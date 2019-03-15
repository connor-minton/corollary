const util = require('./util');

function and(rulesRepo, ...rules) {
  return thing => {
    let result = true;

    for (rule of rules) {
      const ruleFunc = util.createRuleFunc(rule, rulesRepo);

      if (!ruleFunc(thing)) {
        result = false;
        break;
      }
    }

    return result;
  }
}

function or(rulesRepo, ...rules) {
  return thing => {
    let result = false;

    for (rule of rules) {
      const ruleFunc = util.createRuleFunc(rule, rulesRepo);

      if (ruleFunc(thing)) {
        result = true;
        break;
      }
    }

    return result;
  }
}

function not(rulesRepo, rule) {
  return thing => {
    const ruleFunc = util.createRuleFunc(rule, rulesRepo);
    return !ruleFunc(thing);
  }
}

module.exports = {
  and,
  or,
  not
};
