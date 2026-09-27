import React from "react";
import TaskList from "../components/TaskList";

function Home() {
    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center text-center">
            <h1>Welcome to Todo List</h1>
            <TaskList />
        </div>
    );
}

export default Home;