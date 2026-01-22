const Joi = require('joi');
const { profileUpdateSchema } = require('./dist/middleware/validation');

const testData = {
  firstName: 'John',
  lastName: 'Doe',
  age: 28,
  bio: 'This is a test bio',
  interests: ['Hiking', 'Reading'],
  relationshipGoals: ['Long-term relationship', 'Casual dating']
};

console.log('=== Testing profileUpdateSchema ===');
console.log('Schema:', profileUpdateSchema);
console.log('Test data:', JSON.stringify(testData, null, 2));

const { error, value } = profileUpdateSchema.validate(testData, { abortEarly: false });

if (error) {
  console.log('❌ Validation failed:');
  console.log(error.details.map(detail => `${detail.field}: ${detail.message}`).join('\n'));
} else {
  console.log('✅ Validation successful:');
  console.log(value);
}

// Let's also test the individual fields
console.log('\n=== Testing individual fields ===');
console.log('firstName:', profileUpdateSchema.extract('firstName').validate('John'));
console.log('lastName:', profileUpdateSchema.extract('lastName').validate('Doe'));
console.log('age:', profileUpdateSchema.extract('age').validate(28));
console.log('bio:', profileUpdateSchema.extract('bio').validate('This is a test bio'));
console.log('interests:', profileUpdateSchema.extract('interests').validate(['Hiking', 'Reading']));
console.log('relationshipGoals:', profileUpdateSchema.extract('relationshipGoals').validate(['Long-term relationship', 'Casual dating']));
