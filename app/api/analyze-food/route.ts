import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImage } from '@/lib/huggingface';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'ไม่พบภาพที่ต้องการวิเคราะห์' },
        { status: 400 }
      );
    }

    // Image already includes data URL prefix
    const result = await analyzeFoodImage(image);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in analyze-food API:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการวิเคราะห์อาหาร' },
      { status: 500 }
    );
  }
}
