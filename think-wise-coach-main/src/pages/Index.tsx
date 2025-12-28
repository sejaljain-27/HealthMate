import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthScreen } from "@/components/screens/AuthScreen";
import { SignupScreen } from "@/components/screens/SignupScreen";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { WeeklyPlanScreen } from "@/components/screens/WeeklyPlanScreen";
import { DailyCheckInScreen } from "@/components/screens/DailyCheckInScreen";
import { FailureReasoningScreen } from "@/components/screens/FailureReasoningScreen";
import { PlanAdaptationScreen } from "@/components/screens/PlanAdaptationScreen";
import { ProgressScreen } from "@/components/screens/ProgressScreen";
import { CoachScreen } from "@/components/screens/CoachScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { NutritionScreen } from "@/components/screens/NutritionScreen";
import { BottomNav } from "@/components/layout/BottomNav";
import { SplineSceneBasic } from "@/components/ui/spline-scene-basic";

type Screen = 
  | "auth"
  | "signup"
  | "spline"
  | "onboarding"
  | "home"
  | "plan"
  | "checkin"
  | "failure"
  | "adaptation"
  | "progress"
  | "coach"
  | "profile"
  | "nutrition";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");
  const [activeTab, setActiveTab] = useState("home");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ email: "", name: "" });

  const handleLogin = (userData: { email: string; name?: string }) => {
    setUser({ email: userData.email, name: userData.name || "" });
    setIsLoggedIn(true);
    setCurrentScreen("spline");
  };

  const handleSignUp = () => {
    setCurrentScreen("signup");
  };

  const handleSignupComplete = (userData: { name: string; email: string; phone: string; password: string }) => {
    setUser({ email: userData.email, name: userData.name });
    setIsLoggedIn(true);
    setCurrentScreen("onboarding");
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    setCurrentScreen("home");
  };

  const handleSplineComplete = () => {
    setCurrentScreen("onboarding");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        setCurrentScreen("home");
        break;
      case "plan":
        setCurrentScreen("plan");
        break;
      case "checkin":
        setCurrentScreen("checkin");
        break;
      case "progress":
        setCurrentScreen("progress");
        break;
      case "coach":
        setCurrentScreen("coach");
        break;
      case "profile":
        setCurrentScreen("profile");
        break;
      case "nutrition":
        setCurrentScreen("nutrition");
        break;
    }
  };

  const handleCheckInComplete = (completed: boolean, energy: string) => {
    if (!completed) {
      setCurrentScreen("failure");
    } else {
      setCurrentScreen("home");
    }
  };

  const handleFailureReasonContinue = (reason: string) => {
    setCurrentScreen("adaptation");
  };

  const handlePlanAccepted = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "auth":
        return <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} />;
      case "signup":
        return <SignupScreen onSignup={handleSignupComplete} onBack={() => setCurrentScreen("auth")} />;
      case "spline":
        return <SplineSceneBasic onComplete={handleSplineComplete} />;
      case "onboarding":
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case "home":
        return (
          <HomeScreen
            onStartWorkout={() => setCurrentScreen("checkin")}
            onViewPlan={() => {
              setCurrentScreen("plan");
              setActiveTab("plan");
            }}
          />
        );
      case "plan":
        return <WeeklyPlanScreen />;
      case "checkin":
        return <DailyCheckInScreen onComplete={handleCheckInComplete} />;
      case "failure":
        return <FailureReasoningScreen onContinue={handleFailureReasonContinue} />;
      case "adaptation":
        return <PlanAdaptationScreen onAccept={handlePlanAccepted} />;
      case "progress":
        return <ProgressScreen />;
      case "coach":
        return <CoachScreen />;
      case "profile":
        return <ProfileScreen 
          user={user}
          onLogout={() => {
            setIsOnboarded(false);
            setIsLoggedIn(false);
            setCurrentScreen("auth");
          }} 
        />;
      case "nutrition":
        return <NutritionScreen />;
      default:
        return <HomeScreen onStartWorkout={() => {}} onViewPlan={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {isLoggedIn && isOnboarded && currentScreen !== "onboarding" && currentScreen !== "auth" && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default Index;
