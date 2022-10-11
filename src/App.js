import React, { useRef } from "react";
import "./App.css";
import Todo from "./components/todo";
import Form from "./components/form";

const initial = { work: "", category: "personal", done: false };
function App() {
  const [task, setTask] = React.useState(initial);
  const [allTodos, setAllTodos] = React.useState([]);
  const [allToShow, setAllToShow] = React.useState([]);
  const [editId, setEditId] = React.useState(null);
  const [specificCat, setSpecificCat] = React.useState("all");
  const [isEditing, setIsEditing] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [alert, setAlert] = React.useState({ show: false, msg: "", type: "" });

  const allCategories = [
    "all",
    ...new Set(allTodos.map((item) => item.category)),
  ];

  const reset = () => {
    setIsError(false);
  };
  React.useEffect(() => {
    const set = setTimeout(() => {
      reset();
    }, 2000);
    return () => clearTimeout(set);
  }, [isError]);

  const anyLeft = allCategories.some((item) => item === specificCat);
  React.useEffect(() => {
    if (!anyLeft) {
      setSpecificCat("all");
    }
  }, [anyLeft]);

  React.useEffect(() => {
    if (specificCat === "all") {
      setAllToShow(allTodos);
    } else {
      const newItems = allTodos.filter((item) => item.category === specificCat);
      setAllToShow(newItems);
    }
    return () => {};
  }, [allTodos, specificCat]);

  const filterItems = (cat) => {
    cat !== specificCat && setSpecificCat(cat);
    if (cat === "all") {
      setAllToShow(allTodos);
      return;
    } else {
      const newItems = allTodos.filter((item) => item.category === cat);
      setAllToShow(newItems);
    }
  };

  console.log(allTodos);

  const refInput = useRef();
  const focusInput = () => {
    refInput.current.focus();
  };
  const editTodo = (id) => {
    const specificItem = allTodos.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setTask(specificItem);
    focusInput();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEditing) {
      // setAllTodos(
      //   allTodos.map((item) => {
      //     if (item.id === editId) {
      //       return { ...item, work: task.work, category: task.category };
      //     }
      //     return item;
      //   })
      // );

      setAllTodos((oldTodos) => {
        const newArray = [];
        for (let i = 0; i < oldTodos.length; i++) {
          const oldTodo = oldTodos[i];
          if (oldTodo.id === editId) {
            newArray.unshift({
              ...oldTodo,
              work: task.work,
              category: task.category,
            });
          } else {
            newArray.push(oldTodo);
          }
        }
        return newArray;
      });
      // setAllTodos((oldTodos) => {
      //   const newArray = [];
      //   oldTodos.map((todo) => {
      //     if (todo.id === editId) {
      //       newArray.unshift({
      //         ...todo,
      //         work: task.work,
      //         category: task.category,
      //       });
      //     }
      //     return newArray.push(todo);
      //   });
      //   return newArray;
      // });

      setTask(initial);
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "todo edited", "success");

      // setSpecificCat("all");
    } else if (task.work && task.category) {
      setAllTodos((prev) => {
        return [{ ...task, id: new Date().getTime().toString() }, ...prev];
      });
      setTask(initial);
      showAlert(true, "todo added", "success");

      // setSpecificCat("all");
    } else if (!task.work) {
      setIsError(true);
      showAlert(true, "please enter todo", "warn");
    }
  };
  // console.log(allTodos);
  // console.log(task);
  // const check = (id) => {
  //   setAllTodos(
  //     allTodos.map((todo) => {
  //       if (todo.id === id) {
  //         return { ...todo, done: !todo.done };
  //       }
  //       return todo;
  //     })
  //   );
  // };
  const check = (id) => {
    const edit = allTodos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done };
      }
      return todo;
    });
    edit.sort((a, b) => {
      return a.done - b.done;
    });
    setAllTodos(edit);
    // setSpecificCat("all");
  };

  const clearAll = () => {
    if (specificCat === "all") {
      setAllTodos([]);
    } else {
      setAllTodos(allTodos.filter((item) => item.category !== specificCat));
      setSpecificCat("all");
    }
  };

  const anyDone = allTodos.some((todos) => todos.done);
  // const anyLeft = allCategories.filter((item) => item === specificCat);
  console.log(specificCat);
  console.log(anyLeft);

  const clearComplete = () => {
    if (specificCat === "all") {
      setAllTodos(allTodos.filter((item) => !item.done));
    } else {
      // setSpecificCat("all");
      setAllTodos(
        allTodos.filter((item) => item.category !== specificCat || !item.done)
      );
      // filterItems(specificCat);
    }
  };

  // const reOrder = () => filterItems(specificCat);
  const clearOne = (id) => {
    if (specificCat === "all") {
      setAllTodos(allTodos.filter((item) => item.id !== id));
    } else {
      // setSpecificCat("all");
      setAllTodos(allTodos.filter((item) => item.id !== id));

      // setSpecificCat(specificCat);
      // filterItems(specificCat);
    }
    // reOrder();
  };
  // setNotes((oldNotes) => {
  //   const newArray = [];
  //   for (let i = 0; i < oldNotes.length; i++) {
  //     const oldNote = oldNotes[i];
  //     if (oldNote.id === currentNoteId) {
  //       newArray.unshift({ ...oldNote, body: text });
  //     } else {
  //       newArray.push(oldNote);
  //     }
  //   }
  //   return newArray;
  // });

  return (
    <div className="todo-app">
      <Form
        {...task}
        isEditing={isEditing}
        handleChange={(event) => handleChange(event)}
        handleSubmit={handleSubmit}
        select={refInput}
        error={isError}
        alert={alert}
      />
      <Todo
        specific={specificCat}
        categories={allCategories}
        filterItems={filterItems}
        display={allToShow}
        todos={allTodos}
        check={check}
        done={anyDone}
        clearCompleted={clearComplete}
        clear={clearAll}
        clearOne={clearOne}
        edit={editTodo}
      />
    </div>
  );
}

export default App;
