"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/dashboard/Dashboard";
import Footer from "@/components/ui/footer";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <Dashboard />
      <Footer />
    </div>
  );
}
