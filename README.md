# Student OS v12.4 — Public Web Release

**Developed by Rizky Khoilillu Rochman.**

This package is structured for public deployment as a web app/PWA.

## What is included
- Professional Student OS academic workspace.
- AI modules and student productivity tools.
- Unified document/image attachments.
- PWA manifest + service worker + install icons.
- Same-origin AI gateway for public deployments.
- Vercel and Netlify deployment configs.
- Security-oriented response headers.
- No provider API secret is stored in the frontend runtime config.

## Recommended public deployment
Deploy the repository root to **Vercel** or **Netlify** and configure server environment variables:

- `GEMINI_API_KEY` — optional
- `OPENAI_API_KEY` — optional
- `ANTHROPIC_API_KEY` — optional

Only configure the providers you actually use. Never put these values into `www/runtime-config.js` or frontend JavaScript.

### Vercel
The included `vercel.json` rewrites `/api/ai` to the serverless gateway in `api/ai.js` and publishes `www` as the web root.

### Netlify
The included `netlify.toml` publishes `www` and maps `/api/ai` to `netlify/functions/ai.js`.

## Static-only hosting
The web app can also be hosted as a static site. In that mode, `runtime-config.js` should set `backendUrl:''` and users can use Offline mode or their own browser-side provider keys. This is less secure for a public service because browser-entered keys are exposed to the client.

## PWA
Serve over HTTPS. The service worker will register automatically and supported browsers can offer Install/Add to Home Screen.

## Local test
```bash
python -m http.server 8080 -d www
```
Then open `http://localhost:8080/`.

## Important
This is a deployable web source package, not a hosted website or a prebuilt APK. A hosting account/domain is required to put it on the public internet.


## Production hardening in v12.4
- AI gateway validates provider/model, prompt length, attachment MIME/type, and payload size.
- Same-origin AI requests are protected by a lightweight per-instance rate limit and a 45-second upstream timeout.
- Frontend attachment limit is 6 MB to stay aligned with serverless request constraints.
- Vercel routing is simplified to avoid conflicting `rewrites`/`routes`.
- Service worker registration is de-duplicated and cache version is bumped.
- Provider API keys remain server-side for the recommended public deployment.

Note: serverless rate limiting is intentionally lightweight; for high-traffic public launches, add durable rate limiting/WAF (for example via the hosting provider or an edge service).
