import TaskItem from './TaskItem.jsx';

const filters = [
  { id: 'all', label: 'All tasks' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
];

export default function TaskList({
  tasks,
  filter,
  loading,
  onFilterChange,
  onToggle,
  onEdit,
  onDelete,
}) {
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <section className="panel list-panel" aria-labelledby="tasks-heading">
      <div className="list-heading">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h2 id="tasks-heading">Your tasks <span className="count-badge">{tasks.length}</span></h2>
        </div>
        <div className="filter-tabs" role="group" aria-label="Filter tasks">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? 'filter-tab active' : 'filter-tab'}
              aria-pressed={filter === item.id}
              onClick={() => onFilterChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty-state" role="status">
          <span className="loader" aria-hidden="true" />
          <p>Loading your tasks…</p>
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">✳</span>
          <h3>{tasks.length === 0 ? 'A fresh start' : `No ${filter} tasks`}</h3>
          <p>{tasks.length === 0 ? 'Add your first task and give it a home here.' : 'Try another filter or add a new task.'}</p>
        </div>
      ) : (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
