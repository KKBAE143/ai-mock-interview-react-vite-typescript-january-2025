import { useState } from 'react';
import { Card } from '../ui/card';
import { SalaryInsights } from './salary-insights';
import { FileText, TrendingUp, MessageSquare } from 'lucide-react';

type Tab = 'company-news' | 'salary-trends' | 'interview-experiences';

export function SalaryInsightsLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('salary-trends');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('company-news')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'company-news'
              ? 'bg-background shadow-sm'
              : 'hover:bg-muted'
          }`}
        >
          <FileText className="h-4 w-4" />
          Company News
        </button>
        <button
          onClick={() => setActiveTab('salary-trends')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'salary-trends'
              ? 'bg-background shadow-sm'
              : 'hover:bg-muted'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Salary Trends
        </button>
        <button
          onClick={() => setActiveTab('interview-experiences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md flex-1 text-sm font-medium transition-colors ${
            activeTab === 'interview-experiences'
              ? 'bg-background shadow-sm'
              : 'hover:bg-muted'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Interview Experiences
        </button>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        {activeTab === 'salary-trends' && <SalaryInsights />}
        {activeTab === 'company-news' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Company News</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        )}
        {activeTab === 'interview-experiences' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Interview Experiences</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        )}
      </Card>
    </div>
  );
} 