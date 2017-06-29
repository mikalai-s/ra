import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class EmployeeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: []
    };
  }

  componentDidMount() {
    fetch('/api/employees')
      .then(r => r.json())
      .then(r => {
        this.setState({
          employees: r
        });
      })
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <h3>Employees</h3>
        <ul>
          {this.state.employees.map(e => (
            <li key={e.id}><Link to={`/employee/${e.id}`}>{e.name}</Link></li>
          ))}
        </ul>
      </div>
    );
  }
}

export default EmployeeList;
