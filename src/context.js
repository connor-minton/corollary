const util = require('./util');

class Context {
  constructor(name) {
    this.name = name;
    this.rules = {};
  }

  createRule(label, statement) {
    this.rules[label] = statement;
  }

  ask(rule, thing) {
    const ruleFunc = util.createRuleFunc(rule, this);
    return ruleFunc(thing, this);
  }
}

Context.defaultContext = new Context();

module.exports = Context;
