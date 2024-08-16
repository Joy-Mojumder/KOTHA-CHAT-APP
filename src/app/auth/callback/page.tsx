"use client";
import { checkAuthStatus } from "@/actions/auth.action";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => await checkAuthStatus(),
  });

  useEffect(() => {
    if (data?.success) {
      router.push("/");
    }
  }, [router, data]);

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <Loader className="size-14 animate-spin" />
        <h3 className="text-2xl font-bold">Authenticating...</h3>

        <p className="text-lg font-semibold">Please wait</p>
      </div>
    </div>
  );
};

export default Page;
