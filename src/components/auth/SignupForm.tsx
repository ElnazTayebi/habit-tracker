import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

// validation
import {
    validateEmail,
    validatePassword,
    validatePasswordMatch
} from "../../validations/auth.validation";

const SignupForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

 const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
        email: "",
        password: "",
        confirmPassword: "",
    };

    let hasError = false;

    // Email validation
    if (!validateEmail(email)) {
        newErrors.email = "Invalid email format";
        hasError = true;
    }

    // Password validation
    const passwordValidation = validatePassword(password);

    if (!passwordValidation.minLength) {
        newErrors.password = "Password must be at least 6 characters";
        hasError = true;
    }

    // 🔥 مهم: حتما هر دو مقدار وجود داشته باشن
    if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        hasError = true;
    }

    // 🔥 بررسی match
    if (
        password &&
        confirmPassword &&
        password !== confirmPassword
    ) {
        newErrors.confirmPassword = "Passwords do not match";
        hasError = true;
    }

    setErrors(newErrors);

    // ⛔ جلوگیری از رفتن به Firebase
    if (hasError) return;

    try {
        setLoading(true);

        await createUserWithEmailAndPassword(auth, email, password);

        console.log("Signup successful");

    } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
            setErrors(prev => ({
                ...prev,
                email: "Email already in use"
            }));
        } else {
            console.log(err);
        }
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="w-full max-w-sm space-y-6 p-6 bg-[rgb(var(--card))] rounded-xl shadow">

            <h2 className="text-xl font-bold">
                Create your account
            </h2>

            <form className="space-y-4" onSubmit={handleSignup}>

                {/* Full Name */}
                <div>
                    <Label>Full name</Label>
                    <Input
                        className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                {/* Email */}
                <div>
                    <Label>Email address</Label>
                    <Input
                        className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <Label>Password</Label>

                    <div className="relative">
                        <Input
                            className="w-full p-2 pr-10 rounded bg-[rgb(var(--card-muted))]"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* password rules */}
                    <div className="text-xs mt-2 space-y-1">
                        <p className={password.length >= 6 ? "text-green-500" : "text-gray-500"}>
                            • At least 6 characters
                        </p>
                        <p className={/\d/.test(password) ? "text-green-500" : "text-gray-500"}>
                            • Contains a number
                        </p>
                        <p className={/[a-zA-Z]/.test(password) ? "text-green-500" : "text-gray-500"}>
                            • Contains a letter
                        </p>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <Label>Confirm Password</Label>

                    <div className="relative">
                        <Input
                            className="w-full p-2 pr-10 rounded bg-[rgb(var(--card-muted))]"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Loading..." : "Sign up"}
                </Button>
            </form>

            <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default SignupForm;