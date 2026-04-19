// 格式化日期
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 格式化时间
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 计算两个日期之间的天数
export const getDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 计算目标进行天数
export const getGoalDays = (startDate: string): number => {
  return getDaysBetween(startDate, new Date().toISOString());
};

// 生成随机ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 计算目标预计完成时间
export const getEstimatedCompletionDate = (startDate: string, targetDate: string, progress: number): string => {
  if (progress === 0) return targetDate;
  
  const start = new Date(startDate);
  const target = new Date(targetDate);
  const totalDays = getDaysBetween(startDate, targetDate);
  const daysPassed = getDaysBetween(startDate, new Date().toISOString());
  const estimatedTotalDays = (daysPassed / progress) * 100;
  const estimatedEndDate = new Date(start.getTime() + estimatedTotalDays * 24 * 60 * 60 * 1000);
  
  return estimatedEndDate.toISOString();
};

// 计算最近10天的活跃度数据
export const getActivityData = (records: { date: string }[]): { date: string; count: number }[] => {
  const today = new Date();
  const activityData = [];
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const count = records.filter(record => {
      return record.date.split('T')[0] === dateString;
    }).length;
    
    activityData.push({ date: dateString, count });
  }
  
  return activityData;
};

// 格式化百分比
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

// 计算本周数据
export const getWeeklyData = (records: { date: string }[]) => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  const weeklyRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });
  
  const activeDays = new Set(weeklyRecords.map(record => record.date.split('T')[0])).size;
  
  return {
    activeDays,
    totalRecords: weeklyRecords.length,
  };
};
