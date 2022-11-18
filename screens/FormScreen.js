import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as ImagePicker from 'expo-image-picker';



import {
	StatusBar,
	View,
	Platform,
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	TextInput,
	ScrollView,
	Pressable,
	Switch,
	KeyboardAvoidingView,
	Image,
	ImageBackground,
	Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function FormScreen(props) {

	const [modalOpen, setModalOpen] = useState(false);
	const navigation = useNavigation();

	// ETAT OBJET RECIPE
	const [recipe, setRecipe] = useState({ name: "", image: "", prepTime: "", cookTime: "", directions: "", servings: "", privateStatus: "", tags: [], recipeId: "", ingredients: [] })
	const isFocused = useIsFocused();
	const [nameError, setNameError] = useState(null)


	//RECUPERATION DU STORE SI EXISTE
	useEffect(() => {
		if (isFocused) {

			if (props.recipe.name) {
				console.log("store existe")
				setRecipe(props.recipe);
				if (props.recipe.tags) {
					setSelectedFiltersArray(props.recipe.tags)
				}
				setNumInputs(props.recipe.ingredients.length)
			}

        }
    }, [isFocused]);


	//-----------------------FONCTION DE SOUMISSION DU FORMULAIRE

	var handleSubmitForm = async function () {

		props.fromWhichScreen("FormScreen")

		let recipeObj = { ...recipe };

		//------recup du multi champs ingredients et push dans l'objet recipe
		let recipeIngredientsCopy = [];
		for (let i = 0; i < numInputs; i++) {
			if (recipe.ingredients.length > 0) {
				recipeIngredientsCopy.push({ name: recipe.ingredients[i].name, quantity: recipe.ingredients[i].quantity })
			} else {
				recipeIngredientsCopy.push({ name: refInputs.current[i], quantity: refInputsQuantity.current[i] })
			}
		}
		recipeObj.ingredients = [...recipeIngredientsCopy];
		recipeObj.privateStatus = !isEnabled;
		if (!props.recipe.tags) {
			recipeObj.tags = [...selectedFiltersArray];
		} else {
			recipeObj.tags = recipe.tags
		}

		//verif si champs vides
		if (recipeObj.ingredients.length === 0 || recipeObj.cookTime === "" || recipeObj.prepTime === "" || recipeObj.name === "" || recipeObj.directions === "" || recipeObj.servings === "") {
			setNameError("Veuillez remplir tous les champs")
		} else {

			if (image) {
				var data = new FormData();
				//attention ne fonctionne que sur jpg
				data.append('image', {
					uri: image,
					type: 'image/jpeg',
					name: 'recipe.jpg',
				});

				var rawResponseImg = await fetch(`https://hungrybook-back.herokuapp.com/upload-image`, {
					method: 'post',
					body: data
				})

				var responseImg = await rawResponseImg.json()

				if (responseImg.result) {
					recipeObj.image = responseImg.resultObj.imageUrl
				} else {
					recipeObj.image = "https://res.cloudinary.com/cloud022/image/upload/v1659520138/default-placeholder_ddf2uy.png"
				}

			} else if (props.recipe.image) {
				recipeObj.image = recipe.image

			} else {
				recipeObj.image = "https://res.cloudinary.com/cloud022/image/upload/v1659520138/default-placeholder_ddf2uy.png"
			}


			//---- envoi recette en BDD 
			setModalOpen(true)
			let recipeData = { recipe: recipeObj, userToken: props.token, userName: props.username }
			var rawResponse = await fetch(`https://hungrybook-back.herokuapp.com/validate-form`, {
				method: 'POST',
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
				body: JSON.stringify(recipeData)
			})
			var response = await rawResponse.json()

			var recipeToStore = response.recipeSaved
			console.log(response.recipeSaved, "--------")

			//---------envoi recipe traitee Backend dans store
			if (recipeToStore) {
				props.setRecipe(recipeToStore)
			}

			setModalOpen(false);
			// redirection vers fiche recette
			navigation.navigate("RecipeSheetScreen")

		}

	}

	//-----------------------FIN FONCTION DE SOUMISSION DU FORMULAIRE

	//-------------FONCTION MISE A JOUR DES CHAMPS SUR LE STATE RECIPE
	const handleChange = (name, value) => {
		setRecipe({
			...recipe,
			[name]: value,
		});
	};
	//-------------FIN FONCTION MISE A JOUR DES CHAMPS SUR LE STATE RECIPE

	//-----------------------------------IMAGE PICKER
	const [image, setImage] = useState(null);
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	//----------------------------------FIN IMAGE PICKER

	// ----------------------------------INPUTS INGREDIENTS
	const [textValue, setTextValue] = useState('');
	const [numInputs, setNumInputs] = useState(recipe.ingredients.length);
	const refInputs = useRef([textValue]);
	const [numValue, setNumValue] = useState('');
	const refInputsQuantity = useRef([numValue]);

	const setInputValue = (index, value) => {
		const inputs = refInputs.current;
		inputs[index] = value;
		setTextValue(value)
	}
	const setInputQuantity = (index, value) => {
		const inputsQuantity = refInputsQuantity.current;
		inputsQuantity[index] = value;
		setNumValue(value)
	}
	const addInput = () => {
		// add a new element in our refInputs array
		refInputs.current.push('');
		refInputsQuantity.current.push('');
		// increase the number of inputs
		setNumInputs(value => value + 1);
	}
	const removeInput = (i) => {
		// remove from the array by index value
		refInputs.current.splice(i, 1)[0];
		refInputsQuantity.current.splice(i, 1)[0];
		// decrease the number of inputs
		setNumInputs(value => value - 1);
	}
	const inputsIngredients = [];

	if (recipe.ingredients.length > 0) {
		for (let i = 0; i < numInputs; i++) {
			inputsIngredients.push(
				<View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={{ marginLeft: 10, color: "#fff" }}>{i + 1}.</Text>
					<TextInput
						style={styles.input}
						onChangeText={(value) => setInputValue(i, value)}
						// value={String(refInputs.current[i])}
						value={recipe.ingredients[i].name}

						placeholder="ex: lait"
						placeholderTextColor={"#d35400"}
					/>
					<TextInput
						style={styles.input}
						onChangeText={(value) => setInputQuantity(i, value)}
						// value={String(refInputsQuantity.current[i])}
						value={recipe.ingredients[i].quantity}

						placeholder="20cl"
						placeholderTextColor={"#d35400"}
					/>
					{/* To remove the input */}
					<Pressable onPress={() => removeInput(i)} style={{ marginLeft: 5 }}>
						<MaterialCommunityIcons
							name="close"
							size={25}
							color="#fff"
							style={{
								paddingLeft: 20,
								paddingRight: 20,
								paddingTop: 10,
								paddingBottom: 10,
								zIndex: 1,
							}}
						/>
					</Pressable>
				</View>
			);
		}

	} else {

		for (let i = 0; i < numInputs; i++) {
			inputsIngredients.push(
				<View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={{ marginLeft: 10, color: "#fff" }}>{i + 1}.</Text>
					<TextInput
						style={styles.input}
						onChangeText={(value) => setInputValue(i, value)}
						// value={{}}}
						value={String(refInputs.current[i])}
						// value={recipe.ingredients[i].name}

						placeholder="ex: lait"
						placeholderTextColor={"#d35400"}
					/>
					<TextInput
						style={styles.input}
						onChangeText={(value) => setInputQuantity(i, value)}
						value={String(refInputsQuantity.current[i])}
						// value={recipe.ingredients[i].quantity}

						placeholder="20cl"
						placeholderTextColor={"#d35400"}
					/>
					{/* To remove the input */}
					<Pressable onPress={() => removeInput(i)} style={{ marginLeft: 5 }}>
						<MaterialCommunityIcons
							name="close"
							size={25}
							color="#fff"
							style={{
								paddingLeft: 20,
								paddingRight: 20,
								paddingTop: 10,
								paddingBottom: 10,
								zIndex: 1,
							}}
						/>
					</Pressable>
				</View>
			);
		}
	}


	// ----------------------------------FIN INPUTS INGREDIENTS

	//----------------------------------------SWITCH publication publique
	const [isEnabled, setIsEnabled] = useState(true);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);
	//------------------------------------fin SWITCH publication publique

	//------------------------------------------TAG LIST
	var tags = [
		"entrée",
		"plat",
		"dessert",
		"apéro",
		"boisson",
		"asiatique",
		"américain",
		"italien",
		"diététique",
		"végétarien",
		"rapide",
		"gastronomique",
		"brunch",
		"festif",
	];
	const [selectedFiltersArray, setSelectedFiltersArray] = useState(recipe.tags);
	const handlePressedChip = (name) => {
		if (selectedFiltersArray.includes(name)) {
			let tempArray = selectedFiltersArray.filter((x) => x !== name);
			setSelectedFiltersArray(tempArray);
		} else {
			setSelectedFiltersArray([...selectedFiltersArray, name]);
		}
	};

	var tagList = tags.map((item, index) => {
		var color = selectedFiltersArray.includes(item) ? "#F19066" : "#dfe4ea"
		return <TouchableOpacity key={index}
			style={{ backgroundColor: color, padding: 10, margin: 5, borderRadius: 5 }}
			onPress={() => handlePressedChip(item)}>
			<Text>{item}</Text>
		</TouchableOpacity >
	})

	//-------------------------------------------FIN TAG LIST

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
	//-----------------------------------------------------------------Fin de StatusBar
	const AppButton = ({ onPress, title }) => (
		<TouchableOpacity onPress={pickImage} style={styles.appButtonContainer}>
			<Text style={styles.appButtonText}>
				{title}
			</Text>
			<MaterialCommunityIcons
				name="image-multiple"
				size={28}
				color="#ffffff"
				onPress={pickImage}
			/>
		</TouchableOpacity>
	);

	const ValidateForm = ({ onPress, title }) => (
		<TouchableOpacity onPress={() => handleSubmitForm()} style={styles.appButtonContainer}>
			<Text style={styles.appButtonText}>
				{title}
			</Text>
		</TouchableOpacity>
	);
	//------------------------------------------------------RETURN------------------------------------------

	return (
		<ImageBackground source={require('../assets/marble.jpg')} style={styles.container} blurRadius={5}>
			<MyStatusBar backgroundColor="#dfe4ea" barStyle="dark-content" />
			{/* ------------------------------------Debut du formulaire */}
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.title}>
					<Text style={{
						fontSize: 24,
						textAlign: "center",
					}}
					>Ma nouvelle recette</Text>
				</View>


				{/* <Text style={styles.label}>Nom de la recette</Text> */}
				<TextInput
					style={styles.input}
					onChangeText={(value) => handleChange('name', value)}
					value={recipe.name}
					placeholder={"Nom de la recette"}
					placeholderTextColor={"#d35400"}
					maxLength={24}
				/>


				{/* <Text style={styles.label}>Image</Text> */}
				{/* <View style={styles.align}> */}
				<View style={styles.screenContainer}>
					<AppButton title="Ajouter une photo" size="sm" />
					{image &&
						<View style={styles.alignImage}>
							<Image source={{ uri: image }}
								style={{
									width: 400,
									height: 250,
								}} />
						</View>
					}

				</View>

				<View style={{ display: "flex", flexDirection: "row" }}>
					<View style={{ display: "flex", flexDirection: "column", width: "50%" }}>
						<Text style={{ alignSelf: "center", color: "white" }}>Temps de préparation</Text>
						<View style={{ display: "flex", flexDirection: "row" }}>
							<TextInput
								style={styles.inputDuo}
								onChangeText={(value) =>
									handleChange("prepTime", value)
								}
								value={String(recipe.prepTime)}
								placeholder={"en minutes"}
								placeholderTextColor={"#d35400"}
								keyboardType="numeric"

							/>

						</View>
					</View>

					<View style={{ display: "flex", flexDirection: "column", width: "50%" }}>
						<Text style={{ alignSelf: "center", color: "white" }}>Temps de cuisson</Text>
						<View style={{ display: "flex", flexDirection: "row" }}>
							<TextInput
								style={styles.inputDuo}
								onChangeText={(value) =>
									handleChange("cookTime", value)
								}
								value={String(recipe.cookTime)}
								placeholder={"en minutes"}
								placeholderTextColor={"#d35400"}
								keyboardType="numeric"
							/>
						</View>
					</View>
				</View>
				<View style={{
					alignItems: "center",
					justifyContent: "center",
				}}>
					<TextInput
						style={styles.inputSolo}
						onChangeText={(value) =>
							handleChange("servings", value)
						}
						value={String(recipe.servings)}
						placeholder={"Nombre de personnes"}
						placeholderTextColor={"#d35400"}
					/>
				</View>
				{/* <Text style={styles.label}>Nombre de personnes</Text> */}



				<Text style={styles.label}>Ingrédients</Text>
				{/* MULTPIPLE INPUTS */}
				{inputsIngredients}
				<Pressable onPress={addInput} style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginLeft: 10 }}>
					<MaterialCommunityIcons
						name="plus"
						size={25}
						color="#fff"
						style={{
							paddingTop: 10,
							paddingBottom: 10,
							zIndex: 1,
						}}
					/>
					<Text style={{ fontWeight: 'bold', color: "#fff", fontSize:18 }}> Ajouter un ingrédient</Text>
				</Pressable>

				{/* FIN MULTIPLE INPUTS */}

				<Text style={styles.label}>Instructions</Text>
				{/* <ScrollView
					scrollEnabled="false"
				> */}
				{/* "fausse" scollview pour escape le clavier en multiline, voir https://stackoverflow.com/questions/38981117/dismiss-keyboard-in-multiline-textinput-in-react-native */}
				<TextInput
					style={{
						height: 120,
						margin: 12,
						borderWidth: 1,
						padding: 10,
						backgroundColor: "#dfe4ea",
						borderWidth: 0.7,
						borderRadius: 10

					}}
					multiline
					onChangeText={(value) => handleChange('directions', value)}
					value={recipe.directions}
				/>

				{/* </ScrollView> */}


				<Text style={styles.label}>Tags</Text>
				<View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
					{tagList}
				</View>


				<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginLeft: 10, marginBottom: 10 }}>
					<Text style={styles.label}>Partager sur le feed Hungry: </Text>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text style={{ marginLeft: 10, color: "#fff" }}>{isEnabled ? "Oui" : "Non"}</Text>
						<Switch
							style={{ marginRight: 10, marginLeft: 10 }}
							trackColor={{ false: "#2F3542", true: "#d35400" }}
							thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
							ios_backgroundColor="#3e3e3e"
							onValueChange={toggleSwitch}
							value={isEnabled}
						/>
					</View>
				</View>

				<View style={styles.screenContainer}>
					{!!nameError && (
						<Text style={{ color: "red", textAlign: "center" }}>{nameError}</Text>
					)}
					<ValidateForm title="Valider ma recette" size="sm" />
				</View>

				<Modal visible={modalOpen}>
					<View style={{ justifyContent: 'center', flex: 1 }}>
						<Image style={{

						}}
							source={require("../assets/chef.gif")}
							resizeMode="contain"
							resizeMethod="resize"
						/>
					</View>
				</Modal>

			</ScrollView >


			<View
				style={{
					height: props.bottomTabHeight,
					backgroundColor: "#f5f6fa",
					display: "flex",
					justifyContent: "center",
				}}
			>
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
					{/* ------------------------------------Fin du formulaire */}
				</View>
			</View>
		</ImageBackground>
	);
}

