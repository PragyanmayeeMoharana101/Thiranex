import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if(!user) return <div className="text-center mt-10">Please log in.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-lg"><strong>Name:</strong> {user.name}</p>
        <p className="text-lg mt-2"><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}
