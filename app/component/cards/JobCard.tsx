"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Job } from "../../types/job";

interface JobCardProps {
	job: Job;
}

export default function JobCard({ job }: JobCardProps) {
	const { data: session } = useSession();
	const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log("Bookmark state changed:", isBookmarked);
	}, [isBookmarked]);

	const toggleBookmark = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!session?.user) {
			toast.info("Please login to bookmark jobs");
			return;
		}

		setIsLoading(true);
		const newBookmarkState = !isBookmarked;

		try {
			const endpoint = `https://akil-backend.onrender.com/bookmarks/${job.id}`;
			const method = newBookmarkState ? "POST" : "DELETE";

			const response = await fetch(endpoint, {
				method,
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
					"Content-Type": "application/json",
				},
				...(method === "POST" ? { body: JSON.stringify({}) } : {}),
			});

			if (response.ok) {
				setIsBookmarked(newBookmarkState);
				toast.success(newBookmarkState ? "Bookmarked!" : "Removed bookmark");
			} else {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}
		} catch (error) {
			console.error("Bookmark error:", error);
			toast.error(
				error instanceof Error
					? error.message || "Failed to update bookmark"
					: "Network error - please try again"
			);

			setIsBookmarked(!newBookmarkState);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Link
			href={`/component/Dashboard/${job.id}`}
			className="flex p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 mb-4 relative"
			style={{
				borderImageSource:
					"linear-gradient(0deg, #4640DE, #4640DE), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
			}}
			data-cy="job-card"
		>
			<button
				onClick={toggleBookmark}
				className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors ${
					isLoading ? "opacity-50 cursor-not-allowed" : ""
				}`}
				aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
				data-cy="bookmark-button"
				data-bookmarked={isBookmarked.toString()}
				data-loading={isLoading}
				data-testid="bookmark-btn"
				{...(isLoading ? { disabled: true } : {})}
			>
				{isLoading ? (
					<div className="w-6 h-6 flex items-center justify-center">
						<svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					</div>
				) : isBookmarked ? (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB836" className="w-6 h-6" data-cy="bookmark-icon-filled">
						<path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
					</svg>
				) : (
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFB836" className="w-6 h-6" data-cy="bookmark-icon-outline">
						<path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
					</svg>
				)}
			</button>
			{job.logoUrl && (
				<img src={job.logoUrl} alt={`${job.orgName} logo`} className="h-12 w-12 object-contain mr-4" data-cy="job-logo" />
			)}
			<div className="flex-1" data-cy="job-content">
				<div className="flex justify-between items-start">
					<div>
						<h2 className="text-xl font-bold text-gray-900 mb-1" data-cy="job-title">{job.title}</h2>
						<p className="text-gray-600 mb-3" data-cy="job-company-location">{job.orgName} • {job.location}</p>
						<p className="text-gray-700 mb-4 line-clamp-2" data-cy="job-description">{job.description}</p>
						<div className="flex flex-wrap gap-2" data-cy="job-tags">
							<span className="flex items-center px-3 py-1 text-xs rounded-full" style={{ border: "1px solid #56CDAD", color: "#56CDAD", backgroundColor: "#56CDAD1A" }} data-cy="job-type">
								{job.opType}
							</span>
							{job.categories?.map((category, index) => (
								<span key={`${job.id}-${index}`} className="flex items-center px-3 py-1 text-xs rounded-full" style={{ border: `1px solid ${index % 2 === 0 ? "#FFB836" : "#4640DE"}`, color: index % 2 === 0 ? "#FFB836" : "#4640DE", backgroundColor: index % 2 === 0 ? "#FFB8361A" : "#4640DE1A" }} data-cy={`job-category-${index}`}>
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