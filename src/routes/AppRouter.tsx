import { Routes, Route, Navigate } from "react-router";
import { useAuth, SignIn, SignUp } from "@clerk/clerk-react";
import MainLayout from "@/layouts/MainLayout";

// Import components directly
import Home from "@/page/Home";
import About from "@/page/About";
import Base from "@/components/Base";
import NotFound from "@/page/NotFound";
import Page from "@/app/dashboard/page";
import BaseUpdate from "@/page/base/BaseUpdate";
import FullsizeBase from "@/components/FullsizeBase";
import Leaderboard from "@/components/Leaderboard";
// Loading component for fallback
const LoadingSpinner = () => <div>Loading...</div>;

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return isSignedIn ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="base" element={<Base />} />
        <Route path="base/full-size" element={<FullsizeBase />} />
        <Route path="leaderboard" element={<Leaderboard />} />

        {/* Authentication routes */}
        <Route
          path="sign-in/*"
          element={
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md">
                <SignIn routing="path" path="/sign-in" />
              </div>
            </div>
          }
        />
        <Route
          path="sign-up/*"
          element={
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md">
                <SignUp routing="path" path="/sign-up" />
              </div>
            </div>
          }
        />

        {/* Protected routes */}

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Page />
            </ProtectedRoute>
          }
        />

        <Route path="/bases/:baseId/edit" element={<BaseUpdate />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
