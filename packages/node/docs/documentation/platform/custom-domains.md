---
lastModified: 2026-08-16
title: Custom Domains
description: Serve checkout and the Customer Portal from branded subdomains you control.
---

Custom domains replace `commet.co` in new hosted checkout and Customer Portal links. Configure them under **Settings → Custom Domains**.

Commet supports separate domains for each surface:

- **Checkout**, such as `checkout.example.com`.
- **Customer Portal**, such as `billing.example.com`.

## Add and verify a domain

1. Choose the surface and add a subdomain you own.
2. Add every DNS record shown by Commet at your DNS provider. This is normally one CNAME and one ownership TXT record.
3. Return to the dashboard and verify the domain.
4. Wait for DNS propagation if verification remains pending.

The hostname becomes active only after verification. Existing hosted links remain valid; newly generated links use the verified custom domain for that surface.

If the hostname is already registered to another Vercel account, Commet also shows a `vc-domain-verify` TXT record. Add that extra record before retrying verification.

Use a dedicated subdomain rather than a root domain already serving your application. Removing a domain returns future hosted links to the default Commet domain.

Custom-domain management is currently a dashboard workflow. Your application continues to request checkout and portal URLs through the same SDK operations.
