import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; 

// Function to login user using Firebase Authentication
export const loginUser = async (email: string, password: string) => {
  try {
    // Firebase login method
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Return user data
    return userCredential.user;

  } catch (error) {
    // Log error for debugging
    console.error("Login error:", error);

    // Re-throw error so UI can handle it
    throw error;
  }
};