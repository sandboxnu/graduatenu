const json_parser = require('../src/json_parser.js');
const fs = require('fs');

const cs_sched = json_parser.toSchedule(fs.readFileSync('./test/mock_parsed_audits/cs_schedule.json', 'utf-8'));
const cs_sched2 = json_parser.toSchedule(fs.readFileSync('./test/mock_parsed_audits/cs_schedule.json', 'utf-8'));

let schedules = [];

schedules.push(cs_sched);
schedules.push(cs_sched2);

// todo: make a custom matcher for schedule.
// expect.extend({
//   toBeValidSchedule(schedule) {
//     const pass = received >= floor && received <= ceiling;
//     if (pass) {
//       return {
//         message: () =>
//           `expected ${received} not to be within range ${floor} - ${ceiling}`,
//         pass: true,
//       };
//     } else {
//       return {
//         message: () =>
//           `expected ${received} to be within range ${floor} - ${ceiling}`,
//         pass: false,
//       };
//     }
//   },
// });

/**
 * Ensures that a given item is a schedule, with correct property format.
 * @param {*} schedule The thing to check.
 */
let ensureScheduleFormat = schedule => {
  test('Ensures that schedule has correct property format', () => {

    // ensure schedule is defined, and is an Object.
    expect(schedule).toBeDefined();
    expect(schedule).toBeInstanceOf(Object);

    // ensure that 'completed' property exists, with correct property format.
    expect(schedule).toHaveProperty('completed');
    ensureCompletedFormat(schedule.completed);

    // ensure that 'scheduled' property exists, is defined, and is an Array.
    expect(schedule).toHaveProperty('scheduled');
    ensureScheduledFormat(schedule.scheduled);
  });
}

/**
 * Ensures that a given item is a completed, with correct property format.
 * @param {*} completed The thing to check.
 */
let ensureCompletedFormat = completed => {
  test('Ensures that completed has correct property format', () => {
    
    // ensures that completed is defined, and is an Object.
    expect(schedule.completed).toBeDefined();
    expect(schedule.completed).toBeInstanceOf(Object);
  });
}

/**
 * Ensures that a given item is a scheduled, with correct property format.
 * @param {*} scheduled The thing to check.
 */
let ensureScheduledFormat = scheduled => {
  test('Ensures that scheduled has correct property format', () => {

    // ensures schedule is defined, and is an array.
    expect(schedule.completed).toBeDefined();
    expect(schedule.completed).toBeInstanceOf(Array);

    // todo: check that each of the completed classes are also valid classes.
  });
}

