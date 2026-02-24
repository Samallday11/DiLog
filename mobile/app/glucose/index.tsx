import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GlucoseIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Glucose</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, fontWeight: '600' },
});
