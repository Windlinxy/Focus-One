import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const EmptyStatePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleCreateGoal = () => {
    // 这里应该导航到创建目标页面，暂时先添加一个示例目标
    // navigation.navigate('Create');
    
    // 为了演示，直接添加一个示例目标
    import('../store').then(({ useFocusOneStore }) => {
      const { addGoal } = useFocusOneStore.getState();
      addGoal({
        name: '学 Python 编程',
        description: '掌握Python基础语法和核心库，能够开发简单的应用程序',
        icon: '🐍',
        isFocus: true,
        progress: 0,
        startDate: new Date().toISOString(),
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90天后
        milestones: [
          {
            id: '1',
            goalId: '',
            date: new Date().toISOString(),
            title: '完成基础语法学习',
            description: '掌握变量、数据类型、控制流等基础概念',
            completed: false,
          },
          {
            id: '2',
            goalId: '',
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            title: '学习核心库',
            description: '掌握numpy、pandas、matplotlib等核心库',
            completed: false,
          },
          {
            id: '3',
            goalId: '',
            date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            title: '开发第一个应用',
            description: '开发一个简单的Python应用程序',
            completed: false,
          },
        ],
        status: 'active',
      });
      navigation.replace('Focus');
    });
  };

  return (
    <View style={styles.container}>
      {/* 顶部弱化的目标信息区 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>还没有焦点目标</Text>
        <Text style={styles.headerSubtitle}>创建一个目标，开始你的专注之旅</Text>
      </View>

      {/* 中间引导区 */}
      <View style={styles.content}>
        <Text style={styles.icon}>🎯</Text>
        <Text style={styles.title}>聚焦一件事</Text>
        <Text style={styles.description}>
          选择一个核心目标，持续记录进度，获得正向反馈，实现稳步成长
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateGoal}
        >
          <Text style={styles.buttonText}>创建第一个目标</Text>
        </TouchableOpacity>
      </View>

      {/* 底部输入区弱化（禁用状态） */}
      <View style={styles.inputBar}>
        <View style={styles.inputRow}>
          <View style={styles.input}>
            <Text style={styles.inputPlaceholder}>写点什么想法...</Text>
          </View>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>📤</Text>
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
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  inputBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
    opacity: 0.5,
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
  },
  inputPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#999',
  },
});

export default EmptyStatePage;
