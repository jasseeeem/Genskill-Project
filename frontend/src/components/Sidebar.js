import React, { useEffect, useState } from "react";
import { Input, Button } from "reactstrap";
import "../App.css";
import { FaSearch } from "react-icons/fa";

const Sidebar = ({ notes, activeNote, setActiveNote, updateNote, addNote }) => {
  return (
    <div className="bg-light border-right vh-100" id="sidebar-wrapper">
      <div className="input-group pe-4 ps-4 pt-3 pb-3">
        <Input type="search" className="row" placeholder="Search" />
        <Button className="btn btn-primary row">
          <FaSearch />
        </Button>
      </div>
      {notes ? (
        <div className="list-group list-group-flush overflow-scroll h-100">
          {notes.map((note) => (
            <div
              onClick={() => {
                if (activeNote) {
                  if (activeNote.server_id) {
                    updateNote(activeNote);
                  } else {
                    addNote(activeNote);
                  }
                }
                setActiveNote(note.client_id);
              }}
              className={
                activeNote && activeNote.client_id === note.client_id
                  ? "list-group-item list-group-item-action flex-column align-items-start active"
                  : "list-group-item list-group-item-action flex-column align-items-start"
              }
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{note.title ? note.title : "Title"}</h5>
              </div>
              <small>
                {note.note ? note.note.length > 100
                  ? note.note.substr(0, 100) + "..."
                  : note.note : "Body"}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p>Add a note by clicking the + icon</p>
      )}
    </div>
  );
};

export default Sidebar;
