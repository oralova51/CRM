import { useEffect, useState } from "react";
import TaskApi from "../../entities/task/api/TaskApi";
import type { Task } from "../../entities/task/model";
import "./TasksPage.css";

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
      setError(responseError || "Не удалось загрузить список задач");
    }

    setIsLoading(false);
  }

  return (
    <section className="page tasks-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Задачи</h1>
          <p className="page-subtitle">
            Актуальные поручения и рабочие заметки по клиентам.
          </p>
        </div>
      </header>

      {isLoading && <p className="page-status">Загрузка задач...</p>}
      {error && <p className="page-status page-status--error">{error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p className="page-status">Задач пока нет.</p>
      )}

      <div className="tasks-list">
        {tasks.map((task) => (
          <article key={task.id} className="task-card">
            <h2 className="task-title">{task.title}</h2>
            <p className="task-text">{task.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
