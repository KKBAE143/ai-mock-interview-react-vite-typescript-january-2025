import { SalaryNegotiationForm } from "@/components/salary-negotiation-form";
import { SalaryInsights } from "@/components/salary-insights";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    industry: "",
    companyType: "",
    role: "",
    level: "",
    location: "",
    experience: 0,
    skills: [],
    currentSalary: 0,
    targetSalary: 0,
    achievements: "",
  });

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <SalaryNegotiationForm onSubmit={handleFormSubmit} />
      {formData.industry && (
        <SalaryInsights {...formData} />
      )}
    </main>
  );
} 