import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); // Use Next.js redirect for server-side
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      imageUrl: user.imageUrl || "",
      email: user.emailAddresses[0]?.emailAddress || "",
    },
  });

  return newProfile;
};