import { UserButton, useUser } from '@clerk/clerk-react';

const UserProfile = () => {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="user-profile">
      <h2>Profile</h2>
      <p>Hello, {user?.firstName}!</p>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
      
      {/* UserButton provides account management and sign-out */}
      <UserButton />
    </div>
  );
};

export default UserProfile; 