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
  const subLower = (subject || '').toLowerCase();

  let templates = [];

  if (subLower.includes('math')) {
    templates = [
      {
        text: isHindi ? 'यदि 2x + 5 = 15 है, तो x का मान ज्ञात कीजिए।' : 'If 2x + 5 = 15, find the value of x.',
        options: isHindi ? ['A) 5', 'B) 10', 'C) 8', 'D) 15'] : ['A) 5', 'B) 10', 'C) 8', 'D) 15'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      },
      {
        text: isHindi ? 'द्विघात समीकरण x² - 5x + 6 = 0 के मूल (roots) ज्ञात कीजिए।' : 'Find the roots of the quadratic equation x² - 5x + 6 = 0.',
        options: [],
        answer: isHindi ? 'समीकरण का गुणनखंड करने पर: (x - 2)(x - 3) = 0. इसलिए, x = 2 और x = 3.' : 'Factoring the equation: (x - 2)(x - 3) = 0. Therefore, x = 2 and x = 3.',
        type: 'Short',
        marks: 3,
        difficulty: 'Medium'
      },
      {
        text: isHindi ? 'पाइथागोरस प्रमेय (Pythagoras Theorem) का कथन लिखिए और इसे सिद्ध कीजिए।' : 'State and prove the Pythagoras Theorem with a neat diagram.',
        options: [],
        answer: isHindi ? 'एक समकोण त्रिभुज में, कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है (AC² = AB² + BC²).' : 'In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides (AC² = AB² + BC²).',
        type: 'Long',
        marks: 5,
        difficulty: 'Hard'
      },
      {
        text: isHindi ? '7 सेमी त्रिज्या वाले एक वृत्त का क्षेत्रफल ज्ञात कीजिए।' : 'Find the area of a circle with a radius of 7 cm.',
        options: isHindi ? ['A) 154 वर्ग सेमी', 'B) 44 वर्ग सेमी', 'C) 98 वर्ग सेमी', 'D) 144 वर्ग सेमी'] : ['A) 154 sq cm', 'B) 44 sq cm', 'C) 98 sq cm', 'D) 144 sq cm'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Medium'
      },
      {
        text: isHindi ? 'त्रिकोणमिति में, sin 30° + cos 60° का मान क्या होगा?' : 'In trigonometry, what is the value of sin 30° + cos 60°?',
        options: isHindi ? ['A) 1', 'B) 1/2', 'C) 0', 'D) 2'] : ['A) 1', 'B) 1/2', 'C) 0', 'D) 2'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      }
    ];
  } else if (subLower.includes('history') || subLower.includes('civics') || subLower.includes('geography') || subLower.includes('social') || subLower.includes('political')) {
    templates = [
      {
        text: isHindi ? 'फ्रांसीसी क्रांति (French Revolution) कब शुरू हुई थी?' : 'When did the French Revolution begin?',
        options: isHindi ? ['A) 1789', 'B) 1776', 'C) 1914', 'D) 1857'] : ['A) 1789', 'B) 1776', 'C) 1914', 'D) 1857'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      },
      {
        text: isHindi ? 'जल चक्र (Water Cycle) का संक्षिप्त वर्णन कीजिए।' : 'Briefly explain the process of the Water Cycle.',
        options: [],
        answer: isHindi ? 'जल चक्र में वाष्पीकरण, संघनन, वर्षण और अपवाह की प्रक्रिया शामिल है, जिससे जल चक्रवात चलता रहता है।' : 'The water cycle involves evaporation of water, condensation into clouds, precipitation as rain/snow, and runoff back into water bodies.',
        type: 'Short',
        marks: 3,
        difficulty: 'Medium'
      },
      {
        text: isHindi ? 'भारतीय लोकतंत्र की मुख्य विशेषताओं और इसकी चुनौतियों की व्याख्या कीजिए।' : 'Explain the main features and key challenges faced by Indian Democracy.',
        options: [],
        answer: isHindi ? 'भारतीय लोकतंत्र की मुख्य विशेषताएं हैं: सार्वभौमिक वयस्क मताधिकार, स्वतंत्र न्यायपालिका, बहुदलीय व्यवस्था, और धर्मनिरपेक्षता। चुनौतियाँ हैं: निरक्षरता, क्षेत्रीय असमानता, और भ्रष्टाचार।' : 'Features: Universal adult franchise, independent judiciary, multi-party system, federalism. Challenges: Illiteracy, regional disparity, communalism, and corruption.',
        type: 'Long',
        marks: 5,
        difficulty: 'Hard'
      },
      {
        text: isHindi ? 'भारत का प्रथम राष्ट्रीय उद्यान कौन सा है?' : 'Which is the first national park established in India?',
        options: isHindi ? ['A) जिम कॉर्बेट', 'B) काजीरंगा', 'C) गिर', 'D) कान्हा'] : ['A) Jim Corbett', 'B) Kaziranga', 'C) Gir', 'D) Kanha'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      }
    ];
  } else if (subLower.includes('english')) {
    templates = [
      {
        text: 'Identify the correct preposition: "The book is ___ the table."',
        options: ['A) on', 'B) at', 'C) in', 'D) over'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      },
      {
        text: 'Rewrite the following sentence in passive voice: "The teacher corrected the exam papers."',
        options: [],
        answer: 'Passive voice: "The exam papers were corrected by the teacher."',
        type: 'Short',
        marks: 2,
        difficulty: 'Medium'
      },
      {
        text: 'Write a short formal letter to your school Principal requesting three days of sick leave.',
        options: [],
        answer: 'The letter must follow formal structure: sender/recipient addresses, subject (Application for Sick Leave), formal greeting, body stating illness and duration, formal sign-off (Yours obediently).',
        type: 'Long',
        marks: 5,
        difficulty: 'Medium'
      },
      {
        text: 'Choose the word with the correct spelling:',
        options: ['A) Accommodation', 'B) Acomodation', 'C) Accomodation', 'D) Acommodation'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Hard'
      }
    ];
  } else if (subLower.includes('hindi') || subLower.includes('mil')) {
    templates = [
      {
        text: 'संज्ञा के मुख्य रूप से कितने भेद होते हैं?',
        options: ['A) तीन', 'B) पाँच', 'C) चार', 'D) छह'],
        answer: 'A',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      },
      {
        text: 'संधि की परिभाषा लिखिए तथा इसके प्रमुख भेदों के नाम बताइए।',
        options: [],
        answer: 'दो वर्णों के मेल से होने वाले विकार को संधि कहते हैं। इसके तीन मुख्य भेद हैं: स्वर संधि, व्यंजन संधि, और विसर्ग संधि।',
        type: 'Short',
        marks: 3,
        difficulty: 'Medium'
      },
      {
        text: 'निम्नलिखित मुहावरे का अर्थ लिखकर वाक्य में प्रयोग कीजिए: "अपने पैरों पर खड़ा होना"',
        options: [],
        answer: 'अर्थ: स्वावलंबी होना (आत्मनिर्भर होना)। वाक्य प्रयोग: शिक्षा समाप्त करने के बाद रमेश अपने पैरों पर खड़ा हो गया।',
        type: 'Short',
        marks: 2,
        difficulty: 'Easy'
      },
      {
        text: 'दिए गए विषय पर एक संक्षिप्त निबंध लिखिए: "विद्यार्थी जीवन और अनुशासन"',
        options: [],
        answer: 'निबंध में भूमिका, विद्यार्थी जीवन का महत्व, अनुशासन की आवश्यकता, अनुशासन से लाभ, और उपसंहार जैसे मुख्य बिंदु शामिल होने चाहिए।',
        type: 'Long',
        marks: 5,
        difficulty: 'Hard'
      }
    ];
  } else {
    // Default Science / Physics / Chemistry / Biology
    templates = [
      {
        text: isHindi ? 'प्रकाश संश्लेषण क्या है? इसकी रासायनिक अभिक्रिया लिखिए।' : 'What is photosynthesis? Write its balanced chemical equation.',
        options: [],
        answer: isHindi ? 'प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश का उपयोग करके कार्बन डाइऑक्साइड और पानी को ग्लूकोज और ऑक्सीजन में परिवर्तित करते हैं। समीकरण: 6CO2 + 6H2O -> C6H12O6 + 6O2' : 'Photosynthesis is the process by which green plants convert carbon dioxide and water into glucose and oxygen using sunlight. Equation: 6CO2 + 6H2O -> C6H12O6 + 6O2',
        type: 'Long',
        marks: 5,
        difficulty: 'Medium'
      },
      {
        text: isHindi ? 'निम्नलिखित में से कौन सा अम्ल आमाशय (Stomach) में स्रावित होता है?' : 'Which of the following acids is secreted in the stomach?',
        options: isHindi 
          ? ['A) सल्फ्यूरिक अम्ल', 'B) हाइड्रोक्लोरिक अम्ल', 'C) साइट्रिक अम्ल', 'D) नाइट्रिक अम्ल']
          : ['A) Sulfuric acid', 'B) Hydrochloric acid', 'C) Citric acid', 'D) Nitric acid'],
        answer: 'B',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      },
      {
        text: isHindi ? 'उदासीनीकरण (Neutralization) अभिक्रिया क्या है? एक उदाहरण दें।' : 'What is a neutralization reaction? Give one example.',
        options: [],
        answer: isHindi 
          ? 'अम्ल और क्षार की अभिक्रिया जिससे लवण और जल बनता है, उदासीनीकरण कहलाती है। उदाहरण: HCl + NaOH -> NaCl + H2O'
          : 'A chemical reaction in which an acid and a base react to form salt and water. Example: HCl + NaOH -> NaCl + H2O',
        type: 'Short',
        marks: 2,
        difficulty: 'Easy'
      },
      {
        text: isHindi ? 'कोशिका का "पावरहाउस" किसे कहा जाता है?' : 'Which organelle is known as the "Powerhouse of the Cell"?',
        options: isHindi
          ? ['A) राइबोसोम', 'B) गॉल्जीकाय', 'C) माइटोकॉन्ड्रिया', 'D) लाइसोसोम']
          : ['A) Ribosome', 'B) Golgi Apparatus', 'C) Mitochondria', 'D) Lysosome'],
        answer: 'C',
        type: 'MCQ',
        marks: 1,
        difficulty: 'Easy'
      },
      {
        text: isHindi ? 'ओम का नियम (Ohm\'s Law) समझाइए।' : 'State and explain Ohm\'s Law.',
        options: [],
        answer: isHindi 
          ? 'नियत ताप पर चालक से प्रवाहित धारा चालक के सिरों के विभवांतर के समानुपाती होती है (V = IR).'
          : 'Ohm\'s law states that the current flowing through a conductor is directly proportional to the voltage across its ends, provided temperature is constant (V = IR).',
        type: 'Short',
        marks: 3,
        difficulty: 'Medium'
      }
    ];
  }

  // Filter based on type if not 'Mixed'
  let filtered = templates;
  if (type !== 'Mixed') {
    filtered = templates.filter(q => q.type.toLowerCase() === type.toLowerCase());
  }

  // If filtered result is empty, use all templates
  if (filtered.length === 0) {
    filtered = templates;
  }

  // Slice/loop to desired count
  const results = [];
  for (let i = 0; i < count; i++) {
    const template = filtered[i % filtered.length];
    results.push({
      text: template.text, // Clean output without '[Fallback Mode]' prefix
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
