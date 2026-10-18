import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"

// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "thrrosenheim.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "thrrosenheim",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

if (
    process.env.NEXT_PUBLIC_TEST_ENV === "true" &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL
) {
    connectAuthEmulator(
        auth,
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL
    )
}

export { auth }
