import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Backend_URL } from "@/lib/Constants";
import CompanyDashboardPanel from "@/components/company/CompanyDashboardPanel";
import CompanyLocationDashboard from "@/components/company/CompanyLocationDashboard";

type Props = {
  params: {
    id: string;
  };
};

const HomePage = async (props: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "auth/login",
        permanent: false,
      },
    };
  }
  const response = await fetch(Backend_URL + `/users/${session.user.id}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + session.backendTokens.access_token,
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error loading user data:", response.statusText);
    return <p>Error loading user data</p>;
  }
  const user = await response.json();
  console.log("User data:", user);
  console.log("Session data:", session);

  return (
    <div className="min-h-screen mx-4 my-9">
      <div className="mx-3 sm:mx-8">
        <h1 className="text-xl font-bold">Welcome, {user.firstName}</h1>
        <p className="text-xs">
          Your video call meeting hasn't been scheduled yet. Take a moment to
          choose your preferred date and time.{" "}
        </p>
      </div>
      <CompanyDashboardPanel />
      <CompanyLocationDashboard />
    </div>
  );
};

export default HomePage;
