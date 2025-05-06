import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../page/auth/Login'
import { ADD_RECIPE_PAGE, BOTTOM_TABS_PAGE, HOME_PAGE, LOGIN_PAGE, MAIN_APP_PAGE, REGISTER_PAGE } from './constant'
import Register from '../page/auth/Register'
import Home from '../page/Home/Home'
import MainApp from '../MainApp'
import BottomTAbs from './BottomTAbs'
import AddRecipe from '../page/Home/AddRecipe'

const Stack = createNativeStackNavigator()

export default function StackRoute() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name={MAIN_APP_PAGE} component={MainApp}/>
          <Stack.Screen name={LOGIN_PAGE} component={Login}/>
          <Stack.Screen name={REGISTER_PAGE} component={Register}/>
          <Stack.Screen name={BOTTOM_TABS_PAGE} component={BottomTAbs}/>

          <Stack.Screen name={ADD_RECIPE_PAGE} component={AddRecipe}/>
          


        </Stack.Navigator>
       </NavigationContainer>
  )
}