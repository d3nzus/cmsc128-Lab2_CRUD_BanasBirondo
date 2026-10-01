import LoginButton from "./LoginButton";

function Header() {
    return (
        <header className="flex w-full items-center justify-between bg-gray-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">128 Lab CRUD</h1>
            <LoginButton />
        </header>
    );
}

export default Header;