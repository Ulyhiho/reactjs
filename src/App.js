import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import AddContact from "./components/AddContact";
import View from "./components/ViewContact";
import Update from "./components/UpdateContact";
import Delete from "./components/DeleteContact";

const App = () => (
  <div>
    <Header />
    <Router>
      <Switch>
        <Route exact path="/" component={AddContact} />
        <Route path="/view" component={View} />
        <Route path="/update" component={Update} />
        <Route path="/delete" component={Delete} />
      </Switch>
    </Router>
  </div>
);

export default App;
