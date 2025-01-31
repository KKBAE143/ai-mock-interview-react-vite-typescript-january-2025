import { CompanySimulator } from "@/components/company-simulator";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";

export function CompanySimulatorPage() {
  return (
    <div className="container py-8 space-y-6">
      <CustomBreadCrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Company Simulator", href: "/generate/company-simulator" },
        ]}
      />
      <CompanySimulator />
    </div>
  );
} 