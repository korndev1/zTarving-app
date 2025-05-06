import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { color } from "../Constant/colors";
import { HOME_PAGE, LIST_PAGE, RECIPE_PAGE, SETTING_PAGE } from "./constant";
import { useTranslation } from "react-i18next";
import { getFontFamily } from "../common/utils/font";

const BottomTabsLayout = ({ state, descriptors, navigation }) => {
  const { t } = useTranslation();
  const getTabName = (routeName) => {
    if (routeName == HOME_PAGE) return t("Home");
    if (routeName == LIST_PAGE) return t("List");
    if (routeName == RECIPE_PAGE) return t("Recipe");
    if (routeName == SETTING_PAGE) return t("setting");
  };

  const getTabIcon = (routeName, isFocused) => {
    if (routeName == HOME_PAGE) {
      if (isFocused) {
        return require("../assets/image_icon/home_ac.png");
      } else {
        return require("../assets/image_icon/home_in.png");
      }
    } else if (routeName == LIST_PAGE) {
      if (isFocused) {
        return require("../assets/image_icon/list_ac.png");
      } else {
        return require("../assets/image_icon/list_in.png");
      }
    } else if (routeName == RECIPE_PAGE) {
      if (isFocused) {
        return require("../assets/image_icon/recipe_ac.png");
      } else {
        return require("../assets/image_icon/recipe_in.png");
      }
    } else if (routeName == SETTING_PAGE) {
      if (isFocused) {
        return require("../assets/image_icon/setting_ac.png");
      } else {
        return require("../assets/image_icon/setting_in.png");
      }
    }
  };
  return (
    <View
      style={{
        backgroundColor: color.primary,
        height: 90,
        justifyContent: "space-evenly",
        padding: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        flexDirection: "row",
        shadowColor:color.black,
        shadowOffset:{width:0,height:-5},
        shadowOpacity:0.3,
        shadowRadius:7.5
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label = getTabName(route.name);

        const isFocused = state.index === index;

        const onPress = async () => {
          navigation.navigate(route.name);
        };
        return (
          <TouchableOpacity
            key={`tab-layout-${index}`}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ["selected"] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{

            }}
          >
            <View
              style={{
                //   backgroundColor: isFocused
                //     ? '#F5E8ED'
                //     : Colors.light_violet,
                alignItems: "center",
                width: 65,
                height: 65,
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Image
                resizeMode={"contain"}
                style={[{ width: 30, height: 30 }]}
                source={getTabIcon(route.name, isFocused)}
              />

              <Text
                style={[
                  // styles.textMenu,
                  {
                    color: isFocused ? color.white : color.grey_transparent,
                    // textShadowColor: isFocused ? '#BA68C8' : '#5C25AB',
                    // textShadowOffset: {width: 1, height: 1},
                    // textShadowRadius: 1,
                    fontFamily: getFontFamily("bold"),
                  },
                ]}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabsLayout;
