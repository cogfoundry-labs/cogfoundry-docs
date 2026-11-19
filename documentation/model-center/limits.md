---
title: Rate limits
description: How the API behaves when you send too much, and how to back off.
icon: gauge
---

Requests are throttled. Limits exist to keep one integration from consuming capacity that other accounts are waiting on, and they apply to the account behind the key rather than to each request in isolation.

When you exceed a limit the API returns `429` with the same `error` body shape as any other failure. Retry with exponential backoff and jitter rather than a fixed delay, and cap the total number of retries — a client that retries immediately keeps landing on the limit.

<Note>
  The concrete request-per-minute and concurrency ceilings are not published. If you are sizing a production integration and need the numbers confirmed for your account, contact support instead of inferring them from observed behaviour.
</Note>
