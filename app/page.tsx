import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Landing from "./component/LandingPage/landing";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return <Landing />;
}
