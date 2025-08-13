/**
 * Database caching service for performance optimization
 */

import type { UserProfile, QuizProgress, QuizAttempt, UserSession } from '../types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  memoryUsage: number;
}

export class DatabaseCache {
  private static instance: DatabaseCache | null = null;
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = { hits: 0, misses: 0, size: 0, memoryUsage: 0 };
  private maxSize = 1000; // Maximum number of entries
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  private constructor() {
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
    
    // Monitor memory usage every 30 seconds
    setInterval(() => this.updateMemoryStats(), 30000);
  }

  static getInstance(): DatabaseCache {
    if (!DatabaseCache.instance) {
      DatabaseCache.instance = new DatabaseCache();
    }
    return DatabaseCache.instance;
  }

  private generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
  }

  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.updateStats();
    }
  }

  private updateMemoryStats(): void {
    // Estimate memory usage
    let memoryUsage = 0;
    for (const [key, entry] of this.cache.entries()) {
      memoryUsage += key.length * 2; // String characters are 2 bytes
      memoryUsage += JSON.stringify(entry.data).length * 2;
      memoryUsage += 24; // Overhead for timestamp, ttl, etc.
    }

    this.stats.memoryUsage = memoryUsage;
    this.stats.size = this.cache.size;
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.updateMemoryStats();
  }

  private evictLRU(): void {
    if (this.cache.size === 0) return;

    // Find oldest entry (simple LRU)
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  public set<T>(key: string, data: T, ttl?: number): void {
    // Evict if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Update timestamp for LRU
    entry.timestamp = now;
    this.stats.hits++;
    return entry.data as T;
  }

  public invalidate(pattern: string): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.updateStats();
  }

  public clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, size: 0, memoryUsage: 0 };
  }

  public getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

    return {
      ...this.stats,
      hitRate,
    };
  }

  // Specific caching methods for different data types

  public cacheUserProfile(userId: string, profile: UserProfile, ttl?: number): void {
    const key = this.generateKey('user', userId);
    this.set(key, profile, ttl);
  }

  public getUserProfile(userId: string): UserProfile | null {
    const key = this.generateKey('user', userId);
    return this.get<UserProfile>(key);
  }

  public cacheUserProgress(userId: string, progress: QuizProgress[], ttl?: number): void {
    const key = this.generateKey('progress', userId);
    this.set(key, progress, ttl);
  }

  public getUserProgress(userId: string): QuizProgress[] | null {
    const key = this.generateKey('progress', userId);
    return this.get<QuizProgress[]>(key);
  }

  public cacheModuleProgress(userId: string, moduleId: string, progress: QuizProgress[], ttl?: number): void {
    const key = this.generateKey('progress', userId, moduleId);
    this.set(key, progress, ttl);
  }

  public getModuleProgress(userId: string, moduleId: string): QuizProgress[] | null {
    const key = this.generateKey('progress', userId, moduleId);
    return this.get<QuizProgress[]>(key);
  }

  public cacheUserAttempts(userId: string, attempts: QuizAttempt[], ttl?: number): void {
    const key = this.generateKey('attempts', userId);
    this.set(key, attempts, ttl);
  }

  public getUserAttempts(userId: string): QuizAttempt[] | null {
    const key = this.generateKey('attempts', userId);
    return this.get<QuizAttempt[]>(key);
  }

  public cacheUserSession(userId: string, session: UserSession, ttl?: number): void {
    const key = this.generateKey('session', userId);
    this.set(key, session, ttl);
  }

  public getUserSession(userId: string): UserSession | null {
    const key = this.generateKey('session', userId);
    return this.get<UserSession>(key);
  }

  public cacheUserStats(userId: string, stats: UserProfile['stats'], ttl?: number): void {
    const key = this.generateKey('stats', userId);
    this.set(key, stats, ttl || 60000); // 1 minute for stats
  }

  public getUserStats(userId: string): UserProfile['stats'] | null {
    const key = this.generateKey('stats', userId);
    return this.get<UserProfile['stats']>(key);
  }

  // Invalidation helpers
  public invalidateUser(userId: string): void {
    this.invalidate(`user:${userId}`);
    this.invalidate(`progress:${userId}`);
    this.invalidate(`attempts:${userId}`);
    this.invalidate(`session:${userId}`);
    this.invalidate(`stats:${userId}`);
  }

  public invalidateUserProgress(userId: string): void {
    this.invalidate(`progress:${userId}`);
    this.invalidate(`stats:${userId}`); // Stats depend on progress
  }

  public invalidateUserAttempts(userId: string): void {
    this.invalidate(`attempts:${userId}`);
    this.invalidate(`stats:${userId}`); // Stats depend on attempts
  }

  // Configuration
  public setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    
    // Evict excess entries if necessary
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
    
    this.updateStats();
  }

  public setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  // Export/import for debugging
  public export(): Record<string, any> {
    const exported: Record<string, any> = {};
    
    for (const [key, entry] of this.cache.entries()) {
      exported[key] = {
        data: entry.data,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        age: Date.now() - entry.timestamp,
      };
    }

    return exported;
  }

  public getMemoryUsageFormatted(): string {
    const bytes = this.stats.memoryUsage;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export const databaseCache = DatabaseCache.getInstance();

// Development helpers
if (process.env.NODE_ENV === 'development') {
  (window as any).dbCache = databaseCache;
  console.log('Database cache available at window.dbCache');
}