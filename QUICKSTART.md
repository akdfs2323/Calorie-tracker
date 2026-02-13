# ⚡ Quick Start Guide - CalorieMate

## 🚀 Get Started in 5 Minutes!

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Setup Supabase (2 min)
1. Go to [supabase.com](https://supabase.com/) → Create new project
2. Copy SQL from `supabase-schema.sql` → Run in SQL Editor
3. Go to Settings → API → Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon key: eyJhbGci...
```

### Step 3: Setup Hugging Face API (1 min)
1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token" → Name: calorie-tracker → Type: Read
3. Copy the token (starts with `hf_`)

**FREE forever! No credit card needed! 🎉**

### Step 4: Create .env.local (30 sec)
Create `.env.local` file in root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_supabase_anon_key_here
HUGGINGFACE_API_KEY=paste_your_huggingface_token_here
```

### Step 5: Run! (30 sec)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📝 Quick Test

1. Click "สมัครใช้งานฟรี" (Sign up)
2. Fill in: Name, Email, Password
3. Click "ตั้งค่าโปรไฟล์" (Setup profile)
4. Fill in: Weight (60), Target (55), Height (170)
5. Click "ถ่ายรูปอาหาร" (Take photo) → Upload food image
6. AI will analyze → Click "บันทึก" (Save)
7. See your calorie dashboard! ✨

---

## 🎯 What You Get

✅ **AI Food Analysis** - Upload food photo → Get calories instantly  
✅ **AI Chatbot** - Ask nutrition questions  
✅ **Daily Tracking** - Track calories, protein, carbs, fat  
✅ **Goal Setting** - Set weight goals and track progress  
✅ **Beautiful UI** - Modern glassmorphism design  

---

## 🐛 Common Issues

### "Supabase client error"
→ Check `.env.local` file exists and has correct values

### "API key not valid"
→ Check Gemini API key is correct

### "Cannot find module"
→ Run `npm install` again

### Build errors
→ Delete `.next` folder and run `npm run dev` again

---

## 📚 Next Steps

- Read `SETUP_GUIDE.md` for detailed setup
- Check `PROJECT_STRUCTURE.md` for code organization
- See `README.md` for features overview

---

## 🎨 Customize

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: { ... },  // Your primary color
  accent: { ... },   // Your accent color
}
```

### Change Fonts
Edit `app/layout.tsx`:
```ts
const yourFont = YourFont({ ... });
```

---

## 🚢 Deploy to Production

### Using Vercel (Recommended):
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (same as .env.local)
5. Deploy! 🚀

---

## 💡 Pro Tips

🔥 **Food Analysis**: Use clear, well-lit photos for best results  
💬 **Chatbot**: Ask in Thai for better responses  
📊 **Tracking**: Log meals consistently for accurate data  
🎯 **Goals**: Set realistic targets (0.5-1kg per week)  

---

## 📞 Need Help?

- Check documentation files
- Search issues on GitHub
- Visit [Supabase docs](https://supabase.com/docs)
- Visit [Gemini docs](https://ai.google.dev/docs)

---

**Happy tracking! 🎉**

Made with ❤️ and AI
