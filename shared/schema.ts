import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  age: integer("age"),
  weight: real("weight"),
  height: real("height"),
  activityLevel: text("activity_level"),
  goal: text("goal"),
  dailyCalorieGoal: integer("daily_calorie_goal"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  foodName: text("food_name").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein"),
  carbs: real("carbs"),
  fat: real("fat"),
  imageUrl: text("image_url"),
  confidence: real("confidence"),
  mealType: text("meal_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  age: true,
  weight: true,
  height: true,
  activityLevel: true,
  goal: true,
  dailyCalorieGoal: true,
});

export const insertFoodEntrySchema = createInsertSchema(foodEntries).pick({
  userId: true,
  foodName: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  imageUrl: true,
  confidence: true,
  mealType: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateProfileSchema = insertUserSchema.omit({ password: true }).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
