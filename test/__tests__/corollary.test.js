const { and, or, not, createRule, ask, isInList, isInSet, createContext } = require('../..');
const uuid = require('uuid/v4');

test('rules can return a non-boolean value', () => {
  const testCtx = createContext(uuid());
  testCtx.createRule('itColor', it => it.color);
  const thing1 = { color: 'blue' };
  const thing2 = { color: 'brown' };
  expect(testCtx.ask('itColor', thing1)).toBe('blue');
  expect(testCtx.ask('itColor', thing2)).toBe('brown');
});

test('corollary#and()', () => {
  const rule = and(
    it => it.this === 'this',
    it => it.that === 'that',
    it => it.color === 'blue'
  );

  const thing1 = {
    this: 'this',
    that: 'that',
    color: 'blue'
  };

  const thing2 = {
    this: 'this',
    that: 'there',
    color: 'blue'
  };

  expect(rule(thing1)).toBe(true);
  expect(rule(thing2)).toBe(false);
});

test('corollary#or()', () => {
  const rule = or(
    it => it.this === 'this',
    it => it.that === 'that',
    it => it.color === 'blue'
  );

  const thing1 = {
    this: 'this',
    that: 'that',
    color: 'blue'
  };

  const thing2 = {
    this: 'this',
    that: 'there',
    color: 'blue'
  };

  const thing3 = {
    this: 'that',
    that: 'this',
    color: 'red'
  };

  expect(rule(thing1)).toBe(true);
  expect(rule(thing2)).toBe(true);
  expect(rule(thing3)).toBe(false);
});

test('corollary#not()', () => {
  const rule = not(it => it.foo === 'bar');

  const thing1 = {
    foo: 'bar'
  };

  const thing2 = {
    foo: 'foo'
  };

  expect(rule(thing1)).toBe(false);
  expect(rule(thing2)).toBe(true);
});

test('corollary#createRule/ask(): can create rules and ask questions', () => {
  createRule('isSkyBlue', weather => weather.skyColor === 'blue');
  createRule('isSkyRed', weather => weather.skyColor === 'red');
  createRule('isSunOut', weather => weather.cloudCoverage < 0.5);
  createRule('isRainy', weather => weather.precipitation > 0.25);

  createRule('isNice',
    and(
      'isSkyBlue',
      'isSunOut',
      not('isRainy')
    )
  );

  const today = {
    skyColor: 'blue',
    cloudCoverage: 0.2,
    precipitation: 0.2
  };

  const tomorrow = {
    skyColor: 'blue',
    cloudCoverage: 0.8,
    precipitation: 0
  };

  expect(ask('isNice', today)).toBe(true);
  expect(ask('isNice', tomorrow)).toBe(false);
});

test('corollary#isInList()', () => {
  const testCtx = createContext(uuid());
  testCtx.createRule('itColor', it => it.color);

  const colors = ['yellow', 'green', 'blue'];
  const thing1 = { color: 'blue' };
  const thing2 = { color: 'green' };
  const thing3 = { color: 'red' };

  expect(testCtx.ask(isInList('itColor', colors), thing1)).toBe(true);
  expect(testCtx.ask(isInList('itColor', colors), thing2)).toBe(true);
  expect(testCtx.ask(isInList('itColor', colors), thing3)).toBe(false);
});

test('corollary#isInSet()', () => {
  const testCtx = createContext(uuid());
  testCtx.createRule('itColor', it => it.color);

  const colors = new Set(['yellow', 'green', 'blue']);
  const thing1 = { color: 'blue' };
  const thing2 = { color: 'green' };
  const thing3 = { color: 'red' };

  expect(testCtx.ask(isInSet('itColor', colors), thing1)).toBe(true);
  expect(testCtx.ask(isInSet('itColor', colors), thing2)).toBe(true);
  expect(testCtx.ask(isInSet('itColor', colors), thing3)).toBe(false);
});
