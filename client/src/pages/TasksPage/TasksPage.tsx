import { useEffect, useState } from 'react';
import TaskApi from '../../entities/task/api/TaskApi';
import type { Task } from '../../entities/task/model';
import './TasksPage.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);

    const { statusCode, data, error: responseError } = await TaskApi.getTasks();

    if (statusCode === 200) {
      setTasks(data);
      setError(null);
    } else {
      setError(responseError || 'Не удалось загрузить список задач');
    }

    setIsLoading(false);
  }

  return (
    <div className="app-container">
      <h2>Задачи</h2>

      {isLoading && <p>Загрузка задач...</p>}
      {error && <p className="tasks-error">{error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>Задач пока нет.</p>
      )}

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

