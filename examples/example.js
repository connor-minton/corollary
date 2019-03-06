const { and, not, createRule, ask } = require('..');

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
