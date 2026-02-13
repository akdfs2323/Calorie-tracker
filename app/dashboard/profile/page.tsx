'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Scale, Target, TrendingDown, ArrowLeft, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getCurrentUser, getUserProfile, upsertUserProfile } from '@/lib/supabase';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    current_weight: 0,
    target_weight: 0,
    height: 0,
    age: 0,
    gender: 'other',
    activity_level: 'moderate',
  });
  const [loading, setLoading] = useState(true);
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
    await loadProfile(currentUser.id);
  };

  const loadProfile = async (userId: string) => {
    const { data } = await getUserProfile(userId);
    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setSaved(false);

    try {
      const profileData = {
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { error } = await upsertUserProfile(profileData);

      if (error) {
        alert('เกิดข้อผิดพลาดในการบันทึก');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  const calculateBMI = () => {
    if (profile.current_weight && profile.height) {
      const heightInMeters = profile.height / 100;
      return (profile.current_weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '0';
  };

  const weightDifference = () => {
    if (profile.current_weight && profile.target_weight) {
      return Math.abs(profile.current_weight - profile.target_weight).toFixed(1);
    }
    return '0';
  };

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
            <h1 className="font-display text-3xl font-bold">โปรไฟล์</h1>
            <p className="text-gray-600">ตั้งค่าเป้าหมายและข้อมูลส่วนตัว</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">น้ำหนักปัจจุบัน</p>
                <p className="font-display text-2xl font-bold text-gray-800">
                  {profile.current_weight || 0} <span className="text-base">กก.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">น้ำหนักเป้าหมาย</p>
                <p className="font-display text-2xl font-bold text-gray-800">
                  {profile.target_weight || 0} <span className="text-base">กก.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ต้องการลด/เพิ่ม</p>
                <p className="font-display text-2xl font-bold text-gray-800">
                  {weightDifference()} <span className="text-base">กก.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card">
          <h2 className="font-display text-2xl font-bold mb-6">ข้อมูลส่วนตัว</h2>

          <div className="space-y-6">
            {/* Name (Read-only from auth) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={user?.user_metadata?.full_name || ''}
                  disabled
                  className="input-field pl-12 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Current Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                น้ำหนักปัจจุบัน (กิโลกรัม)
              </label>
              <input
                type="number"
                value={profile.current_weight || ''}
                onChange={(e) =>
                  setProfile({ ...profile, current_weight: parseFloat(e.target.value) || 0 })
                }
                className="input-field"
                placeholder="60"
                step="0.1"
              />
            </div>

            {/* Target Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                น้ำหนักเป้าหมาย (กิโลกรัม)
              </label>
              <input
                type="number"
                value={profile.target_weight || ''}
                onChange={(e) =>
                  setProfile({ ...profile, target_weight: parseFloat(e.target.value) || 0 })
                }
                className="input-field"
                placeholder="55"
                step="0.1"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ส่วนสูง (เซนติเมตร)
              </label>
              <input
                type="number"
                value={profile.height || ''}
                onChange={(e) =>
                  setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })
                }
                className="input-field"
                placeholder="170"
                step="0.1"
              />
              {profile.current_weight && profile.height && (
                <p className="text-sm text-gray-600 mt-2">
                  BMI: <span className="font-semibold">{calculateBMI()}</span>
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                อายุ (ปี)
              </label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) =>
                  setProfile({ ...profile, age: parseInt(e.target.value) || 0 })
                }
                className="input-field"
                placeholder="25"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                เพศ
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'male', label: 'ชาย', emoji: '👨' },
                  { value: 'female', label: 'หญิง', emoji: '👩' },
                  { value: 'other', label: 'อื่นๆ', emoji: '🧑' },
                ].map((gender) => (
                  <button
                    key={gender.value}
                    onClick={() => setProfile({ ...profile, gender: gender.value as any })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      profile.gender === gender.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{gender.emoji}</div>
                    <div className="text-sm font-medium">{gender.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ระดับกิจกรรม
              </label>
              <div className="space-y-2">
                {[
                  { value: 'sedentary', label: 'นั่งทำงาน ไม่ค่อยได้ออกกำลังกาย' },
                  { value: 'light', label: 'ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์' },
                  { value: 'moderate', label: 'ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์' },
                  { value: 'active', label: 'ออกกำลังกายหนัก 6-7 วัน/สัปดาห์' },
                  { value: 'very_active', label: 'ออกกำลังกายหนักมาก หรือเป็นนักกีฬา' },
                ].map((activity) => (
                  <button
                    key={activity.value}
                    onClick={() => setProfile({ ...profile, activity_level: activity.value as any })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      profile.activity_level === activity.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {activity.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  กำลังบันทึก...
                </>
              ) : saved ? (
                <>
                  <Save className="w-5 h-5" />
                  บันทึกแล้ว ✓
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  บันทึกข้อมูล
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
