// todo: add module.exports to json_parser for testing, and then use files in './test/mock_parsed_audits/' for testing.

// const json_parser = require('../src/json_parser.js');
const fs = require('fs');

// const cs_sched = json_parser.toSchedule(fs.readFileSync('./test/mock_parsed_audits/cs_schedule.json', 'utf-8'));
// const cs_sched2 = json_parser.toSchedule(fs.readFileSync('./test/mock_parsed_audits/cs_schedule.json', 'utf-8'));
const tempSchedule = JSON.parse(fs.readFileSync('./test/mock_parsed_audits/sampleScheduleOutput.json', 'utf-8'));

let schedules = [];

// schedules.push(cs_sched);
// schedules.push(cs_sched2);
schedules.push(tempSchedule);

// runs tests on all items in 'schedules' array.
for (let index = 0; index < schedules.length; index += 1) {
  let schedule = schedules[index];
  
  // tests that 'schedule' is well formed.
  test('Ensures that schedule has well formed properties and types.', () => {
    expect(schedule).toHaveValidScheduleProperties();
  });

  // test that 'schedule.completed' is well formed.
  test('Ensures that schedule.completed has well formed properties and types.', () => {
    expect(schedule.completed).toHaveValidScheduleCompletedProperties();
  });

  // test that each item in 'schedule.completed.classes' is well formed.
  for (let objIndex = 0; objIndex < schedule.completed.classes.length; objIndex += 1) {

    let termObj = schedule.completed.classes[objIndex];
    test('Ensures that term object has well formed properties and types.', () => {
      expect(termObj).toHaveValidScheduleCompletedClassesProperties();
    });

    // test that each item in 'schedule.completed.classes[objIndex].courses' is well formed.
    for (let courseIdx = 0; courseIdx < termObj.courses.length; courseIdx += 1) {

      let courseObj = termObj.courses[courseIdx];
      test('Ensures that course object has well formed properties and types.', () => {
        expect(courseObj).toBeValidCourse();
      });
    }
  }

  // test that 'schedule.scheduled' is well formed.
  test('Ensures that schedule.scheduled has well formed properties and types.', () => {
    expect(schedule.scheduled).toHaveValidScheduleScheduledProperties();
  });

}

// todo: rename 'schedule.scheduled' property to 'schedule.planned' to avoid confusion.

// custom matcher for checking schedule property form.
expect.extend({
  toHaveValidScheduleProperties(received) {

    // ensure schedule is defined, and is an Object.
    expect(received).toBeDefined();
    expect(received).toBeInstanceOf(Object);

    // ensure that 'completed' property exists, with correct property format.
    expect(received).toHaveProperty('completed');

    // ensure that 'scheduled' property exists, is defined, and is an Array.
    expect(received).toHaveProperty('scheduled');

    return {
      message: () => `expected ${received} not to have valid schedule properties.`,
      pass: true,
    };
  },
});

// custom matcher for checking schedule.completed property form.
expect.extend({
  toHaveValidScheduleCompletedProperties(received) {

    // received is 'schedule.completed'.

    // ensure that schedule.completed is defined, and is an Object.
    expect(received).toBeDefined();
    expect(received).toBeInstanceOf(Object);

    // ensure that schedule.completed.classes field exists, with correct property format.
    expect(received).toHaveProperty('classes');
    expect(received.classes).toBeDefined();
    expect(received.classes).toBeInstanceOf(Array);

    return {
      message: () => `expected ${received} not to have valid schedule.completed properties.`,
      pass: true,
    };
  },
});

// custom matcher for checking schedule.completed.classes property form.
expect.extend({
  toHaveValidScheduleCompletedClassesProperties(received) {

    // received.classes should be an Array of Objects with termId and courses properties.
    // yeah, I know it doesn't make sense for received.classes to not be an array of classes. Sorry.
    expect(received).toBeDefined();
    expect(received).toBeInstanceOf(Object);
    
    // ensures received has property 'termId', that is a number that matches 20xx[1-6]0.
    expect(received).toHaveProperty('termId');
    expect(received.termId).toBeDefined();
    // expect(received.termId).toBeInstanceOf(Number);
    expect("" + received.termId).toMatch(/^20\d\d[1-6]0$/);
    
    // ensures received has property 'courses', that is an Array of courses.
    expect(received).toHaveProperty('courses');
    expect(received.courses).toBeDefined();
    expect(received.courses).toBeInstanceOf(Array);

    return {
      message: `expected ${received} to not have valid schedule.completed.classes properties.`,
      pass: true,
    };
  },
});

// custom matcher to ensure received is a valid course.
expect.extend({
  toBeValidCourse(received) {

    // ensure that received is an Object.
    expect(received).toBeDefined();
    expect(received).toBeInstanceOf(Object);

    // todo: add the name property to list of tests.
    // ensure that received contains the following properties, and that they are all defined.
    let props = ['hon', 'subject', 'classId', 'credithours', 'season', 'year', 'termId'];
    for (let i = 0; i < props.length; i += 1) {
      expect(received).toHaveProperty(props[i]);
      expect(received[props[i]]).toBeDefined();
    }

    // ensure the properties' values are well formed.
    expect(received.subject).toMatch(/^[A-Z]{2,4}$/);
    expect(received.classId).toMatch(/^[\d]{4}$/);
    expect(received.credithours).toMatch(/^[\d]\.00/);
    expect(received.season).toMatch(/FL|SP|S1|S2|SM/);
    expect(received.year).toMatch(/^\d\d$/);
    expect(received.termId).toMatch(/^20\d\d[1-6]0$/);
    // expect(received.name).toBeInstanceOf(String);
    
    return {
      message: () => `expected ${received} not to have valid course properties`,
      pass: true,
    };
  },
});

// custom matcher for checking schedule.scheduled property form.
expect.extend({
  toHaveValidScheduleScheduledProperties(received) {

    // received is 'schedule.scheduled'.

    // ensure that received is defined, and is an Array.
    expect(received).toBeDefined();
    expect(received).toBeInstanceOf(Array);

    // ensure that each item in received is an Array of courses.
    for (let i = 0; i < received.length; i += 1) {

      let item = received[i];

      expect(item).toBeDefined();
      expect(item).toBeInstanceOf(Array);

      // we should never have more than 4 courses in a semester.
      expect(item.length).toBeLessThanOrEqual(4);
      
      for (let j = 0; j < item.length; j += 1) {
        let itemCourse = item[j];

        expect(itemCourse).toBeDefined();
        // expect(itemCourse).toBeInstanceOf(String);
      }
    }

    return {
      message: () => `expected ${received} not to have valid schedule.scheduled properties.`,
      pass: true,
    };
  },
});
