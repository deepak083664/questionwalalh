const genAI = require('../config/gemini');

// Helper to clean JSON string from Gemini code block formatting
const cleanJSON = (str) => {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

/**
 * Fallback question bank to simulate AI generation if API key is not provided.
 */
const getFallbackQuestions = (subject, classLevel, count, type, language) => {
  const isHindi = language === 'Hindi';
  
  const mockQuestions = [
    {
      text: isHindi ? 'प्रकाश संश्लेषण क्या है? इसकी रासायनिक अभिक्रिया लिखिए।' : 'What is photosynthesis? Write its balanced chemical equation.',
      options: [],
      answer: isHindi ? 'प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश का उपयोग करके कार्बन डाइऑक्साइड और पानी को ग्लूकोज और ऑक्सीजन में परिवर्तित करते हैं। समीकरण: 6CO2 + 6H2O + प्रकाश -> C6H12O6 + 6O2' : 'Photosynthesis is the process by which green plants convert carbon dioxide and water into glucose and oxygen using sunlight. Equation: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2',
      type: 'Long',
      marks: 5,
      difficulty: 'Medium',
    },
    {
      text: isHindi ? 'निम्नलिखित में से कौन सा अम्ल आमाशय (Stomach) में स्रावित होता है?' : 'Which of the following acids is secreted in the stomach?',
      options: isHindi 
        ? ['A) सल्फ्यूरिक अम्ल', 'B) हाइड्रोक्लोरिक अम्ल', 'C) साइट्रिक अम्ल', 'D) नाइट्रिक अम्ल']
        : ['A) Sulfuric acid', 'B) Hydrochloric acid', 'C) Citric acid', 'D) Nitric acid'],
      answer: 'B',
      type: 'MCQ',
      marks: 1,
      difficulty: 'Easy',
    },
    {
      text: isHindi ? 'गुरुत्वाकर्षण का सार्वत्रिक नियम (Universal Law of Gravitation) क्या है?' : 'What is the Universal Law of Gravitation?',
      options: [],
      answer: isHindi 
        ? 'ब्रह्मांड में प्रत्येक पिंड प्रत्येक दूसरे पिंड को एक बल से आकर्षित करता है जो उनके द्रव्यमान के गुणनफल के समानुपाती और उनके बीच की दूरी के वर्ग के व्युत्क्रमानुपाती होता है। F = G * (m1 * m2) / r^2'
        : 'Every body in the universe attracts every other body with a force proportional to the product of their masses and inversely proportional to the square of the distance between them. F = G * (m1 * m2) / r^2',
      type: 'Short',
      marks: 3,
      difficulty: 'Medium',
    },
    {
      text: isHindi ? 'कोशिका का "पावरहाउस" किसे कहा जाता है?' : 'Which organelle is known as the "Powerhouse of the Cell"?',
      options: isHindi
        ? ['A) राइबोसोम', 'B) गॉल्जीकाय', 'C) माइटोकॉन्ड्रिया', 'D) लाइसोसोम']
        : ['A) Ribosome', 'B) Golgi Apparatus', 'C) Mitochondria', 'D) Lysosome'],
      answer: 'C',
      type: 'MCQ',
      marks: 1,
      difficulty: 'Easy',
    },
    {
      text: isHindi ? 'अम्ल और क्षार के बीच उदासीनीकरण अभिक्रिया (Neutralization) को समझाइए।' : 'Explain neutralization reaction between an acid and a base with an example.',
      options: [],
      answer: isHindi 
        ? 'जब कोई अम्ल किसी क्षार के साथ अभिक्रिया करता है, तो लवण और जल बनते हैं। इसे उदासीनीकरण कहते हैं। उदाहरण: HCl + NaOH -> NaCl + H2O'
        : 'A reaction where an acid and a base react to form salt and water. Example: HCl + NaOH -> NaCl + H2O',
      type: 'Short',
      marks: 3,
      difficulty: 'Easy',
    },
    {
      text: isHindi ? 'एक अवतल दर्पण के सामने रखी वस्तु के प्रतिबिंब निर्माण की व्याख्या कीजिए।' : 'Explain the image formation by a concave mirror when the object is placed at C.',
      options: [],
      answer: isHindi
        ? 'जब वस्तु C (वक्रता केंद्र) पर होती है, तो प्रतिबिंब वास्तविक, उल्टा और वस्तु के समान आकार का C पर ही बनता है।'
        : 'When the object is placed at C (center of curvature), the image formed is real, inverted, of the same size, and located at C.',
      type: 'Long',
      marks: 5,
      difficulty: 'Hard',
    }
  ];

  // Filter based on type if not 'Mixed'
  let filtered = mockQuestions;
  if (type !== 'Mixed') {
    filtered = mockQuestions.filter(q => q.type.toLowerCase() === type.toLowerCase());
  }

  // If filtered result is empty, use all
  if (filtered.length === 0) {
    filtered = mockQuestions;
  }

  // Slice to desired count
  const results = [];
  for (let i = 0; i < count; i++) {
    const template = filtered[i % filtered.length];
    // Create copy with slightly adjusted marks if needed
    results.push({
      text: `[Fallback Mode] ${template.text}`,
      options: template.options,
      answer: template.answer,
      type: template.type,
      marks: template.marks,
      difficulty: template.difficulty,
    });
  }
  return results;
};

/**
 * Generate questions using Gemini AI
 */
const generateQuestions = async ({
  classLevel,
  subject,
  chapter,
  topic,
  count,
  difficulty,
  language,
  type,
}) => {
  // If Gemini client is not configured, return mock data
  if (!genAI) {
    console.log('Gemini API is not configured. Using high-quality fallback generator.');
    return getFallbackQuestions(subject, classLevel, count, type, language);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert exam paper setter. Generate exactly ${count} educational questions for a school exam paper.
    
    Target details:
    - Class/Grade: ${classLevel}
    - Subject: ${subject}
    - Chapter: ${chapter || 'General'}
    - Topic: ${topic || 'General'}
    - Difficulty Level: ${difficulty}
    - Language: ${language} (Note: If language is Hindi, generate the questions and answers in Hindi Devanagari script, but keep JSON keys in English as specified below)
    - Question Type: ${type} (Options: MCQ, Short, Long, Mixed)
    
    You MUST output your response strictly as a JSON array of objects. Do not write any introduction, code blocks, or explanations. Just return the valid JSON array.
    
    JSON Schema of each question object:
    {
      "text": "The full text of the question. E.g. \\"Define gravity.\\" or \\"गुरुत्वाकर्षण को परिभाषित कीजिए।\\"",
      "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"], // Array of exactly 4 options. Include ONLY if type is MCQ. If type is Short or Long, options must be an empty array []
      "answer": "For MCQ, output the single correct option letter (e.g. \\"A\\" or \\"B\\" or \\"C\\" or \\"D\\"). For Short or Long questions, provide a concise guide answer / grading key.",
      "type": "MCQ" | "Short" | "Long", // Must map exactly to one of these three
      "marks": number, // Reasonable integer marks: MCQ=1, Short=2 or 3, Long=5
      "difficulty": "${difficulty}" // Must be "Easy" or "Medium" or "Hard"
    }
    
    Double check that the array has exactly ${count} items. Ensure JSON syntax is perfectly correct.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = cleanJSON(text);

    try {
      const parsedQuestions = JSON.parse(cleanedText);
      if (Array.isArray(parsedQuestions)) {
        return parsedQuestions;
      }
      throw new Error('Response is not a JSON array');
    } catch (parseErr) {
      console.error('Failed to parse Gemini output. Raw text was:', text);
      // Try regex or fallback
      throw new Error('AI returned invalid format. Please try again.');
    }
  } catch (error) {
    console.error('Gemini generateContent error:', error.message);
    // Return fallback in dev/test environment to prevent user blocking
    if (process.env.NODE_ENV !== 'production') {
      console.log('Falling back to local generated questions due to API error.');
      return getFallbackQuestions(subject, classLevel, count, type, language);
    }
    throw error;
  }
};

