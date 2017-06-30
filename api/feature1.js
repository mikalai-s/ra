'use strict';

const data = require('./data');
const constraints = require('./constraints');


const EMPLOYEES_PER_SHIFT_RULE_ID = 7;


function feature1(weekStart, weekEnd, employees, shiftRules, timeOffs) {
  const result = {};

  let currentEmployeeIndex = -1;

  let adjustedEmployeePerShift = Math.min(shiftRules.filter(r => r.rule_id === EMPLOYEES_PER_SHIFT_RULE_ID)[0].value, employees.length);

  for (let w = weekStart; w <= weekEnd; w += 1) {
    const cw = result[w] = [];

    const res = constraints.applyConstraints(
      cw,
      [
        () => constraints.assumeAllAreOnShift(cw, employees)
      ],
      [
        tryCount => constraints.ensureNumberOfEmployeesPerShift(tryCount, cw, employees, adjustedEmployeePerShift)
      ]);
    if (!res) {
      console.log('Unable to process data');
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
