"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token && !sessionStorage.getItem("token")) {
      router.push("/login");
    }
  }, [token, router]);

  return <>{children}</>;
}