/**
 * Generate questions similar to extracted text (OCR helper)
 */
const generateSimilarQuestions = async (extractedText, language = 'English') => {
  if (!genAI) {
    console.log('Gemini API is not configured. Using mock OCR similarity analyzer.');
    return [
      {
        text: `[OCR Similar] Write a detailed explanation of the text found in the document: "${extractedText.substring(0, 50)}..."`,
        options: [],
        answer: 'Provide general answers based on the topic.',
        type: 'Short',
        marks: 3,
        difficulty: 'Medium',
      },
      {
        text: `[OCR Similar] What are the main points discussed regarding: "${extractedText.substring(0, 30)}"?`,
        options: [],
        answer: 'Verify main thesis points of the text.',
        type: 'Long',
        marks: 5,
        difficulty: 'Hard',
      }
    ];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an AI assistant helping a teacher. We scanned a question sheet using OCR and extracted the following text:
    
    ---
    ${extractedText}
    ---
    
    Analyze this text and generate 3 similar or complementary exam questions in ${language}.
    
    You MUST output the result strictly as a JSON array of objects. Do not write anything else.
    
    JSON Schema:
    {
      "text": "The question text in ${language}",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."], // empty [] if not MCQ
      "answer": "Guide answer",
      "type": "MCQ" | "Short" | "Long",
      "marks": number,
      "difficulty": "Easy" | "Medium" | "Hard"
    }`;

    const result = await model.generateContent(prompt);
    const cleanedText = cleanJSON(result.response.text());
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('Similar question generation failed:', err.message);
    throw err;
  }
};

module.exports = {
  generateQuestions,
  generateSimilarQuestions,
};
