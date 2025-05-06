import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { color } from "./Constant/colors";
import StackRoute from "./routes/StackRoute";
import { fontSize } from "./Constant/fontSize";
import { GET_LOCAL } from "./common/storage/LocalStorage";
import { ACCESS_TOKEN } from "./common/storage/constant";
import { useNavigation } from "@react-navigation/native";
import { BOTTOM_TABS_PAGE, HOME_PAGE, LOGIN_PAGE } from "./routes/constant";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  HOME_PAGE: undefined;
  LOGIN_PAGE: undefined;
  [BOTTOM_TABS_PAGE]:undefined
};

export default function MainApp() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [splashScreen, setSplashScreen] = useState(true);
  const [access_token, setAccess_Token] = useState("");

  useEffect(() => {

    const timeOut = setTimeout(() => {
      getDataFromLocal();
    }, 3000);

    return () => clearTimeout(timeOut)
    
  }, []);

  const getDataFromLocal = async () => {
    const data = await GET_LOCAL(ACCESS_TOKEN);
    setAccess_Token(data.access_token);
    if (data) {
      navigation.navigate(BOTTOM_TABS_PAGE);
    } else {
      setSplashScreen(false);
      navigation.navigate(LOGIN_PAGE);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>zTarving</Text>
        <ActivityIndicator
          size={"large"}
          color={color.white}
          style={{ position: "absolute", bottom: 100 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: fontSize.font_40,
    color: color.white,
  },
});
