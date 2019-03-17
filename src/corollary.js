const util = require('./util');
const primitives = require('./primitives');
const Context = require('./context');

const contexts = {};

function and(...rules) {
  return primitives.and(...rules);
}

function or(...rules) {
  return primitives.or(...rules);
}

function not(...rules) {
  return primitives.not(...rules);
}

function isInList(rule, list) {
  return primitives.isInList(rule, list);
}

function isInSet(rule, set) {
  return primitives.isInSet(rule, set);
}

function createRule(label, statement) {
  Context.defaultContext.createRule(label, statement);
}

function createContext(name) {
  if (!name || typeof name !== 'string')
    throw new Error('a context must have a non-empty string `name`');

  const _context = new Context(name);
  contexts[name] = _context;
  return _context;
}

function getContext(name) {
  if (!name || typeof name !== 'string')
    throw new Error('a context must have a non-empty string `name`');

  let _context = contexts[name];
  if (!_context)
    throw new Error(`context '${name}' does not exist`);

  return _context;
}

function ask(rule, thing) {
  const ruleFunc = util.createRuleFunc(rule, Context.defaultContext);
  return ruleFunc(thing);
}

module.exports = {
  and,
  or,
  not,
  isInList,
  isInSet,
  createRule,
  createContext,
  getContext,
  ask
};
