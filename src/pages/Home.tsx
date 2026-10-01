import React from "react";
import TaskList from "../components/TaskList";

function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col p-4 items-center justify-center text-center bg-teal-100 inset-shadow-teal-200 inset-shadow-sm">
      <TaskList />
    </div>
  );
}

export default Home;
