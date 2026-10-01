import React from "react";
import TaskList from "../components/TaskList";

function Home() {
  return (
    <main className="flex min-h-screen w-full justify-center bg-teal-100 p-3 inset-shadow-teal-200 inset-shadow-sm sm:p-6">
      <div className="w-full min-w-0 max-w-screen-2xl">
        <TaskList />
      </div>
    </main>
  );
}

export default Home;
