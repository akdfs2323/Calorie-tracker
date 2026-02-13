'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, MessageCircle, Target, TrendingUp, Sparkles, Apple } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  const checkUser = async () => {
    const user = await getCurrentUser();
    if (user) {
      router.push('/dashboard');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl floating" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300/25 rounded-full blur-3xl floating" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logo/Badge */}
          <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full mb-8 animate-pulse-slow">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Nutrition Tracking</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Track Calories
            <br />
            <span className="text-gradient">With a Snap</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-light">
            ถ่ายรูปอาหาร AI จะวิเคราะห์แคลอรี่ให้คุณทันที พร้อมคำปรึกษาด้านโภชนาการ
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
              เริ่มใช้งานฟรี
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4">
              เข้าสู่ระบบ
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="card group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-gray-800">ถ่ายรูปวิเคราะห์</h3>
              <p className="text-gray-600">ใช้ AI วิเคราะห์แคลอรี่จากภาพอาหารทันที</p>
            </div>

            <div className="card group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-gray-800">AI ที่ปรึกษา</h3>
              <p className="text-gray-600">พูดคุยปรึกษาเรื่องโภชนาการกับ AI</p>
            </div>

            <div className="card group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2 text-gray-800">ตั้งเป้าหมาย</h3>
              <p className="text-gray-600">ติดตามความคืบหน้าสู่เป้าหมายของคุณ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16">
            ทำไมต้อง <span className="text-gradient">CalorieMate</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Apple className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">วิเคราะห์อาหารอัจฉริยะ</h3>
                  <p className="text-gray-600">ใช้ Google Gemini AI วิเคราะห์แคลอรี่ โปรตีน คาร์บ และไขมันจากภาพอาหาร</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">ติดตามความคืบหน้า</h3>
                  <p className="text-gray-600">ดูสถิติรายวัน รายสัปดาห์ และแนวโน้มการบริโภคแคลอรี่ของคุณ</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">คำแนะนำส่วนตัว</h3>
                  <p className="text-gray-600">รับคำปรึกษาด้านโภชนาการและการออกกำลังกายที่เหมาะกับคุณ</p>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <div className="aspect-square bg-gradient-to-br from-primary-200 via-accent-200 to-pink-200 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-2xl font-display font-bold text-gray-800">ใช้งานง่าย</p>
                  <p className="text-gray-600 mt-2">ถ่ายรูป → AI วิเคราะห์ → บันทึกทันที</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              พร้อมที่จะเริ่มต้น<span className="text-gradient">เส้นทางสุขภาพ</span>ของคุณแล้วหรือยัง?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              เข้าร่วมกับผู้ใช้หลายพันคนที่กำลังบรรลุเป้าหมายด้านสุขภาพ
            </p>
            <Link href="/signup" className="btn-primary text-lg px-12 py-4 inline-block">
              สมัครใช้งานฟรีวันนี้
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 CalorieMate. สร้างด้วย ❤️ และ AI</p>
        </div>
      </footer>
    </div>
  );
}
