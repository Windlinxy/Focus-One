import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusOneStore } from '../store';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getGoalDays } from '../utils';
import ProgressBar from '../components/ProgressBar';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FocusPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    focusGoal, 
    toggleSidebar, 
    addIdeaRecord, 
    updateGoalProgress, 
    addMilestone 
  } = useFocusOneStore();

  // 如果没有焦点目标，跳转到空状态页
  useEffect(() => {
    if (!focusGoal) {
      navigation.replace('Empty');
    }
  }, [focusGoal, navigation]);

  if (!focusGoal) {
    return null;
  }

  // 计算已完成的里程碑数量
  const completedMilestones = focusGoal.milestones.filter(m => m.completed).length;

  // 输入状态
  const [inputType, setInputType] = React.useState<'idea' | 'progress' | 'milestone'>('idea');
  const [inputValue, setInputValue] = React.useState('');
  const [progressValue, setProgressValue] = React.useState('0');
  const [milestoneTitle, setMilestoneTitle] = React.useState('');

  const handleSubmit = () => {
    switch (inputType) {
      case 'idea':
        if (inputValue.trim()) {
          addIdeaRecord(focusGoal.id, inputValue.trim());
          setInputValue('');
        }
        break;
      case 'progress':
        const progress = parseInt(progressValue);
        if (progress >= 0 && progress <= 100 && inputValue.trim()) {
          updateGoalProgress(focusGoal.id, progress, inputValue.trim());
          setInputValue('');
          setProgressValue('0');
        }
        break;
      case 'milestone':
        if (milestoneTitle.trim() && inputValue.trim()) {
          addMilestone(focusGoal.id, milestoneTitle.trim(), inputValue.trim());
          setInputValue('');
          setMilestoneTitle('');
        }
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部信息区 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.goalName}>
            {focusGoal.icon} {focusGoal.name}
          </Text>
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>进度: {Math.round(focusGoal.progress)}%</Text>
            <Text style={styles.metaText}>第 {getGoalDays(focusGoal.startDate)} 天</Text>
            <Text style={styles.metaText}>{completedMilestones}/{focusGoal.milestones.length} 里程碑</Text>
          </View>
        </View>
        {/* 用户头像 */}
        <TouchableOpacity 
          style={styles.avatar}
          onPress={toggleSidebar}
        >
          <Text style={styles.avatarText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={focusGoal.progress} 
          height={10} 
        />
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>开始: {new Date(focusGoal.startDate).toLocaleDateString('zh-CN')}</Text>
          <Text style={styles.dateText}>目标: {new Date(focusGoal.targetDate).toLocaleDateString('zh-CN')}</Text>
        </View>
      </View>

      {/* 折叠层级切换器 */}
      <View style={styles.periodSelector}>
        {['天', '周', '月', '年'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              period === '月' && styles.periodButtonActive
            ]}
          >
            <Text style={[
              styles.periodButtonText,
              period === '月' && styles.periodButtonTextActive
            ]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 时间线区域 */}
      <ScrollView style={styles.timeline}>
        <Text style={styles.timelinePlaceholder}>时间线内容将在这里显示</Text>
      </ScrollView>

      {/* 底部输入区 */}
      <View style={styles.inputBar}>
        {/* 快捷操作 */}
        <View style={styles.inputTypeSelector}>
          <TouchableOpacity
            style={[
              styles.inputTypeButton,
              inputType === 'idea' && styles.inputTypeButtonActive
            ]}
            onPress={() => setInputType('idea')}
          >
            <Text style={[
              styles.inputTypeButtonText,
              inputType === 'idea' && styles.inputTypeButtonTextActive
            ]}>
              写想法
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.inputTypeButton,
              inputType === 'progress' && styles.inputTypeButtonActive
            ]}
            onPress={() => setInputType('progress')}
          >
            <Text style={[
              styles.inputTypeButtonText,
              inputType === 'progress' && styles.inputTypeButtonTextActive
            ]}>
              更新进度
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.inputTypeButton,
              inputType === 'milestone' && styles.inputTypeButtonActive
            ]}
            onPress={() => setInputType('milestone')}
          >
            <Text style={[
              styles.inputTypeButtonText,
              inputType === 'milestone' && styles.inputTypeButtonTextActive
            ]}>
              里程碑
            </Text>
          </TouchableOpacity>
        </View>

        {/* 输入区域 */}
        <View style={styles.inputContainer}>
          {inputType === 'progress' && (
            <View style={styles.progressInput}>
              <TextInput
                style={styles.progressSlider}
                type="range"
                min="0"
                max="100"
                value={progressValue}
                onChangeText={setProgressValue}
                keyboardType="numeric"
              />
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>0%</Text>
                <Text style={styles.progressLabel}>{progressValue}%</Text>
                <Text style={styles.progressLabel}>100%</Text>
              </View>
            </View>
          )}

          {inputType === 'milestone' && (
            <TextInput
              style={styles.milestoneTitleInput}
              placeholder="里程碑标题"
              value={milestoneTitle}
              onChangeText={setMilestoneTitle}
            />
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={inputType === 'idea' ? '写点什么想法...' : inputType === 'progress' ? '写下进度备注...' : '写下里程碑描述...'}
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSubmit}
            >
              <Text style={styles.sendButtonText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  goalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  progressContainer: {
    padding: 24,
    backgroundColor: 'white',
  },
  dateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  periodButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#667eea',
    fontWeight: '500',
  },
  timeline: {
    flex: 1,
    padding: 16,
  },
  timelinePlaceholder: {
    textAlign: 'center',
    color: '#999',
    marginTop: 48,
  },
  inputBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
  },
  inputTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  inputTypeButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  inputTypeButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  inputTypeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  inputTypeButtonTextActive: {
    color: '#667eea',
    fontWeight: '500',
  },
  inputContainer: {
    gap: 8,
  },
  progressInput: {
    marginBottom: 8,
  },
  progressSlider: {
    height: 40,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#999',
  },
  milestoneTitleInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
  },
});

export default FocusPage;
