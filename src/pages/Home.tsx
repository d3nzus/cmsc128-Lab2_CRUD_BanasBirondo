import TaskList from "../components/TaskList";

function Home() {
  return (
    <main className="flex flex-1 justify-center bg-teal-100 p-3 sm:p-6">
      <div className="w-full min-w-0 max-w-screen-2xl">
        <TaskList />
      </div>
    </main>
  );
}

export default Home;
