import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOnboardingStore } from '@/store/onboarding-store';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnboardingComplete } = useOnboardingStore();

  useEffect(() => {
    // Skip redirection if we're already on the onboarding page
    if (location.pathname === '/onboarding') {
      return;
    }

    // Redirect to onboarding if it's not complete
    if (!isOnboardingComplete) {
      // Save the intended destination for after onboarding
      const returnPath = location.pathname;
      navigate('/onboarding', { state: { returnPath } });
    }
  }, [isOnboardingComplete, location.pathname, navigate]);

  // If onboarding is complete or we're on the onboarding page, render children
  if (isOnboardingComplete || location.pathname === '/onboarding') {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
} 