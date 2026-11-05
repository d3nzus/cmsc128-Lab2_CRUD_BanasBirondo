import { Link, useLocation } from "react-router-dom";
import SignOutButton from "./SignOutButton";

function Header() {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/login";
  const isTaskArea =
    pathname === "/home" ||
    pathname === "/addForm" ||
    pathname === "/editForm" ||
    pathname === "/addTaskList";

  function navLinkClass(active: boolean) {
    return [
      "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold transition sm:px-3",
      active
        ? "bg-black-forest-700 text-white shadow-sm"
        : "text-cyan-900 hover:bg-olive-leaf-100 hover:text-black-forest-900",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-olive-leaf-200/80 bg-teal-50/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link
          to="/home"
          className="group inline-flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black-forest-500"
          aria-label="128 Lab Task CRUD home"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-olive-leaf-600 text-cornsilk-100 shadow-sm transition group-hover:bg-olive-leaf-700">
            <svg
              aria-hidden="true"
              className="size-5"
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
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-bold text-cyan-950 sm:text-lg">
              128 Lab
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-olive-leaf-700 sm:block">
              Task CRUD
            </span>
          </span>
        </Link>

        {isLoginPage ? (
          <p className="hidden max-w-xs text-right text-sm leading-5 text-cyan-800 md:block">
            Simple task tracking for busy student teams.
          </p>
        ) : (
          <nav aria-label="Main navigation" className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/home"
              className={navLinkClass(isTaskArea)}
              aria-current={isTaskArea ? "page" : undefined}
              aria-label="Tasks"
              title="Tasks"
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
                <path d="M9 11.5 11.2 14 15.5 8.5" />
                <rect x="3" y="4" width="18" height="16" rx="3" />
              </svg>
              <span className="hidden sm:inline">Tasks</span>
            </Link>
            <Link
              to="/profile"
              className={navLinkClass(pathname === "/profile")}
              aria-current={pathname === "/profile" ? "page" : undefined}
              aria-label="Profile"
              title="Profile"
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
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.7-3.4 3.2-5.5 7-5.5s6.3 2.1 7 5.5" />
              </svg>
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <SignOutButton />
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
