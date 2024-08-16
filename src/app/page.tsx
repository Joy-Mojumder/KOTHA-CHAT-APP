import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Preferences from "../components/Preferences";
import ChatLayout from "../components/chat/ChatLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { redis } from "@/lib/db";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

const getUsers = async (): Promise<User[]> => {
  const userKeys: string[] = [];

  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: "user:*",
      type: "hash",
      count: 100,
    });
    cursor = nextCursor;

    userKeys.push(...keys);
  } while (cursor !== "0");

  const { getUser } = getKindeServerSession();
  const currentUser = await getUser();

  const pipeline = redis.pipeline();
  userKeys.forEach((key) => pipeline.hgetall(key));
  const results = (await pipeline.exec()) as User[];

  const filteredResults: User[] = results.filter(
    (result) => result.id !== currentUser?.id
  );

  return filteredResults;
};

const Home = async () => {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return redirect("/auth");
  }

  const allUsersWOMe = await getUsers();

  return (
    <main className="flex w-full h-screen flex-col items-center justify-between p-4 md:px-24 py-8 gap-4">
      <Preferences />

      {/* dotted bg */}
      <div
        className="absolute top-0 z-[-2] h-screen w-screen dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] 
				dark:bg-[size:20px_20px] bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:20px_20px]"
        aria-hidden="true"
      />

      <div className="z-10 border rounded-lg max-w-5xl w-full min-h-[85vh] text-sm">
        <ChatLayout defaultLayout={defaultLayout} users={allUsersWOMe} />
      </div>
    </main>
  );
};

export default Home;
