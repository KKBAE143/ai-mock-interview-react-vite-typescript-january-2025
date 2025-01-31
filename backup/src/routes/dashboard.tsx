import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "./loader-page";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return {
            id,
            ...doc.data(),
          };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "SOmething went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleDelete = () => {
    // Refresh interviews after deletion
    const fetchInterviews = async () => {
      try {
        const q = query(
          collection(db, "interviews"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const interviewData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Interview[];
        setInterviews(interviewData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInterviews();
  };

  if (loading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mock Interviews</h1>
          <p className="text-muted-foreground">
            Create and manage your mock interview sessions
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/generate/company-simulator")}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Building2 className="w-4 h-4" />
            Company Simulator
          </Button>
          <Button
            onClick={() => navigate("/generate/new")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Interviews Grid */}
      {interviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No mock interviews created yet.</p>
          <Button
            onClick={() => navigate("/generate/new")}
            className="mt-4"
            variant="outline"
          >
            Create your first mock interview
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <InterviewPin
              key={interview.id}
              interview={interview}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
