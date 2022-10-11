import React from "react";
import { MdLibraryAdd } from "react-icons/md";
const Form = ({
  handleSubmit,
  handleChange,
  work,
  category,
  select,
  isEditing,
  error,
  alert,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <div className="header">
          <h2>
            Create a Todo <MdLibraryAdd />
          </h2>
          <div className="underline"></div>
        </div>
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            <p>{alert.msg}</p>
          </div>
        )}
        <label htmlFor="work">
          <h3>Enter task :</h3>
        </label>
        <input
          className={`input ${error === true ? "error" : ""}`}
          onChange={handleChange}
          type="text"
          name="work"
          id="work"
          value={work}
          ref={select}
          autoComplete="off"
        />
        <label htmlFor="category">
          <h3>Please select a category :</h3>
        </label>
        <select
          id="category"
          value={category}
          onChange={handleChange}
          name="category"
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="urgent">Urgent</option>
        </select>
        <br />

        <button className="btn" type="submit">
          {isEditing ? "edit todo" : "add todo"}
        </button>
      </form>
    </>
  );
};

export default Form;
