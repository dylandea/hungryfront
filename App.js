import "react-native-gesture-handler"; //est utilisé par le Drawer, doit rester en haut

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
//les deux lignes ci-dessus permettent de cacher les messages d'erreur sur telephone

import * as React from "react";

// redux
import { Provider } from "react-redux";
import bottomTabHeight from "./reducers/bottomTabHeight.reducer";
import token from './reducers/token.reducer'
import username from './reducers/username.reducer'
import avatar from './reducers/avatar.reducer'
import fromWhichScreen from "./reducers/fromWhichScreen.reducer";
import likedRecipes from './reducers/likedRecipes.reducer'
import recipe from './reducers/recipe.reducer'
import { createStore, combineReducers } from "redux";
const store = createStore(combineReducers({ bottomTabHeight, token, recipe, username, avatar, likedRecipes, fromWhichScreen }));

//modules pour la navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

//icones
import { MaterialCommunityIcons } from "react-native-vector-icons";

//import des "screens":
import HomeScreen from "./screens/HomeScreen";
import FeedScreen from "./screens/FeedScreen";
import DrawerScreen from "./screens/DrawerScreen";
import AccountScreen from "./screens/AccountScreen";
import AddScreen from "./screens/AddScreen";
import FormScreen from "./screens/FormScreen";
import PlannerScreen from "./screens/PlannerScreen";
import RecipeSheetScreen from "./screens/RecipeSheetScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SnapScreen from "./screens/SnapScreen";
import UrlScreen from "./screens/UrlScreen";

//déclarations our les différentes navigations
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// 3 exemplaires de la Tab nav pour les trois principaux ecrans (sinon problèmes dans la navigation)
function HomeScreenTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: "#ff7f50",
				tabBarInactiveTintColor: "#dfe4ea",
				tabBarLabelPosition: "beside-icon",
				tabBarShowLabel: false,
				tabBarStyle: [
					{
						display: "flex",
						backgroundColor: "#2f3542",
					},
					null,
				],

				tabBarHideOnKeyboard: true,
				tabBarIcon: ({ color }) => {
					let iconName;

					if (route.name === "Feed") {
						iconName = "hamburger";
					} else if (route.name === "Add") {
						iconName = "plus-circle";
					} else if (route.name === "Home") {
						iconName = "notebook";
					}
					return (
						<MaterialCommunityIcons
							name={iconName}
							size={24}
							color={color}
						/>
					);
				},
			})}
		>
			<Tab.Screen
				name="Feed"
				component={FeedScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Add"
				component={AddScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);
}

function AddScreenTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Add"
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: "#ff7f50",
				tabBarInactiveTintColor: "#dfe4ea",
				tabBarLabelPosition: "beside-icon",
				tabBarShowLabel: false,
				tabBarStyle: [
					{
						display: "flex",
						backgroundColor: "#2f3542",
					},
					null,
				],

				tabBarHideOnKeyboard: true,
				tabBarIcon: ({ color }) => {
					let iconName;

					if (route.name === "Feed") {
						iconName = "hamburger";
					} else if (route.name === "Add") {
						iconName = "plus-circle";
					} else if (route.name === "Home") {
						iconName = "notebook";
					}
					return (
						<MaterialCommunityIcons
							name={iconName}
							size={24}
							color={color}
						/>
					);
				},
			})}
		>
			<Tab.Screen
				name="Feed"
				component={FeedScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Add"
				component={AddScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);
}

function FeedScreenTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Feed"
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: "#ff7f50",
				tabBarInactiveTintColor: "#dfe4ea",
				tabBarLabelPosition: "beside-icon",
				tabBarShowLabel: false,
				tabBarStyle: [
					{
						display: "flex",
						backgroundColor: "#2f3542",
					},
					null,
				],

				tabBarHideOnKeyboard: true,
				tabBarIcon: ({ color }) => {
					let iconName;

					if (route.name === "Feed") {
						iconName = "hamburger";
					} else if (route.name === "Add") {
						iconName = "plus-circle";
					} else if (route.name === "Home") {
						iconName = "notebook";
					}
					return (
						<MaterialCommunityIcons
							name={iconName}
							size={24}
							color={color}
						/>
					);
				},
			})}
		>
			<Tab.Screen
				name="Feed"
				component={FeedScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Add"
				component={AddScreen}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);
}

