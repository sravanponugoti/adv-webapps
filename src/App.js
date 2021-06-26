import React from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect } from 'react-router-dom';
 
import Login from './Login';
import Home from './Home';
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          {/* <div className="header">
            <NavLink exact activeClassName="active" to="/">Home</NavLink>
            <NavLink activeClassName="active" to="/login">Login</NavLink><small>(Access without token only)</small>
            <NavLink activeClassName="active" to="/dashboard">Dashboard</NavLink><small>(Access with token only)</small>
          </div> */}
          <div className="content">
            <Switch>
              <Redirect exact path="/" to="login" />
              <Route path="/login" component={Login} />
              <Route path="/home" component={Home} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}
 
export default App;