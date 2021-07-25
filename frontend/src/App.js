import './App.css'; 
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Home from "./pages/Home.js";
import Sidebar from "./components/Sidebar";
import Notes from "./components/Notes.js";
import Navbar from "./components/Navbar.js";
import './custom.scss';

function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState(null);
  const handleSettings = () => {
    console.log("clicked settings");
  }
  const makeUser = (obj) => {
    setUser(obj);
  }

  useEffect(() => {

    (async () => {
      let res = await fetch(process.env.REACT_APP_API_URL + "/users/verify", {
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
      if(user) {
        res = await fetch(process.env.REACT_APP_API_URL + "/users/" + user.id + "/notes", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if(res.ok) {
          res = await res.json();
          setNotes(res);
        }
        else {
          setNotes(null);
        }
      }
      setLoading(true);
    })();
  }, [])

  return (
    <div>
      <BrowserRouter>
        {loading ? (
          <>
            <Navbar user={user} handleSettings={handleSettings} />
            {user ?
            <div className="container-fluid">
              <Sidebar />
              <Notes />
            </div>
            :
              <Home setUser={makeUser} /> 
            }
          </>
        ) :
        <div className="container text-center mt-5">
          <BeatLoader loading />
        </div>
        }
      </BrowserRouter>
    </div>
  );
}

export default App;
