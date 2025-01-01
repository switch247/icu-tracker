// UserPage.server.tsx

import { notFound } from "next/navigation";
import { getUser, getUsers } from "@/utils/fakeBackend";
import UserPageClient from "./UserPageClient";

export const dynamicParams = true;


export default async function UserPageServer({ params: { id } }: { params: { id: string } }) {
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return <UserPageClient user={user} />;
}


// Static generation: define which paths to pre-render
export async function generateStaticParams() {
  const users = await getUsers(); // Fetch all users to generate paths
  return users.map(user => ({
    id: user.id.toString(), // Ensure id is a string for the path
  }));
}