import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset, signInWithEmail, signUpWithEmail } from "../utils/userAuth";

function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setMessage("");
    setUsername("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stops the page from reloading
    setError("");
    setMessage("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const authError =
      mode === "signup"
        ? await signUpWithEmail(email, password, username)
        : await signInWithEmail(email, password);

    setLoading(false);

    if (authError) {
      setError(authError);
      return;
    }

    if (mode === "signup") {
      setMessage("Check your email and click the link to confirm your account.");
      //clear fields on successful signup
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      return;
    }

    navigate("/home"); // go to the task list
  }

  async function handleForgotPassword() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email address first, then choose Forgot password.");
      return;
    }

    setResetting(true);
    const resetError = await requestPasswordReset(email);
    setResetting(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    setMessage("If an account exists for that email, a password reset link is on its way.");
  }

  const inputClass =
    "w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-700 focus:ring-2 focus:ring-copperwood-300";

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-teal-100 p-4 py-10 inset-shadow-teal-200 inset-shadow-sm sm:p-8">
      <section
        aria-labelledby="login-heading"
        className="w-full max-w-md rounded-lg bg-olive-leaf-700 p-5 text-white shadow-xl shadow-teal-700/30 sm:p-8"
      >
        <h1 id="login-heading" className="text-2xl font-bold sm:text-3xl">
          {mode === "login" ? "Log In" : "Create Account"}
        </h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="username">
                Username
              </label>
              <input
                className={inputClass}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                maxLength={30}
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className={inputClass}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className={`${inputClass} pr-16`}
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                aria-describedby={mode === "signup" ? "password-hint" : undefined}
                minLength={6}
                required
              />
              <button
                className="absolute inset-y-0 right-0 rounded-r-md px-3 text-sm font-semibold text-cyan-950 hover:bg-olive-leaf-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-700"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {mode === "signup" && (
              <p id="password-hint" className="mt-1 text-xs text-cornsilk-100">
                At least 6 characters.
              </p>
            )}
            {mode === "login" && (
              <div className="mt-1 flex justify-end">
                <button
                  className="text-sm font-semibold text-cornsilk-100 underline underline-offset-2 hover:text-white disabled:opacity-50"
                  type="button"
                  onClick={() => void handleForgotPassword()}
                  disabled={resetting}
                >
                  {resetting ? "Sending..." : "Forgot password?"}
                </button>
              </div>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                className={inputClass}
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          )}

          {error && (
            <p className="rounded-md border border-red-300/50 bg-red-950/30 p-3 text-sm text-red-100" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-md border border-cornsilk-300/50 bg-olive-leaf-800 p-3 text-sm text-cornsilk-100" role="status">
              {message}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-olive-leaf-500 pt-5 sm:flex-row sm:justify-between">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-cornsilk-300 px-5 py-2 font-bold text-olive-leaf-950 hover:bg-cornsilk-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : "Sign Up"}
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-cornsilk-300/70 bg-transparent px-5 py-2 font-bold text-cornsilk-50 hover:bg-olive-leaf-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
            type="button"
            onClick={switchMode}
          >
            {mode === "login" ? "Create account" : "Log in"}
          </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
