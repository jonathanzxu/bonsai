touch .env
echo "MONGO=mongodb+srv://anthonyla:9DAoGnvNumXy6JTw@taskmanager.wvsknzw.mongodb.net/taskmanager?retryWrites=true&w=majority" >> .env
echo "NEXTAUTH_SECRET=test" >> .env
echo "NEXTAUTH_URL=http://localhost:3000/api/auth" >> .env
echo "GOOGLE_CLIENT_ID=702455039050-9ffolqsfagnoa5kaf5ki1dhlog7pc705.apps.googleusercontent.com" >> .env
echo "GOOGLE_CLIENT_SECRET=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" >> .env
npm install
npm run dev