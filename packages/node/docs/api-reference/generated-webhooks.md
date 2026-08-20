# Webhooks

API version: `2026-07-31`

## get

`commet.webhooks.get(params)`

`GET /webhooks/{id}` · operation `get-webhook-endpoint`

Retrieve a webhook endpoint by its public ID.

### Parameters

- `id` (`string`, required)

### Returns

`Webhook`

## update

`commet.webhooks.update(params, options?)`

`PATCH /webhooks/{id}` · operation `update-webhook-endpoint`

Update a webhook endpoint. Only the provided fields change.

### Parameters

- `id` (`string`, required)
- `url` (`string`, optional)
- `events` (`Array<"subscription.created" | "subscription.activated" | "subscription.reactivated" | "subscription.canceled" | "subscription.updated" | "subscription.plan_changed" | "subscription.cancellation_scheduled" | "subscription.cancellation_revoked" | "subscription.plan_change_scheduled" | "subscription.plan_change_revoked" | "subscription.past_due" | "trial.started" | "trial.converted" | "trial.expired" | "trial.will_end" | "trial.checkout_ready" | "checkout.ready" | "payment.received" | "payment.failed" | "payment.recovered" | "payment.retry_failed" | "payment.refunded" | "payment.disputed" | "payment.dispute_resolved" | "payment_link.created" | "payment_link.completed" | "payment_link.failed" | "payment_link.canceled" | "invoice.created" | "invoice.voided" | "invoice.overdue" | "invoice.upcoming" | "payment_method.attached" | "payment_method.updated" | "customer.created" | "customer.updated" | "customer.state_changed" | "plan_grant.created" | "plan_grant.updated" | "plan_grant.expired" | "plan_grant.revoked" | "credits.granted" | "credits.purchased" | "credits.low" | "credits.depleted" | "credits.expired" | "balance.topped_up" | "balance.low" | "balance.depleted" | "quota.threshold_reached" | "quota.exceeded" | "seats.updated" | "seats.limit_reached" | "addon.activated" | "addon.deactivated" | "usage.recorded" | "payout.available" | "payout.created" | "payout.paid" | "payout.failed">`, optional)
- `description` (`string | null`, optional)
- `isActive` (`boolean`, optional)
- `apiVersion` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`Webhook`

## delete

`commet.webhooks.delete(params, options?)`

`DELETE /webhooks/{id}` · operation `delete-webhook-endpoint`

Permanently delete a webhook endpoint.

### Parameters

- `id` (`string`, required)

### Returns

`DeletedObject`

## test

`commet.webhooks.test(params, options?)`

`POST /webhooks/{id}/test` · operation `test-webhook-endpoint`

Send a test event to a webhook endpoint to verify connectivity.

### Parameters

- `id` (`string`, required)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`WebhookTest`

## list

`commet.webhooks.list(params?)`

`GET /webhooks` · operation `list-webhook-endpoints`

List webhook endpoints with cursor-based pagination.

### Parameters

- `cursor` (`string`, optional)
- `limit` (`number`, optional)

### Returns

`{ object: "list"; data: Array<Webhook>; hasMore: boolean; nextCursor?: string }`

## create

`commet.webhooks.create(params, options?)`

`POST /webhooks` · operation `create-webhook-endpoint`

Create a new webhook endpoint. The response includes the signing secret which is only returned once.

### Parameters

- `url` (`string`, required)
- `events` (`Array<"subscription.created" | "subscription.activated" | "subscription.reactivated" | "subscription.canceled" | "subscription.updated" | "subscription.plan_changed" | "subscription.cancellation_scheduled" | "subscription.cancellation_revoked" | "subscription.plan_change_scheduled" | "subscription.plan_change_revoked" | "subscription.past_due" | "trial.started" | "trial.converted" | "trial.expired" | "trial.will_end" | "trial.checkout_ready" | "checkout.ready" | "payment.received" | "payment.failed" | "payment.recovered" | "payment.retry_failed" | "payment.refunded" | "payment.disputed" | "payment.dispute_resolved" | "payment_link.created" | "payment_link.completed" | "payment_link.failed" | "payment_link.canceled" | "invoice.created" | "invoice.voided" | "invoice.overdue" | "invoice.upcoming" | "payment_method.attached" | "payment_method.updated" | "customer.created" | "customer.updated" | "customer.state_changed" | "plan_grant.created" | "plan_grant.updated" | "plan_grant.expired" | "plan_grant.revoked" | "credits.granted" | "credits.purchased" | "credits.low" | "credits.depleted" | "credits.expired" | "balance.topped_up" | "balance.low" | "balance.depleted" | "quota.threshold_reached" | "quota.exceeded" | "seats.updated" | "seats.limit_reached" | "addon.activated" | "addon.deactivated" | "usage.recorded" | "payout.available" | "payout.created" | "payout.paid" | "payout.failed">`, required)
- `description` (`string`, optional)
- `apiVersion` (`string`, optional)

### Request options

- `idempotencyKey` (`string`, optional) — Unique key used to safely retry this write for 24 hours without applying it twice.

### Returns

`CreatedWebhook`
