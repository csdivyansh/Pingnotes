import { useState, useEffect } from "react";
import DashNav from "./DashNav";
import "./ToDo.css";

export default function ToDo() {
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  function persistData(newList) {
    localStorage.setItem("todos", JSON.stringify({ todos: newList }));
  }

  function handleAddTodos(newTodo) {
    if (newTodo !== "") {
      const newTodoList = [...todos, { text: newTodo, completed: false }];
      persistData(newTodoList);
      setTodos(newTodoList);
      setIsEditing(false);
    }
  }

  function handleToggleComplete(index) {
    const newTodoList = [...todos];
    newTodoList[index].completed = !newTodoList[index].completed;
    persistData(newTodoList);
    setTodos(newTodoList);
  }

  function handleDeleteTodos(index) {
    const newTodoList = todos.filter((_, todoIndex) => todoIndex !== index);
    persistData(newTodoList);
    setTodos(newTodoList);
  }

  function handleEditTodos(index) {
    const valueToBeEdited = todos[index].text;
    setTodoValue(valueToBeEdited);
    handleDeleteTodos(index);
    setIsEditing(true);
  }

  useEffect(() => {
    if (!localStorage) return;
    let localTodos = localStorage.getItem("todos");
    if (!localTodos) return;
    localTodos = JSON.parse(localTodos).todos;
    setTodos(localTodos);
  }, []);

  return (
    <>
      <DashNav />
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24 }}>
        <h2 style={{ fontSize: 32, marginBottom: 24 }}>To-Do List</h2>
        <TodoInput
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          handleAddTodos={handleAddTodos}
          isEditing={isEditing}
        />
        <TodoList
          handleDeleteTodos={handleDeleteTodos}
          handleEditTodos={handleEditTodos}
          handleToggleComplete={handleToggleComplete}
          todos={todos}
        />
      </div>
    </>
  );
}
