import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义数据类型
export interface ProgressUpdate {
  id: string;
  goalId: string;
  date: string;
  progress: number;
  note: string;
}

export interface IdeaRecord {
  id: string;
  goalId: string;
  date: string;
  content: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  icon: string;
  isFocus: boolean;
  progress: number;
  startDate: string;
  targetDate: string;
  milestones: Milestone[];
  progressUpdates: ProgressUpdate[];
  ideaRecords: IdeaRecord[];
  status: 'active' | 'completed' | 'paused';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockCondition: string;
  unlockedDate: string | null;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

// 定义store状态
interface FocusOneStore {
  // 目标相关
  goals: Goal[];
  focusGoal: Goal | null;
  
  // 成就相关
  achievements: Achievement[];
  
  // 用户相关
  user: User;
  
  // UI状态
  sidebarOpen: boolean;
  distractionModalOpen: boolean;
  
  // 操作方法
  addGoal: (goal: Omit<Goal, 'id' | 'progressUpdates' | 'ideaRecords'>) => void;
  setFocusGoal: (goalId: string) => void;
  updateGoalProgress: (goalId: string, progress: number, note: string) => void;
  addIdeaRecord: (goalId: string, content: string) => void;
  addMilestone: (goalId: string, title: string, description: string) => void;
  completeMilestone: (goalId: string, milestoneId: string) => void;
  updateGoalStatus: (goalId: string, status: 'active' | 'completed' | 'paused') => void;
  deleteGoal: (goalId: string) => void;
  
  // 成就操作
  checkAchievements: () => void;
  
  // UI操作
  toggleSidebar: () => void;
  toggleDistractionModal: () => void;
}

// 初始成就列表
const initialAchievements: Achievement[] = [
  {
    id: '1',
    name: '初心者',
    description: '创建第一个目标',
    icon: '🎯',
    unlocked: false,
    unlockCondition: '创建第一个目标',
    unlockedDate: null,
  },
  {
    id: '2',
    name: '坚持一周',
    description: '连续记录7天',
    icon: '🔥',
    unlocked: false,
    unlockCondition: '连续记录7天',
    unlockedDate: null,
  },
  {
    id: '3',
    name: '第一个里程碑',
    description: '完成第一个里程碑',
    icon: '🏆',
    unlocked: false,
    unlockCondition: '完成第一个里程碑',
    unlockedDate: null,
  },
  {
    id: '4',
    name: '进度过半',
    description: '目标进度达到50%',
    icon: '📈',
    unlocked: false,
    unlockCondition: '目标进度达到50%',
    unlockedDate: null,
  },
  {
    id: '5',
    name: '记录达人',
    description: '记录10条想法',
    icon: '✍️',
    unlocked: false,
    unlockCondition: '记录10条想法',
    unlockedDate: null,
  },
  {
    id: '6',
    name: '目标达成',
    description: '完成第一个目标',
    icon: '🎉',
    unlocked: false,
    unlockCondition: '完成第一个目标',
    unlockedDate: null,
  },
];

// 创建store
export const useFocusOneStore = create<FocusOneStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      goals: [],
      focusGoal: null,
      achievements: initialAchievements,
      user: {
        id: '1',
        name: '用户',
        avatar: '👤',
      },
      sidebarOpen: false,
      distractionModalOpen: false,
      
