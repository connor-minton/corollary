const _rules = {};

function and(...rules) {
  return thing => {
    let result = true;

    for (rule of rules) {
      let ruleFunc;
      if (typeof rule === 'string')
        ruleFunc = _rules[rule];
      else
        ruleFunc = rule;

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
      let ruleFunc;
      if (typeof rule === 'string')
        ruleFunc = _rules[rule];
      else
        ruleFunc = rule;

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
    let ruleFunc;
    if (typeof rule === 'string')
      ruleFunc = _rules[rule];
    else
      ruleFunc = rule;

    return !ruleFunc(thing);
  }
}

function createRule(label, statement) {
  _rules[label] = statement;
}

function ask(rule, thing) {
  let ruleFunc;
  if (typeof rule === 'string')
    ruleFunc = _rules[rule];
  else
    ruleFunc = rule;

  return ruleFunc(thing);
}

module.exports = {
  and,
  or,
  not,
  createRule,
  ask
};
