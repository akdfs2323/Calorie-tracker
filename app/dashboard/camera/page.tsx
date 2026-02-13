'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2, Check, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getCurrentUser, addCalorieEntry } from '@/lib/supabase';
import { FoodAnalysisResult } from '@/types';

export default function CameraPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageBase64: string) => {
    setAnalyzing(true);
    setResult(null);
    setSaved(false);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการวิเคราะห์');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('เกิดข้อผิดพลาดในการวิเคราะห์อาหาร');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;

    setSaving(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const entry = {
        user_id: user.id,
        food_name: result.foodName,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        meal_type: mealType,
        entry_date: today,
        image_url: imagePreview,
      };

      const { error } = await addCalorieEntry(entry);

      if (error) {
        alert('เกิดข้อผิดพลาดในการบันทึก');
        return;
      }

      setSaved(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setImagePreview('');
    setResult(null);
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <div className="pt-24 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/80"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="font-display text-3xl font-bold">วิเคราะห์อาหาร</h1>
            <p className="text-gray-600">ถ่ายรูปหรืออัปโหลดภาพอาหาร</p>
          </div>
        </div>

        {/* Upload Section */}
        {!imagePreview && (
          <div className="card">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">เลือกภาพอาหาร</h3>
              <p className="text-gray-600 mb-8">AI จะวิเคราะห์แคลอรี่และโภชนาการให้คุณ</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                เลือกภาพ
              </button>
            </div>
          </div>
        )}

        {/* Analysis Section */}
        {imagePreview && (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="card">
              <img
                src={imagePreview}
                alt="Food preview"
                className="w-full h-64 object-cover rounded-2xl mb-4"
              />
              
              {analyzing && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">กำลังวิเคราะห์อาหาร...</p>
                </div>
              )}

              {result && !analyzing && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-gray-800 mb-2">
                      {result.foodName}
                    </h3>
                    <p className="text-gray-600">{result.description}</p>
                  </div>

                  {/* Nutrition Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-xl">
                      <div className="text-3xl mb-2">🔥</div>
                      <p className="text-sm text-gray-600">แคลอรี่</p>
                      <p className="font-display text-2xl font-bold text-primary-600">
                        {result.calories}
                      </p>
                      <p className="text-xs text-gray-500">kcal</p>
                    </div>

                    <div className="glass p-4 rounded-xl">
                      <div className="text-3xl mb-2">💪</div>
                      <p className="text-sm text-gray-600">โปรตีน</p>
                      <p className="font-display text-2xl font-bold text-blue-600">
                        {result.protein.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">กรัม</p>
                    </div>

                    <div className="glass p-4 rounded-xl">
                      <div className="text-3xl mb-2">🍚</div>
                      <p className="text-sm text-gray-600">คาร์บ</p>
                      <p className="font-display text-2xl font-bold text-green-600">
                        {result.carbs.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">กรัม</p>
                    </div>

                    <div className="glass p-4 rounded-xl">
                      <div className="text-3xl mb-2">🥑</div>
                      <p className="text-sm text-gray-600">ไขมัน</p>
                      <p className="font-display text-2xl font-bold text-yellow-600">
                        {result.fat.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">กรัม</p>
                    </div>
                  </div>

                  {/* Meal Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      เลือกมื้ออาหาร
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: 'breakfast', label: 'เช้า', emoji: '🍳' },
                        { value: 'lunch', label: 'กลางวัน', emoji: '🍱' },
                        { value: 'dinner', label: 'เย็น', emoji: '🍽️' },
                        { value: 'snack', label: 'ของว่าง', emoji: '🍪' },
                      ].map((meal) => (
                        <button
                          key={meal.value}
                          onClick={() => setMealType(meal.value as any)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            mealType === meal.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{meal.emoji}</div>
                          <div className="text-xs font-medium">{meal.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="btn-secondary flex-1"
                    >
                      ถ่ายใหม่
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || saved}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          กำลังบันทึก...
                        </>
                      ) : saved ? (
                        <>
                          <Check className="w-5 h-5" />
                          บันทึกแล้ว
                        </>
                      ) : (
                        'บันทึก'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
