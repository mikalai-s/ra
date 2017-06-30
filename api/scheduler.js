'use strict';

const data = require('./data');
const config = require('./config.json');
const feature = require(`./feature${config.feature}`);

module.exports = {
  getEmployeeSchedule(employeeId, weekStart, weekEnd) {
    return Promise.all(
      [
        data.getEmployee(employeeId),
        data.getWeeks(),
        data.getTimeOffs(),
        feature(weekStart, weekEnd)
      ])
      .then(([employee, weeks, timeOffs, schedule]) => ({
        employeeId: employeeId,
        name: employee.name,
        weeks: new Array(weekEnd - weekStart + 1)
          .fill()
          .map((w, i) => {
            const week = weekStart + i;
            const weekInfo = weeks.filter(w => w.id === week)[0];
            const employeeTimeOff = timeOffs.filter(t => (t.employee_id === employeeId) && (t.week === week))[0];
            const daysOff = (employeeTimeOff && employeeTimeOff.days) || [];
            return {
              week: week,
              startDate: weekInfo && weekInfo.start_date,
              days: schedule[week].slice(1).map(ids => ids.indexOf(employeeId) >= 0),
              daysOff: [1, 2, 3, 4, 5, 6, 7].map(d => daysOff.indexOf(d) >= 0)
            };
          })
      }));
  }
};