'use strict';

const Joi = require('joi');

const data = require('./data');
const scheduler = require('./scheduler');
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
        path: '/employee/{id?}',
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
            reply(data.getEmployees());
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