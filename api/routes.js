'use strict';

const axios = require('axios');
const scheduler = require('./scheduler');
const Joi = require('joi');
const config = require('./config.json');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: {
            file: './build/index.html'
        }
    },
    {
        method: 'GET',
        path: '/{path*}',
        config: {
            cache: {
                privacy: 'public',
                expiresIn: 31536000000 // 1 year in milliseconds
            }
        },
        handler: {
            directory: { path: './build' }
        }
    },
    {
        method: 'GET',
        path: '/api/employees',
        handler: function (request, reply) {
            reply(axios.get('http://interviewtest.replicon.com/employees').then(r => r.data));
        }
    },
    {
        method: 'GET',
        path: '/api/employees/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.number().required()
                }
            }
        },
        handler: function ({ params }, reply) {
            const weekStart = 23;
            const weekEnd = 26;
            reply(scheduler.getEmployeeSchedule(params.id, config.startWeek, config.endWeek));
        }
    }
];