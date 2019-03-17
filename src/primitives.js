const util = require('./util');
const Context = require('./context');

function and(...rules) {
  return (thing, context) => {
    if (!(context instanceof Context))
      context = Context.defaultContext;

    let result = true;
    for (rule of rules) {
      const ruleFunc = util.createRuleFunc(rule, context);

      if (!ruleFunc(thing, context)) {
        result = false;
        break;
      }
    }

    return result;
  };
}

function or(...rules) {
  return (thing, context) => {
    if (!(context instanceof Context))
      context = Context.defaultContext;

    let result = false;
    for (rule of rules) {
      const ruleFunc = util.createRuleFunc(rule, context);

      if (ruleFunc(thing, context)) {
        result = true;
        break;
      }
    }

    return result;
  };
}

function not(rule) {
  return (thing, context) => {
    if (!(context instanceof Context))
      context = Context.defaultContext;

    const ruleFunc = util.createRuleFunc(rule, context);
    return !ruleFunc(thing, context);
  };
}

function isInList(rule, list) {
  return (thing, context) => {
    if (!(context instanceof Context))
      context = Context.defaultContext;

    const ruleFunc = util.createRuleFunc(rule, context);
    const value = ruleFunc(thing, context);

    for (let item of list) {
      if (value === item)
        return true;
    }

    return false;
  };
}

function isInSet(rule, set) {
  return (thing, context) => {
    if (!(context instanceof Context))
      context = Context.defaultContext;

    const ruleFunc = util.createRuleFunc(rule, context);
    const value = ruleFunc(thing, context);

    return set.has(value);
  };
}

module.exports = {
  and,
  or,
  not,
  isInList,
  isInSet
};
