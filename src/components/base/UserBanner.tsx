interface UserBannerProps {
  isSignedIn: boolean | undefined;
}

export const UserBanner = ({ isSignedIn }: UserBannerProps) => {
  return (
    <div
      className={`mb-6 p-4 ${isSignedIn ? "bg-blue-50" : "bg-gray-50"} 
        rounded-lg transform transition-transform duration-500 hover:scale-[1.01]`}
    >
      <p
        className={`text-sm ${isSignedIn ? "text-blue-600" : "text-gray-600"}`}
      >
        {isSignedIn
          ? "Welcome back!"
          : "Sign in to upload your own bases and see which ones you've created."}
      </p>
    </div>
  );
};
