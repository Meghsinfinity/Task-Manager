import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("Todo");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: {
          Authorization: token,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/tasks",
        {
          title,
          description,
          stage,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTitle("");
      setDescription("");
      setStage("Todo");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const updateStage = async (id, newStage) => {
    try {
      await API.put(
        `/tasks/${id}`,
        {
          stage: newStage,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const renderTask = (task) => (
    <div key={task._id} className="card p-3 mb-3 shadow-sm">
      <h5>{task.title}</h5>

      <p>{task.description}</p>

      <p>
        <strong>Status:</strong> {task.stage}
      </p>

      <div className="d-flex flex-wrap gap-2">

        {task.stage !== "Todo" && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() =>
              updateStage(task._id, "Todo")
            }
          >
            Todo
          </button>
        )}

        {task.stage !== "In Progress" && (
          <button
            className="btn btn-warning btn-sm"
            onClick={() =>
              updateStage(task._id, "In Progress")
            }
          >
            In Progress
          </button>
        )}

        {task.stage !== "Done" && (
          <button
            className="btn btn-success btn-sm"
            onClick={() =>
              updateStage(task._id, "Done")
            }
          >
            Done
          </button>
        )}

        <button
          className="btn btn-danger btn-sm"
          onClick={() =>
            deleteTask(task._id)
          }
        >
          Delete
        </button>

      </div>
    </div>
  );

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Task Manager Dashboard
      </h2>

      <form onSubmit={createTask} className="mb-5">

        <input
          type="text"
          placeholder="Task Title"
          className="form-control mb-2"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <textarea
          placeholder="Description"
          className="form-control mb-2"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <select
          className="form-control mb-2"
          value={stage}
          onChange={(e) =>
            setStage(e.target.value)
          }
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <button className="btn btn-primary">
          Add Task
        </button>

      </form>

      <div className="row">

        <div className="col-md-4">
          <h3 className="text-primary">
            Todo
          </h3>

          {tasks
            .filter(
              (task) => task.stage === "Todo"
            )
            .map(renderTask)}
        </div>

        <div className="col-md-4">
          <h3 className="text-warning">
            In Progress
          </h3>

          {tasks
            .filter(
              (task) =>
                task.stage === "In Progress"
            )
            .map(renderTask)}
        </div>

        <div className="col-md-4">
          <h3 className="text-success">
            Done
          </h3>

          {tasks
            .filter(
              (task) => task.stage === "Done"
            )
            .map(renderTask)}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;