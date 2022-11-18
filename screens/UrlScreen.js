import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

import { SafeAreaView } from "react-native-safe-area-context";
import {
	StatusBar,
	View,
	Platform,
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	TextInput,
	Modal,
	Image,
} from "react-native";

import { MaterialCommunityIcons } from "react-native-vector-icons";



function UrlScreen(props) {
	const navigation = useNavigation();
	const [currentWebViewURL, setCurrentWebViewURL] = useState("");
	const [webView, setWebView] = useState(false);
	const [loadModalOpen, setLoadModalOpen] = useState(false);

	const onNavigationStateChange = (webViewState) => {
		setCurrentWebViewURL(webViewState.url);
	};

	const [searchInput, setSearchInput] = useState("");

	const handleUrlSubmit = async (url) => {
		// async function UrlSearch() {
		setWebView(false);
		setLoadModalOpen(true);
		var rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/api/url-scrapper`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `url=${url}`,
			}
		);

		var response = await rawResponse.json();
		console.log(response);

		// }
		// UrlSearch();
		if (response.status) {
			props.setRecipe(response.recipe);
			setLoadModalOpen(false);
			navigation.navigate("FormScreen");
		}
	};

	//-------------------------------------------------------Boutons ------------------------------------------------

	const OpenNavigator = ({ onPress, title }) => (
		<TouchableOpacity
			onPress={() => {
				setWebView(true);
			}}
			style={styles.appButtonContainer}
		>
			<Text style={styles.appButtonText}>{title}</Text>
			<MaterialCommunityIcons
				name="web"
				size={28}
				color="#ffffff"
				onPress={() => {
					setWebView(true);
				}}
			/>
		</TouchableOpacity>
	);

	const AddUrl = ({ onPress, title }) => (
		<TouchableOpacity
			style={{
				marginRight: "8%",
			}}
			onPress={() => handleUrlSubmit(currentWebViewURL)}
		>
			<MaterialCommunityIcons
				name="plus-circle"
				size={50}
				color="#d35400"
				style={{
					zIndex: 1,
				}}
			/>
		</TouchableOpacity>
	);

	const ValidateUrl = ({ onPress, title }) => (
		<TouchableOpacity
			onPress={() => {
				handleUrlSubmit(searchInput);
			}}
			style={styles.validateButtonContainer}
		>
			<Text style={styles.validateText}>{title}</Text>
			<MaterialCommunityIcons
				name="checkbox-marked-circle-plus-outline"
				size={28}
				color="#ffffff"
			/>
		</TouchableOpacity>
	);

	//-------------------------------------------------------Fin boutons ---------------------------------------------

	//-----------------------------------Modal chargement

	var LoadingModal = (
		<Modal visible={loadModalOpen}>
			<View style={{ justifyContent: "center", flex: 1 }}>
				<Image
					style={{}}
					source={require("../assets/chef.gif")}
					resizeMode="contain"
					resizeMethod="resize"
				/>
			</View>
		</Modal>
	);

	//-----------------------------------Fin modal chargment
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
	if (webView) {
		return (
			<View style={styles.container}>
				<MyStatusBar
					backgroundColor="#dfe4ea"
					barStyle="dark-content"
				/>

				<WebView
					style={styles.container}
					source={{ uri: "https://google.com" }}
					onNavigationStateChange={onNavigationStateChange}
					javaScriptEnabled
					domStorageEnabled
					startInLoadingState={false}
				/>

				<View style={styles.bottomTab}>
					<View
						style={{
							height: props.bottomTabHeight,

							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 20,
						}}
					>
						<TouchableOpacity
							style={{}}
							onPress={() => setWebView(false)}
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
						<AddUrl size="xl" />
					</View>
				</View>
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<MyStatusBar
					backgroundColor="#dfe4ea"
					barStyle="dark-content"
				/>
				<View style={styles.title}>
					<Text
						style={{
							fontSize: 24,
							textAlign: "center",
						}}
					>
						Ajouter via Internet
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<View style={styles.content}>
						{/* <Text style={{ fontSize: 20 }}>UrlScreen</Text> */}

						<View style={styles.screenContainer}>
							<OpenNavigator
								title="Rechercher une recette sur internet"
								size="sm"
							/>
						</View>
						<TextInput
							style={styles.searchInput}
							onChangeText={(value) => setSearchInput(value)}
							value={searchInput}
							placeholder="ICI copier le lien du site"
							// placeholderTextColor={"#d35400"}
							underlineColorAndroid="transparent"
						/>
						<View style={styles.validateContainer}>
							<ValidateUrl title="Valider" size="sm" />
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
				{LoadingModal}
			</View>
		);
	}
}

function mapStateToProps(state) {
	return { bottomTabHeight: state.bottomTabHeight, recipe: state.recipe };
}

function mapDispatchToProps(dispatch) {
	return {
		setRecipe: function (recipe) {
			dispatch({ type: "setRecipe", recipe: recipe });
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlScreen);

const STATUSBAR_HEIGHT =
	Platform.OS === "android" ? StatusBar.currentHeight : 44;
// https://stackoverflow.com/a/39300715

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	statusBar: {
		height: STATUSBAR_HEIGHT,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f1f2f6",
	},
	screenContainer: {
		marginBottom: "15%",
	},
	appButtonContainer: {
		elevation: 8,
		backgroundColor: "#F19066",
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		// marginTop: 10,
	},
	appButtonText: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
		alignSelf: "center",
	},
	searchInput: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		backgroundColor: "#dfe4ea",
		borderRadius: 15,
		borderWidth: 1.1,
		width: "85%",
		borderColor: "#d35400",
	},
	title: {
		backgroundColor: "#dfe4ea",
		height: 50,
		justifyContent: "center",
		alignContent: "center",
		// marginBottom: 10
	},

	validateButtonContainer: {
		elevation: 8,
		backgroundColor: "#F19066",
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: "10%",
		borderWidth: 1,
		borderColor: "#fff",
	},
	validateText: {
		fontSize: 20,
		color: "#fff",
		fontWeight: "bold",
		alignSelf: "center",
	},
});
