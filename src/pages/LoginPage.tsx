import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signUpWithEmail } from "../utils/userAuth";
 
function LoginPage() {
  const navigate = useNavigate();
 
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
 
  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setMessage("");
  }
 
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stops the page from reloading
    setLoading(true);
    setError("");
    setMessage("");
 
    const authError =
      mode === "signup"
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

    setLoading(false);

    if (authError) {
      setError(authError);
      return;
    }

    if (mode === "signup") {
      setMessage("Check your email and click the link to confirm your account.");
      setPassword("");
      return;
    }

    navigate("/home"); // go to the task list
  }
 
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
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
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
            <input
              className="w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={6}
              required
            />
          </div>

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
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-black-forest-500 px-5 py-2 font-bold text-white hover:bg-black-forest-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-copperwood-600 px-5 py-2 font-bold text-white hover:bg-copperwood-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
            type="button"
            onClick={switchMode}
          >
            {mode === "login" ? "Need an account?" : "Have an account?"}
          </button>
          </div>
        </form>
      </section>
    </main>
  );
}
 
export default LoginPage;
 