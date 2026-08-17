---
lastModified: 2026-07-28
title: Integrate with Java
description: Install and configure the Commet Java SDK.
---

Install the Commet Skill so your coding agent can integrate the current SDK and verify its work against the live API contract.

```bash
npx skills add commet-labs/skills --skill commet
```

1. ## Install
   ### Maven
   ```xml title="pom.xml"
   <dependency>
       <groupId>co.commet</groupId>
       <artifactId>commet-java</artifactId>
       <version>8.0.0</version>
   </dependency>
   ```
   ### Gradle
   ```kotlin title="build.gradle.kts"
   implementation("co.commet:commet-java:9.0.0")
   ```

2. ## Configure
   ```bash title=".env"
   COMMET_API_KEY=ck_sandbox_xxx
   ```
   ```java title="CommetClient.java"
   import co.commet.Commet;

   public class CommetClient {

       public static final Commet commet = Commet.builder()
               .apiKey(System.getenv("COMMET_API_KEY"))
               .build();
   }
   ```
   There is no environment option on the client: sandbox vs live is decided by the organization the API key belongs to.

3. ## Create Customer and Subscribe
   `customers().create` is idempotent — if a customer with the same `id` already exists, it returns the existing record.
   ```java
   import co.commet.params.CreateCustomerParams;
   import co.commet.params.CreateSubscriptionParams;

   commet.customers().create(
       CreateCustomerParams.builder("user@example.com")
           .id("user_123")
           .build()
   );

   var subscription = commet.subscriptions().create(
       CreateSubscriptionParams.builder("user_123")
           .planCode("pro")
           .build()
   );

   String checkoutUrl = subscription.checkoutUrl();
   ```
   The customer is redirected to checkout to complete payment.

4. ## Check Access
   ```java
   import co.commet.models.FeatureAccess;
   import co.commet.models.Subscription;
   import co.commet.models.SubscriptionStatus;
   import co.commet.params.GetActiveSubscriptionParams;
   import co.commet.params.GetFeatureAccessParams;

   Subscription sub = commet.subscriptions().getActive(
       GetActiveSubscriptionParams.builder("user_123").build()
   );
   SubscriptionStatus status = sub != null ? sub.status() : null;

   FeatureAccess access = commet.featureAccess()
           .get("custom_branding", GetFeatureAccessParams.builder("user_123").build());
   boolean allowed = access.allowed();
   ```

5. ## Track Usage
   ```java
   import co.commet.params.TrackUsageParams;

   commet.usage().track(
       TrackUsageParams.builder("api_calls", "user_123")
           .value(1.0)
           .build()
   );
   ```
   Usage is aggregated and billed at end of period.

6. ## Webhooks
   ```java
   import co.commet.resources.Webhooks;
   import java.util.Map;

   Webhooks webhooks = new Webhooks();

   Map<String, Object> payload = webhooks.verifyAndParse(
           rawBody, signature, webhookSecret
   );

   if (payload == null) {
       // return 401
   }

   if ("subscription.activated".equals(payload.get("event"))) {
       // handle activation
   }
   ```

## Related

- [SDK Reference](/docs/sdk-reference)
