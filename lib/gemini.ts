import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeFoodImage(imageBase64: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this food image and provide detailed nutritional information in JSON format.
    
    Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
    {
      "foodName": "name of the food/dish",
      "calories": estimated calories (number),
      "protein": estimated protein in grams (number),
      "carbs": estimated carbohydrates in grams (number),
      "fat": estimated fat in grams (number),
      "description": "brief description of the food and portion size"
    }
    
    If you cannot identify the food clearly, return:
    {
      "foodName": "Unknown",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0,
      "description": "Unable to identify food in image"
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Parse and validate the JSON
    const parsed = JSON.parse(cleanedText);
    
    return {
      foodName: parsed.foodName || 'Unknown',
      calories: Number(parsed.calories) || 0,
      protein: Number(parsed.protein) || 0,
      carbs: Number(parsed.carbs) || 0,
      fat: Number(parsed.fat) || 0,
      description: parsed.description || 'No description available',
    };
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw new Error('Failed to analyze food image');
  }
}

export async function chatWithAI(userMessage: string, chatHistory: any[] = []) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build conversation context
    const context = `You are a helpful nutrition and fitness AI assistant. You help users with:
    - Nutrition advice and healthy eating tips
    - Calorie counting and meal planning
    - Exercise recommendations
    - Weight management strategies
    - Motivation and support
    
    Be friendly, supportive, and provide evidence-based advice. Keep responses concise and actionable.`;

    // Convert chat history to Gemini format
    const history = chatHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: context }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I\'m here to help you with nutrition, fitness, and wellness advice. How can I assist you today?' }],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw new Error('Failed to get AI response');
  }
}
