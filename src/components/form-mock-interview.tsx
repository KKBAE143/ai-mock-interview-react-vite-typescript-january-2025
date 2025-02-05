import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Interview } from "@/types";

import { CustomBreadCrumb } from "./custom-bread-crumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2, Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
  language: z.string().default('en')
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData || {},
      language: 'en'
    },
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData
    ? initialData.position
    : "Create a new mock interview";

  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  const cleanAiResponse = (responseText: string) => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 3: Extract a JSON array by capturing text between square brackets
    const jsonArrayMatch = cleanText.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      cleanText = jsonArrayMatch[0];
    } else {
      throw new Error("No JSON array found in response");
    }

    // Step 4: Parse the clean JSON text into an array of objects
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateAiResponse = async (data: FormData) => {
    const targetLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === data.language)?.name || 'English';
    
    const prompt = `
        As an experienced prompt engineer and professional translator, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question", "answer", and their translations. The translations must be accurate and natural in the target language.

        Format as follows:
        [
          {
            "question": "<Question text in English>",
            "answer": "<Answer text in English>",
            "questionTranslated": "<Question text in ${targetLanguage}>",
            "answerTranslated": "<Answer text in ${targetLanguage}>"
          },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}
        - Target Language: ${targetLanguage}

        Requirements:
        1. Questions should assess skills in ${data?.techStack} development, best practices, and problem-solving
        2. Translations must be culturally appropriate and use proper technical terminology in the target language
        3. If the target language is English, set questionTranslated and answerTranslated the same as question and answer
        4. Ensure translations maintain the technical accuracy of the original content
        5. Use proper script and characters for the target language
        6. Keep the technical terms in English but translate the surrounding context naturally

        Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations.
        Return only the JSON array with questions, answers, and their accurate translations.
    `;

    const aiResult = await chatSession.sendMessage(prompt);
    const cleanedResponse = cleanAiResponse(aiResult.response.text());

    return cleanedResponse;
  };

  const generateJobDescription = async (position: string) => {
    const prompt = `
      As a professional technical recruiter, create a polished job description for a ${position} position.
      The description should be well-structured and easy to read.
      
      Use the following format, maintaining consistent spacing and professional tone:
      
      Position Overview:
      [Write a compelling 2-3 sentence overview of the role, focusing on impact and opportunity]

      Key Responsibilities:
      • [Action verb] + key responsibility with impact
      • [Action verb] + key responsibility with impact
      • [Action verb] + key responsibility with impact
      • [Action verb] + key responsibility with impact

      Technical Requirements:
      Frontend:
      • [List 2-3 primary frontend technologies]
      
      Backend:
      • [List 2-3 primary backend technologies]
      
      Additional Technologies:
      • [List 2-3 relevant tools/platforms]

      Required Qualifications:
      • [Education requirement]
      • [Years of experience]
      • [Key technical expertise]
      • [Soft skills]

      Format the output with proper spacing, bullet points (•), and clear section headings.
      Keep technical terms in their original form (e.g., React.js, Node.js).
      Focus on clarity and professionalism.
    `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      return aiResult.response.text();
    } catch (error) {
      console.error('Error generating job description:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      if (initialData) {
        // update
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await updateDoc(doc(db, "interviews", initialData?.id), {
            questions: aiResult,
            ...data,
            updatedAt: serverTimestamp(),
          }).catch((error) => console.log(error));
          toast(toastMessage.title, { description: toastMessage.description });
        }
      } else {
        // create a new mock interview
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            createdAt: serverTimestamp(),
          });

          toast(toastMessage.title, { description: toastMessage.description });
        }
      }

      navigate("/generate", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("Error..", {
        description: `Something went wrong. Please try again later`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumpPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-lg font-semibold">Job Description</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        if (!form.getValues("position")) {
                          toast.error("Please enter a job position first");
                          return;
                        }
                        try {
                          setLoading(true);
                          const description = await generateJobDescription(form.getValues("position"));
                          field.onChange(description);
                          toast.success("Job description generated successfully!");
                        } catch (error) {
                          toast.error("Failed to generate job description");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Professional Description
                    </Button>
                    <FormMessage className="text-sm" />
                  </div>
                </div>
                <FormControl>
                  <Textarea
                    className="min-h-[400px] p-4 text-base leading-relaxed font-[system-ui] resize-y"
                    disabled={loading}
                    placeholder="A professional job description will be generated here..."
                    {...field}
                    value={field.value || ""}
                    style={{
                      whiteSpace: 'pre-line',
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Interview Language</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