      // 添加目标
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: Date.now().toString(),
          progressUpdates: [],
          ideaRecords: [],
        };
        
        const updatedGoals = [...get().goals, newGoal];
        
        set({ 
          goals: updatedGoals,
          focusGoal: newGoal, // 自动设置为焦点目标
        });
        
        // 检查成就
        get().checkAchievements();
      },
      
      // 设置焦点目标
      setFocusGoal: (goalId) => {
        const goal = get().goals.find(g => g.id === goalId);
        if (goal) {
          // 更新所有目标的isFocus状态
          const updatedGoals = get().goals.map(g => ({
            ...g,
            isFocus: g.id === goalId,
          }));
          
          set({ 
            goals: updatedGoals,
            focusGoal: goal,
          });
        }
      },
      
      // 更新目标进度
      updateGoalProgress: (goalId, progress, note) => {
        const goal = get().goals.find(g => g.id === goalId);
        if (goal) {
          const newProgressUpdate: ProgressUpdate = {
            id: Date.now().toString(),
            goalId,
            date: new Date().toISOString(),
            progress,
            note,
          };
          
          const updatedGoals = get().goals.map(g => {
            if (g.id === goalId) {
              return {
                ...g,
                progress,
                progressUpdates: [...g.progressUpdates, newProgressUpdate],
              };
            }
            return g;
          });
          
          const updatedFocusGoal = get().focusGoal?.id === goalId 
            ? { ...get().focusGoal!, progress, progressUpdates: [...get().focusGoal!.progressUpdates, newProgressUpdate] }
            : get().focusGoal;
          
          set({ 
            goals: updatedGoals,
            focusGoal: updatedFocusGoal,
          });
          
          // 检查成就
          get().checkAchievements();
        }
      },
      
      // 添加想法记录
      addIdeaRecord: (goalId, content) => {
        const newIdeaRecord: IdeaRecord = {
          id: Date.now().toString(),
          goalId,
          date: new Date().toISOString(),
          content,
        };
        
        const updatedGoals = get().goals.map(g => {
          if (g.id === goalId) {
            return {
              ...g,
              ideaRecords: [...g.ideaRecords, newIdeaRecord],
            };
          }
          return g;
        });
        
        const updatedFocusGoal = get().focusGoal?.id === goalId 
          ? { ...get().focusGoal!, ideaRecords: [...get().focusGoal!.ideaRecords, newIdeaRecord] }
          : get().focusGoal;
        
        set({ 
          goals: updatedGoals,
          focusGoal: updatedFocusGoal,
        });
        
        // 检查成就
        get().checkAchievements();
      },
      
      // 添加里程碑
      addMilestone: (goalId, title, description) => {
        const newMilestone: Milestone = {
          id: Date.now().toString(),
          goalId,
          date: new Date().toISOString(),
          title,
          description,
          completed: false,
        };
        
        const updatedGoals = get().goals.map(g => {
          if (g.id === goalId) {
            return {
              ...g,
              milestones: [...g.milestones, newMilestone],
            };
          }
          return g;
        });
        
        const updatedFocusGoal = get().focusGoal?.id === goalId 
          ? { ...get().focusGoal!, milestones: [...get().focusGoal!.milestones, newMilestone] }
          : get().focusGoal;
        
        set({ 
          goals: updatedGoals,
          focusGoal: updatedFocusGoal,
        });
      },
      
      // 完成里程碑
      completeMilestone: (goalId, milestoneId) => {
        const updatedGoals = get().goals.map(g => {
          if (g.id === goalId) {
            return {
              ...g,
              milestones: g.milestones.map(m => {
                if (m.id === milestoneId) {
                  return { ...m, completed: true };
                }
                return m;
              }),
            };
          }
          return g;
        });
        
        const updatedFocusGoal = get().focusGoal?.id === goalId 
          ? { 
              ...get().focusGoal!,
              milestones: get().focusGoal!.milestones.map(m => {
                if (m.id === milestoneId) {
                  return { ...m, completed: true };
                }
                return m;
              }),
            }
          : get().focusGoal;
        
        set({ 
          goals: updatedGoals,
          focusGoal: updatedFocusGoal,
        });
        
        // 检查成就
        get().checkAchievements();
      },
      
      // 更新目标状态
      updateGoalStatus: (goalId, status) => {
        const updatedGoals = get().goals.map(g => {
          if (g.id === goalId) {
            return { ...g, status };
          }
          return g;
        });
        
        const updatedFocusGoal = get().focusGoal?.id === goalId 
          ? { ...get().focusGoal!, status }
          : get().focusGoal;
        
        set({ 
          goals: updatedGoals,
          focusGoal: updatedFocusGoal,
        });
        
        // 检查成就
        get().checkAchievements();
      },
      
      // 删除目标
      deleteGoal: (goalId) => {
        const updatedGoals = get().goals.filter(g => g.id !== goalId);
        const updatedFocusGoal = get().focusGoal?.id === goalId ? null : get().focusGoal;
        
        set({ 
          goals: updatedGoals,
          focusGoal: updatedFocusGoal,
        });
      },
      
      // 检查成就
      checkAchievements: () => {
        const { goals } = get();
        const currentAchievements = [...get().achievements];
        let hasChanges = false;
        
        // 检查第一个目标成就
        if (goals.length > 0 && !currentAchievements.find(a => a.id === '1')?.unlocked) {
          const achievement = currentAchievements.find(a => a.id === '1');
          if (achievement) {
            achievement.unlocked = true;
            achievement.unlockedDate = new Date().toISOString();
            hasChanges = true;
          }
        }
        
        // 检查第一个里程碑成就
        const totalMilestones = goals.reduce((sum, goal) => sum + goal.milestones.filter(m => m.completed).length, 0);
        if (totalMilestones > 0 && !currentAchievements.find(a => a.id === '3')?.unlocked) {
          const achievement = currentAchievements.find(a => a.id === '3');
          if (achievement) {
            achievement.unlocked = true;
            achievement.unlockedDate = new Date().toISOString();
            hasChanges = true;
          }
        }
        
        // 检查进度过半成就
        const hasHalfProgress = goals.some(goal => goal.progress >= 50);
        if (hasHalfProgress && !currentAchievements.find(a => a.id === '4')?.unlocked) {
          const achievement = currentAchievements.find(a => a.id === '4');
          if (achievement) {
            achievement.unlocked = true;
            achievement.unlockedDate = new Date().toISOString();
            hasChanges = true;
          }
        }
        
        // 检查记录达人成就
        const totalIdeas = goals.reduce((sum, goal) => sum + goal.ideaRecords.length, 0);
        if (totalIdeas >= 10 && !currentAchievements.find(a => a.id === '5')?.unlocked) {
          const achievement = currentAchievements.find(a => a.id === '5');
          if (achievement) {
            achievement.unlocked = true;
            achievement.unlockedDate = new Date().toISOString();
            hasChanges = true;
          }
        }
        
        // 检查目标达成成就
        const completedGoals = goals.filter(goal => goal.status === 'completed');
        if (completedGoals.length > 0 && !currentAchievements.find(a => a.id === '6')?.unlocked) {
          const achievement = currentAchievements.find(a => a.id === '6');
          if (achievement) {
            achievement.unlocked = true;
            achievement.unlockedDate = new Date().toISOString();
            hasChanges = true;
          }
        }
        
        if (hasChanges) {
          set({ achievements: currentAchievements });
        }
      },
      
      // 切换侧边栏
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },
      
      // 切换分心警告弹窗
      toggleDistractionModal: () => {
        set(state => ({ distractionModalOpen: !state.distractionModalOpen }));
      },
    }),
    {
      name: 'focus-one-storage',
    }
  )
);
