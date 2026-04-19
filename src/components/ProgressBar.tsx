import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  style?: object;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 8, 
  style = {} 
}) => {
  return (
    <View 
      style={[styles.container, { height }, style]}
    >
      <View 
        style={[
          styles.progress,
          {
            width: `${Math.min(progress, 100)}%`,
            height: '100%',
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
});

export default ProgressBar;
