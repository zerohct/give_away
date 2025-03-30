import { useEffect, useState } from "react";
import { AuthService } from "../services/AuthService";
import MainLayout from "../components/layouts/MainLayout";

const Profile = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await AuthService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    getProfile();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Profile</h2>
        <p className="text-gray-700 mb-4">Name: {user.name}</p>
        <p className="text-gray-700 mb-4">Email: {user.email}</p>
      </div>
    </MainLayout>
  );
};

export default Profile;