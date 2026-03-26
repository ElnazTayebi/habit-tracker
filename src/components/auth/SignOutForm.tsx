import Button from "../ui/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Zustand
import { useAuthStore } from "../../store/auth/authStore";

const SignOutForm = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const navigate = useNavigate();

    // Zustand
    const logout = useAuthStore((state) => state.logout);
    const loading = useAuthStore((state) => state.loading);

    const handleSignOut = async () => {
        try {
            setIsConfirming(true);
            // 🔥 Zustand logout
            await logout();

            console.log("Sign out successful");
            navigate("/login");
        } catch (err: any) {
            console.error("Sign out error:", err);
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCancel = () => {
        // Navigate back or close modal
        window.history.back();
    };

    return (
        <div className="w-full max-w-sm space-y-6 p-6 bg-[rgb(var(--card))] rounded-xl shadow">

            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <span className="font-semibold text-lg">HabitTrack</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl text-center">
                Sign out
            </h2>

            {/* Description */}
            <div className="text-center space-y-2">
                <p className="text-sm text-[rgb(var(--muted))]">
                    Are you sure you want to sign out of your account?
                </p>
                <p className="text-sm text-[rgb(var(--muted))]">
                    You will need to sign in again to access your habits.
                </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                {/* Sign Out Button */}
                <Button
                    onClick={handleSignOut}
                    disabled={loading || isConfirming}
                    className="w-full bg-[rgb(var(--primary))] text-white hover:bg-opacity-90"
                >
                    {loading || isConfirming ? "Signing out..." : "Sign out"}
                </Button>

                {/* Cancel Button */}
                <button
                    onClick={handleCancel}
                    disabled={loading || isConfirming}
                    className="w-full px-4 py-2 rounded-lg border border-[rgb(var(--border))] text-[rgb(var(--foreground))] hover:bg-[rgb(var(--card-muted))] transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-[rgb(var(--muted))]">
                Not finished yet?{" "}
                <Link
                    to="/dashboard"
                    className="text-[rgb(var(--primary))] font-semibold hover:underline"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default SignOutForm;