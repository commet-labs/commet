---
lastModified: 2026-07-31
title: Integrate with Encore
description: Add billing and payments to your Encore application.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ```bash
   encore app create --example=hello-world myapp
   cd myapp
   go get github.com/commet-labs/commet-go/v9
   ```

2. ## Configure
   Store secrets using Encore's secret manager instead of environment variables:
   ```bash
   encore secret set --type dev,local,pr,prod CommetAPIKey
   encore secret set --type dev,local,pr,prod CommetWebhookSecret
   ```
   ```go title="billing/billing.go"
   package billing

   import (
   	commet "github.com/commet-labs/commet-go/v9"
   )

   var secrets struct {
   	CommetAPIKey       string
   	CommetWebhookSecret string
   }

   var client *commet.Client

   func initClient() error {
   	var err error
   	client, err = commet.New(secrets.CommetAPIKey)
   	return err
   }
   ```
   There is no environment option on the client: sandbox vs live is decided by the organization the API key belongs to.

3. ## Subscribe
   ```go title="billing/billing.go"
   import "context"

   type SubscribeParams struct {
   	Email      string `json:"email"`
   	CustomerID string `json:"customer_id"`
   }

   type SubscribeResponse struct {
   	CheckoutURL string `json:"checkout_url"`
   }

   //encore:api public method=POST path=/billing/subscribe
   func Subscribe(ctx context.Context, req *SubscribeParams) (*SubscribeResponse, error) {
   	if err := initClient(); err != nil {
   		return nil, err
   	}

   	_, err := client.Customers.Create(ctx, &commet.CreateCustomerParams{
   		Email: req.Email,
   		ID:    &req.CustomerID,
   	})
   	if err != nil {
   		return nil, err
   	}

   	planCode := "pro"
   	subscription, err := client.Subscriptions.Create(ctx, &commet.CreateSubscriptionParams{
   		CustomerID: req.CustomerID,
   		PlanCode:   &planCode,
   	})
   	if err != nil {
   		return nil, err
   	}

   	checkoutURL := ""
   	if subscription.CheckoutURL != nil {
   		checkoutURL = *subscription.CheckoutURL
   	}

   	return &SubscribeResponse{
   		CheckoutURL: checkoutURL,
   	}, nil
   }
   ```

4. ## Check Access
   ```go title="billing/billing.go"
   type SubscriptionResponse struct {
   	Status string `json:"status"`
   }

   //encore:api public method=GET path=/billing/subscription/:customerID
   func GetSubscription(ctx context.Context, customerID string) (*SubscriptionResponse, error) {
   	if err := initClient(); err != nil {
   		return nil, err
   	}

   	sub, err := client.Subscriptions.GetActive(ctx, &commet.GetActiveSubscriptionParams{
   		CustomerID: customerID,
   	})
   	if err != nil {
   		return nil, err
   	}

   	if sub == nil {
   		return &SubscriptionResponse{Status: "none"}, nil
   	}

   	return &SubscriptionResponse{
   		Status: string(sub.Status),
   	}, nil
   }

   type FeatureResponse struct {
   	Allowed bool `json:"allowed"`
   }

   //encore:api public method=GET path=/billing/features/:feature/:customerID
   func CheckFeature(ctx context.Context, feature string, customerID string) (*FeatureResponse, error) {
   	if err := initClient(); err != nil {
   		return nil, err
   	}

   	result, err := client.FeatureAccess.Get(ctx, feature, &commet.GetFeatureAccessParams{
   		CustomerID: customerID,
   	})
   	if err != nil {
   		return nil, err
   	}

   	return &FeatureResponse{
   		Allowed: result.Allowed,
   	}, nil
   }
   ```

5. ## Track Usage
   ```go title="billing/billing.go"
   func float64Ptr(value float64) *float64 { return &value }

   type UsageParams struct {
   	CustomerID string `json:"customer_id"`
   }

   type UsageResponse struct {
   	Tracked bool `json:"tracked"`
   }

   //encore:api public method=POST path=/billing/usage
   func TrackUsage(ctx context.Context, req *UsageParams) (*UsageResponse, error) {
   	if err := initClient(); err != nil {
   		return nil, err
   	}

   	_, err := client.Usage.Track(ctx, &commet.TrackUsageParams{
   		CustomerID: req.CustomerID,
   		FeatureCode: "api_calls",
   		Value:       float64Ptr(1),
   	})
   	if err != nil {
   		return nil, err
   	}

   	return &UsageResponse{Tracked: true}, nil
   }
   ```
   Usage is aggregated and billed at end of period.

6. ## Webhooks
   ```go title="billing/webhooks.go"
   package billing

   import (

   	"io"
   	"net/http"

   	commet "github.com/commet-labs/commet-go/v9"
   )

   //encore:api public raw method=POST path=/webhooks/commet
   func HandleWebhook(w http.ResponseWriter, r *http.Request) {
   	rawBody, err := io.ReadAll(r.Body)
   	if err != nil {
   		http.Error(w, "Failed to read body", http.StatusBadRequest)
   		return
   	}

   	webhooks := &commet.WebhooksResource{}
   	payload, err := webhooks.VerifyAndParse(
   		string(rawBody),
   		r.Header.Get("x-commet-signature"),
   		secrets.CommetWebhookSecret,
   	)
   	if err != nil {
   		http.Error(w, "Invalid signature", http.StatusUnauthorized)
   		return
   	}

   	switch payload["event"] {
   	case "subscription.activated":
   		// handle activation
   	}

   	w.Header().Set("Content-Type", "application/json")
   	w.Write([]byte(`{"ok":true}`))
   }
   ```

7. ## Run
   ```bash
   encore run
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
