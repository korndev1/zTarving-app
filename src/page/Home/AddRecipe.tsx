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

type RootStackParamList = {};

type Ingredient = {
  name: string;
  amount: string;
  measure: string;
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

  const [measureData,setMeasureData] = useState<MeasureData[]>([])

  const [addIngredient, setAddIngredient] = useState(false);

  useEffect(()=>{
    fetchGetMeasure()
  },[measureData])
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
    if (ingredientName && amount && measure) {
      setIngredients([
        ...ingredients,
        { name: ingredientName, amount, measure },
      ]);
      setIngredientName("");
      setAmount("");
      setMeasure("");
    }
  };

  const fetchGetMeasure = async() => {
    try {
      const response = await IngredientService.getMeasure()
      const result = response.data
      if(result.statusCode == 200){
        setMeasureData(result.data)
      }
      
    } catch (error) {
      console.error('fetchGetMeasure',error);
      
    }
  }

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
        {measureData.map((item)=>(
          <Text>{item.name}</Text>
        ))}
        <FlatList
          data={ingredients}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.ingredientItem}>
              - {item.amount} {item.measure} {item.name}
            </Text>
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
                  placeholder={t("food_name")}
                  value={ingredientName}
                  onChangeText={setIngredientName}
                  style={styles.input}
                />
                <TextInput
                  placeholder={t("amount")}
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.input}
                />
                <TextInput
                  placeholder={t("measure")}
                  value={measure}
                  onChangeText={setMeasure}
                  style={styles.input}
                />
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
  },
  label: { fontWeight: "bold", marginTop: 10 },
  ingredientItem: {
    fontSize: 14,
    marginVertical: 2,
    color: "#333",
  },
});
