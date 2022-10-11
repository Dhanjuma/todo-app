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
            <button onClick={clear} className="btn clr-btn">
              Clear {specific === "all" ? "all" : "category"}
            </button>
          )}
          {done && (
            <button onClick={clearCompleted} className="btn clr-btn">
              Clear completed
            </button>
          )}
        </header>
        {display.map((todo) => {
          const { work, category, id, done } = todo;

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
                    onClick={() => clearOne(id)}
                    className={`delete ${finishedIcon}`}
                  >
                    <MdDeleteForever />
                  </button>
                </article>
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
