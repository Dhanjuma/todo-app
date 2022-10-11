import React, { useRef } from "react";
import "./App.css";
import Todo from "./components/todo";
import Form from "./components/form";

// !! gets todo from local storage
const getLocalStorage = () => {
  let allTodos = localStorage.getItem("allTodos");
  if (allTodos) {
    return (allTodos = JSON.parse(localStorage.getItem("allTodos")));
  } else {
    return [];
  }
};

// !! initial state of task
const initial = {
  work: "",
  category: "personal",
  done: false,
  showDelete: false,
};
function App() {
  const [task, setTask] = React.useState(initial);
  const [allTodos, setAllTodos] = React.useState(getLocalStorage());
  const [allToShow, setAllToShow] = React.useState([]);
  const [editId, setEditId] = React.useState(null);
  const [specificCat, setSpecificCat] = React.useState("all");
  const [isEditing, setIsEditing] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isShowDelete, setIsShowDelete] = React.useState(false);
  const [isToClearAll, setIsToClearAll] = React.useState(false);
  const [clearButton, setClearButton] = React.useState("");
  const [alert, setAlert] = React.useState({ show: false, msg: "", type: "" });
  const [buttonValue] = React.useState(["all", "some"]);

  // ?? checks if any todo is completed/done
  const anyDone = allTodos.some((todos) => todos.done);

  // ?? generates the array of all categories including done and all
  const allCategories = [
    "all",
    ...new Set(allTodos.map((item) => item.category)),
  ];
  anyDone && allCategories.push("done");

  // !! to create todo

  // ?? onchange
  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // ?? onSubmit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEditing) {
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
      setTask(initial);
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "todo edited", "success");
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
    } else if (task.work) {
      setAllTodos((prev) => {
        return [{ ...task, id: new Date().getTime().toString() }, ...prev];
      });
      setTask(initial);
      showAlert(true, "todo added", "success");
      setSpecificCat("all");
    } else if (!task.work) {
      setIsError(true);
      showAlert(true, "please enter todo", "warn");
    }
  };

  // !! saves todo to local storage
  React.useEffect(() => {
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
  }, [allTodos]);

  //!! displays error if input is empty and auto removes it

  // ?? for controlling alerts when create , edit & error change happens
  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };

  // ?? 01
  const reset = () => {
    setIsError(false);
  };
  React.useEffect(() => {
    let set;
    if (isError) {
      set = setTimeout(() => {
        reset();
      }, 500);
    }
    return () => clearTimeout(set);
  }, [isError]);

  // ?? 02
  React.useEffect(() => {
    let timeout;
    if (alert.show) {
      timeout = setTimeout(() => {
        showAlert();
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [alert]);

  // !! category manipulation

  // ?? sets specific category to show
  const filterItems = (cat) => {
    cat !== specificCat && setSpecificCat(cat);
  };

  // ?? filters category to show
  React.useEffect(() => {
    if (specificCat === "all") {
      setAllToShow(allTodos);
    } else if (specificCat === "done") {
      const doneItems = allTodos.filter((item) => item.done);
      setAllToShow(doneItems);
    } else {
      const newItems = allTodos.filter((item) => item.category === specificCat);
      setAllToShow(newItems);
    }
    return () => {};
  }, [allTodos, specificCat]);

  // ?? checks if any todo category is empty and then sets category back to all
  const anyLeft = allCategories.some((item) => item === specificCat);
  React.useEffect(() => {
    if (!anyLeft) {
      setSpecificCat("all");
    }
  }, [anyLeft]);

  // !! edit todo
  // ?? focuses on input when edit is initiated
  const refInput = useRef();
  const focusInput = () => {
    refInput.current.focus();
  };

  // ?? sets task to todo for edit
  const editTodo = (id) => {
    const specificItem = allTodos.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setTask(specificItem);
    focusInput();
  };

  // ?? marks todo as done/complete
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
  };

  // !! delete todos

  // ??  hides todo delete component when there is change
  React.useEffect(() => {
    setIsShowDelete(false);
    setClearButton("");
  }, [allTodos, isEditing, specificCat]);

  // ?? does reveal for delete of category of/all todos
  const showDeleteAll = (event) => {
    const { value } = event.target;
    setIsShowDelete(true);
    setClearButton(value);
    value === "all" ? setIsToClearAll(true) : setIsToClearAll(false);
  };

  // ?? hides delete for category of/all todos
  const hideDeleteAll = () => {
    setIsShowDelete(false);
    setClearButton("");
  };

  // ?? deletes todo category or all
  const clearAll = () => {
    if (specificCat === "all") {
      setAllTodos([]);
    } else if (specificCat === "done") {
      setAllTodos(allTodos.filter((item) => !item.done));
    } else {
      setAllTodos(allTodos.filter((item) => item.category !== specificCat));
      setSpecificCat("all");
    }
  };

  // ?? deletes completed/done todo
  const clearComplete = () => {
    if (specificCat === "all") {
      setAllTodos(allTodos.filter((item) => !item.done));
    } else {
      setAllTodos(
        allTodos.filter((item) => item.category !== specificCat || !item.done)
      );
    }
  };

  // ?? does reveal for delete of specific todo
  const revealDelete = (id) => {
    let exact = allTodos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, showDelete: true };
      }
      return todo;
    });
    setAllTodos(exact);
  };

  // ?? hides delete for specific todo
  const hideDelete = (id) => {
    let exact = allTodos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, showDelete: false };
      }
      return todo;
    });
    setAllTodos(exact);
  };

  // ?? deletes specific todo
  const clearOne = (id) => {
    setAllTodos(allTodos.filter((item) => item.id !== id));
    setTask(initial);
    setIsEditing(false);
  };

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
        buttonValue={buttonValue}
        clearButton={clearButton}
        clearAll={isToClearAll}
        showDeleteAll={showDeleteAll}
        hideDeleteAll={hideDeleteAll}
        specific={specificCat}
        categories={allCategories}
        isShowDelete={isShowDelete}
        revealDelete={revealDelete}
        hideDelete={hideDelete}
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
