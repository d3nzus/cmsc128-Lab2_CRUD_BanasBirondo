import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function App() {
  return (
    <div className="flex min-h-svh flex-col bg-teal-100">
      <Header />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
