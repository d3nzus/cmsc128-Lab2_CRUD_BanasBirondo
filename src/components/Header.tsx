import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";

function Header() {
    return (
        <div>
            <header className="flex w-full items-center justify-between bg-teal-50 px-6 py-4">
                <Link to="/home" className="text-2xl font-bold text-black">
                    128 Lab CRUD
                </Link>
                <LoginButton />
            </header>
        </div>
    );
}

export default Header;