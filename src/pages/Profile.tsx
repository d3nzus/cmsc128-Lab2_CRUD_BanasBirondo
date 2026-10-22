import React from "react";
import { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "../utils/userAuth";
import Title from "../components/Title";
import { deleteTasks, getTaskLists, getUserName } from "../utils/api";
import TaskListDropdown from "../components/TaskListDropdown";
import { errorText } from "../components/TaskList";
import { readPendingDeleteIds, clearPendingDeleteIds } from "../utils/helper";

function Profile(){
    const [username, setUsername] = useState("");
    const [taskLists, setTaskLists] = useState<UserTaskList[]>([]);
    const [selectedTaskListId, setSelectedTaskListId] = useState("");
    const initialized = useRef(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
    async function fetchUsername() {
        const result = await getUserName();
        setUsername(result ?? "");
    }
    fetchUsername();

    useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    void (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Please sign in to view task lists.");
        setUserId(user.id);

        const queuedIds = readPendingDeleteIds(user.id);
        clearPendingDeleteIds(user.id);
        if (queuedIds.length > 0) {
          try {
            await deleteTasks(queuedIds);
          } catch (error) {
            setActionError(`Could not finish pending deletes: ${errorText(error)}`);
          }
        }

        const lists = await getTaskLists(user.id);
        setTaskLists(lists);
        if (lists.length > 0) {
          const selectedList = lists.find((list) => String(list.id) === requestedTaskListId)
            ?? lists[0];
          setSelectedTaskListId(String(selectedList.id));
        }
      } catch (error) {
        setLoadError(errorText(error));
      } finally {
        setLoadingLists(false);
      }
    })();
  }, []);
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