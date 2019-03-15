const util = require('./util');
const primitives = require('./primitives');

const _rules = {};

function and(...rules) {
  return primitives.and(_rules, ...rules);
}

function or(...rules) {
  return primitives.or(_rules, ...rules);
}

function not(...rules) {
  return primitives.not(_rules, ...rules);
}

function createRule(label, statement) {
  _rules[label] = statement;
}

function ask(rule, thing) {
  const ruleFunc = util.createRuleFunc(rule, _rules);
  return ruleFunc(thing);
}

module.exports = {
  and,
  or,
  not,
  createRule,
  ask
};
