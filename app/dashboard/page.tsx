'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, MessageCircle, TrendingUp, Target, Calendar, Apple, Flame } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getCurrentUser, getUserProfile, getCalorieEntries } from '@/lib/supabase';
import { CalorieEntry, UserProfile } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayEntries, setTodayEntries] = useState<CalorieEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    await loadData(currentUser.id);
  };

  const loadData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await getUserProfile(userId);
      setProfile(profileData);

      // Load today's entries
      const today = new Date().toISOString().split('T')[0];
      const { data: entries } = await getCalorieEntries(userId, today);
      setTodayEntries(entries || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const todayProtein = todayEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const todayCarbs = todayEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const todayFat = todayEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);

  // Calculate recommended calories (simple formula)
  const recommendedCalories = profile ? 2000 : 2000; // You can implement a more complex formula
  const calorieProgress = (todayCalories / recommendedCalories) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <div className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            สวัสดี, <span className="text-gradient">{user?.user_metadata?.full_name || 'User'}</span>
          </h1>
          <p className="text-gray-600 text-lg">มาดูความคืบหน้าของคุณวันนี้กันเถอะ</p>
        </div>

        {/* Profile Setup Reminder */}
        {!profile && (
          <div className="card bg-gradient-to-r from-primary-500 to-accent-500 text-white mb-8 p-6">
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold mb-2">ตั้งค่าโปรไฟล์ของคุณ</h3>
                <p className="mb-4 opacity-90">เพิ่มข้อมูลส่วนตัวเพื่อรับคำแนะนำที่เหมาะกับคุณ</p>
                <Link href="/dashboard/profile" className="inline-block bg-white text-primary-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  ตั้งค่าเลย
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">แคลอรี่วันนี้</h3>
            <p className="font-display text-3xl font-bold text-gray-800">{todayCalories.toFixed(0)}</p>
            <p className="text-sm text-gray-500 mt-1">จาก {recommendedCalories} kcal</p>
          </div>

          <div className="card group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">โปรตีน</h3>
            <p className="font-display text-3xl font-bold text-gray-800">{todayProtein.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-1">กรัม</p>
          </div>

          <div className="card group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">🍚</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">คาร์โบไฮเดรต</h3>
            <p className="font-display text-3xl font-bold text-gray-800">{todayCarbs.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-1">กรัม</p>
          </div>

          <div className="card group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl">🥑</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">ไขมัน</h3>
            <p className="font-display text-3xl font-bold text-gray-800">{todayFat.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-1">กรัม</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold">ความคืบหน้าวันนี้</h3>
            <span className="text-sm font-semibold text-primary-600">
              {Math.min(calorieProgress, 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {calorieProgress < 100
              ? `เหลืออีก ${(recommendedCalories - todayCalories).toFixed(0)} แคลอรี่`
              : 'ถึงเป้าหมายแล้ว!'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/dashboard/camera" className="card group hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-1">ถ่ายรูปอาหาร</h3>
                <p className="text-gray-600">วิเคราะห์แคลอรี่ด้วย AI</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/chat" className="card group hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-1">ปรึกษา AI</h3>
                <p className="text-gray-600">รับคำแนะนำด้านโภชนาการ</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Today's Meals */}
        <div className="card">
          <h3 className="font-display text-2xl font-bold mb-6">มื้ออาหารวันนี้</h3>

          {todayEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-600 mb-4">ยังไม่มีบันทึกมื้ออาหาร</p>
              <Link href="/dashboard/camera" className="btn-primary inline-block">
                เพิ่มมื้ออาหาร
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {todayEntries.map((entry) => (
                <div key={entry.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-pink-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">
                        {entry.meal_type === 'breakfast' ? '🍳' : 
                         entry.meal_type === 'lunch' ? '🍱' :
                         entry.meal_type === 'dinner' ? '🍽️' : '🍪'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{entry.food_name}</h4>
                      <p className="text-sm text-gray-600">
                        {entry.meal_type === 'breakfast' ? 'มื้อเช้า' :
                         entry.meal_type === 'lunch' ? 'มื้อกลางวัน' :
                         entry.meal_type === 'dinner' ? 'มื้อเย็น' : 'ของว่าง'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-primary-600">{entry.calories}</p>
                    <p className="text-sm text-gray-600">kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
