import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signUpWithEmail } from "../utils/userAuth";

const inputClass =
  "w-full min-w-0 rounded-lg border border-olive-leaf-200 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none transition placeholder:text-cyan-700/50 hover:border-olive-leaf-300 focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300";

function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function switchMode(next: "login" | "signup") {
    if (next === mode) return;
    setMode(next);
    setError("");
    setMessage("");
    setPassword("");
    setUsername("");
    setShowPassword(false);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stops the page from reloading
    setLoading(true);
    setError("");
    setMessage("");

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
      setUsername("");
      return;
    }

    navigate("/home"); // go to the task list
  }

  const modeTabClass = (active: boolean) =>
    [
      "min-h-10 flex-1 rounded-lg px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-500",
      active
        ? "bg-white text-cyan-950 shadow-sm"
        : "text-cyan-800 hover:bg-white/60 hover:text-cyan-950",
    ].join(" ");

  return (
    <main className="flex flex-1 items-center justify-center bg-teal-100 p-4 py-8 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-olive-leaf-200 bg-white shadow-xl shadow-teal-900/10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden flex-col justify-between gap-8 bg-olive-leaf-700 p-8 text-white lg:flex xl:p-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-cornsilk-300 text-olive-leaf-900 shadow-sm">
                <svg
                  aria-hidden="true"
                  className="size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </span>
              <div>
                <p className="text-lg font-bold leading-tight text-white">128 Lab</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-olive-leaf-100">
                  Task CRUD
                </p>
              </div>
            </div>

            <h2 className="mt-10 text-3xl font-bold leading-tight text-white">
              Keep every task and teammate in one calm place.
            </h2>
            <p className="mt-3 text-base leading-7 text-olive-leaf-100">
              Create shared lists, track priorities, and get things done together.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-cornsilk-50">
              {[
                "Collaborative task lists",
                "Clear priorities and due dates",
                "Invite teammates by email",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-olive-leaf-600 text-cornsilk-200">
                    <svg
                      aria-hidden="true"
                      className="size-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs leading-5 text-olive-leaf-200">
            Built for CMSC 128 · Simple, shared task tracking.
          </p>
        </aside>

        <section className="p-6 sm:p-8 lg:p-10" aria-labelledby="login-heading">
          <div className="mb-6 flex rounded-xl bg-olive-leaf-50 p-1" role="group" aria-label="Authentication mode">
            <button
              className={modeTabClass(mode === "login")}
              type="button"
              onClick={() => switchMode("login")}
              aria-pressed={mode === "login"}
            >
              Log in
            </button>
            <button
              className={modeTabClass(mode === "signup")}
              type="button"
              onClick={() => switchMode("signup")}
              aria-pressed={mode === "signup"}
            >
              Create account
            </button>
          </div>

          <h1 id="login-heading" className="text-2xl font-bold tracking-tight text-cyan-950 sm:text-3xl">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-cyan-800">
            {mode === "login"
              ? "Log in to pick up where you left off."
              : "Set up a username and start organizing your tasks."}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-cyan-950" htmlFor="username">
                  Username
                </label>
                <input
                  className={inputClass}
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="your-username"
                  minLength={3}
                  maxLength={30}
                  required
                />
                <p className="mt-1.5 text-xs leading-5 text-cyan-700">
                  3–30 characters. This is how teammates will recognize you.
                </p>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-cyan-950" htmlFor="email">
                Email
              </label>
              <input
                className={inputClass}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-cyan-950" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className={`${inputClass} pr-12`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={mode === "login" ? "Enter your password" : "At least 6 characters"}
                  minLength={6}
                  required
                />
                <button
                  className="absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-cyan-700 transition hover:bg-olive-leaf-50 hover:text-cyan-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-500"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg
                      aria-hidden="true"
                      className="size-4.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                      <path d="M9.4 5.2A10.4 10.4 0 0 1 12 5c5 0 9 4.5 9 7 0 .9-.4 1.9-1.1 2.9M6.1 6.2C3.9 7.7 3 9.9 3 12c0 2.5 4 7 9 7 1.3 0 2.5-.3 3.6-.8" />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      className="size-4.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"
                role="alert"
              >
                <svg
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16.5v.5" />
                </svg>
                {error}
              </p>
            )}
            {message && (
              <p
                className="flex items-start gap-2 rounded-lg border border-olive-leaf-300 bg-olive-leaf-50 p-3 text-sm text-olive-leaf-900"
                role="status"
              >
                <svg
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.5 12 2.5 2.5 4.5-5" />
                </svg>
                {message}
              </p>
            )}

            <button
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-black-forest-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <svg
                  aria-hidden="true"
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4Z" />
                </svg>
              )}
              {loading
                ? "Please wait…"
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
