import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { commet } from "@/lib/commet";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const subscription = await commet.subscriptions.get(user.id);

  if (!subscription.success || !subscription.data) {
    redirect("/pricing");
  }

  return <>{children}</>;
}
