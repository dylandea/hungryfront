import React, { useState, useEffect } from "react";
import { connect } from "react-redux";




import {
	StatusBar,
	View,
	ScrollView,
	Platform,
	Image,
	FlatList,
	StyleSheet,
	Button,
	Pressable,
	TouchableOpacity,
	TouchableHighlight,
	Text,
	TextInput,
} from "react-native";
import {
	useNavigation,
	DrawerActions,
	useIsFocused,
} from "@react-navigation/native";

import { MaterialCommunityIcons } from "react-native-vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
function ShoppingListScreen(props) {
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	const [shoppingListData, setShoppingListData] = useState([]);

	const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

	const handlePressedCheckbox = async (id) => {
		if (selectedCheckboxes.includes(id)) {
			let tempArray = selectedCheckboxes.filter((x) => x !== id);
			setSelectedCheckboxes(tempArray);
		} else {
			setSelectedCheckboxes([...selectedCheckboxes, id]);
		}
	};

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

	// var DATA = recipeData.ingredients.map((data, i)=>
	// 	{id : i , ingredients : data.name , quantity : data.quantity},
	// )
	// var DATA = [
	// 	// {id : i , ingredients : data.name , quantity : data.quantity},
	// 	{id:2 , ingredients:'creme' , quantity:'100cl'},
	// 	{id:3 , ingredients:'sucre' , quantity:'80cl'},
	// ]

	// var DATA = props.recipe.ingredients
	useEffect(() => {
		if (isFocused) {
			async function initialFetch() {
				var rawResponse = await fetch(
					`https://hungrybook-back.herokuapp.com/recipesheet/initial-fetch-shoppingList`,
					{
						method: "post",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: `token=${props.token}`,
					}
				);

				var response = await rawResponse.json();
				setShoppingListData(response.shoppingList);
			}
			initialFetch();
		}
	}, [isFocused]);

	console.log(shoppingListData, "front shop");

	var item = ({ item }) => {
		return (
			<View style={{ flexDirection: "row" }}>
				<View style={{ width: 110, backgroundColor: "#dfe4ea" }}>
					<TouchableOpacity
						style={{}}
						onPress={() => handlePressedCheckbox(item._id)}
					>
						<MaterialCommunityIcons
							name={
								selectedCheckboxes.includes(item._id)
									? "checkbox-marked-outline"
									: "checkbox-blank-outline"
							}
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
				<View style={{ width: 110, backgroundColor: "#dfe4ea" }}>
					<Text
						style={{
							textAlign: "center",
							fontSize: 20,
							textDecorationLine: selectedCheckboxes.includes(
								item._id
							)
								? "line-through"
								: "none",
						}}
					>
						{item.name}
					</Text>
				</View>
				<View style={{ width: 110, backgroundColor: "#dfe4ea" }}>
					<Text
						style={{
							textAlign: "center",
							fontSize: 20,
							textDecorationLine: selectedCheckboxes.includes(
								item._id
							)
								? "line-through"
								: "none",
						}}
					>
						{item.quantity}
					</Text>
				</View>
			</View>
		);
	};

	const handleDeleteSelected = (arrayOfSelected) => {
		async function deleteSelected() {
			var rawResponse = await fetch(
				`https://hungrybook-back.herokuapp.com/recipesheet/delete-selected-shoppingList`,
				{
					method: "post",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: `token=${props.token}&selection=${JSON.stringify(arrayOfSelected)}`,
				}
			);

			var response = await rawResponse.json();
			setShoppingListData(response.shoppingList);
		}
		deleteSelected();
	}

	const handleDeleteAll = () => {
		async function deleteAll() {
			var rawResponse = await fetch(
				`https://hungrybook-back.herokuapp.com/recipesheet/delete-all-shoppingList`,
				{
					method: "post",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: `token=${props.token}`,
				}
			);

			var response = await rawResponse.json();
			setShoppingListData(response.shoppingList);
		}
		deleteAll();
	}

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
				<TouchableOpacity
						style={{}}
						onPress={() => handleDeleteSelected(selectedCheckboxes)}
					>
						<MaterialCommunityIcons
							name="delete-sweep"
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
					<TouchableOpacity
						style={{}}
						onPress={() => handleDeleteAll()}
					>
						<MaterialCommunityIcons
							name="delete"
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
			<View style={{ flex: 1 }}>
				<View style={styles.content}>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							marginTop: "10%",
						}}
					>
						<View style={{ flexDirection: "row", margin: 3 }}>
							<View
								style={{
									width: 110,
									backgroundColor: "#F19066",
								}}
							>
								<Text
									style={{
										textAlign: "center",
										fontSize: 20,
									}}
								>
									valide
								</Text>
							</View>
							<View
								style={{
									width: 110,
									backgroundColor: "#F19066",
								}}
							>
								<Text
									style={{
										textAlign: "center",
										fontSize: 20,
									}}
								>
									vos produits
								</Text>
							</View>
							<View
								style={{
									width: 110,
									backgroundColor: "#F19066",
								}}
							>
								<Text
									style={{
										textAlign: "center",
										fontSize: 20,
									}}
								>
									quantity
								</Text>
							</View>
						</View>
						<FlatList
							data={shoppingListData}
							renderItem={item}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
				</View>
				<View style={styles.bottomTab}>
					<View
						style={{
							height: props.bottomTabHeight,
							backgroundColor: "#f5f6fa",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<TouchableOpacity
							style={{}}
							onPress={() => navigation.goBack()}
						>
							<MaterialCommunityIcons
								name="arrow-left"
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
				</View>
			</View>
		</View>
	);
}

function mapStateToProps(state) {
	return {
		bottomTabHeight: state.bottomTabHeight,
		recipe: state.recipe,
		token: state.token,
	};
}

/*function mapDispatchToProps(dispatch) {
	return {
		onSubmitBottomTabHeight: function (bottomTabHeight) {
			dispatch({ type: "initializeBottomTabHeight", bottomTabHeight: bottomTabHeight });
		},
	};
}*/

export default connect(mapStateToProps, null)(ShoppingListScreen);

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
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f6fa",
	},

	searchSection: {
		flex: 1,
		height: 40,
		margin: 12,
		marginLeft: 0,

		borderRadius: 5,

		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	searchIcon: {
		padding: 5,
	},
	searchInput: {
		flex: 1,
		paddingTop: 10,
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		backgroundColor: "#fff",
		color: "#424242",
	},
	filterContainer: {
		alignSelf: "center",
		padding: 12,
		margin: 5,
		borderWidth: 1,
		borderRadius: 100,
	},
	overlay: {
		flex: 1,
		position: "absolute",
		left: 0,
		top: 0,
		opacity: 0.97,
		borderBottomLeftRadius: 50,
		borderBottomRightRadius: 50,
		backgroundColor: "white",
		width: "100%",
	},
	overlayShadow: {
		flex: 1,
		position: "absolute",
		left: 0,
		top: 0,
		opacity: 0.6,

		backgroundColor: "black",
		width: "100%",
	},
});
