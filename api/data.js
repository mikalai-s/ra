'use strict';

const axios = require('axios');

module.exports = {
    getEmployees: () => axios(`http://interviewtest.replicon.com/employees`).then(r => r.data),
    getEmployee: (id) => axios(`http://interviewtest.replicon.com/employees/${id}`).then(r => r.data),
    getTimeOffs: () => axios(`http://interviewtest.replicon.com/time-off/requests`).then(r => r.data),
    getWeeks: () => axios(`http://interviewtest.replicon.com/weeks`).then(r => r.data),
    getWeek: (id) => axios(`http://interviewtest.replicon.com/week/${id}`).then(r => r.data),
    getRuleDefinitions: () => axios(`http://interviewtest.replicon.com/rule-definitions`).then(r => r.data),
    getShiftRules: () => axios(`http://interviewtest.replicon.com/shift-rules`).then(r => r.data),
};