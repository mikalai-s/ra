'use strict';

const PriorityQueue = require('./priorityQueue');

module.exports = {

  /**
   * Applies constraints for a given week.
   * @param {Array} week Array of days.
   * @param {Function} softConstraintFns Soft constraints.
   * @param {Function} hardConstraintFns Hard constraints.
   */
  applyConstraints(week, softConstraintFns, hardConstraintFns) {
    // keep track of failures
    let tryCount = 0;

    while (true) {
      // enforce soft constraints first
      for (let i = 0; i < softConstraintFns.length; i += 1) {
        const f = softConstraintFns[i](tryCount);
        for (let j = 1; j < week.length; j += 1) {
          const res = f(week, week[j], j);
          if (res) {
            // truthy value for soft constraint means
            // that it tried all possible adjustments
            // at this point there is no sense to run hard constraints
            // because we've tried everything
            return false;
          }
        }
      }

    // enforce hard constraints
      let enforcedAllConstraints = true;
      for (let i = 0; i < hardConstraintFns.length; i += 1) {
        const f = hardConstraintFns[i](tryCount);
        for (let j = 1; j < week.length; j += 1) {
          const res = f(week, week[j], j);
          if (res) {
            // truthy value for a hard constraint means that it failed
            // so we need to start over to make all soft constraints to adjust their routine
            // before executing hard constraints
            tryCount += 1;
            enforcedAllConstraints = false;
            break;
          }
        }
        if (!enforcedAllConstraints) {
          break;
        }
      }
      if (enforcedAllConstraints) {
        break;
      }
    }
  },

  /**
   * Initiates each day with all possible employees.
   * @param {Array} week Array of days.
   * @param {Array} employees Array of employees.
   */
  assumeAllAreOnShift(week, employees) {
    for (let d = 1; d <= 7; d += 1) {
      week[d] = [];
    }
    return function (w, d, di) {
      w[di] = employees.map(e => e.id);
    }
  },

  /**
   * Filter out employees from a day
   * which they requested as a day off.
   * If we are in "try" mode, some day-off requests are ignored.
   * @param {*} tryCount
   * @param {*} cw
   * @param {*} timeOffs
   */
  filterOutWithDayOffRequests(tryCount, week, timeOffs) {
    return function (w, d, di) {
      // if try count is more then day-off count, then we tried all
      // skips (for our simple case) and cannot continue
      if (tryCount > timeOffs.length) {
        return true;
      }

      // we use day-off count to differenciate day-offs
      // in case when this constraint is called with non-zero tryCount
      // (i.e. some other constraint failed, so we need to adjust logic)
      // we need to skip some day-offs
      // for simplicity we do not consider all permutations of day-offs
      // so we just skip ones which count correspond to the try count
      for (let i = 0; i < d.length; i += 1) {
        const e = d[i];
        const dayOffs = timeOffs.filter(t => (t.employee_id === e) && t.days.indexOf(di) >= 0);
        if (dayOffs.length) {
          // day-off
          if (tryCount !== timeOffs.indexOf(dayOffs[0]) + 1) {
            d.splice(i, 1);
            i -= 1;
          }
        }
      }
    };
  },

  /**
   * Makes sure that each day is fulfilled with a specific number of eployees.
   * @param {*} tryCount
   * @param {*} w
   * @param {*} employees
   * @param {*} adjustedEmployeePerShift
   */
  ensureNumberOfEmployeesPerShift(tryCount, week, employees, employeePerShift) {
    // calc frequencies, i.e. how often an employee is already assigned
    const fr = week.reduce((p, c, i) => {
      c.forEach(e => {
        p[e] = (p[e] || 0) + 1;
      });
      return p;
    }, {});
    // creates priority queue based on the frequencies
    // soeach time there is need an employee to put ito a day
    // the queue helps us to get proper candidate
    // allows us to have more even distribution of employees during a week
    const frequenciesQueue = new PriorityQueue(employees.map(e => ({
      priority: fr[e.id],
      id: e.id
    })));
    return function (w, d, di) {
      w[di] = [];
      for (let i = 0; i < employeePerShift; i += 1) {
        // get next employee
        // the skip function ensures:
        // 1. an employee with day-off reuest is not considered
        // 2. an employee already added to current day is not considered again
        const item = frequenciesQueue.dequeue(e => (d.indexOf(e.id) === -1) || (w[di].indexOf(e.id) >= 0));
        if (!item) {
          // if ther eis no such employee
          // make the routine know that we need to adjust day-off requests
          return true;
        }
        w[di].push(item.id);
      }
    };
  }
};
