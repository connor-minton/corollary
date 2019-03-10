const util = require('./util');

const _rules = {};

function and(...rules) {
  return thing => {
    let result = true;

    for (rule of rules) {
      const ruleFunc = util.createRuleFunc(rule, _rules);

      if (!ruleFunc(thing)) {
        result = false;
        break;
      }
    }

    return result;
  }
}

function or(...rules) {
  return thing => {
    let result = false;

    for (rule of rules) {
      const ruleFunc = util.createRuleFunc(rule, _rules);

      if (ruleFunc(thing)) {
        result = true;
        break;
      }
    }

    return result;
  }
}

function not(rule) {
  return thing => {
    const ruleFunc = util.createRuleFunc(rule, _rules);
    return !ruleFunc(thing);
  }
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
