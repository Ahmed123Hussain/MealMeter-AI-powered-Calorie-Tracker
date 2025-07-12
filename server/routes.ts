import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import multer from "multer";
import { insertUserSchema, insertFoodEntrySchema, loginSchema, updateProfileSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Gemini API configuration
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = "YOUR API KEY";

// Gemini AI food recognition service
const geminiFoodRecognition = async (imageBuffer: Buffer) => {
  const base64Image = imageBuffer.toString("base64");

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Analyze this food image and return ONLY a valid JSON object with these keys:
"name", "calories", "protein", "carbs", "fat", "confidence".
Do NOT include any comments, explanations, or extra text.
Example:
{
  "name": "Rice",
  "calories": 130,
  "protein": 2.7,
  "carbs": 28,
  "fat": 0.3,
  "confidence": 0.95
}
`
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Gemini response:", response.data);

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("Gemini response missing text:", response.data);
      throw new Error("No food detected or Gemini API response format changed");
    }

    let result;
    try {
      // Remove triple backticks and optional "json" label
      const cleanText = text
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      result = JSON.parse(cleanText);
    } catch (err) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to parse Gemini response");
    }

    return result;
  } catch (err: any) {
    console.error("Gemini API error:", err.response?.data || err.message);
    throw new Error("Gemini API request failed");
  }
};

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          age: user.age,
          weight: user.weight,
          height: user.height,
          activityLevel: user.activityLevel,
          goal: user.goal,
          dailyCalorieGoal: user.dailyCalorieGoal
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.validateUser(loginData.email, loginData.password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          age: user.age,
          weight: user.weight,
          height: user.height,
          activityLevel: user.activityLevel,
          goal: user.goal,
          dailyCalorieGoal: user.dailyCalorieGoal
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Protected routes
  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel,
        goal: user.goal,
        dailyCalorieGoal: user.dailyCalorieGoal
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/auth/profile', authenticateToken, async (req: any, res) => {
    try {
      const updates = updateProfileSchema.parse(req.body);
      const user = await storage.updateUser(req.user.userId, updates);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel,
        goal: user.goal,
        dailyCalorieGoal: user.dailyCalorieGoal
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Food entry routes
  app.get('/api/food-entries', authenticateToken, async (req: any, res) => {
    try {
      const entries = await storage.getFoodEntriesByUser(req.user.userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/food-entries/today', authenticateToken, async (req: any, res) => {
    try {
      const today = new Date();
      const entries = await storage.getFoodEntriesByUserAndDate(req.user.userId, today);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/food-entries', authenticateToken, async (req: any, res) => {
    try {
      const entryData = insertFoodEntrySchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const entry = await storage.createFoodEntry(entryData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/food-entries/:id', authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFoodEntry(id, req.user.userId);
      
      if (!success) {
        return res.status(404).json({ message: 'Food entry not found' });
      }
      
      res.json({ message: 'Food entry deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // AI food recognition route
  app.post('/api/ai/analyze-food', authenticateToken, upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
      }

      const result = await geminiFoodRecognition(req.file.buffer);
      res.json(result);
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', authenticateToken, async (req: any, res) => {
    try {
      const today = new Date();
      const todayEntries = await storage.getFoodEntriesByUserAndDate(req.user.userId, today);
      
      const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
      const totalProtein = todayEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
      const totalCarbs = todayEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
      const totalFat = todayEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0);
      
      const user = await storage.getUser(req.user.userId);
      const calorieGoal = user?.dailyCalorieGoal || 2000;
      
      res.json({
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        calorieGoal,
        entries: todayEntries.length
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Weekly data for charts
  app.get('/api/dashboard/weekly', authenticateToken, async (req: any, res) => {
    try {
      const weeklyData = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const entries = await storage.getFoodEntriesByUserAndDate(req.user.userId, date);
        const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
        
        weeklyData.push({
          date: date.toISOString().split('T')[0],
          calories: totalCalories,
          day: date.toLocaleDateString('en-US', { weekday: 'short' })
        });
      }
      
      res.json(weeklyData);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
