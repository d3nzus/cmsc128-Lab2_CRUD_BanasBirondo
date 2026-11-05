import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../utils/userAuth.ts";

function SignOutButton() {
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const error = await signOut();
      if (error) throw new Error(error);
      navigate("/login", { replace: true });
    } catch (error) {
      alert(`Could not sign out: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <button
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-copperwood-600 px-2.5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-copperwood-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
      type="button"
      onClick={() => void handleSignOut()}
      disabled={signingOut}
      aria-label="Sign out"
      title="Sign out"
    >
      <svg
        aria-hidden="true"
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
        <path d="m10 17 5-5-5-5" />
        <path d="M15 12H3" />
      </svg>
      <span className="hidden sm:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}

export default SignOutButton;
