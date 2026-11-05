import { Link } from "react-router-dom";
import SignOutButton from "./SignOutButton";

function Header() {
    return (
        <header className="flex w-full items-center justify-between bg-teal-50 px-6 py-4">
            <Link to="/home" className="text-2xl font-bold text-black">
                128 Lab CRUD
            </Link>
            <div className="flex items-center gap-10">
                <Link to="/profile" className="text-2xl font-bold text-black">
                Profile
                </Link>
                <SignOutButton />
            </div>
            
        </header>
    );
}

export default Header;