// 3 exemplaires de la Drawer Nav pour les trois principaux écrans, sinon ne fonctionne pas pour chaque écran

function HomeScreenDrawer() {
	return (
		<Drawer.Navigator
			initialRouteName="HomeDrawer"
			drawerContent={(props) => <DrawerScreen />}
			screenOptions={{
				drawerType: "front",
				drawerStyle: {
					width: "80%",
				},
			}}
		>
			<Drawer.Screen
				name="HomeDrawer"
				component={HomeScreenTabs}
				options={{ headerShown: false }}
			/>

			<Drawer.Screen
				name="ShoppingList"
				component={ShoppingListScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Planner"
				component={PlannerScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Account"
				component={AccountScreen}
				options={{ headerShown: false }}
			/>
		</Drawer.Navigator>
	);
}

function AddScreenDrawer() {
	return (
		<Drawer.Navigator
			initialRouteName="AddDrawer"
			drawerContent={(props) => <DrawerScreen />}
			screenOptions={{
				drawerType: "front",
				drawerStyle: {
					width: "80%",
				},
			}}
		>
			<Drawer.Screen
				name="AddDrawer"
				component={AddScreenTabs}
				options={{ headerShown: false }}
			/>

			<Drawer.Screen
				name="ShoppingList"
				component={ShoppingListScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Planner"
				component={PlannerScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Account"
				component={AccountScreen}
				options={{ headerShown: false }}
			/>
		</Drawer.Navigator>
	);
}

function FeedScreenDrawer() {
	return (
		<Drawer.Navigator
			initialRouteName="FeedDrawer"
			drawerContent={(props) => <DrawerScreen />}
			screenOptions={{
				drawerType: "front",
				drawerStyle: {
					width: "80%",
				},
			}}
		>
			<Drawer.Screen
				name="FeedDrawer"
				component={FeedScreenTabs}
				options={{ headerShown: false }}
			/>

			<Drawer.Screen
				name="ShoppingList"
				component={ShoppingListScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Planner"
				component={PlannerScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Account"
				component={AccountScreen}
				options={{ headerShown: false }}
			/>
		</Drawer.Navigator>
	);
}

function ShoppingListScreenDrawer() {
	return (
		<Drawer.Navigator
			initialRouteName="ShoppingList"
			drawerContent={(props) => <DrawerScreen />}
			screenOptions={{
				drawerType: "front",
				drawerStyle: {
					width: "80%",
				},
			}}
		>
			<Drawer.Screen
				name="FeedDrawer"
				component={FeedScreenTabs}
				options={{ headerShown: false }}
			/>

			<Drawer.Screen
				name="ShoppingList"
				component={ShoppingListScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Planner"
				component={PlannerScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Account"
				component={AccountScreen}
				options={{ headerShown: false }}
			/>
		</Drawer.Navigator>
	);
}

function PlannerScreenDrawer() {
	return (
		<Drawer.Navigator
			initialRouteName="Planner"
			drawerContent={(props) => <DrawerScreen />}
			screenOptions={{
				drawerType: "front",
				drawerStyle: {
					width: "80%",
				},
			}}
		>
			<Drawer.Screen
				name="FeedDrawer"
				component={FeedScreenTabs}
				options={{ headerShown: false }}
			/>

			<Drawer.Screen
				name="ShoppingList"
				component={ShoppingListScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Planner"
				component={PlannerScreen}
				options={{ headerShown: false }}
			/>
			<Drawer.Screen
				name="Account"
				component={AccountScreen}
				options={{ headerShown: false }}
			/>
		</Drawer.Navigator>
	);
}

export default function App() {
	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="SignIn">
					<Stack.Screen
						name="SignIn"
						component={SignInScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SignUp"
						component={SignUpScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="HomeDrawer2"
						component={HomeScreenDrawer}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddDrawer2"
						component={AddScreenDrawer}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FeedDrawer2"
						component={FeedScreenDrawer}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="SnapScreen"
						component={SnapScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="UrlScreen"
						component={UrlScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FormScreen"
						component={FormScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RecipeSheetScreen"
						component={RecipeSheetScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="PlannerScreen"
						component={PlannerScreenDrawer}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ShoppingListScreen"
						component={ShoppingListScreenDrawer}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}
