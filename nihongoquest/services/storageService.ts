
import { KanjiData, KanaData, UserProgress, UserState, VocabularyItem, RegisterData } from '../types';
import { SEED_KANJI, SEED_KANA, SEED_VOCABULARY } from '../constants';

const STORAGE_KEYS = {
  CURRENT_USER: 'nihongoquest_current_user',
  USERS_DB: 'nihongoquest_users_db', // Simulating a database
  PROGRESS: 'nihongoquest_progress',
};

// Mock Backend API Service
export const storageService = {
  // --- Auth ---

  // Helper to get the "Database" of users
  getUsersDB: (): UserState[] => {
    const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return db ? JSON.parse(db) : [];
  },

  saveUsersDB: (users: UserState[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  },

  getUser: (): UserState | null => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  },

  saveUserSession: (user: UserState) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  register: async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = storageService.getUsersDB();
        
        // Check if email exists
        if (users.find(u => u.email === data.email)) {
          resolve({ success: false, message: "Email already registered." });
          return;
        }

        const newUser: UserState = {
          id: Date.now().toString(),
          isAuthenticated: true,
          username: data.username,
          email: data.email,
          password: data.password, // In real app, hash this!
          avatar: '🦊',
          totalXp: 0,
          dailyStreak: 1,
          lastLoginDate: new Date().toISOString().split('T')[0],
          settings: { darkMode: false }
        };

        users.push(newUser);
        storageService.saveUsersDB(users);
        storageService.saveUserSession(newUser);
        resolve({ success: true, message: "Account created successfully!" });
      }, 800);
    });
  },

  login: async (email: string, password: string): Promise<{ success: boolean; user?: UserState; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = storageService.getUsersDB();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          resolve({ success: false, message: "Invalid email or password." });
          return;
        }

        // Update streak logic
        const today = new Date().toISOString().split('T')[0];
        if (user.lastLoginDate !== today) {
            const lastDate = new Date(user.lastLoginDate);
            const currDate = new Date(today);
            const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) user.dailyStreak += 1;
            else if (diffDays > 1) user.dailyStreak = 1; // Reset if missed a day
            
            user.lastLoginDate = today;
        }

        user.isAuthenticated = true;
        // Update DB
        const updatedUsers = users.map(u => u.id === user.id ? user : u);
        storageService.saveUsersDB(updatedUsers);
        storageService.saveUserSession(user);

        resolve({ success: true, user, message: "Welcome back!" });
      }, 800);
    });
  },

  loginAsGuest: async (): Promise<{ success: boolean; user: UserState }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const guestUser: UserState = {
          id: 'guest_' + Date.now(),
          isAuthenticated: true,
          username: 'Guest Learner',
          email: 'guest@nihongoquest.app',
          avatar: '🐼',
          totalXp: 0,
          dailyStreak: 1,
          lastLoginDate: new Date().toISOString().split('T')[0],
          settings: { darkMode: false }
        };
        
        storageService.saveUserSession(guestUser);
        resolve({ success: true, user: guestUser });
      }, 600);
    });
  },

  logout: () => {
    const user = storageService.getUser();
    if (user && !user.id.startsWith('guest_')) {
      user.isAuthenticated = false;
      // Sync with DB
      const users = storageService.getUsersDB();
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      storageService.saveUsersDB(updatedUsers);
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  updateProfile: async (id: string, updates: Partial<UserState>): Promise<UserState> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = storageService.getUsersDB();
        const userIndex = users.findIndex(u => u.id === id);
        
        // Handle Guest (or user not in DB for some reason)
        if (userIndex === -1) {
             const currentUser = storageService.getUser();
             if (currentUser && currentUser.id === id) {
                  const updatedUser = { ...currentUser, ...updates };
                  storageService.saveUserSession(updatedUser);
                  resolve(updatedUser);
                  return;
             }
             throw new Error("User not found");
        }

        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        
        storageService.saveUsersDB(users);
        storageService.saveUserSession(updatedUser);
        resolve(updatedUser);
      }, 500);
    });
  },

  resetPassword: async (email: string): Promise<boolean> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const users = storageService.getUsersDB();
              const user = users.find(u => u.email === email);
              // In a real app, send email. Here we just pretend.
              resolve(!!user);
          }, 1000);
      });
  },

  // --- Kanji Data ---
  getAllKanji: (): Promise<KanjiData[]> => {
    return Promise.resolve(SEED_KANJI);
  },

  getKanjiById: (id: string): Promise<KanjiData | undefined> => {
    return Promise.resolve(SEED_KANJI.find(k => k.id === id));
  },

  // --- Kana Data ---
  getAllKana: (): Promise<KanaData[]> => {
    return Promise.resolve(SEED_KANA);
  },

  getKanaById: (id: string): Promise<KanaData | undefined> => {
    return Promise.resolve(SEED_KANA.find(k => k.id === id));
  },

  // --- Vocabulary Data ---
  getAllVocabulary: (): Promise<VocabularyItem[]> => {
    return Promise.resolve(SEED_VOCABULARY);
  },

  // --- SRS & Progress ---
  getProgress: (): Record<string, UserProgress> => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return saved ? JSON.parse(saved) : {};
  },

  saveProgress: (progressData: UserProgress) => {
    const current = storageService.getProgress();
    current[progressData.kanjiId] = progressData;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(current));
    
    // Add XP
    const user = storageService.getUser();
    if (user) {
      user.totalXp += 10;
      storageService.updateProfile(user.id, { totalXp: user.totalXp });
    }
  },

  // Update SRS based on quiz result
  updateSRS: (kanjiId: string, isCorrect: boolean) => {
    const allProgress = storageService.getProgress();
    const currentItem = allProgress[kanjiId] || {
      kanjiId,
      status: 'new',
      nextReviewDate: Date.now(),
      streak: 0,
      lastStudied: Date.now(),
      accuracy: 0
    };

    if (isCorrect) {
      currentItem.streak += 1;
      currentItem.status = currentItem.streak > 5 ? 'mastered' : 'review';
      // Simple exponential backoff: 1 day, 2 days, 4 days, etc.
      const daysToAdd = Math.pow(2, currentItem.streak - 1);
      currentItem.nextReviewDate = Date.now() + (daysToAdd * 24 * 60 * 60 * 1000);
    } else {
      currentItem.streak = 0;
      currentItem.status = 'learning';
      currentItem.nextReviewDate = Date.now(); // Review immediately
    }

    currentItem.lastStudied = Date.now();
    storageService.saveProgress(currentItem);
    return currentItem;
  }
};
