// FontsProvider.js
import React, { useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

export default function FontsProvider({ children }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = () => {
    return Font.loadAsync({
      "Poppins-Regular": require("@expo-google-fonts/poppins/build/Poppins-Regular.ttf"),
      "Poppins-Bold": require("@expo-google-fonts/poppins/build/Poppins-Bold.ttf"),
    });
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return children;
}
