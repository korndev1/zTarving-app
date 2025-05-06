import {
  Animated,
  Button,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import LinearGradient from "react-native-linear-gradient";
import { color } from "../../Constant/colors";
import { getFontFamily } from "../../common/utils/font";
import { IngredientService } from "../../services/ingredients";
import { MeasureData } from "../../type";
import Modal from "react-native-modal";

type RootStackParamList = {};

type Ingredient = {
  name: string;
  amount: string;
  measure: string;
  short_form: string;
};

const AddRecipe = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const lang = i18n.language;
  const [loading, setLoading] = useState(false);

  const handleGOBack = () => {
    navigation.goBack();
  };

  const widthAnim = useRef(new Animated.Value(130)).current;
  const raduisAnim = useRef(new Animated.Value(100)).current;
  const highAnim = useRef(new Animated.Value(60)).current;

  const [showView, setShowView] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientName, setIngredientName] = useState("");
  const [amount, setAmount] = useState("");
  const [measure, setMeasure] = useState("");
  const [selectMeasure, setSelectMeasure] = useState(t("measure"));
  const [selectMeasureSF, setSelectMeasureSF] = useState("");

  const [modalMeasure, setModalMeasure] = useState(false);

  const [measureData, setMeasureData] = useState<MeasureData[]>([]);

  const [addIngredient, setAddIngredient] = useState(false);

  useEffect(() => {
    fetchGetMeasure();
  }, [measureData]);
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: addIngredient ? Dimensions.get("screen").width * 0.9 : 130,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(raduisAnim, {
      toValue: addIngredient ? 15 : 100,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(highAnim, {
      toValue: addIngredient ? 300 : 60,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [addIngredient]);

  useEffect(() => {
    const listener = highAnim.addListener(({ value }) => {
      if (value === 300) {
        setShowView(true);
      } else {
        setShowView(false);
      }
    });

    return () => {
      highAnim.removeListener(listener);
    };
  }, [highAnim]);

  const addIngredients = () => {
    if (ingredientName && amount && selectMeasure) {
      setIngredients([
        ...ingredients,
        {
          name: ingredientName,
          amount,
          measure: selectMeasure,
          short_form: selectMeasureSF,
        },
      ]);
      setIngredientName("");
      setAmount("");
      setSelectMeasure(t("measure"));
      setSelectMeasureSF("");
    }
  };

  const fetchGetMeasure = async () => {
    try {
      const response = await IngredientService.getMeasure();
      const result = response.data;
      if (result.statusCode == 200) {
        setMeasureData(result.data);
      }
    } catch (error) {
      console.error("fetchGetMeasure", error);
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[color.white, color.primary]}
      start={{ x: 0, y: 0.9 }}
      end={{ x: 0, y: 0 }}
    >
      <TouchableOpacity
        style={{
          top: 75,
          position: "absolute",
          left: 15,
          backgroundColor: "rgba(0,0,0,0.3)",
          padding: 5,
          borderRadius: 100,
          paddingHorizontal: 10,
        }}
        onPress={() => handleGOBack()}
      >
        <Text
          style={{
            fontFamily: getFontFamily("semibold"),
            color: color.white,
          }}
        >
          {t("back")}
        </Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <TextInput
          placeholder="Food name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Image URL"
          value={image}
          onChangeText={setImage}
          style={styles.input}
        />

        <FlatList
          horizontal
          data={ingredients}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => removeIngredient(index)}
              style={{
                backgroundColor: color.white,
                marginRight: 10,
                padding: 10,
                alignItems: "center",
                justifyContent:"center",
                borderRadius:100,
                height:40
              }}
            >
              <Text style={styles.ingredientItem}>
                {item.amount} {item.short_form} {item.name}
              </Text>
            </TouchableOpacity>
          )}
          style={{ marginVertical: 8, maxHeight: 20 * ingredients.length }}
          contentContainerStyle={{ paddingVertical: 0 }}
          scrollEnabled={ingredients.length > 4}
        />

        <View style={{ alignItems: "flex-end", marginTop: 10 }}>
          <Animated.View
            style={{
              backgroundColor: color.white,
              width: widthAnim,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: raduisAnim,
              height: highAnim,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                disabled={showView}
                onPress={() => setAddIngredient(true)}
              >
                <Text
                  style={{
                    fontFamily: getFontFamily("bold"),
                    color: color.primary,
                    fontSize: showView ? 20 : 15,
                  }}
                >
                  {t("add_ingedient")}
                </Text>
              </TouchableOpacity>
              {showView && (
                <TouchableOpacity onPress={() => setAddIngredient(false)}>
                  <Text style={{ fontFamily: getFontFamily("bold") }}>
                    {"X"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {showView && (
              <View style={{ marginTop: 10, width: "100%" }}>
                <TextInput
                  placeholder={t("ingredient_name")}
                  value={ingredientName}
                  onChangeText={setIngredientName}
                  style={styles.input}
                  placeholderTextColor={color.primary}
                />
                <TextInput
                  placeholder={t("amount")}
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.input}
                  placeholderTextColor={color.primary}
                />
                <TouchableOpacity
                  style={[styles.input, { padding: 10 }]}
                  onPress={() => setModalMeasure(true)}
                >
                  <Text style={{ color: color.primary }}>{selectMeasure}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: color.primary,
                    padding: 10,
                    borderRadius: 100,
                    width: 75,
                    alignSelf: "flex-end",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={() => addIngredients()}
                >
                  <Text
                    style={{
                      color: color.white,
                      fontFamily: getFontFamily("semibold"),
                    }}
                  >
                    {t("add")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: color.primary,
          padding: 10,
          alignItems: "center",
          margin: 20,
          marginBottom: 40,
          borderRadius: 7,
          shadowColor: color.black,
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
        }}
      >
        <Text
          style={{
            color: color.white,
            fontFamily: getFontFamily("bold"),
            fontSize: 24,
          }}
        >
          {t("add_recipe")}
        </Text>
      </TouchableOpacity>
      <Modal
        isVisible={modalMeasure}
        onBackdropPress={() => setModalMeasure(false)}
        animationOut={"fadeOut"}
        style={{ flex: 1, justifyContent: "flex-end", padding: 0, margin: 0 }}
      >
        <View
          style={{
            backgroundColor: color.white,
            padding: 20,
            height: Dimensions.get("screen").height * 0.5,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: getFontFamily("bold"),
              fontSize: 30,
              color: color.primary,
            }}
          >
            {t("measure")}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {measureData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectMeasure(item.name);
                  setSelectMeasureSF(item.short_forn);
                  setModalMeasure(false);
                }}
                style={{
                  borderWidth: 2,
                  padding: 10,
                  borderColor: color.primary,
                  marginBottom: 15,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  elevation: 3,
                  shadowColor: "#000000",
                  shadowOffset: { width: 1.5, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                  backgroundColor: color.white,
                  marginHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: getFontFamily("semibold"),
                    fontSize: 16,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: getFontFamily("regular"),
                    fontSize: 16,
                    color: color.grey_transparent,
                  }}
                >{` (${item.short_forn})`}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  container: { padding: 16, marginTop: 100, flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: color.primary,
    padding: 8,
    marginVertical: 6,
    borderRadius: 5,
    fontFamily: getFontFamily("regular"),
    color: color.primary,
  },
  label: { fontWeight: "bold", marginTop: 10 },
  ingredientItem: {
    fontSize: 14,
    marginVertical: 2,
    color: color.primary,
    fontFamily:getFontFamily('semibold')
  },
});
