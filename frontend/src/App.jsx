import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from './api/tasks.js';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

function todayLabel() {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await getTasks());
    } catch (requestError) {
      setError(`${requestError.message}. Check that the API and database are running, then refresh.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const pendingCount = tasks.length - completedCount;
  const completion = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  async function saveTask(values) {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      if (editingTask) {
        await updateTask(editingTask.id, values);
        setNotice('Task details updated.');
        setEditingTask(null);
      } else {
        await createTask(values);
        setNotice('Task added to your list.');
      }
      await loadTasks();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task) {
    setError('');
    setNotice('');
    try {
      await updateTaskStatus(task.id, !task.completed);
      await loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeTask(task) {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      await deleteTask(task.id);
      if (editingTask?.id === task.id) setEditingTask(null);
      setNotice('Task deleted.');
      await loadTasks();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="TaskFlow home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>taskflow</span>
        </a>
        <div className="topbar-meta">
          <span className="live-dot" aria-hidden="true" />
          <span>Personal workspace</span>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="date-line">{todayLabel()}</p>
          <h1>Make room for<br /><em>what matters.</em></h1>
          <p className="hero-copy">Small steps add up. Keep your next one in sight.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit-core"><span>✳</span></div>
          <span className="spark spark-one">✦</span>
          <span className="spark spark-two">✧</span>
          <span className="spark spark-three">·</span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Task summary">
        <article className="stat-card stat-total">
          <span className="stat-label">All tasks</span>
          <strong>{tasks.length.toString().padStart(2, '0')}</strong>
          <span className="stat-caption">in your list</span>
        </article>
        <article className="stat-card stat-pending">
          <span className="stat-label">In progress</span>
          <strong>{pendingCount.toString().padStart(2, '0')}</strong>
          <span className="stat-caption">ready for a next step</span>
        </article>
        <article className="stat-card stat-complete">
          <div className="stat-topline"><span className="stat-label">Completed</span><span className="progress-percent">{completion}%</span></div>
          <strong>{completedCount.toString().padStart(2, '0')}</strong>
          <div className="progress-track" aria-label={`${completion}% of tasks completed`}>
            <span style={{ width: `${completion}%` }} />
          </div>
        </article>
      </section>

      {(error || notice) && (
        <div className={error ? 'message message-error' : 'message message-success'} role={error ? 'alert' : 'status'}>
          <span>{error || notice}</span>
          {error && <button type="button" onClick={loadTasks}>Try again</button>}
        </div>
      )}

      <div className="content-grid">
        <TaskForm
          task={editingTask}
          busy={saving}
          onSubmit={saveTask}
          onCancel={() => setEditingTask(null)}
        />
        <TaskList
          tasks={tasks}
          filter={filter}
          loading={loading}
          onFilterChange={setFilter}
          onToggle={toggleTask}
          onEdit={setEditingTask}
          onDelete={removeTask}
        />
      </div>

      <footer className="footer">
        <span>One thing at a time.</span>
        <span className="footer-dot">·</span>
        <span>Your tasks are saved automatically.</span>
      </footer>
    </main>
  );
}
