import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NoActivePlanNotice({
  pendingPayment,
}: {
  pendingPayment: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {pendingPayment ? "Payment pending" : "No active plan"}
        </CardTitle>
        <CardDescription>
          {pendingPayment
            ? "Complete checkout to activate your task quota."
            : "Choose a plan to start using your task quota."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingPayment ? (
          <Button
            nativeButton={false}
            // biome-ignore lint/a11y/useAnchorContent: renders children via Button
            render={
              <a
                href="/api/commet/portal"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Complete payment
          </Button>
        ) : (
          <Button nativeButton={false} render={<Link href="/pricing" />}>
            View plans
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
