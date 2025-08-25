"use client";
import JobCard from "./JobCard";
import { Job } from "../../types/job";

export default function CardsDemoPage() {
	const sampleJob: Job = {
		id: "demo-1",
		title: "Frontend Engineer",
		description: "Build delightful interfaces with React and TypeScript.",
		location: ["Remote"],
		opType: "Full-time",
		categories: ["Frontend", "React"],
		logoUrl: "https://placehold.co/48x48",
		orgName: "News Brief Inc.",
		datePosted: "2024-01-01",
		isBookmarked: false,
	};

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Cards Demo</h1>
			<JobCard job={sampleJob} />
		</div>
	);
}
