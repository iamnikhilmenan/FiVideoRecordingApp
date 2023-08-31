import React from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";

import CameraScreen from "./src/screens/CameraScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.appContainer}>
      <CameraScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: "rgba(250, 250, 250, 0.5)",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
