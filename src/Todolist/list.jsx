import { useEffect, useState } from "react";
import { axiosInstance } from "../assets/Config/axios.config";


const getAllTodos = (query) => axiosInstance.get('/todos', { params: { q: query } }).then((data) => data.data);


const getTodosList = () =>
  axiosInstance.get("/todos").then((data) => data.data);

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [search, setSearch] = useState("");


  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  const searchSubmit = (e) => {
    todolist(e.target.value);
  }

  const todolist = async (query = '') => {
    const res = await getAllTodos(query);
    setTodos(res);
  };


  // const todolist = async () => {
  //   const response = await getTodosList();
  //   return setTodos(response);
  // axiosInstance.get("/todos", {
  //   params: {
  //     q: !!search && search,
  //   }}).then((data) => setTodos(data.data))
  // };

  useEffect(() => {
    todolist();

    // fetch("http://localhost:3000/todos")
    //   .then((data) => data.json())
    //   .then((res) => setTodos(res));
  }, []);

  const handleDelete = (id) => {
    axiosInstance.delete(`todos/${id}`).then((data) => {
      if (data.status === 200) { todolist(); }
    })
  };
  const handleEdit = (content) => { };
  const handleDone = (status) => { };

  const addTask = async (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/todos", {
      method: "post",
      body: JSON.stringify({
        taskName,
        isCompleted: false,
      }),
      headers: { "content-type": "application/json" },
    }).then((data) => {
      if (data.status === 201) {
        setTaskName("");
        todolist();
      }
    });
  };

  return (
    <div className="todolist">
      <div className="search">
        <input type="text" placeholder="Search ex: todo 1" onChange={searchSubmit} />
      </div>

      {/* <div className="search" onSubmit={addTask}>
        <input type="text" onChange={(e) => searchSubmit(e)}
          value={search}
          placeholder="Search ex: todo 1" />
      </div> */}
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
