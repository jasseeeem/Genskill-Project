import './App.css'; 
import { useEffect, useState, useContext } from "react";
function App() {

  useEffect(() => {
    console.log(process.env);
  })
  return (
    <div>
      {process.env.REACT_APP_API_URL}
    </div>
  );
}

export default App;
