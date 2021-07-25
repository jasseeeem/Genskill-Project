import React, { useState } from "react";
import { Button, Modal, Form, Input, Radio } from "reactstrap";
import guy from "../background/guy.svg";
import bgmobile from "../background/bgmobile.svg";
function Home(props) {
  const handleLogin = () => {
    console.log("logging in");
  };
  const handleSignUp = () => {
    console.log("Signing up");
  };

  return (
    <div>
      <div className="d-flex hero-text">
        <div className="p-5 flex-shrink-1 hero-text">
          <h1>The No Nonsense Note Taking App .</h1>
          <div>
            <Button className="btn btn-primary mt-3 me-3" onClick={handleLogin}>
              Login
            </Button>
            <Button
              className="btn btn-primary mt-3 me-3"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <div className="mt-4">
              <small>
                Developed as part of <a href="#">Genskill Project</a>
              </small>
            </div>
          </div>
        </div>
        <div className="pt-4 w-100">
          <img className="guy" src={guy} alt="background" />
        </div>
      </div>
    
        <img className="bgmobile ps-5" src={bgmobile} alt="background" />
    </div>
  );
}

export default Home;
