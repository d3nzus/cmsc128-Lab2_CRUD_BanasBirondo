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
      className="rounded bg-copperwood-500 px-4 py-2 font-bold text-white hover:bg-copperwood-700 disabled:opacity-50"
      type="button"
      onClick={() => void handleSignOut()}
      disabled={signingOut}
    >
      {signingOut ? "Signing out..." : "Sign Out"}
    </button>
  );
}

export default SignOutButton;
