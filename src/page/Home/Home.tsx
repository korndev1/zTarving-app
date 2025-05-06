import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { GET_LOCAL } from "../../common/storage/LocalStorage";
import { ACCESS_TOKEN } from "../../common/storage/constant";
import LinearGradient from "react-native-linear-gradient";
import { color } from "../../Constant/colors";
import Seach from "../../../components/Seach";
import { getFontFamily } from "../../common/utils/font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ADD_RECIPE_PAGE } from "../../routes/constant";

type RootStackParamList = {
  [ADD_RECIPE_PAGE]: undefined;
};

const Home = () => {
  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [access_token, setAccess_Token] = useState("");
  const [text, setText] = useState("");
  const [showButton, setShowButton] = useState(false);

  const widthAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: showButton ? 100 : 50,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showButton]);

  const getDataFromLocal = async () => {
    const data = await GET_LOCAL(ACCESS_TOKEN);
    setAccess_Token(data.access_token);
  };
  useEffect(() => {
    getDataFromLocal();
  }, []);

  const handleSubmit = () => {
    console.log(text);
  };

  const navigateAddRecipe = () => {
    navigate.navigate(ADD_RECIPE_PAGE)
  };

  const handleShowButton = () => {
    setShowButton(true);
  };
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[color.white, color.primary]}
      start={{ x: 0, y: 0.9 }}
      end={{ x: 0, y: 0 }}
    >
      <ScrollView style={styles.contentContainer}>
        <Seach
          setTextSearch={setText}
          textSearch={text}
          handleSubmit={handleSubmit}
        />
      </ScrollView>
      <Animated.View
        style={{
          backgroundColor: color.primary,
          width: widthAnim,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 100,
          elevation: 3,
          shadowColor: color.black,
          shadowOffset: { width: 2.5, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 1,
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          onLongPress={() => setShowButton(true)}
          onPressOut={() => setShowButton(false)}
          onPress={()=>navigateAddRecipe()}
          activeOpacity={1}
        >
          <Text
            style={{
              color: color.white,
              fontFamily: getFontFamily("semibold"),
              fontSize: 18,
              width: showButton ? 100 : 50,
              textAlign: "center",
            }}
          >
            {showButton ? "add recipe" : "+"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
});
