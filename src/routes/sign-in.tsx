import { SignIn } from "@clerk/clerk-react";
import { useOnboardingStore } from "@/store/onboarding-store";

export const SignInPage = () => {
  const { isOnboardingComplete } = useOnboardingStore();
  const afterSignInUrl = isOnboardingComplete ? "/generate" : "/onboarding";

  return (
    <SignIn
      path="/signin"
      afterSignInUrl={afterSignInUrl}
      routing="path"
      signUpUrl="/signup"
    />
  );
};
