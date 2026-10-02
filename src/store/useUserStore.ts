import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoal: number; // default 15 questions
  todayAnsweredCount: number;
  todayDate: string;
  bookmarks: string[]; // question IDs
  theme: 'light' | 'dark';
}

interface UserState extends UserStats {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setDailyGoal: (goal: number) => void;
  addXP: (amount: number) => { gained: number; newTotal: number; leveledUp: boolean; newLevel: number };
  recordAnswer: (isCorrect: boolean) => void;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  exportState: () => string;
  importState: (jsonStr: string) => boolean;
}

// Level calculation: 100 * level^1.5 XP
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  while (xp >= Math.floor(100 * Math.pow(level, 1.4))) {
    level++;
  }
  return level;
};

export const getXPForNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.4));
};

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streakDays: 1,
      lastActiveDate: getTodayString(),
      dailyGoal: 15,
      todayAnsweredCount: 0,
      todayDate: getTodayString(),
      bookmarks: [],
      theme: 'light',

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
      },

      setDailyGoal: (dailyGoal) => set({ dailyGoal: Math.max(5, Math.min(100, dailyGoal)) }),

      addXP: (amount) => {
        const currentXP = get().xp;
        const currentLevel = get().level;
        const newXP = Math.max(0, currentXP + amount);
        const newLevel = getLevelFromXP(newXP);
        const leveledUp = newLevel > currentLevel;

        set({ xp: newXP, level: newLevel });
        return { gained: amount, newTotal: newXP, leveledUp, newLevel };
      },

      recordAnswer: (_isCorrect) => {
        const today = getTodayString();
        const state = get();
        let currentTodayCount = state.todayAnsweredCount;
        let streak = state.streakDays;

        if (state.todayDate !== today) {
          // Check streak continuity: was last active yesterday?
          const last = new Date(state.lastActiveDate);
          const now = new Date(today);
          const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

          if (diffDays === 1) {
            streak = state.streakDays + 1;
          } else if (diffDays > 1) {
            streak = 1;
          }
          currentTodayCount = 1;
        } else {
          currentTodayCount += 1;
        }

        set({
          todayDate: today,
          todayAnsweredCount: currentTodayCount,
          lastActiveDate: today,
          streakDays: streak,
        });
      },

      toggleBookmark: (questionId) => {
        const current = get().bookmarks;
        if (current.includes(questionId)) {
          set({ bookmarks: current.filter((id) => id !== questionId) });
        } else {
          set({ bookmarks: [...current, questionId] });
        }
      },

      isBookmarked: (questionId) => {
        return get().bookmarks.includes(questionId);
      },

      exportState: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },

      importState: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (typeof parsed.xp === 'number' && Array.isArray(parsed.bookmarks)) {
            set(parsed);
            if (parsed.theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'paes_user_state',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);
