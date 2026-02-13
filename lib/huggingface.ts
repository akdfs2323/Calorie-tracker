/**
 * Analyze food image using Together.ai Llama Vision (ฟรี $25!)
 */
export async function analyzeFoodImage(imageBase64: string) {
  try {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error('TOGETHER_API_KEY is not set in environment variables');
    }

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this food in simple English (just the name, like "fried rice with chicken" or "pad thai"). Be brief and specific:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Together.ai Error:', errorData);
      throw new Error(`Together.ai Error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    const foodDescription = result.choices[0].message.content.trim();
    
    console.log('Food detected:', foodDescription);
    
    // ใช้ database คํานวณโภชนาการ
    const nutrition = estimateNutritionFromDescription(foodDescription);

    return {
      foodName: foodDescription,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      description: `อาหารที่ตรวจพบ: ${foodDescription}`,
    };

  } catch (error) {
    console.error('Error analyzing food:', error);
    
    return {
      foodName: 'ไม่สามารถระบุอาหารได้',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      description: 'ไม่สามารถวิเคราะห์อาหารได้ กรุณาลองใหม่',
    };
  }
}

/**
 * Chat with AI using Groq (ฟรีตลอดไป!)
 */
export async function chatWithAI(userMessage: string, chatHistory: any[] = []) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    const systemPrompt = `คุณคือผู้ช่วยด้านโภชนาการและสุขภาพที่ให้คำแนะนำเป็นภาษาไทย คุณช่วยเหลือผู้ใช้ในเรื่อง:
- คำแนะนำด้านโภชนาการและการกินอาหารเพื่อสุขภาพ
- การนับแคลอรี่และวางแผนมื้ออาหาร
- คำแนะนำการออกกำลังกาย
- กลยุทธ์การจัดการน้ำหนัก
- กำลังใจและการสนับสนุน

ตอบเป็นภาษาไทยที่เป็นมิตร ให้กำลังใจ และให้คำแนะนำที่มีหลักฐานรองรับ คำตอบควรกระชับและนำไปปฏิบัติได้จริง`;

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    chatHistory.slice(-5).forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    messages.push({
      role: 'user',
      content: userMessage
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error(`Groq API Error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();

  } catch (error) {
    console.error('Error in Groq chat:', error);
    return 'ขออภัยครับ ขณะนี้ระบบไม่สามารถตอบกลับได้ กรุณาลองใหม่อีกครั้งในภายหลัง';
  }
}

