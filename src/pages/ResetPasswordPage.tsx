import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, updatePassword } from "../utils/userAuth";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error(
          "This reset link is invalid or has expired. Request a new one from the login page.",
        );
      }

      const updateError = await updatePassword(password);
      if (updateError) throw new Error(updateError);

      navigate("/home", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full min-w-0 rounded-md border border-olive-leaf-300 bg-white px-3 py-2.5 text-cyan-950 shadow-sm outline-none focus:border-copperwood-500 focus:ring-2 focus:ring-copperwood-300";

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-teal-100 p-4 py-10 inset-shadow-teal-200 inset-shadow-sm sm:p-8">
      <section
        aria-labelledby="reset-password-heading"
        className="w-full max-w-md rounded-lg bg-olive-leaf-700 p-5 text-white shadow-xl shadow-teal-700/30 sm:p-8"
      >
        <h1 id="reset-password-heading" className="text-2xl font-bold sm:text-3xl">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-cornsilk-100">
          Choose a new password for your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="new-password">
              New password
            </label>
            <div className="relative">
              <input
                className={`${inputClass} pr-16`}
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                aria-describedby="reset-password-hint"
                minLength={6}
                required
              />
              <button
                className="absolute inset-y-0 right-0 rounded-r-md px-3 text-sm font-semibold text-cyan-950 hover:bg-olive-leaf-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copperwood-500"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p id="reset-password-hint" className="mt-1 text-xs text-cornsilk-100">
              At least 6 characters.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirm-new-password">
              Confirm new password
            </label>
            <input
              className={inputClass}
              id="confirm-new-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-300/50 bg-red-950/30 p-3 text-sm text-red-100" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-olive-leaf-500 pt-5 sm:flex-row sm:justify-between">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-copperwood-600 px-5 py-2 font-bold text-white hover:bg-copperwood-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
              to="/login"
            >
              Back to login
            </Link>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-black-forest-700 px-5 py-2 font-bold text-white hover:bg-black-forest-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ResetPasswordPage;
