---
lastModified: 2026-08-16
title: Members and Permissions
description: Invite teammates and choose who can manage organization configuration.
---

Manage team access under **Settings → Members** in the live organization. Membership lives on that live organization and grants the same team access to its sandboxes. Invitations can assign one of three roles.

| Role       | Intended responsibility                                              |
| ---------- | -------------------------------------------------------------------- |
| **Owner**  | Organization ownership and the most sensitive administrative actions |
| **Admin**  | Operational configuration and member management                      |
| **Member** | Day-to-day access without organization administration                |

Owners and admins can invite members, change supported roles, cancel pending invitations, and remove members. An admin cannot manage the owner as if they were a normal member.

Member changes are available only from the live organization. Switch back to live before inviting someone or changing access for the live-and-sandbox group.

Invite each person with their own account. Do not share dashboard credentials or use a human login as an application credential; server workloads use [API keys](/docs/create-api-key).

Permissions protect dashboard actions, but they do not narrow an API key to the member who created it. Rotate or delete keys independently when a workload or team boundary changes.
