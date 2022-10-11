import React from "react";
import {
  MdTaskAlt,
  MdFormatQuote,
  MdOutlineCircle,
  MdEditNote,
  MdDeleteForever,
  MdWork,
  MdQuickreply,
  MdPerson,
  MdCancel,
  MdCheckCircle,
} from "react-icons/md";

const Todo = ({
  todos,
  check,
  clear,
  done,
  clearCompleted,
  clearOne,
  edit,
  categories,
  filterItems,
  display,
  specific,
  revealDelete,
  isShowDelete,
  hideDelete,
  hideDeleteAll,
  showDeleteAll,
  clearAll,
  clearButton,
  buttonValue,
}) => {
  return (
    <>
      <main className="todos-container">
        <header className="top">
          <h2>
            TODOS <MdFormatQuote />
          </h2>
          <div className="underline"></div>
          {todos.length > 0 && (
            <section className="cats-container">
              {categories.map((cat, index) => {
                return (
                  <div
                    key={index}
                    className={`${cat === specific && "active"}`}
                  >
                    <button className="cat" onClick={() => filterItems(cat)}>
                      {cat}
                    </button>
                    <p className="cat-underline"></p>
                  </div>
                );
              })}
            </section>
          )}
          {todos.length > 0 && (
            <button
              onClick={(event) => showDeleteAll(event)}
              value={buttonValue[0]}
              className={`btn clr-btn ${
                buttonValue[0] === clearButton ? "clicked" : ""
              }`}
            >
              Clear {specific === "all" ? "all" : "category"}
            </button>
          )}
          {done && specific !== "done" && (
            <button
              onClick={(event) => showDeleteAll(event)}
              value={buttonValue[1]}
              className={`btn clr-btn ${
                buttonValue[1] === clearButton ? "clicked" : ""
              }`}
            >
              Clear completed
            </button>
          )}
          {isShowDelete && (
            <div className="confirm-delete">
              <p>are you sure?</p>
              <button
                onClick={clearAll ? clear : clearCompleted}
                className="yes"
              >
                <MdCheckCircle />
              </button>
              <button onClick={hideDeleteAll} className="no">
                <MdCancel />
              </button>
            </div>
          )}
        </header>
        {display.map((todo) => {
          const { work, category, id, done, showDelete } = todo;

          let icon;
          if (category === "work") {
            icon = <MdWork />;
          } else if (category === "urgent") {
            icon = <MdQuickreply />;
          } else {
            icon = <MdPerson />;
          }
          let finished = done ? "finished" : "";
          let hideIcon = done ? "hideIcon" : "";
          let finishedIcon = done ? "finishedIcon" : "unfinishedIcon";
          return (
            <article className="task-container" key={id}>
              <section className={`tasks ${finished}`}>
                <header className="title">
                  <p>{icon}</p>
                  <p>{work}</p>
                </header>
                <article className="icons-container">
                  <button onClick={() => check(id)}>
                    {done ? <MdTaskAlt /> : <MdOutlineCircle />}
                  </button>

                  <button>
                    <MdEditNote
                      onClick={() => edit(id)}
                      className={`${hideIcon}`}
                    />
                  </button>
                  <button
                    onClick={() => revealDelete(id)}
                    className={`delete ${finishedIcon}`}
                  >
                    <MdDeleteForever />
                  </button>
                </article>
                {showDelete && (
                  <div className="confirm-delete">
                    <p>are you sure?</p>
                    <button onClick={() => clearOne(id)} className="yes">
                      <MdCheckCircle />
                    </button>
                    <button onClick={() => hideDelete(id)} className="no">
                      <MdCancel />
                    </button>
                  </div>
                )}
              </section>
              <div className="separator"></div>
            </article>
          );
        })}
      </main>
    </>
  );
};

export default Todo;
