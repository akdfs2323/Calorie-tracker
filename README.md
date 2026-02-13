# CalorieMate - AI-Powered Calorie Tracker 🔥

เว็บแอพพลิเคชั่นติดตามแคลอรี่ด้วย AI ที่ใช้ Google Gemini วิเคราะห์อาหารจากภาพ พร้อมระบบแชทบอทให้คำปรึกษาด้านโภชนาการ

## ✨ Features

- 📸 **ถ่ายรูปวิเคราะห์** - ใช้ AI วิเคราะห์แคลอรี่ โปรตีน คาร์บ และไขมันจากภาพอาหาร (Hugging Face - ฟรี!)
- 💬 **AI Chatbot** - พูดคุยปรึกษาเรื่องโภชนาการและการออกกำลังกายกับ AI
- 🎯 **ตั้งเป้าหมาย** - กำหนดน้ำหนักเป้าหมายและติดตามความคืบหน้า
- 📊 **สถิติรายวัน** - ดูสรุปแคลอรี่และโภชนาการที่บริโภคในแต่ละวัน
- 👤 **โปรไฟล์** - จัดการข้อมูลส่วนตัวและเป้าหมาย
- 🔐 **Authentication** - ระบบ Login/Signup/Logout ด้วย Supabase Auth

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Hugging Face API (FREE! 🤗)
  - Vision: Salesforce/blip-image-captioning-large
  - Chat: meta-llama/Llama-3.2-3B-Instruct
- **Authentication**: Supabase Auth
- **Animation**: Framer Motion

## 📦 Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd calorie-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. ไปที่ [Supabase](https://supabase.com/) และสร้างโปรเจคใหม่
2. ใน SQL Editor ให้รัน SQL ที่อยู่ในไฟล์ `supabase-schema.sql`
3. ไปที่ Settings > API และคัดลอก:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon/public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 4. Setup Hugging Face API

1. ไปที่ [Hugging Face](https://huggingface.co/settings/tokens)
2. สร้าง API Token (Read access)
3. คัดลอก API Token

**หมายเหตุ**: Hugging Face ฟรี 100% ไม่ต้องใส่บัตรเครดิต!

### 5. Environment Variables

สร้างไฟล์ `.env.local` และใส่ค่าต่อไปนี้:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Hugging Face API Configuration
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### 6. Run Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
calorie-tracker/
├── app/
│   ├── api/                 # API routes
│   │   ├── analyze-food/    # Food analysis endpoint
│   │   └── chat/            # Chat endpoint
│   ├── dashboard/           # Dashboard pages
│   │   ├── camera/          # Food scanning page
│   │   ├── chat/            # AI chat page
│   │   └── profile/         # Profile page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   └── Navbar.tsx           # Navigation bar
├── lib/                     # Utilities
│   ├── supabase.ts          # Supabase client & helpers
│   └── gemini.ts            # Gemini AI integration
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
├── .env.local               # Environment variables (create this)
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── supabase-schema.sql      # Database schema
```

## 🎨 Design Features

- **สีสันสดใส**: ใช้โทนสี Orange, Pink, และ Purple
- **Glassmorphism**: Effect แก้วโปร่งแสง
- **Smooth Animations**: การเคลื่อนไหวที่นุ่มนวล
- **Gradient Backgrounds**: พื้นหลังแบบ Gradient Mesh
- **Custom Fonts**: Poppins (Display) และ DM Sans (Body)
- **Responsive Design**: รองรับทุกขนาดหน้าจอ

## 🔑 Key Features Explanation

### 1. Food Analysis (ถ่ายรูปวิเคราะห์)
- ถ่ายรูปหรืออัปโหลดภาพอาหาร
- AI วิเคราะห์แคลอรี่และโภชนาการ
- เลือกมื้ออาหาร (เช้า/กลางวัน/เย็น/ของว่าง)
- บันทึกลงฐานข้อมูล

### 2. AI Chat (แชทบอท)
- พูดคุยกับ AI เรื่องโภชนาการ
- ขอคำแนะนำด้านการออกกำลังกาย
- บันทึกประวัติการสนทนา

### 3. Profile (โปรไฟล์)
- ตั้งค่าน้ำหนักปัจจุบันและเป้าหมาย
- กรอกข้อมูลส่วนตัว (ส่วนสูง, อายุ, เพศ)
- เลือกระดับกิจกรรม
- คำนวณ BMI อัตโนมัติ

### 4. Dashboard (หน้าหลัก)
- สรุปแคลอรี่และโภชนาการวันนี้
- แสดงความคืบหน้าต่อเป้าหมาย
- รายการมื้ออาหารทั้งหมด

## 🔒 Security

- Row Level Security (RLS) enabled บน Supabase
- ผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตัวเอง
- API Keys ถูกเก็บใน environment variables
- HTTPS only in production

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Author

Created with ❤️ and AI

---

**หมายเหตุ**: อย่าลืมเพิ่ม `.env.local` ไว้ใน `.gitignore` เพื่อความปลอดภัย!
