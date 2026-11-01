import { useEffect, useState } from 'react';

export default function TaskForm({ task, busy, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
  }, [task]);

  async function handleSubmit(event) {
    event.preventDefault();
    const saved = await onSubmit({ title: title.trim(), description: description.trim() });
    if (saved) {
      setTitle('');
      setDescription('');
    }
  }

  return (
    <section className="panel form-panel" aria-labelledby="form-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">A clear next step</p>
          <h2 id="form-heading">{task ? 'Edit task' : 'Add a task'}</h2>
        </div>
        <span className="heading-mark" aria-hidden="true">＋</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="task-title">Task name</label>
        <input
          id="task-title"
          name="title"
          type="text"
          placeholder="e.g. Prepare the project demo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          required
          autoComplete="off"
        />

        <div className="label-row">
          <label htmlFor="task-description">Details <span>optional</span></label>
          <span className="character-count">{description.length}/2000</span>
        </div>
        <textarea
          id="task-description"
          name="description"
          placeholder="Add a note to help you get started…"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={2000}
          rows={4}
        />

        <div className="form-actions">
          {task && (
            <button className="button button-quiet" type="button" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
          )}
          <button className="button button-primary" type="submit" disabled={busy || !title.trim()}>
            {busy ? 'Saving…' : task ? 'Save changes' : 'Add task'}
            {!busy && <span aria-hidden="true">↗</span>}
          </button>
        </div>
      </form>
    </section>
  );
}
