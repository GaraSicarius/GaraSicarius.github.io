# Carl Joseph Aguas portfolio

Run `npm start` with Node.js 22 or newer and open http://127.0.0.1:8765. The Gemini chatbot requires this server; a static file server or opening index.html directly will not run the backend. The optional Google Fonts stylesheet needs internet access; local fallback fonts are included.

## Replace your images and certificate placeholders

1. Create an `images` folder inside `dist` and put your project screenshots and certificate images there.
2. Open `dist/content.js` with a text editor.
3. For each project, replace `image: ''` with a path such as `image: 'images/hospital.png'`.
4. For each certificate, enter its real title, issuer and date, add its image path, and set `verified: true` only after supplying the actual details. Blank cards are explicitly labeled placeholders.
5. Save and refresh the page. A hosted copy needs to be republished for visitors to see changes. Clicking an added image opens the full image.

## Chatbot

The chatbot calls Google Gemini through `/api/chat`. Questions, recent conversation, and the approved profile are sent to Google. The API key stays on the server. Requests use `store: false`; Google's service terms still apply. Gemini is instructed to acknowledge missing details, but these instructions do not guarantee factual accuracy. Reloading or resetting clears the page's conversation.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`, which publishes the static files in `dist` whenever `main` is pushed. For the root address `https://garasicarius.github.io`, create a public GitHub repository named `GaraSicarius.github.io`, push this project to its `main` branch, and select **GitHub Actions** under **Settings → Pages → Build and deployment**.

GitHub Pages hosts the portfolio interface. The Gemini key remains on the existing server endpoint and is never committed to GitHub.

Get a key from https://aistudio.google.com/apikey. Copy `.env.example` to `.env` if it does not already exist and add the key after `GEMINI_API_KEY=`. Do not put secrets in `dist`, source control, or chat messages. The local server reads `.env` on each request, so saving the key does not require a restart. `GEMINI_MODEL` defaults to `gemini-3.8-flash` and can select a supported model available to the account. Verify a real answer after adding the key.

For hosting, configure `GEMINI_API_KEY` as a Sites secret environment variable. Local `.env` is not uploaded. `npm run build` produces a Cloudflare-compatible Worker. This site has not been configured for public access.

Birthday, hobbies, career goal, development-role interest, and GitHub were supplied by Carl in the conversation. Availability and LinkedIn remain unspecified. Edit `personal` in `dist/content.js` to update them. Other resume facts are in `profile.mjs`. Restart the local server after changing profile facts; rebuild and republish the hosted version.

Run `npm test` for mocked integration checks covering request construction, history validation, missing-key behavior, provider errors and secret handling. These tests do not call Gemini or verify live model behavior. After adding the key, verify birthday, project contributions, follow-up questions and an unsupported question such as favorite book. Requests time out after 25 seconds; conversation context is capped at six exchanges. A best-effort per-instance limit restricts clients to 15 requests per minute; this is not a durable account-wide spending limit.

All resume sections except the character reference are represented. The source resume is not served with the website because it contains that reference. The phone number is preserved exactly as written in the resume: 63+9452874381. Project screenshots and certificates have not been supplied.

The cursor word trail can be turned off below the hero and respects reduced-motion preferences. The layout adapts to mobile screens. Buttons, form fields, navigation and image dialogs support keyboard operation.
