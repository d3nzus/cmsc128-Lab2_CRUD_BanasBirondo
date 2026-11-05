import React from "react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/userAuth";
import Title from "../components/Title";
import MyTaskLists from "../components/MyTaskLists";
import { getUserName } from "../utils/api";


function Profile() {
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
            <div className="flex w-full max-w-2xl min-w-0 flex-col gap-4 text-cyan-950">
            <Title>Hello {username || "Loading..."}</Title>
            <MyTaskLists title="Your Task Lists" />
            <Title>Invitations</Title>
            </div>
        </main>
    )
}

export default Profile;