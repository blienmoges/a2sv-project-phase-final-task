"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://akil-backend.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: "user",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Email already exists. Please sign in instead.");
        }
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(formData.email)}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Signup failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError("");
      setIsGoogleLoading(true);

      // Clear any existing auth state
      localStorage.removeItem("nextauth.message");

      const result = await signIn("google", {
        callbackUrl: "/", // Use absolute path
        redirect: false,
      });

      console.log("Google auth result:", result); // Debugging

      if (result?.error) {
        // Handle specific OAuth errors
        if (
          result.error === "OAuthSignin" ||
          result.error === "OAuthCallback"
        ) {
          throw new Error("Google authentication failed. Please try again.");
        }
        throw new Error(result.error);
      }

      if (result?.url) {
        // Force full page reload to ensure auth state is properly initialized
        window.location.href = result.url;
        return;
      }

      throw new Error("No response received from Google authentication");
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to Google. Please check your network."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-6 p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sign Up Today!
        </h1>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
          className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isGoogleLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          <span>
            {isGoogleLoading ? "Processing..." : "Sign Up with Google"}
          </span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or Sign Up with Email
            </span>
          </div>
        </div>

        {/* Email Sign Up Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-1">
              Full Name
            </h2>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-[#4640DE]"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-1">
              Email Address
            </h2>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter email address"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-[#4640DE]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-1">Password</h2>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Enter password (min 6 characters)"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-[#4640DE]"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </h2>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Enter password again"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-[#4640DE]"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-[#4640DE] hover:bg-[#3934C2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4640DE] ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-[#4640DE] hover:text-[#3934C2]"
          >
            Login
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500">
          By clicking 'Continue', you acknowledge that you have read and
          accepted our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
