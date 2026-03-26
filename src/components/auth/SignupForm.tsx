import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

// validation
import { validateEmail, validatePassword } from "../../validations/auth.validation";

// Zustand
import { useAuthStore } from "../../store/auth/authStore";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };
    let hasError = false;

    // Full name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      hasError = true;
    }

    // Email
    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
    }

    // Password
    const passwordValid = validatePassword(password);
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (!passwordValid.minLength) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    // Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      await signup(email, password);
      console.log("Signup successful");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setErrors((prev) => ({ ...prev, email: "Email already in use" }));
      } else {
        console.log(err);
      }
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6 p-6 bg-[rgb(var(--card))] rounded-xl shadow">

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
          ✔
        </div>
        <span className="font-semibold text-lg">HabitTrack</span>
      </div>

      <h2 className="mt-6 text-xl font-bold">
        Create your account
      </h2>

      <form noValidate className="space-y-4" onSubmit={handleSignup}>

        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
             placeholder="Joe Doe"
            className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
             placeholder="example@gmail.com"
            type="email"
            className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              setErrors((prev) => ({
                ...prev,
                email: !value
                  ? "Email is required"
                  : validateEmail(value)
                  ? ""
                  : "Invalid email format",
              }));
            }}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
               placeholder="******"
              type={showPassword ? "text" : "password"}
              className="w-full p-2 pr-10 rounded bg-[rgb(var(--card-muted))]"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                const valid = validatePassword(value);
                setErrors((prev) => ({
                  ...prev,
                  password: !value
                    ? "Password is required"
                    : valid.minLength
                    ? ""
                    : "Password must be at least 6 characters",
                }));
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
               placeholder="******"
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-2 pr-10 rounded bg-[rgb(var(--card-muted))]"
              value={confirmPassword}
              onChange={(e) => {
                const value = e.target.value;
                setConfirmPassword(value);
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: !value
                    ? "Please confirm your password"
                    : value !== password
                    ? "Passwords do not match"
                    : "",
                }));
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Sign up"}
        </Button>
      </form>

      <p className="text-left text-sm text-[rgb(var(--muted))]">
        Already have an account?{" "}
        <Link to="/login" className="ml-1 text-[rgb(var(--primary))] font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;