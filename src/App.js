import React from "react";
import Home from "./pages/Home";
import './css/firefly.sass';
import Repositories from "./pages/Repositories";
import PullReq from "./pages/PullReq";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
  state = {
    fireflies: [],
  };
  componentDidMount() {
    var f = [];
    for (var i = 0; i < 15; i++) f.push(<div key={i} className="firefly" />);
    this.setState({
      fireflies: f,
    });
  }
  render() {
    return (
      <Router>
        <div className="noise" />
        <Switch>
          <Route exact path="/" render={(props)=>(<Home history={props.history}/>)}/>
          <Route render={(props)=>(<Repositories history={props.history}/>)} path="/repos"/>
          <Route render={(props)=>(<PullReq history={props.history}/>)} path="/pullreqs"/>
        </Switch>
        {this.state.fireflies}
      </Router>
    );
  }
}

export default App;