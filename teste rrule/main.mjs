const { RRule } = require('rrule');
const moment = require('moment-timezone');

// Function to create an RRule
const createRRule = (input) => {
  return new RRule({
    freq: input.repeatEveryUnit === 'day'
      ? RRule.DAILY
      : input.repeatEveryUnit === 'week'
      ? RRule.WEEKLY
      : RRule.MONTHLY,
    interval: input.repeatEvery, // How often it repeats
    count: input.endType === 'after' ? input.occurrences : null, // Number of times it repeats
    until: input.endType === 'on' ? moment(input.endDate).toDate() : null, // End date
    dtstart: moment(input.startDate).toDate(), // Start date
    byweekday: input.repeatOn ? input.repeatOn.map(day => RRule[day.toUpperCase()]) : null, // Days of the week
  });
};

// Example input
const input = {
  repeatEveryUnit: 'week', // Repeat weekly
  repeatEvery: 1, // Every 1 week
  endType: 'after', // End after 10 occurrences
  occurrences: 10,
  startDate: '2023-05-15T10:00:00', // Start date
  endDate: null, // Not used since we’re ending after 10 times
  repeatOn: ['mo', 'we', 'fr'], // Monday, Wednesday, Friday
};

// Create the rule
const rule = createRRule(input);

// Output the rule as a string
console.log(rule.toString());

const readableText = (rule) => rule.toText();

console.log(readableText(rule));