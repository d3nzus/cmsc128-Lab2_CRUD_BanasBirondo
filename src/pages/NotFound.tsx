import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-teal-100 p-6 text-center text-cyan-950">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="max-w-md">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-black-forest-700 px-5 py-2 font-bold text-white hover:bg-black-forest-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cornsilk-300"
        to="/home"
      >
        Back to task list
      </Link>
    </main>
  );
}

export default NotFound;
