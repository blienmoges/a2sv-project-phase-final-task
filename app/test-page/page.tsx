// app/pages/test-page.tsx
"use client";
import JobCard from "../component/cards/JobCard";
import { Job } from "../types/job";

const TestPage = () => {
  const testJob: Job = {
    id: "test-job-1",
    title: "Test Developer Position",
    description: "This is a test job description",
    location: ["Remote"],
    opType: "Full-time",
    categories: ["Frontend", "React"],
    logoUrl: "https://example.com/logo.png",
    orgName: "Test Company",
    datePosted: "2023-01-01",
    isBookmarked: false,
  };

  return (
    <div className="p-6" data-cy="test-page">
      <h1 className="text-2xl font-bold mb-6">Test Page for Cypress</h1>
      <div className="max-w-3xl mx-auto">
        <JobCard job={testJob} />
      </div>
    </div>
  );
};

export default TestPage;
