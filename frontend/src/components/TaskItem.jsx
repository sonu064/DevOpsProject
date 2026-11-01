function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <article className={`task-item${task.completed ? ' task-item-completed' : ''}`}>
      <button
        className="status-toggle"
        type="button"
        onClick={() => onToggle(task)}
        aria-label={task.completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`}
        title={task.completed ? 'Mark as pending' : 'Mark as completed'}
      >
        {task.completed && <span aria-hidden="true">✓</span>}
      </button>

      <div className="task-copy">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`status-chip${task.completed ? ' status-chip-done' : ''}`}>
            {task.completed ? 'Completed' : 'In progress'}
          </span>
        </div>
        {task.description && <p>{task.description}</p>}
        <time className="task-date" dateTime={task.createdAt}>
          Added {formatDate(task.createdAt)}
        </time>
      </div>

      <div className="task-actions">
        <button type="button" className="text-action" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
          Edit
        </button>
        <button type="button" className="text-action text-action-danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
          Delete
        </button>
      </div>
    </article>
  );
}
