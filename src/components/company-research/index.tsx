import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Briefcase } from "lucide-react";
import { CompanyIntelligence } from "./company-intelligence";
import { RolePreparation } from "./role-preparation";

interface CompanyResearchProps {
  companyName: string;
  role: string;
  industry: string;
}

export function CompanyResearch({ companyName, role, industry }: CompanyResearchProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="intelligence" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Intelligence
          </TabsTrigger>
          <TabsTrigger value="preparation" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Role Preparation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence" className="mt-6">
          <CompanyIntelligence
            companyName={companyName}
            industry={industry}
            jobRole={role}
          />
        </TabsContent>

        <TabsContent value="preparation" className="mt-6">
          <RolePreparation
            companyName={companyName}
            role={role}
            industry={industry}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 