import React, { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { Input, Label, Button } from "reactstrap";

const Note = ({
  activeNote,
  setActiveNote,
  onUpdateNote,
  updateNote,
  addNote,
  newNote,
}) => {
  const format = (date) => {
    return (
      ("00" + date.getDate()).slice(-2) +
      " " +
      date.toLocaleString("default", { month: "short" }) +
      " " +
      date.getFullYear() +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2)
    );
  };
  const handleSave = () => {
    if (activeNote.server_id) updateNote(activeNote);
    else addNote(activeNote);
    setActiveNote("");
  };

  const onEditField = (field, value) => {
    var m = new Date();
    var dateString =
      m.getUTCFullYear() +
      "-" +
      (m.getUTCMonth() + 1) +
      "-" +
      m.getUTCDate() +
      " " +
      m.getUTCHours() +
      ":" +
      m.getUTCMinutes() +
      ":" +
      m.getUTCSeconds();
    onUpdateNote({
      ...activeNote,
      [field]: value,
      last_edited: dateString,
    });
  };

  return activeNote ? (
    <div id="page-content-wrapper">
      <div className="container-fluid">
        <Input
          type="text"
          autoFocus
          className="mt-3"
          placeholder="Title"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
        />
        <Label className="mt-3">HASHTAGS</Label>
        <Input type="text" readOnly className="mt-1" />
        <Input
          type="textarea"
          className="mt-3"
          rows="10"
          placeholder="Body"
          value={activeNote.note}
          onChange={(e) => onEditField("note", e.target.value)}
        />
        <div className="d-flex mt-3  justify-content-between">
          <small>
            Last Edited: {format(new Date(activeNote.last_edited + " UTC"))}
          </small>
          <Button className="btn btn-primary" onClick={handleSave}>
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ width: "100%" }}
    >
      <FiPlusCircle size={"150"} onClick={newNote} />
    </div>
  );
};

export default Note;
