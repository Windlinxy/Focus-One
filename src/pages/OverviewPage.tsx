import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusOneStore } from '../store';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getGoalDays, getActivityData, getWeeklyData, getEstimatedCompletionDate, formatDate } from '../utils';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const OverviewPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { focusGoal } = useFocusOneStore();

  // 如果没有焦点目标，跳转到空状态页
  useEffect(() => {
    if (!focusGoal) {
      navigation.replace('Empty');
    }
  }, [focusGoal, navigation]);

  if (!focusGoal) {
    return null;
  }

  // 准备数据
  const daysPassed = getGoalDays(focusGoal.startDate);
  const completedMilestones = focusGoal.milestones.filter(m => m.completed).length;
  const totalIdeas = focusGoal.ideaRecords.length;
  const estimatedCompletion = getEstimatedCompletionDate(focusGoal.startDate, focusGoal.targetDate, focusGoal.progress);

  // 活跃度数据（最近10天）
  const allRecords = [
    ...focusGoal.progressUpdates,
    ...focusGoal.ideaRecords,
    ...focusGoal.milestones,
  ];
  const activityData = getActivityData(allRecords);

  // 本周数据
  const weeklyData = getWeeklyData(allRecords);

  return (
    <View style={styles.container}>
      {/* 顶部返回栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 概览</Text>
      </View>

      {/* 核心内容区 */}
      <ScrollView style={styles.content}>
        {/* 当前进度卡片 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>当前进度</Text>
          <View style={styles.progressContainer}>
            <View style={styles.circularProgress}>
              <Text style={styles.progressPercentage}>{Math.round(focusGoal.progress)}%</Text>
            </View>
            <View style={styles.progressData}>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>已用时</Text>
                <Text style={styles.dataValue}>{daysPassed} 天</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>里程碑</Text>
                <Text style={styles.dataValue}>{completedMilestones}/{focusGoal.milestones.length}</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>想法记录</Text>
                <Text style={styles.dataValue}>{totalIdeas} 条</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>预计完成</Text>
                <Text style={styles.dataValue}>{formatDate(estimatedCompletion)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 成长曲线卡片 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>成长曲线</Text>
          <View style={styles.chartContainer}>
            {activityData.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar,
                    {
                      height: Math.max(item.count * 20, 20),
                    }
                  ]}
                />
                <Text style={styles.barLabel}>
                  {new Date(item.date).getDate()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 本周回顾卡片 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>本周回顾</Text>
          <View style={styles.weeklyGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>活跃天数</Text>
              <Text style={styles.gridValue}>{weeklyData.activeDays} 天</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>想法记录</Text>
              <Text style={styles.gridValue}>{weeklyData.totalRecords} 条</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>进度推进</Text>
              <Text style={styles.gridValue}>{Math.round(focusGoal.progress)}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>里程碑达成</Text>
              <Text style={styles.gridValue}>{completedMilestones} 个</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circularProgress: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  progressData: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  dataItem: {
    width: '45%',
  },
  dataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 20,
    backgroundColor: '#667eea',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
  },
  weeklyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  gridLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
});

export default OverviewPage;
