"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // agar token present hai to home/dashboard bhej do
    if (token || sessionStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [token, router]);

  return <>{children}</>;
}
