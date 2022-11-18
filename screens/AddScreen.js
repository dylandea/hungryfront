import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation, DrawerActions, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
	StatusBar,
	View,
	Platform,
	StyleSheet,
	TouchableOpacity,
	Text,
	ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialCommunityIcons } from "react-native-vector-icons";

function AddScreen(props) {
	const navigation = useNavigation();
	const [searchInput, setSearchInput] = useState("");
	const isFocused = useIsFocused();

	//Clear Recipe dans le store
	useEffect(() => {
		if (isFocused) {
			props.setRecipe({});
		}
	}, [isFocused]);

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

	// -----------------------------------------------------------BOUTONS---------------------------------------------------------
	const AppButton = ({ onPress, title }) => (
		<TouchableOpacity onPress={() => navigation.navigate("SnapScreen")} style={styles.appButtonContainer}>
			<Text style={styles.appButtonText}>
				{title}
			</Text>
			<MaterialCommunityIcons
				name="camera"
				size={28}
				color="#d35400"
				style={{
					paddingLeft: 20,
					paddingRight: 20,
					paddingTop: 10,
					paddingBottom: 10,
					zIndex: 1,
				}}
			/>
		</TouchableOpacity>
	);
	const UrlButton = ({ onPress, title }) => (
		<TouchableOpacity onPress={() => navigation.navigate("UrlScreen")} style={styles.appButtonContainer}>
			<Text style={styles.appButtonText}>
				{title}
			</Text>
			<MaterialCommunityIcons
				name="web"
				size={28}
				color="#d35400"
				style={{
					paddingLeft: 20,
					paddingRight: 20,
					paddingTop: 10,
					paddingBottom: 10,
					zIndex: 1,
				}}
			/>
		</TouchableOpacity>
	);
	const ManualButton = ({ onPress, title }) => (
		<TouchableOpacity onPress={() => navigation.navigate("FormScreen")} style={styles.appButtonContainer}>
			<Text style={styles.appButtonText}>
				{title}
			</Text>
			<MaterialCommunityIcons
				name="pencil"
				size={28}
				color="#d35400"
				style={{
					paddingLeft: 20,
					paddingRight: 20,
					paddingTop: 10,
					paddingBottom: 10,
					zIndex: 1,
				}}
			/>
		</TouchableOpacity>
	);
	// -----------------------------------------------------------FIN BOUTONS --------------------------------------------------------------
	return (
		<ImageBackground source={require('../assets/cook.jpg')} style={styles.container} blurRadius={2}>

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
				<Text style={{ fontSize: 18, textAlign: "center", color: "#2F3542" }}>Ma nouvelle recette.</Text>
			</View>
			<View>

			</View>

			<View style={{ marginTop: 120 }}>
				<View style={styles.screenContainer}>
					<AppButton title="Avec mon appareil photo " size="sm" />
				</View>
				<View style={styles.screenContainer}>
					<UrlButton title="A l'aide d'une URL" size="sm" />
				</View>
				<View style={styles.screenContainer}>
					<ManualButton title="Saisie manuelle" size="sm" />
				</View>
			</View>









		</ImageBackground>
	);
}

/* function mapStateToProps(state) {
	return { listPOIFromState: state.listPOI };
} */

function mapDispatchToProps(dispatch) {
	return {
		setRecipe: function (recipe) {
			dispatch({ type: "setRecipe", recipe: recipe });
		},
	};
}

export default connect(null, mapDispatchToProps)(AddScreen);

// export default AddScreen;

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
		justifyContent: "flex-start",
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
	appButtonContainer: {
		elevation: 8,
		backgroundColor: "#f5f6fa",
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 40,
		border: 1

	},
	appButtonText: {
		fontSize: 18,
		color: "#d35400",
		fontWeight: "bold",
		alignSelf: "center",
		textAlign: "center"
	},
	screenContainer: {
		//flex: 1,
		justifyContent: "center",
		padding: 16
	},
	text: {
		textAlign: "center",
		fontSize: 22,
		marginTop: 45


	}

});
