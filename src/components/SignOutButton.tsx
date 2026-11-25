import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../utils/userAuth.ts";

function SignOutButton() {
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setSigningOut(true);
    setError("");

    try {
      const signOutError = await signOut();
      if (signOutError) throw new Error(signOutError);
      navigate("/login", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className="inline-flex min-h-11 items-center justify-center rounded bg-copperwood-700 px-3 py-2 text-sm font-bold text-white hover:bg-copperwood-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-leaf-700 disabled:opacity-50 sm:px-4 sm:text-base"
        type="button"
        onClick={() => void handleSignOut()}
        disabled={signingOut}
      >
        {signingOut ? "Signing out..." : "Sign Out"}
      </button>
      {error && (
        <p className="max-w-40 text-right text-xs text-red-700 sm:max-w-56" role="alert">
          Could not sign out: {error}
        </p>
      )}
    </div>
  );
}

export default SignOutButton;
