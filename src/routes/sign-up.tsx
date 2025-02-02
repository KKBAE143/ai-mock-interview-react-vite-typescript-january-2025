import { SignUp } from "@clerk/clerk-react";

export const SignUpPage = () => {
  return (
    <SignUp
      path="/signup"
      afterSignUpUrl="/onboarding"
      routing="path"
      signInUrl="/signin"
    />
  );
};
