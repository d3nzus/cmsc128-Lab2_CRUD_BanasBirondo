import { Link, useLocation } from "react-router-dom";
import SignOutButton from "./SignOutButton";

function Header() {
    const { pathname } = useLocation();
    const showAccount = pathname !== "/login";

    return (
        <header className="flex w-full items-center justify-between gap-4 bg-teal-50 px-4 py-4 sm:px-6">
            <Link to="/" className="text-xl font-bold text-black sm:text-2xl">
                128 Lab CRUD
            </Link>
            {showAccount && (
                <div className="flex items-center gap-4 sm:gap-6">
                    <Link to="/profile" className="text-base font-bold text-black sm:text-lg">
                        Profile
                    </Link>
                    <SignOutButton />
                </div>
            )}
        </header>
    );
}

export default Header;
