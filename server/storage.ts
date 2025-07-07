import { users, foodEntries, type User, type InsertUser, type FoodEntry, type InsertFoodEntry, type UpdateProfileData } from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateProfileData): Promise<User | undefined>;
  validateUser(email: string, password: string): Promise<User | undefined>;

  // Food entry operations
  getFoodEntry(id: number): Promise<FoodEntry | undefined>;
  getFoodEntriesByUser(userId: number): Promise<FoodEntry[]>;
  getFoodEntriesByUserAndDate(userId: number, date: Date): Promise<FoodEntry[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  deleteFoodEntry(id: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private foodEntries: Map<number, FoodEntry>;
  private currentUserId: number;
  private currentFoodEntryId: number;

  constructor() {
    this.users = new Map();
    this.foodEntries = new Map();
    this.currentUserId = 1;
    this.currentFoodEntryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      password: hashedPassword,
      id,
      createdAt: new Date(),
      age: insertUser.age ?? null,
      weight: insertUser.weight ?? null,
      height: insertUser.height ?? null,
      activityLevel: insertUser.activityLevel ?? null,
      goal: insertUser.goal ?? null,
      dailyCalorieGoal: insertUser.dailyCalorieGoal ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: UpdateProfileData): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async validateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }

  async getFoodEntry(id: number): Promise<FoodEntry | undefined> {
    return this.foodEntries.get(id);
  }

  async getFoodEntriesByUser(userId: number): Promise<FoodEntry[]> {
    return Array.from(this.foodEntries.values()).filter(entry => entry.userId === userId);
  }

  async getFoodEntriesByUserAndDate(userId: number, date: Date): Promise<FoodEntry[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Array.from(this.foodEntries.values()).filter(entry => 
      entry.userId === userId && 
      entry.createdAt >= startOfDay && 
      entry.createdAt <= endOfDay
    );
  }

  async createFoodEntry(insertEntry: InsertFoodEntry): Promise<FoodEntry> {
    const id = this.currentFoodEntryId++;
    const entry: FoodEntry = {
      ...insertEntry,
      id,
      createdAt: new Date(),
      protein: insertEntry.protein ?? null,
      carbs: insertEntry.carbs ?? null,
      fat: insertEntry.fat ?? null,
      imageUrl: insertEntry.imageUrl ?? null,
      confidence: insertEntry.confidence ?? null,
      mealType: insertEntry.mealType ?? null,
    };
    this.foodEntries.set(id, entry);
    return entry;
  }

  async deleteFoodEntry(id: number, userId: number): Promise<boolean> {
    const entry = this.foodEntries.get(id);
    if (!entry || entry.userId !== userId) return false;

    this.foodEntries.delete(id);
    return true;
  }
}

export const storage = new MemStorage();
