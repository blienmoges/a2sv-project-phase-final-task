"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    id: string;
    role: string;
  };
  message?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://akil-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Verify all required data exists
      if (!data.data?.accessToken || !data.data?.id) {
        throw new Error("Incomplete authentication data received");
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken || "");
      localStorage.setItem("id", data.data.id);
      localStorage.setItem("role", data.data.role || "user");

      // window.location.href = "/";
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-6 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading ? "bg-gray-400" : "bg-[#4640DE] hover:bg-[#3934C2]"
            } focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:ring-offset-2 transition-colors`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-[#4640DE] hover:text-[#3934C2]"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[#4640DE] hover:text-[#3934C2]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
