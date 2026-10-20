import React from "react";
import { getCurrentUser } from "../utils/userAuth";

function Profile(){
    const user = getCurrentUser();
    return(
        <main className="flex min-h-screen w-full justify-center bg-teal-100 p-3 inset-shadow-teal-200 inset-shadow-sm sm:p-6">
            <h1 className="w-full min-w-0 space-y-4 align-baseline text-cyan-950 text-xl font-bold"> Hello User </h1>
        </main>
    )
}

export default Profile;