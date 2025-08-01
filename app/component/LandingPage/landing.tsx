"use client";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { getJobs } from "../store/slices/jobSlice";
import JobCard from "../cards/page";

export default function Landing() {
  const dispatch = useAppDispatch();
  const { jobs, status, error } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Opportunities</h1>
        <div className="space-y-6">
          <p>Loading opportunities...</p>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Opportunities</h1>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>Error loading opportunities: {error}</p>
          <button
            onClick={() => dispatch(getJobs())}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Opportunities</h1>
      <div className="space-y-6">
        <p className="text-gray-600">Showing {jobs.length} Results</p>

        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={{
              ...job,
              about: {
                location: Array.isArray(job.location)
                  ? job.location[0]
                  : "Remote",
                posted_on: job.datePosted,
                categories: job.categories || [],
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
