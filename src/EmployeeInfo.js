import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class EmployeeInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employee: null
    };
  }

  componentDidMount() {
    fetch(`/api/employees/${this.props.match.params.id}`)
      .then(r => r.json())
      .then(e => {
        this.setState({
          employee: e
        });
      })
      .catch(console.error);
  }

  render() {
    const empl = this.state.employee;
    return (
      <div>
        <Link to="/">&lt;-- Back to employees</Link>
        <br />
        <br />
        {empl
          ? (
            <div>
              {empl.name}
              <br />
              <br />
              {this.renderSchedule(empl.weeks)}
            </div>
          )
          : (
            <div>Loading...</div>
          )}
      </div>
    );
  }

  renderSchedule(weeks) {
    return (
      <div>
        <table className="schedule">
          <thead>
            <tr>
              <th>Week</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map(w => (
              <tr key={w.week}>
                <td className="schedule-week">{w.week}</td>
                {w.days.map((d, i) => (
                  <td key={w.week + i} className={'schedule schedule-day ' + (d ? 'day-shift' : 'day-off')}>
                    <div>{moment(w.startDate, 'YYYY/MM/DD').add(i, 'day').format('MMMM Do')}</div>
                    <div>{d && 'shift'}</div>
                    <div className={w.daysOff[i] ? 'requested-day-off' : ''}>{w.daysOff[i] && 'requested day-off'}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {weeks.days}
      </div>
    );
  }
}

export default EmployeeInfo;
