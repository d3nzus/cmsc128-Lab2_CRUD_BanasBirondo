type TaskListHeadingProps = {
  title: string;
};

function TaskListDropdown({ title }: TaskListHeadingProps) {
  return (
    <h1 className="mb-5 text-2xl sm:text-3xl">
      <strong>{title}</strong>
    </h1>
  );
}

export default TaskListDropdown;
