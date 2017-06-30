'use strict';

const data = require('./data');

const EMPLOYEES_PER_SHIFT_RULE_ID = 7;


function feature1(weekStart, weekEnd, employees, shiftRules) {
  const result = {};

  let currentEmployeeIndex = -1;

  let adjustedEmployeePerShift = Math.min(shiftRules.filter(r => r.rule_id === EMPLOYEES_PER_SHIFT_RULE_ID)[0].value, employees.length);

  for (let w = weekStart; w <= weekEnd; w += 1) {
    const cw = result[w] = [];

    for (let d = 1; d <= 7; d += 1) {
      cw[d] = [];

      while (true) {
        currentEmployeeIndex = (currentEmployeeIndex + 1) % employees.length;
        const ce = employees[currentEmployeeIndex];

        cw[d].push(ce.id);
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
      data.getShiftRules()
    ]
  )
    .then(([employees, shiftRules]) => feature1(weekStart, weekEnd, employees, shiftRules));
}