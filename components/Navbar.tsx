'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Camera, MessageCircle, User, LogOut, Sparkles } from 'lucide-react';
import { signOut } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gradient hidden sm:block">
              CalorieMate
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700 font-medium">หน้าหลัก</span>
            </Link>

            <Link
              href="/dashboard/camera"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              <Camera className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700 font-medium">ถ่ายรูป</span>
            </Link>

            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700 font-medium">แชท</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700 font-medium">โปรไฟล์</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
