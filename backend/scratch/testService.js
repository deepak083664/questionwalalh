require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { generateQuestions } = require('../src/services/geminiService');

async function test() {
  try {
    const questions = await generateQuestions({
      classLevel: '10',
      subject: 'Science',
      chapter: 'Chemical Reactions',
      topic: 'Redox',
      count: 2,
      difficulty: 'Medium',
      language: 'English',
      type: 'Mixed'
    });
    console.log('Success! Generated Questions:', JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error('Service test failed:', err);
  }
}

test();
