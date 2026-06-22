interface NewSubscriptionNotification {
  userEmail: string;
  planName: string;
}

export async function notifyTeamOfNewSubscription({
  userEmail,
  planName,
}: NewSubscriptionNotification) {
  console.log(`[team] 💰 New ${planName} subscription: ${userEmail}`);
}
