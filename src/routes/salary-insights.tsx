import { SalaryInsightsComponent } from '@/components/salary-insights/salary-insights';

export default function SalaryInsightsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Salary Insights</h1>
        <p className="text-muted-foreground">
          Get detailed salary insights powered by AI, including market trends, skill premiums, and negotiation recommendations.
        </p>
        <SalaryInsightsComponent />
      </div>
    </div>
  );
} 