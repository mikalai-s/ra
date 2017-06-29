import React, { Component } from 'react';
import logo from './icon.png';
import './App.css';

import EmployeeList from './EmployeeList';
import EmployeeInfo from './EmployeeInfo';

import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Shifts</h2>
        </div>
        <div className="App-content">
          <Router>
            <div>
              <Route exact path="/" component={EmployeeList}/>
              <Route path="/employee/:id" component={EmployeeInfo}/>
            </div>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
