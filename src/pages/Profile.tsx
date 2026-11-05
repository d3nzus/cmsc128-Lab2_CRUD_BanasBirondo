import React from "react";
import { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "../utils/userAuth";
import Title from "../components/Title";
import { deleteTasks, getTaskLists, getUserName } from "../utils/api";
import TaskListDropdown from "../components/TaskListDropdown";

function Profile(){
    const [username, setUsername] = useState("");
    useEffect(() => {
    async function fetchUsername() {
        const result = await getUserName();
        setUsername(result ?? "");
    }
    fetchUsername();
    }, []);
    return(
        <main className="flex min-h-screen w-full justify-center bg-teal-100 p-3 inset-shadow-teal-200 inset-shadow-sm sm:p-6">
            <Title>Hello {username || "Loading..."} </Title>
            <div>
                <Title>Your Tasklists</Title>
                <TaskListDropdown
                    taskLists={taskLists}
                    selectedTaskListId={selectedTaskListId}
                    onSelect={setSelectedTaskListId}
                />
            </div>
            <Title>Invitations</Title>
        </main>
    )
}

export default Profile;