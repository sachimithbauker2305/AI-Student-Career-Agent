# NextStep deployment / mobile link

The frontend is now a Progressive Web App (PWA). After deployment, users can open the same HTTPS URL on a phone and use **Add to Home Screen / Install App** for an app-like experience. The Home page also has a Share NextStep action for sending the link to other users.

## One public URL

The project includes `render.yaml` for a single-service deployment where FastAPI serves the built React app. This keeps the frontend and API on one URL.

1. Create a Render account and connect this project repository.
2. Use the included `render.yaml` to create the web service.
3. Set the database connection (`DATABASE_URL`) to a hosted PostgreSQL database if you want persistent user data.
4. Set the SMTP variables using the same values already used by your local backend `.env`; do not commit secrets.
5. The chatbot still needs a reachable Ollama-compatible endpoint. A local `127.0.0.1:11434` Ollama service is only reachable from the computer running it, so for a public deployment set `OLLAMA_BASE_URL` to a remotely reachable compatible service.
6. Render will provide an HTTPS URL such as `https://your-service-name.onrender.com`. That is the link you can send to users and open on Android/iPhone.

## Local mobile testing

For testing on a phone connected to the same Wi-Fi as the development computer, run the frontend with Vite's host setting (already enabled in `vite.config.js`) and use the computer's local-network URL. A public user link requires deployment.