function mapStateToProps(state) {
	return { bottomTabHeight: state.bottomTabHeight, token: state.token, username: state.username, recipe: state.recipe };
}

function mapDispatchToProps(dispatch) {
	return {
		setRecipe: function (recipe) {
			dispatch({ type: "setRecipe", recipe: recipe });
		},
		fromWhichScreen: function (fromWhichScreen) {
			dispatch({ type: "fromWhichScreen", fromWhichScreen: fromWhichScreen });
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FormScreen);



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
		backgroundColor: "#f5f6fa",
		flex: 1,
		justifyContent: "space-between",
	},
	title: {
		backgroundColor: "#dfe4ea",
		height: 50,
		justifyContent: "center",
		alignContent: "center",
		marginBottom: 10
	},
	button: {
		backgroundColor: "#2F3542",
		alignItems: "center",
		padding: 10,
	},
	text: {
		color: "#f5f6fa",
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		backgroundColor: "#dfe4ea",
		borderRadius: 15,
		borderWidth: 0.6,

	},
	inputSolo: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		backgroundColor: "#dfe4ea",
		borderRadius: 15,
		borderWidth: 0.6,


	},
	inputDuo: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		backgroundColor: "#dfe4ea",
		borderRadius: 15,
		borderWidth: 0.6,
		width: 100,
	},
	label: {
		marginLeft: 10,
		color: "#f39c12",
		fontSize: 19,
		fontWeight:"bold",
		textDecorationLine: 'underline'

	},
	screenContainer: {
		//flex: 1,
		justifyContent: "center",
		padding: 16
	},
	appButtonContainer: {
		elevation: 8,
		backgroundColor: "#2F3542",
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
	align: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

	},
	alignImage: {
		// flexDirection: "row",
		alignItems: "center",
		// justifyContent: "space-between",
		marginTop: 20

	},
});
