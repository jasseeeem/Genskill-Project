import React, { useEffect, useState } from "react";
import { Input, Button } from "reactstrap";
import "../App.css";
import { FaSearch } from "react-icons/fa";
const Sidebar = ({ notes, activeNote, setActiveNote, updateNote, addNote }) => {
  
  useEffect(() => {
    console.log(activeNote);
  }, [])

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
              key={note.client_id}
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
                  ? "card list-group-item list-group-item-action flex-column align-items-start active"
                  : "card list-group-item list-group-item-action flex-column align-items-start"
              }
            >
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1">
                  {note.title
                    ? note.title.length > 20
                      ? note.title.substr(0, 20) + "..."
                      : note.title
                    : "Title"}
                </h6>
              </div>
              {note.tags && note.tags.length > 0 && <div className="w-100 mb-1">
                
              {note.tags.map(tag => {
                return <Button className="btn btn-primary btn-sm me-2 mt-2" onClick={() => console.log('clicked button')}>#{tag}</Button >
              })}
              </div>}
              <small>
                {note.note
                  ? note.note.length > 100
                    ? note.note.substr(0, 100) + "..."
                    : note.note
                  : "Body"}
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
