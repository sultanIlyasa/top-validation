import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Backend_URL } from "@/lib/Constants";
import Footer from "@/components/ui/footer";

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
    <div className="min-h-screen">
      <h1>Welcome {user.firstName}</h1>
      <h2>Your role is {user.role}</h2>
      <Footer />
    </div>
  );
};

export default HomePage;
