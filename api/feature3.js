'use strict';

const data = require('./data');
const RotatingPriorityList = require('./rotatingPriorityList');

const EMPLOYEES_PER_SHIFT_RULE_ID = 7;
const MAX_SHIFTS_RULE_ID = 2;

function maxShiftsReachedForEmployee(eid, w, max) {
  let count = 0;
  for (let d = 1; d < w.length; d += 1) {
    if (w[d].indexOf(eid) >= 0) {
      count += 1;
    }
  }
  return count >= max;
}


function feature3(weekStart, weekEnd, employees, shiftRules, timeOffs) {
  const result = {};

  // list of employees for more even distribution of them in shifts

  let adjustedEmployeePerShift = Math.min(shiftRules.filter(r => r.rule_id === EMPLOYEES_PER_SHIFT_RULE_ID)[0].value, employees.length);
  let maxShiftsCorporate = shiftRules.filter(r => r.rule_id === MAX_SHIFTS_RULE_ID && typeof r.employee_id === 'undefined')[0].value;

  for (let w = weekStart; w <= weekEnd; w += 1) {
    const cw = result[w] = [];

    const weekTimeOffs = timeOffs.filter(t => t.week === w);
    const employeeList = new RotatingPriorityList(
      employees.map(e => {
        let dayOffs = weekTimeOffs.filter(t => t.employee_id === e.id)[0];
        dayOffs = dayOffs ? dayOffs.days : [];
        return {
          id: e.id,
          dayOffs,
          priority: dayOffs.length
        };
      })
    );

    for (let d = 1; d <= 7; d += 1) {
      cw[d] = [];

      employeeList.reset();

      let ignoreNextDayOff = false;
      while (true) {
        let ce = employeeList.peekNext();

        if (!ce) {
          // that means that current cursor reached end of the employee list
          if (ignoreNextDayOff) {
            throw new Error('Unable to process request due to data config');
          }
          ignoreNextDayOff = true;
          employeeList.reset();
          ce = employeeList.peekNext();
        }

        if (!maxShiftsReachedForEmployee(ce.id, cw, maxShiftsCorporate)) {
          if (ignoreNextDayOff || ce.dayOffs.indexOf(d) === -1) {
            // shift
            cw[d].push(ce.id);
            employeeList.popCurrent();

            ignoreNextDayOff = false;
          }
        }

        if (cw[d].length >= adjustedEmployeePerShift) {
          break;
        }
      }
    }
  }
  return result;
}


module.exports = function (weekStart, weekEnd) {
  return Promise.all(
    [
      data.getEmployees(),
      data.getShiftRules(),
      data.getTimeOffs()
    ]
  )
    .then(([employees, shiftRules, timeOffs]) => feature3(weekStart, weekEnd, employees, shiftRules, timeOffs));
}