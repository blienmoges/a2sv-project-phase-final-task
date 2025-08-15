import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Add this import
import JobCard from "./page";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
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
  isBookmarked: boolean;
}
// Mock dependencies
jest.mock("next-auth/react");
jest.mock("react-toastify");

const mockJob: Job = {
  id: "job1",
  title: "Frontend Developer",
  description: "React experience required",
  location: ["Remote"],
  opType: "Full-time",
  categories: ["React", "TypeScript"],
  logoUrl: "/logo.png",
  orgName: "Tech Corp",
  datePosted: "2023-01-01",
  isBookmarked: false,
};

describe("JobCard Component", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    (toast.info as jest.Mock).mockImplementation(() => {});
    (toast.success as jest.Mock).mockImplementation(() => {});
    (toast.error as jest.Mock).mockImplementation(() => {});
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders job card correctly", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp • Remote")).toBeInTheDocument();
    expect(screen.getByText("React experience required")).toBeInTheDocument();
    expect(screen.getByText("Full-time")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  test("shows login prompt when unauthenticated user clicks bookmark", async () => {
    render(<JobCard job={mockJob} />);

    fireEvent.click(screen.getByLabelText("Add bookmark"));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith("Please login to bookmark jobs");
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("toggles bookmark when authenticated", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { id: "user1", role: "user" },
        accessToken: "mock-token",
      },
      status: "authenticated",
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<JobCard job={mockJob} />);

    // First click - bookmark
    fireEvent.click(screen.getByLabelText("Add bookmark"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://akil-backend.onrender.com/bookmarks/job1",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer mock-token",
            "Content-Type": "application/json",
          },
        })
      );
      expect(toast.success).toHaveBeenCalledWith("Bookmarked!");
    });

    // Second click - unbookmark
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    fireEvent.click(screen.getByLabelText("Remove bookmark"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://akil-backend.onrender.com/bookmarks/job1",
        expect.objectContaining({ method: "DELETE" })
      );
      expect(toast.success).toHaveBeenCalledWith("Removed bookmark");
    });
  });

  test("handles bookmark error", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { id: "user1", role: "user" },
        accessToken: "mock-token",
      },
      status: "authenticated",
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<JobCard job={mockJob} />);
    fireEvent.click(screen.getByLabelText("Add bookmark"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Network error - please try again"
      );
    });
  });

  test("handles 409 conflict", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { id: "user1", role: "user" },
        accessToken: "mock-token",
      },
      status: "authenticated",
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ message: "Already bookmarked" }),
    });

    render(<JobCard job={mockJob} />);
    fireEvent.click(screen.getByLabelText("Add bookmark"));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith("Already bookmarked");
    });
  });

  test("shows loading state during API call", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { id: "user1", role: "user" },
        accessToken: "mock-token",
      },
      status: "authenticated",
    });

    let resolveFetch: any;
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<JobCard job={mockJob} />);
    fireEvent.click(screen.getByLabelText("Add bookmark"));

    // Button should be disabled during loading
    expect(screen.getByLabelText("Add bookmark")).toBeDisabled();

    // Resolve the fetch
    resolveFetch({ ok: true });

    await waitFor(() => {
      expect(screen.getByLabelText("Remove bookmark")).not.toBeDisabled();
    });
  });
});
