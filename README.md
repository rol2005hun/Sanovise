# 🚀 AI-Powered Health Consultation 🏥

## 📝 Description

Sanovise is a digital health assistant powered by artificial intelligence, designed to analyze user health data and provide meaningful insights. The types of data it analyzes include:

- ❤️ Average heart rate and blood pressure
- 📅 Date of birth, weight, height
- 💊 List of medications
- 📄 Medical records
- ⚠️ Symptoms, lifestyle factors, family history

The application processes this information to provide users with an overview of their health status and potential risks.

**⚠️ Note:** This application does *not* replace professional medical consultation. It is intended for informational purposes only.

**🌍 Multilingual Support:** Sanovise is available in several languages, including English, Hungarian, Spanish, French, German, Russian, Chinese, Arabic, and Hindi.

---

## 🛠️ Technology Stack

### **Frontend**
- **🖥️ Framework:** Nuxt.js (Vue.js-based)
- **📝 Language:** TypeScript
- **🎨 Styling:** SCSS
- **📱 Platforms:** Web, Desktop (via Tauri/Electron), Mobile (via Capacitor)

### **Backend**
- **🌐 Server:** Nuxt Nitro (built-in server API)
- **🧠 AI Model:** Integrated with Transformers.js, supporting Hugging Face models
- **📂 Data Handling:** JSON import/export

### **🚀 Hosting & Deployment**
- **Frontend:** Netlify + Cloudflare with a custom domain
- **Backend:** Google Cloud VM instance

---

## ✨ Features

- 📊 Health data analysis (e.g., blood pressure, heart rate, medications)
- 🤖 AI-based medical record processing
- 🏥 AI-powered health consultation and risk assessment
- 💾 JSON data saving, export & import functionality
- 📱 Mobile-ready & multi-platform support
- 🔁 Real-time response streaming via API

---

## 🎥 Demo Video & Feature Walkthrough

Curious how **Sanovise** works in action? Check out the official demo video for a full overview of the app's functionality and user experience:

📺 **Watch now**: [Meet Sanovise!](https://www.youtube.com/watch?v=1CuafcQSEeg)

### What the video covers:
- 🧠 AI model processing and user feedback
- 📱 Live form handling and interface tour
- 🌍 Multilingual usage demonstration
- 💾 JSON export/import features
- ⚠️ Health risk alerts and advisory system

---

## 📥 Installation & Usage

### **1️⃣ Clone the repository**
```bash
git clone https://github.com/rol2005hun/Sanovise.git
cd Sanovise
```

### **2️⃣ Install dependencies**
```bash
npm run install:all
```

### **3️⃣ Start the app**
```bash
cd app && npm run dev
```
The frontend will be available at **http://localhost:3000/**.

### **4️⃣ Backend API**
The backend API now runs inside the Nuxt app via Nitro, so no separate backend process is required.

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a new branch: `git checkout -b new-feature`
3. 📝 Commit your changes: `git commit -m "build: added feature X"`
4. 🚀 Push to the branch: `git push origin new-feature`
5. 🔃 Open a Pull Request

All contributions, feedback, and ideas are welcome!

---

## 📜 License

[MIT License](https://github.com/rol2005hun/Sanovise?tab=MIT-1-ov-file)

---

**👨‍💻 Created by:** ranzak

For any inquiries, feel free to reach out on GitHub or via [email](mailto:contact@ranzak.site)! 📩
