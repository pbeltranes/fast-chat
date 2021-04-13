import { useState, useEffect} from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";


function App() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const localUsername = localStorage.getItem("username");
    localUsername && setUsername(localUsername);
  }, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home setUsername={setUsername} />
          </Route>
          <Route path="/:roomId">
            {typeof username !== "undefined" ? (
              <Room username={username} />
            ) : (
              <Redirect to={{ pathname: "/" }} />
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
