import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import {
	StatusBar,
	View,
	Platform,
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	TextInput,
	ImageBackground,
	KeyboardAvoidingView,
	Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialCommunityIcons } from "react-native-vector-icons";
import { color } from "react-native-reanimated";

function SignInScreen(props) {
	const navigation = useNavigation();

	const [searchInput, setSearchInput] = useState("");

	//------------mettre les champs de saisie a vide------------------
	const [signInEmail, setSignInEmail] = useState("");
	const [signInPassword, setSignInPassword] = useState("");
	//---------------------------------------------------------------------

	//pour si l'utilisater existe lui faire un redirect sur un page (if)--------
	const [userExists, setUserExists] = useState(false);
	//--------------------------------------------------------------------------

	//pour si l'utilisateur existe pas lui afficher une page d'err (else)-------
	const [listErrorsSignin, setErrorsSignin] = useState([]);
	//--------------------------------------------------------------------------

	//-----------------------------------Show password -----------------
	const [passwordVisibility, setPasswordVisibility] = useState(true);
	const [rightIcon, setRightIcon] = useState("eye");
	//------------------------------------------------------------

	var handleSubmitSignin = async () => {
		const rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/users/sign-in`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
			}
		);

		const response = await rawResponse.json();

		if (response.result == true) {
			props.addToken(response.token);
			props.addUsername(response.username);
			props.addAvatar(response.avatar);
			props.addLikedRecipes(response.likedRecipes);
			setUserExists(true);
		} else {
			setErrorsSignin(response.error);
		}
	};

	useEffect(() => {
		if (userExists) {
			navigation.navigate("FeedDrawer2");
		}
	}, [userExists]);

	var tabErrorsSignin = listErrorsSignin.map((error, i) => {
		return (
			<Text style={{ color: "red", height: 40, margin: 10 }} key={i}>
				{error}
			</Text>
		);
	});

	// -----------------------------------------------------Password show ----------------------------------------------------------------------
	const handlePasswordVisibility = () => {
		if (rightIcon === "eye") {
			setRightIcon("eye-off");
			setPasswordVisibility(!passwordVisibility);
		} else if (rightIcon === "eye-off") {
			setRightIcon("eye");
			setPasswordVisibility(!passwordVisibility);
		}
	};
	//------------------------------------------------------fin password show ---------------------------------------------------------------

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
	const AppButton = ({ onPress, title }) => (
		<TouchableOpacity
			onPress={() => handleSubmitSignin()}
			style={styles.appButtonContainer}
		>
			<Text style={styles.appButtonText}>{title}</Text>
		</TouchableOpacity>
	);
	const SignUp = ({ onPress, title }) => (
		<TouchableOpacity
			onPress={() => navigation.navigate("SignUp")}
			style={styles.appButtonContainer1}
		>
			<Text style={styles.appButtonText1}>{title}</Text>
		</TouchableOpacity>
	);

	return (
		<ImageBackground
			source={require("../assets/eggs.jpg")}
			style={styles.container}
			blurRadius={3}
		>
			<MyStatusBar backgroundColor="#dfe4ea" barStyle="dark-content" />

			<View style={{ flex: 1 }}>
				<View style={{ marginTop: 40, marginBottom: 50 }}>
					<Text style={styles.baseText}>THE</Text>
					<Text style={styles.baseText}>HUNGRY-BOOK</Text>
				</View>

				<View style={styles.content}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
					>
						{/* <TouchableOpacity> */}
						<TextInput
							style={styles.inputContainer}
							inputStyle={{ marginLeft: 10 }}
							placeholder="Adresse E-mail"
							keyboardType="email-address"
							overflow="hidden"
							keyboardAppearance="dark"
							onChangeText={(val) => setSignInEmail(val)}
							value={signInEmail}
						/>
						<View style={styles.inputContainer}>
						
							<TextInput
								style={styles.inputPass}
								inputStyle={{ marginLeft: 10 }}
								placeholder="Votre mot de passe"
								secureTextEntry={passwordVisibility}
								onChangeText={(val) => setSignInPassword(val)}
								value={signInPassword}					
							/>
							
							<Pressable onPress={handlePasswordVisibility}>
								<MaterialCommunityIcons
									name={rightIcon}
									size={22}
									color="#232323"
								/>
							</Pressable>
						
							
						</View>

						{tabErrorsSignin}

						<View style={styles.screenContainer}>
							<AppButton title="Me connecter" size="sm" />
						</View>
					</KeyboardAvoidingView>
					<View style={{ marginTop: 120 }}>
						<Text style={styles.goSignup}>
							Vous n'avez pas encore de compte ?
						</Text>
					</View>

					<View style={styles.screenContainer}>
						<SignUp title="Créer mon compte" size="sm" />
					</View>
				</View>
			</View>
		</ImageBackground>
	);
}

/* function mapStateToProps(state) {
	return { listPOIFromState: state.listPOI };
}*/

function mapDispatchToProps(dispatch) {
	return {
		addToken: function (token) {
			dispatch({ type: "addToken", token: token });
		},
		addUsername: function (username) {
			dispatch({ type: "addUsername", username: username });
		},
		addAvatar: function (avatar) {
			dispatch({ type: "addAvatar", avatar: avatar });
		},
		addLikedRecipes: function (likedRecipes) {
			dispatch({ type: "addLikedRecipes", likedRecipes: likedRecipes });
		},
	};
}

export default connect(null, mapDispatchToProps)(SignInScreen);

//export default SignInScreen;

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
	content: {
		flex: 1,
		justifyContent: "center",
		margin: "15%",
	},
	baseText: {
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 50,
		color: "#e67e22",
		borderColor: "#fff",
		textShadowColor: "#2c3e50",
		textShadowOffset: { width: 3, height: 3 },
		textShadowRadius: 10,
	},
	text: {
		marginLeft: 12,
		marginTop: 12,
	},
	screenContainer: {
		//flex: 1,
		justifyContent: "center",
		padding: 16,
	},
	appButtonContainer: {
		elevation: 8,
		backgroundColor: "#e67e22",
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	appButtonText: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
		alignSelf: "center",
	},
	goSignup: {
		fontSize: 18,
		color: "#ffffff",
		textAlign: "center",
	},
	appButtonContainer1: {
		elevation: 8,
		backgroundColor: "#2F3542",
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	appButtonText1: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
		alignSelf: "center",
	},
	inputContainer: {
		backgroundColor: "#dfe4ea",
		borderRadius: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 0.75,
		padding: 10,
		paddingLeft: 20,
		height: 55,
		marginTop: 10,
		marginBottom: 10,
	},
	inputPass: {
		backgroundColor: "#dfe4ea",
		borderRadius: 15,
		width: 210,
		alignItems: "center",
		// marginTop: 10,
		// marginBottom: 10,
	},
});
