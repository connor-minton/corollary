const { and, or, not, createRule, createContext, getContext, ask } = require('../..');
const Context = require('../../src/context');
const uuid = require('uuid/v4');

test('Context.defaultContext: adding rules on the default context is equivalent to adding rules on the `corollary` object', () => {
  const defaultCtxTest = { ctx: 'default' };
  const corollaryCtxTest = { ctx: 'corollary' };

  createRule('corollaryCtxRule', obj => obj.ctx === 'corollary');
  Context.defaultContext.createRule('defaultCtxRule', obj => obj.ctx === 'default');

  expect(ask('corollaryCtxRule', corollaryCtxTest)).toBe(true);
  expect(Context.defaultContext.ask('defaultCtxRule', defaultCtxTest)).toBe(true);

  expect(ask('defaultCtxRule', defaultCtxTest)).toBe(true);
  expect(Context.defaultContext.ask('corollaryCtxRule', corollaryCtxTest)).toBe(true);
});

test('Context.defaultContext: new context is not the default context', () => {
  const context = new Context(uuid());
  expect(context).not.toBe(Context.defaultContext);
});

test('Context: create a callback rule and ask a question in a new context', () => {
  const context = new Context(uuid());
  context.createRule('isGreat', it => it.is === 'great');
  expect(context.ask('isGreat', { is: 'great' })).toBe(true);
  expect(context.ask('isGreat', { is: 'not great' })).toBe(false);
});

test('Context: create an `or` rule and ask a question in a new context', () => {
  const context = new Context(uuid());
  context.createRule('isOkay', it => it.is === 'okay');
  context.createRule('isAwesome', it => it.is === 'awesome');
  context.createRule('isMagnificent', it => it.is === 'magnificent');
  context.createRule('isAboveAverage',
    or('isAwesome', 'isMagnificent')
  );

  expect(context.ask('isAboveAverage', { is: 'awesome' })).toBe(true);
  expect(context.ask('isAboveAverage', { is: 'magnificent' })).toBe(true);
  expect(context.ask('isAboveAverage', { is: 'okay' })).toBe(false);
});

test('Context: create an `and` rule and ask a question in a new context', () => {
  const context = new Context(uuid());
  createPrettyRules(context);

  expect(context.ask('hasPassedInspection', { is: 'pretty', flaws: 1 })).toBe(false);
  expect(context.ask('hasPassedInspection', { is: 'ugly', flaws: 0 })).toBe(false);
  expect(context.ask('hasPassedInspection', { is: 'pretty', flaws:0 })).toBe(true);
});

test('Context: create a `not` rule and ask a question in a new context', () => {
  const context = new Context(uuid());
  context.createRule('isPretty', it => it.is === 'pretty');
  context.createRule('isUgly', not('isPretty'));

  expect(context.ask('isPretty', { is: 'pretty' })).toBe(true);
  expect(context.ask('isUgly', { is: 'hideous' })).toBe(true);
});

test('Context: create a composite rule and ask a question in a new context', () => {
  const context = new Context(uuid());
  createFlightRules(context);

  expect(context.ask('isBird', airplane)).toBe(false);
  expect(context.ask('isBird', hummingbird)).toBe(true);
  expect(context.ask('isBird', chicken)).toBe(true);
});

test('corollary#createContext(): creates different contexts', () => {
  const prettyContext = createContext(uuid());
  const flightContext = createContext(uuid());
  const prettyThing = { is: 'pretty', flaws: 0 };

  createPrettyRules(prettyContext);
  createFlightRules(flightContext);

  expect(prettyContext.ask('hasPassedInspection', prettyThing))
    .toBe(true);
  expect(flightContext.ask('isBird', airplane)).toBe(false);

  expect(() => prettyContext.ask('isBird', airplane)).toThrow();
  expect(() => flightContext.ask('hasPassedInspection', prettyThing)).toThrow();
});

test('corollary#getContext(): gets the context', () => {
  const prettyContextKey = uuid();
  const flightContextKey = uuid();
  const prettyContext = createContext(prettyContextKey);
  const flightContext = createContext(flightContextKey);
  const gottenPrettyContext = getContext(prettyContextKey);
  const gottenFlightContext = getContext(flightContextKey);

  expect(gottenPrettyContext).toBe(prettyContext);
  expect(gottenFlightContext).toBe(flightContext);

  expect(() => createPrettyRules(gottenPrettyContext)).not.toThrow();
  expect(() => createFlightRules(gottenFlightContext)).not.toThrow();
});

function createPrettyRules(context) {
  context.createRule('isPretty', it => it.is === 'pretty');
  context.createRule('hasZeroFlaws', it => it.flaws === 0);
  context.createRule('hasPassedInspection',
    and('isPretty', 'hasZeroFlaws')
  );
}

function createFlightRules(context) {
  context.createRule('doesFly', it => it.movesBy === 'air');
  context.createRule('hasWheels', it => it.has.includes('wheels'));
  context.createRule('hasWings', it => it.has.includes('wings'));
  context.createRule('isBird',
    and(
      or('doesFly', 'hasWings'),
      not('hasWheels')
    )
  );
}

const airplane = {
  movesBy: 'air',
  has: ['wings', 'wheels']
};

const hummingbird = {
  movesBy: 'air',
  has: ['wings', 'feet']
};

const chicken = {
  movesBy: 'ground',
  has: ['wings', 'feet']
};
