import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OnboardingState {
  isOnboardingComplete: boolean;
  hasStartedOnboarding: boolean;
}

interface OnboardingActions {
  setOnboardingComplete: (status: boolean) => void;
  setHasStartedOnboarding: (status: boolean) => void;
}

type OnboardingStore = OnboardingState & OnboardingActions;

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isOnboardingComplete: false,
      hasStartedOnboarding: false,
      setOnboardingComplete: (status: boolean) => set({ isOnboardingComplete: status }),
      setHasStartedOnboarding: (status: boolean) => set({ hasStartedOnboarding: status }),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 