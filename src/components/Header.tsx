import { Link, useLocation } from "react-router-dom";
import SignOutButton from "./SignOutButton";

function Header() {
    const { pathname } = useLocation();
    const showAccount = pathname !== "/login";

    return (
        <header className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-teal-50 px-4 py-3 sm:px-6 sm:py-4">
            <Link to="/" className="min-w-0 truncate text-lg font-bold text-black sm:text-2xl">
                128 Lab CRUD
            </Link>
            {showAccount && (
                <div className="flex min-w-0 items-center gap-2 sm:gap-6">
                    <Link to="/profile" className="text-sm font-bold text-black sm:text-lg">
                        Profile
                    </Link>
                    <SignOutButton />
                </div>
            )}
        </header>
    );
}

export default Header;
