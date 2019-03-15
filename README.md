# corollary

An alternative boolean framework for complex logical systems.
_More succinctly: a cool bool rule tool_.

**This is very experimental and a work-in-progress. Just use for fun.**


## Usage

The basic usage is to define rules using callbacks. Then, you compose rules
using the names of the rules in combination with boolean primitives, like
`and`, `or`, and `not`. Eventually, you have a heirarchy of rules that you
can query using `ask()`.

```js
const { and, not, createRule, ask } = require('corollary');

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

console.log('Is today nice?', today);

if (ask('isNice', today))
  console.log('Yes!');
else
  console.log('No...');

console.log('\nWill tomorrow be nice?', tomorrow);

if (ask('isNice', tomorrow))
  console.log('Yes!');
else
  console.log('No...');
```

## Roadmap (Future Features)

Where to go from here? The end goal of this module is to simplify and
centralize the often thousands of business rules that usually accumulate as
spaghetti code if unchecked. With that goal in mind, there are a few features
that would be nice to have. Since this is an early project, the API will need
to be refined such that the module encourages a good programming style that
supports the features.

### Dependency Graph Generation

It's easy to get lost in the thousands of relationships between object types
and their associations. The `corollary` API should expose a dependency
graph-generator that shows the relationships between rules. An explicit rule
system would be necessary define this dependency graph.

#### Dependency Graph Enforcement

We can take this a step further and enforce dependency graph restrictions.
What makes dependency graph hard to completely infer would be the use of
`ask()` in a callback. One approach is to have callback rules declare their
dependencies, which are evaluated and passed to the callback.

### Heirarchical Naming Convention

A heirarchy based on object types and dependencies could help users better
locate and understand their rules. A convention-based API that supports a
heirarchical pattern would encourage this type of rule definition and
potentially make a dependency graph easier to infer.

### Non-Boolean Rule Types and Lots of Primitives

It makes sense for rules to calculate non-boolean return values. The more
primitives that `corollary` can provide to support this, the better. Think
`sum()`, `isIn()`, `isDeepEqual()`, set operations, etc. These can be
optimized. The primitives could just be rules, and more primitives could be
added by the user if needed. It would be helpful to `corollary` for the
user to provide the arity of rules. Maybe this could be part of the
dependency API.
