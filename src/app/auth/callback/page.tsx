"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }

    setTimeout(checkSession, 1000);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F5EF]">
      <p>🏮 Signing you in...</p>
    </main>
  );
}