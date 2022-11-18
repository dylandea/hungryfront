import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation, DrawerActions, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";
import {
	StatusBar,
	View,
	Platform,
	StyleSheet,
	TouchableOpacity,
	Text,
	TextInput,
	Image,
	Button
} from "react-native";

import { MaterialCommunityIcons } from "react-native-vector-icons";



function PlannerScreen(props) {
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	const [recipeData, setRecipeData] = useState(props.recipe);
	const [isThisRecipeMine, setIsThisRecipeMine] = useState(false);
	const [weeklyPlanRecipes, setWeeklyPlanRecipes] = useState([]);
	const [weekDays, setWeekDays] = useState([])

	function addDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
	var calculateWeek = () => {
		var today = new Date()
		return [today, addDays(today, 1), addDays(today, 2), addDays(today, 3), addDays(today, 4), addDays(today, 5), addDays(today, 6)]

	}
	var handleGoBack = () => {
		if (props.fromWhichScreen === "FormScreen") {
			navigation.navigate("Home");
		} else {
			navigation.goBack();
		}
	};

	useEffect(() => {
		if (isFocused) {
			setWeekDays(calculateWeek())
			async function initialFetch() {
				var rawResponse = await fetch(
					`https://hungrybook-back.herokuapp.com/initial-fetch-calendar`,
					{
						method: "post",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: `token=${props.token}`,
					}
				);

				var response = await rawResponse.json();
				if (response) {
					setWeeklyPlanRecipes(response.weeklyPlan)
					// console.log("weeklyplan", response.weeklyPlan)
				}
			}
			initialFetch();
		}
	}, [isFocused]);



	var week = weekDays.map((item, i) => {
		let result = weeklyPlanRecipes.filter(x => x.date == item.toLocaleString('fr-FR', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		}))
		if (result.length > 0) {
			var content = (
				<View>
					<Text style={{ alignSelf: "center" }}>{result[0].meal.name}</Text>
					<Image
						style={{
							width: 100,
							height: 100,
						}}
						source={{
							uri: result[0].meal.image
						}}></Image>

				</View>
			)
		}
		return (
			<View key={i}
				style={{
					height: 150,
					width: 150,
					border: 1,
					backgroundColor: "#dfe4ea",
					alignItems: "center",
					margin: 5,
					borderRadius: 20
				}}
			>
				<Text style={{ fontWeight: "bold", marginBottom: 5 }}>{item.toLocaleString('fr-FR', {
					weekday: 'long',
				})}
				</Text>
				{content}

			</View >
		)
	})

	var intro

	if (weekDays.length > 0) {
		intro = (
			<Text
				style={{ fontWeight: "bold", marginBottom: 5, marginTop: 5, color: "#F19066" }}>
				Semaine du {weekDays[0].toLocaleString('fr-FR', {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				})} au {weekDays[6].toLocaleString('fr-FR', {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				})}</Text>)
	}


	//----------------------------- ------------------------------------Début StatusBar
	const MyStatusBar = ({ backgroundColor, ...props }) => (
		<View style={[styles.statusBar, { backgroundColor }]}>
			<SafeAreaView>
				<StatusBar
					translucent
					backgroundColor={backgroundColor}
					barStyle="dark-content"
					{...props}
				/>
			</SafeAreaView>
		</View>
	);
	//----------------------------- ------------------------------------Fin de StatusBar

	return (
		<View style={styles.container}>
			<MyStatusBar backgroundColor="#dfe4ea" barStyle="dark-content" />
			<View style={styles.appBar}>
				<TouchableOpacity
					style={{}}
					onPress={() =>
						navigation.dispatch(DrawerActions.openDrawer())
					}
				>
					<MaterialCommunityIcons
						name="menu"
						size={28}
						color="#2f3542"
						style={{
							paddingLeft: 20,
							paddingRight: 20,
							paddingTop: 10,
							paddingBottom: 10,
							zIndex: 1,
						}}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{intro}
				<View style={{
					alignItems: "center",
					justifyContent: "center",
					flexWrap: "wrap",
					flexDirection: "row",
					marginTop: 10

				}}>
					{week}
				</View>

			</View>
			<View style={styles.ligne}>
				<TouchableOpacity
					style={{}}
					onPress={() => handleGoBack()}
				>

					<MaterialCommunityIcons
						name="arrow-left"
						size={28}
						color="#2f3542"
						style={{
							paddingLeft: 20,
							paddingRight: 20,
							paddingTop: 10,
							zIndex: 1,
						}}
					/>
				</TouchableOpacity>
			</View>


		</View>

	);
}

function mapStateToProps(state) {
	return {
		bottomTabHeight: state.bottomTabHeight,
		recipe: state.recipe,
		token: state.token,
		likedRecipes: state.likedRecipes,
		fromWhichScreen: state.fromWhichScreen
	};
}

function mapDispatchToProps(dispatch) {
	return {
		sendBottomTabHeight: function (bottomTabHeight) {
			dispatch({
				type: "sendBottomTabHeight",
				bottomTabHeight: bottomTabHeight,
			});
		},
		sendPressedRecipeToStore: function (recipe) {
			// console.log(recipe)
			dispatch({
				type: "setRecipe",
				recipe: recipe,
			});
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlannerScreen);

const STATUSBAR_HEIGHT =
	Platform.OS === "android" ? StatusBar.currentHeight : 44;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 50 : 56;
// https://stackoverflow.com/a/39300715

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	statusBar: {
		height: STATUSBAR_HEIGHT,
	},
	appBar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#dfe4ea",
		height: APPBAR_HEIGHT,
		width: "100%",
	},
	content: {
		backgroundColor: "#f5f6fa",
		// flex: 1,
		alignItems: "center",
		// justifyContent: "center"
	},
	ligne: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 5,
		zIndex: 1,
		textAlign: "center"
	},
});
