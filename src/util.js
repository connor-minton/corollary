function createRuleFunc(rule, context) {
  let ruleFunc;

  if (typeof rule === 'string')
    ruleFunc = context.rules[rule];
  else
    ruleFunc = rule;

  if (typeof ruleFunc !== 'function')
    throw new Error(`'${rule}' is not a defined rule or function`);

  return ruleFunc;
}

module.exports = {
  createRuleFunc
};
