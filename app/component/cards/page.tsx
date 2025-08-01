import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string[];
  opType: string;
  categories: string[];
  logoUrl: string;
  orgName: string;
  datePosted: string;
  about?: {
    location?: string;
    posted_on?: string;
    categories?: string[];
  };
}

export default function JobCard({ job }: { job: Job }) {
  const location = Array.isArray(job.location) ? job.location[0] : "Remote";
  const firstCategory = job.categories?.[0] || "General";

  return (
    <Link
      href={`/component/Dashboard/${job.id}`}
      className="flex p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 mb-4"
      style={{
        borderImageSource:
          "linear-gradient(0deg, #4640DE, #4640DE), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
      }}
    >
      {job.logoUrl && (
        <img
          src={job.logoUrl}
          alt={`${job.orgName} logo`}
          className="h-12 w-12 object-contain mr-4"
        />
      )}

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {job.title}
            </h2>
            <p className="text-gray-600 mb-3">
              {job.orgName} • {location}
            </p>
            <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2">
              <span
                className="flex items-center px-3 py-1 text-xs rounded-full"
                style={{
                  border: "1px solid #56CDAD",
                  color: "#56CDAD",
                  backgroundColor: "#56CDAD1A",
                }}
              >
                {job.opType}
              </span>
              {job.categories?.map((category, index) => (
                <span
                  key={`${job.id}-${index}`}
                  className="flex items-center px-3 py-1 text-xs rounded-full"
                  style={{
                    border: `1px solid ${
                      index % 2 === 0 ? "#FFB836" : "#4640DE"
                    }`,
                    color: index % 2 === 0 ? "#FFB836" : "#4640DE",
                    backgroundColor:
                      index % 2 === 0 ? "#FFB8361A" : "#4640DE1A",
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
