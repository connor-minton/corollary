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
  }
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
  }
}

function not(rule) {
  return (thing, context) => {
    if (!(context instanceof Context))
      context = Context.defaultContext;

    const ruleFunc = util.createRuleFunc(rule, context);
    return !ruleFunc(thing, context);
  }
}

module.exports = {
  and,
  or,
  not
};
