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

    navigate("/"); // go to the task list
  }
 
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-700 p-4 text-center gap-4">
      <h1 className="text-white text-4xl">128 Lab CRUD</h1>
      <h3 className="text-white">
        {mode === "login" ? "Log In:" : "Create Account:"}
      </h3>
 
      <form onSubmit={handleSubmit}>
        <table className="border-4 text-white">
          <tbody>
            <tr>
              <td className="p-4">Email:</td>
              <td className="p-4">
                <input
                  className="p-2 text-black bg-white"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="p-4">Password:</td>
              <td className="p-4">
                <input
                  className="p-2 text-black bg-white"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={6}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
 
        {error && <p className="mt-4 text-red-400">{error}</p>}
        {message && <p className="mt-4 text-green-400">{message}</p>}
 
        <div className="flex flex-row gap-3 w-full justify-center mt-4">
          <button
            className="bg-blue-500 px-4 py-2 font-bold text-white disabled:opacity-50"
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
            className="bg-gray-500 px-4 py-2 font-bold text-white"
            type="button"
            onClick={switchMode}
          >
            {mode === "login" ? "Need an account?" : "Have an account?"}
          </button>
        </div>
      </form>
    </div>
  );
}
 
export default LoginPage;
 