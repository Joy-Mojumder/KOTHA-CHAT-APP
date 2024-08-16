"use client";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Loader } from "lucide-react";
import { useState } from "react";

const AuthButtons = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    <div className="flex flex-1 flex-col md:flex-row gap-4 relative z-10 mt-28">
      <RegisterLink className="flex-1" onClick={() => setIsRegistering(true)}>
        <Button
          variant={"outline"}
          className="w-full"
          disabled={isRegistering || isLoggingIn}
        >
          {isRegistering ? (
            <Loader className="size-6 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </Button>
      </RegisterLink>
      <LoginLink className="flex-1" onClick={() => setIsLoggingIn(true)}>
        <Button className="w-full" disabled={isLoggingIn || isRegistering}>
          {isLoggingIn ? <Loader className="size-6 animate-spin" /> : "Login"}
        </Button>
      </LoginLink>
    </div>
  );
};

export default AuthButtons;
