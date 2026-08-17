---
lastModified: 2026-07-31
title: Integrate with Go
description: Add billing and payments to your Go application using net/http.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ```bash
   go get github.com/commet-labs/commet-go/v9
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   COMMET_WEBHOOK_SECRET=whsec_xxx
   ```
   ```go title="billing/client.go"
   package billing

   import (
   	"log"
   	"os"

   	commet "github.com/commet-labs/commet-go/v9"
   )

   var Client *commet.Client

   func Init() {
   	var err error
   	Client, err = commet.New(os.Getenv("COMMET_API_KEY"))
   	if err != nil {
   		log.Fatal(err)
   	}
   }
   ```
   There is no environment option on the client: sandbox vs live is decided by the organization the API key belongs to.

3. ## Subscribe
   ```go title="billing/handlers.go"
   package billing

   import (
   	"encoding/json"
   	"net/http"

   	commet "github.com/commet-labs/commet-go/v9"
   )

   type subscribeRequest struct {
   	Email      string `json:"email"`
   	CustomerID string `json:"customer_id"`
   }

   func Subscribe(w http.ResponseWriter, r *http.Request) {
   	var req subscribeRequest
   	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
   		http.Error(w, err.Error(), http.StatusBadRequest)
   		return
   	}

   	_, err := Client.Customers.Create(r.Context(), &commet.CreateCustomerParams{
   		Email: req.Email,
   		ID:    &req.CustomerID,
   	})
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

   	planCode := "pro"
   	subscription, err := Client.Subscriptions.Create(r.Context(), &commet.CreateSubscriptionParams{
   		CustomerID: req.CustomerID,
   		PlanCode:   &planCode,
   	})
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

   	checkoutURL := ""
   	if subscription.CheckoutURL != nil {
   		checkoutURL = *subscription.CheckoutURL
   	}

   	w.Header().Set("Content-Type", "application/json")
   	json.NewEncoder(w).Encode(map[string]any{"checkout_url": checkoutURL})
   }
   ```

4. ## Check Access
   ```go title="billing/handlers.go"
   func GetSubscription(w http.ResponseWriter, r *http.Request) {
   	customerID := r.PathValue("customerID")

   	sub, err := Client.Subscriptions.GetActive(r.Context(), &commet.GetActiveSubscriptionParams{
   		CustomerID: customerID,
   	})
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

   	if sub == nil {
   		http.Error(w, "No active subscription", http.StatusNotFound)
   		return
   	}

   	w.Header().Set("Content-Type", "application/json")
   	json.NewEncoder(w).Encode(map[string]any{"status": sub.Status})
   }

   func CheckFeature(w http.ResponseWriter, r *http.Request) {
   	feature := r.PathValue("feature")
   	customerID := r.PathValue("customerID")

   	result, err := Client.FeatureAccess.Get(r.Context(), feature, &commet.GetFeatureAccessParams{
   		CustomerID: customerID,
   	})
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

   	w.Header().Set("Content-Type", "application/json")
   	json.NewEncoder(w).Encode(map[string]any{"allowed": result.Allowed})
   }
   ```

5. ## Track Usage
   ```go title="billing/handlers.go"
   func float64Ptr(value float64) *float64 { return &value }

   type usageRequest struct {
   	CustomerID string `json:"customer_id"`
   }

   func TrackUsage(w http.ResponseWriter, r *http.Request) {
   	var req usageRequest
   	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
   		http.Error(w, err.Error(), http.StatusBadRequest)
   		return
   	}

   	_, err := Client.Usage.Track(r.Context(), &commet.TrackUsageParams{
   		CustomerID: req.CustomerID,
   		FeatureCode: "api_calls",
   		Value:       float64Ptr(1),
   	})
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

   	w.Header().Set("Content-Type", "application/json")
   	json.NewEncoder(w).Encode(map[string]any{"tracked": true})
   }
   ```
   Usage is aggregated and billed at end of period.

6. ## Customer Portal
   ```go title="billing/handlers.go"
   func Portal(w http.ResponseWriter, r *http.Request) {
   	customerID := "user_123"
   	result, err := Client.Portal.GetURL(r.Context(), &commet.RequestPortalAccessParams{
   		CustomerID: &customerID,
   	})
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

   	http.Redirect(w, r, result.PortalURL, http.StatusTemporaryRedirect)
   }
   ```

7. ## Webhooks
   ```go title="billing/webhooks.go"
   package billing

   import (
   	"io"
   	"net/http"
   	"os"

   	commet "github.com/commet-labs/commet-go/v9"
   )

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
   		os.Getenv("COMMET_WEBHOOK_SECRET"),
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

8. ## Start Server
   ```go title="main.go"
   package main

   import (

   	"log"
   	"net/http"

   	"myapp/billing"
   )

   func main() {
   	billing.Init()
   	defer billing.Client.Close()

   	mux := http.NewServeMux()

   	mux.HandleFunc("POST /billing/subscribe", billing.Subscribe)
   	mux.HandleFunc("GET /billing/subscription/{customerID}", billing.GetSubscription)
   	mux.HandleFunc("GET /billing/features/{feature}/{customerID}", billing.CheckFeature)
   	mux.HandleFunc("POST /billing/usage", billing.TrackUsage)
   	mux.HandleFunc("GET /billing/portal", billing.Portal)
   	mux.HandleFunc("POST /webhooks/commet", billing.HandleWebhook)

   	log.Println("Listening on :3000")
   	log.Fatal(http.ListenAndServe(":3000", mux))
   }
   ```

## Related

- [Subscriptions](/docs/manage-subscriptions)
- [Track Usage](/docs/track-usage)
- [Customer Portal](/docs/customer-portal)
- [SDK Reference](/docs/sdk-reference)
