# 🥗 MealMeter – AI-Powered Calorie & Nutrition Tracker

MealMeter is an AI-powered full-stack web application that enables users to track their daily and weekly nutritional intake effortlessly. By simply uploading a photo of their meal, users receive instant feedback on calorie content and macronutrient breakdown using advanced food image recognition powered by **Gemini 1.5 Flash**.

---

## 🚀 Features

### 📸 AI Food Image Recognition
- Upload meal photos to identify:
  - Food Name
  - Calories
  - Protein, Carbs, Fats
- Confidence score with manual meal type selection (breakfast, lunch, etc.)

### 📊 Nutrition Dashboard
- Track daily calories and macronutrients
- Visualize weekly progress through charts
- Water intake tracker included

### 👤 User Profile
- Set custom calorie/macro goals
- View & edit food logs
- Profile management

### 🔐 Authentication
- Secure JWT-based login & signup
- Session management for data privacy

---

## 🧠 How It Works

1. **Image Upload**  
   - Users upload a food image (PNG/JPG/GIF, max 10MB)

2. **AI Integration**  
   - Image is sent to **Gemini 1.5 Flash** via API  
   - AI returns food name, estimated nutrition, and confidence level

3. **Data Handling**  
   - Nutritional data is logged into **MongoDB**
   - Displayed dynamically on the user’s dashboard

---

## 🧪 Tech Stack

| Layer           | Technologies Used                          |
|----------------|---------------------------------------------|
| Frontend        | React.js, Tailwind CSS                     |
| Backend         | Node.js, Express.js                        |
| Database        | MongoDB (Mongoose ORM)                     |
| AI Integration  | Gemini 1.5 Flash API                       |
| Auth            | JWT-based user authentication              |
| Image Upload    | File handling with compression             |

---

## 📷 UI Snapshots

- 📊 Dashboard with daily stats & graphs  
- 📁 Upload page with AI analysis
- <img width="1623" height="870" alt="image" src="https://github.com/user-attachments/assets/6bca2a1a-3b93-4bf5-a6da-36cc8d036d2a" />
<img width="1623" height="870" alt="image" src="https://github.com/user-attachments/assets/7ce888e4-ce1c-47ad-84d0-6ad3608f923f" />

- 🧍 Profile with log history & preferences  

---

## 📈 Impact

- Encourages mindful eating and self-monitoring
- Reduces the effort of manual calorie logging
- Empowers users to stay on top of fitness goals

---

## 🛠️ Future Enhancements

- Integration with **wearables** (Fitbit, Apple Watch)
- Barcode scanner for packaged food
- AI meal suggestions and diet plans
- Community-based food sharing & logging

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mealmeter.git
cd mealmeter
````

### 2. Install Dependencies

```bash
npm install       # For frontend (React)
cd backend
npm install       # For backend (Node.js)
```

### 3. Set Up Environment Variables

Create a `.env` file in the `/backend` directory and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the App

```bash
# Start backend
cd backend
npm run dev

# In another terminal, start frontend
cd frontend
npm start
```

---

## 🤝 Contributions

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

MIT License 

---

## 🔗 Connect

Built with ❤️ by AZH

```

---

Any projects or for sales connect me @ - ahmedibnzubair@gmail.com
```
