import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/huggingface';

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'ไม่พบข้อความ' },
        { status: 400 }
      );
    }

    const response = await chatWithAI(message, chatHistory || []);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการพูดคุยกับ AI' },
      { status: 500 }
    );
  }
}
