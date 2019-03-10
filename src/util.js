function createRuleFunc(rule, rules) {
  let ruleFunc;

  if (typeof rule === 'string')
    ruleFunc = rules[rule];
  else
    ruleFunc = rule;

  if (typeof ruleFunc !== 'function')
    throw new Error(`'${rule}' is not a defined rule or function`);

  return ruleFunc;
}

module.exports = {
  createRuleFunc
};
