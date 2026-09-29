import React from "react";
import TaskList from "../components/TaskList";

function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-700 p-4 text-center">
      <h1 className="text-white text-4xl">Lab 1 CRUD</h1>
        <TaskList />
    </div>
  );
}

export default Home;