function estimateNutritionFromDescription(description: string): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const lowercaseDesc = description.toLowerCase();

  const nutritionDatabase: Record<string, any> = {
    // ข้าว
    'rice': { calories: 200, protein: 4, carbs: 45, fat: 0.5 },
    'ข้าว': { calories: 200, protein: 4, carbs: 45, fat: 0.5 },
    'fried rice': { calories: 250, protein: 6, carbs: 40, fat: 8 },
    'ข้าวผัด': { calories: 250, protein: 6, carbs: 40, fat: 8 },
    'steamed rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    
    // เนื้อสัตว์
    'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    'ไก่': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    'pork': { calories: 242, protein: 27, carbs: 0, fat: 14 },
    'หมู': { calories: 242, protein: 27, carbs: 0, fat: 14 },
    'beef': { calories: 250, protein: 26, carbs: 0, fat: 15 },
    'เนื้อ': { calories: 250, protein: 26, carbs: 0, fat: 15 },
    'fish': { calories: 140, protein: 26, carbs: 0, fat: 3 },
    'ปลา': { calories: 140, protein: 26, carbs: 0, fat: 3 },
    'shrimp': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
    'กุ้ง': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
    
    // ไข่
    'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    'ไข่': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    'omelette': { calories: 154, protein: 11, carbs: 1, fat: 12 },
    
    // เส้น
    'noodle': { calories: 220, protein: 8, carbs: 43, fat: 1.3 },
    'ก๋วยเตี๋ยว': { calories: 220, protein: 8, carbs: 43, fat: 1.3 },
    'pasta': { calories: 200, protein: 7, carbs: 42, fat: 1.5 },
    'pad thai': { calories: 300, protein: 12, carbs: 40, fat: 12 },
    'ผัดไทย': { calories: 300, protein: 12, carbs: 40, fat: 12 },
    'ramen': { calories: 380, protein: 10, carbs: 55, fat: 14 },
    'spaghetti': { calories: 200, protein: 7, carbs: 42, fat: 1.5 },
    
    // ผัก
    'vegetable': { calories: 50, protein: 2, carbs: 10, fat: 0.3 },
    'ผัก': { calories: 50, protein: 2, carbs: 10, fat: 0.3 },
    'salad': { calories: 100, protein: 5, carbs: 10, fat: 5 },
    'สลัด': { calories: 100, protein: 5, carbs: 10, fat: 5 },
    'broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
    
    // ผลไม้
    'fruit': { calories: 60, protein: 1, carbs: 15, fat: 0.2 },
    'ผลไม้': { calories: 60, protein: 1, carbs: 15, fat: 0.2 },
    'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    'กล้วย': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    'แอปเปิล': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
    'mango': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
    'มะม่วง': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
    
    // Fast food
    'pizza': { calories: 285, protein: 12, carbs: 36, fat: 10 },
    'พิซซ่า': { calories: 285, protein: 12, carbs: 36, fat: 10 },
    'burger': { calories: 354, protein: 20, carbs: 30, fat: 17 },
    'เบอร์เกอร์': { calories: 354, protein: 20, carbs: 30, fat: 17 },
    'french fries': { calories: 312, protein: 3.4, carbs: 41, fat: 15 },
    'fries': { calories: 312, protein: 3.4, carbs: 41, fat: 15 },
    'hot dog': { calories: 290, protein: 11, carbs: 24, fat: 17 },
    
    // ซุป
    'soup': { calories: 120, protein: 6, carbs: 15, fat: 4 },
    'ต้มยำ': { calories: 120, protein: 6, carbs: 15, fat: 4 },
    'tom yum': { calories: 120, protein: 6, carbs: 15, fat: 4 },
    
    // ขนมปัง
    'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
    'ขนมปัง': { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
    'sandwich': { calories: 300, protein: 15, carbs: 35, fat: 12 },
    'แซนด์วิช': { calories: 300, protein: 15, carbs: 35, fat: 12 },
    'toast': { calories: 79, protein: 2.4, carbs: 15, fat: 1 },
    
    // อาหารไทย
    'somtam': { calories: 150, protein: 5, carbs: 25, fat: 4 },
    'ส้มตำ': { calories: 150, protein: 5, carbs: 25, fat: 4 },
    'papaya salad': { calories: 150, protein: 5, carbs: 25, fat: 4 },
    'green curry': { calories: 180, protein: 8, carbs: 12, fat: 12 },
    'แกงเขียวหวาน': { calories: 180, protein: 8, carbs: 12, fat: 12 },
    'massaman': { calories: 220, protein: 10, carbs: 15, fat: 15 },
    'มัสมั่น': { calories: 220, protein: 10, carbs: 15, fat: 15 },
    'basil': { calories: 180, protein: 20, carbs: 12, fat: 8 },
    'กะเพรา': { calories: 180, protein: 20, carbs: 12, fat: 8 },
    'pad krapow': { calories: 180, protein: 20, carbs: 12, fat: 8 },
    'satay': { calories: 200, protein: 18, carbs: 8, fat: 12 },
    'สะเต๊ะ': { calories: 200, protein: 18, carbs: 8, fat: 12 },
    
    // เครื่องดื่ม
    'coffee': { calories: 2, protein: 0.3, carbs: 0, fat: 0 },
    'กาแฟ': { calories: 2, protein: 0.3, carbs: 0, fat: 0 },
    'milk tea': { calories: 220, protein: 4, carbs: 40, fat: 6 },
    'ชานม': { calories: 220, protein: 4, carbs: 40, fat: 6 },
    'smoothie': { calories: 150, protein: 3, carbs: 30, fat: 2 },
    'juice': { calories: 110, protein: 1, carbs: 26, fat: 0.3 },
    
    // ขนม
    'cake': { calories: 350, protein: 5, carbs: 50, fat: 15 },
    'เค้ก': { calories: 350, protein: 5, carbs: 50, fat: 15 },
    'cookie': { calories: 140, protein: 2, carbs: 18, fat: 7 },
    'ice cream': { calories: 207, protein: 3.5, carbs: 24, fat: 11 },
    'ไอศกรีม': { calories: 207, protein: 3.5, carbs: 24, fat: 11 },
    'donut': { calories: 290, protein: 4, carbs: 33, fat: 16 },
    'โดนัท': { calories: 290, protein: 4, carbs: 33, fat: 16 },
  };

  for (const [food, nutrition] of Object.entries(nutritionDatabase)) {
    if (lowercaseDesc.includes(food)) {
      return nutrition;
    }
  }

  return {
    calories: 200,
    protein: 10,
    carbs: 25,
    fat: 8,
  };
}