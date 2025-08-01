"use client";

import {
  Check,
  CircleCheck,
  Calendar,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Job {
  id: string;
  title: string;
  description: string;
  responsibilities: string | string[];
  requirements: string | string[];
  idealCandidate: string;
  categories: string[];
  opType: string;
  startDate: string;
  endDate: string;
  deadline: string;
  location: string[];
  requiredSkills: string[];
  whenAndWhere: string;
  orgName: string;
  logoUrl: string;
  datePosted: string;
  status: string;
  applicantsCount: number;
  viewsCount: number;
}

export default function JobDashboard() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jobId = params?.id;

    if (!jobId) {
      setError("Job ID not found");
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        const response = await fetch(
          `https://akil-backend.onrender.com/opportunities/${jobId}`
        );
        if (!response.ok) throw new Error("Failed to fetch job");
        const data = await response.json();
        setJob(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params?.id]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z")
      return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>Error loading job: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return <div className="p-6">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 space-y-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-[#25324B]">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {job.responsibilities && (
            <div className=" p-6 ">
              <h2 className="text-xl font-bold mb-4 text-[#25324B]">
                Responsibilities
              </h2>
              <ul className="space-y-3">
                {(typeof job.responsibilities === "string"
                  ? job.responsibilities
                      .split("\n")
                      .filter((item) => item.trim() !== "")
                  : job.responsibilities
                ).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CircleCheck className="h-5 w-5 text-[#56CDAD] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && (
            <div className=" p-6 ">
              <h2 className="text-xl font-bold mb-4 text-[#25324B]">
                Requirements
              </h2>
              <ul className="space-y-3">
                {(typeof job.requirements === "string"
                  ? job.requirements
                      .split("\n")
                      .filter((item) => item.trim() !== "")
                  : Array.isArray(job.requirements)
                  ? job.requirements
                  : []
                ).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-[#4640DE] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.idealCandidate && (
            <div className=" p-6 ">
              <h2 className="text-xl font-bold mb-4 text-[#25324B]">
                Ideal Candidate
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {job.idealCandidate}
              </p>
            </div>
          )}

          {job.whenAndWhere && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-[#25324B]">
                When & Where
              </h2>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#26A4FF] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{job.whenAndWhere}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 ">
            <h2 className="text-xl font-bold mb-4 text-[#25324B]">About</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#26A4FF] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Posted On</p>
                  <p className="font-medium">{formatDate(job.datePosted)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#26A4FF] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium">{formatDate(job.deadline)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#26A4FF] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {job.location?.join(", ") || "Remote"}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#26A4FF] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(job.startDate)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#26A4FF] mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{formatDate(job.endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-[#25324B]">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {job.categories?.map((category: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#EB85331A] rounded-full text-sm font-medium"
                  style={{
                    color: index % 2 === 0 ? "#FFB836" : "#56CDAD",
                  }}
                >
                  {category}
                </span>
              ))}
            </div>

            {job.requiredSkills?.length > 0 && (
              <>
                <h3 className="font-bold mb-3 text-[#25324B]">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#4640DE]/10 text-[#4640DE] rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
