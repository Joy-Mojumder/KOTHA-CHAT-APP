"use server";

import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const checkAuthStatus = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  // TODO: check if user is logged in or signed up
  if (!user) {
    return { success: false };
  }

  const userId = `user:${user.id}`;

  // TODO: check if user is in redis
  const existingUser = await redis.hgetall(userId);

  // TODO: check if user is verified
  if (!existingUser || Object.keys(existingUser).length === 0) {
    const imgIsNull = user.picture?.includes("gravatar");
    const image = imgIsNull ? "" : user.picture;

    await redis.hset(userId, {
      id: user.id,
      email: user.email,
      name: `${user.given_name} ${user.family_name}`,
      image: image,
    });
  }

  return { success: true };
};
