# 🚀 QUICK START - Push to GitHub & Deploy

## 3-Step Process (< 10 minutes)

### **Step 1: Create GitHub Repository**
Go to https://github.com/new and create repository named `MashallahFurniture`

### **Step 2: Push Your Code**
```powershell
cd c:\Users\nyvra\Downloads\MashallahFurniture\MashallahFurniture

git remote add origin https://github.com/YOUR_USERNAME/MashallahFurniture.git
git push -u origin main
```

### **Step 3: Deploy to Vercel** 
```powershell
npm install -g vercel
vercel --prod
```

**Done!** Your site is now live! 🎉

---

## Environment Setup (.env)

Copy `.env.example` to `.env` and fill in your values:

```bash
VITE_API_URL=https://your-api.com
VITE_EMAILJS_SERVICE_ID=your_id
VITE_EMAILJS_TEMPLATE_ID=your_id
VITE_EMAILJS_USER_ID=your_id
```

---

## Current Status

✅ Git initialized  
✅ 71 files committed  
✅ Branch: main  
✅ Ready for GitHub push  

**Next:** Create GitHub repo and push code!
