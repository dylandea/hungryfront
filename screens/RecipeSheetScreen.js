import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
	useNavigation,
	DrawerActions,
	useIsFocused,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from 'expo-sharing';


import {
	StatusBar,
	View,
	Platform,
	StyleSheet,
	TouchableOpacity,
	Text,
	Image,
	ScrollView,
	Modal,
	Dimensions,
	KeyboardAvoidingView,
	TextInput,
	Share
} from "react-native";

import { MaterialCommunityIcons } from "react-native-vector-icons";
import ScrollPicker from "react-native-wheel-scrollview-picker";

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

function RecipeSheetScreen(props) {
	const navigation = useNavigation();

	const isFocused = useIsFocused();
	const [recipeData, setRecipeData] = useState(props.recipe);
	const [isThisRecipeMine, setIsThisRecipeMine] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [shadow, setShadow] = useState(false);
	const [likedRecipes, setLikedRecipes] = useState(props.likedRecipes);
	const [addedRecipes, setAddedRecipes] = useState([]);

	const [shoppingList, setShoppingList] = useState([]);
	const [isAlreadyAddedToMyRecipes, setIsAlreadyAddedToMyRecipes] =
		useState(false);
	const [nbPersonne, setNbPersonne] = useState(recipeData.servings);
	const [calendarModalOpen, setCalendarModalOpen] = useState(false);

	const window = Dimensions.get("window");


	//---------------Share function ----------------
	
	let ingredientToMessage = recipeData.ingredients.map(x=>x.name + " " + x.quantity + "\u000A").join("")
	let upperName = recipeData.name.toUpperCase()
    let shareMessage =
		"Cette recette vous a était envoyé via The Hungry-Book, téléchargement bientôt disponible !" + '\n' +
		'\n' +
		upperName + "  " + "\u000A" +
		'\n' +
        "Temps de cuisson : " + recipeData.cookTime + " min" + "   " + "\u000A" +
        "Temps de préparation : " + recipeData.prepTime + " min" + "  " + "\u000A" +
        "Nombre de personnes : " + nbPersonne + "   " + "\u000A" +
		'\n' +
        "Listes des ingédients : " + "\u000A" + ingredientToMessage + "   " + "\u000A" +
        "Méthodologie : " + "\u000A" + '\n' + recipeData.directions + "  "; "\u000A"


	const onShare = async () => {
		try {
			const result = await Share.share({

				message: shareMessage,

			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};



	//----------------Fin share function -----------


	useEffect(() => {
		if (isFocused) {
			setRecipeData(props.recipe);
			async function initialFetch() {
				var rawResponse = await fetch(
					`https://hungrybook-back.herokuapp.com/recipesheet/initial-fetch-recipesheet`,
					{
						method: "post",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: `token=${props.token}`,
					}
				);

				var response = await rawResponse.json();

				setAddedRecipes(response.addedRecipes);
				setLikedRecipes(response.likedRecipes);
			}
			initialFetch();

			props.recipe.author.token === props.token
				? setIsThisRecipeMine(true)
				: setIsThisRecipeMine(false);
		}
	}, [isFocused]);

	//likeIcon
	var heartIcon;
	if (likedRecipes.includes(recipeData._id)) {
		heartIcon = (
			<TouchableOpacity
				style={styles.like}
				onPress={() => {
					handlePressHeartIcon(props.recipe._id, props.token);
				}}
			>
				<Text>{Number(recipeData.likeCount)}</Text>
				<MaterialCommunityIcons
					name="heart"
					size={25}
					color="#ff4757"
					style={{}}
				/>
			</TouchableOpacity>
		);
	} else {
		heartIcon = (
			<TouchableOpacity
				style={styles.like}
				onPress={() => {
					handlePressHeartIcon(props.recipe._id, props.token);
				}}
			>
				<Text>{recipeData.likeCount}</Text>
				<MaterialCommunityIcons
					name="heart-outline"
					size={25}
					color="grey"
					style={{}}
				/>
			</TouchableOpacity>
		);
	}

	var handlePressHeartIcon = async (id, token) => {
		if (likedRecipes.includes(recipeData._id)) {
			var rawResponse = await fetch(
				`https://hungrybook-back.herokuapp.com/recipesheet/dislike-recipe`,
				{
					method: "post",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: `id=${id}&token=${token}`,
				}
			);

			var response = await rawResponse.json();

			setLikedRecipes(response.likedRecipes);

			setRecipeData({
				...recipeData,
				likeCount: Number(response.likeCount),
			});
		} else {
			var rawResponse = await fetch(
				`https://hungrybook-back.herokuapp.com/recipesheet/like-recipe`,
				{
					method: "post",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: `id=${id}&token=${token}`,
				}
			);

			var response = await rawResponse.json();

			setLikedRecipes(response.likedRecipes);

			setRecipeData({
				...recipeData,
				likeCount: Number(response.likeCount),
			});
		}
	};

	var handleAddBook = async (recipe, token) => {
		var rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/recipesheet/add-recipe-to-myrecipes`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `recipe=${JSON.stringify(recipe)}&token=${token}`,
			}
		);
		var response = await rawResponse.json();
		setAddedRecipes(JSON.parse(response.addedRecipes));
	};

	var handleDeleteBook = async (recipe, token) => {
		var rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/recipesheet/delete-recipe-to-myrecipes`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `recipe=${JSON.stringify(recipe)}&token=${token}`,
			}
		);
		var response = await rawResponse.json();
		setAddedRecipes(JSON.parse(response.addedRecipes));
	};

	var handleCart = async (recipe, token) => {
		console.log('salut toi');
		var rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/recipesheet/addToShoppingList`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `recipe=${JSON.stringify(recipe)}&token=${token}`,
			}
		);
		// console.log('salut vous');
		var response = await rawResponse.json();

		// console.log(response.shoppingList,'hello pour la 5eme fois');

		navigation.navigate("ShoppingListScreen");


	};

	// ------------------------------------------------------------CALENDAR FUNCTION

	var today = new Date()
	function addDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
	var weekdays = [today, addDays(today, 1), addDays(today, 2), addDays(today, 3), addDays(today, 4), addDays(today, 5), addDays(today, 6)];

	var handleCalendarAdd = async (date, token, recipe) => {
		// console.log(recipeId, date, token)
		let calendarObj = {
			date: date.toLocaleString('fr-FR', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			}),
			recipe: recipe._id,
			token
		}
		var rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/recipesheet/addToWeeklyList`,
			{
				method: "post",
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
				body: JSON.stringify(calendarObj)
			}
		);
		var response = await rawResponse.json();
		if (response) {
			setCalendarModalOpen(false)
			
		}

	}

	//-------------------------------------------------------------FIN CALENDAR

	let modificationPencilIcon = null;
	let trashIcon = null;
	let addBookIcon = null;
	if (isThisRecipeMine) {
		modificationPencilIcon = (
			<TouchableOpacity
				style={{
					justifyContent: "flex-end"
				}}
				onPress={() => navigation.navigate("FormScreen")}
			>
				<MaterialCommunityIcons
					name="pencil"
					size={25}
					color="#2f3542"
					style={{
						paddingLeft: 10,
						marginTop: 5,

					}}
				/>
			</TouchableOpacity>
		);

		trashIcon = (
			<TouchableOpacity
				style={{}}
				onPress={() => {
					setDeleteModalOpen(true);
					setShadow(true);
					// handlePressTrashIcon(props.recipe._id);
				}}
			>
				<MaterialCommunityIcons
					name="delete"
					size={25}
					color="#2f3542"
					style={{
						paddingLeft: 10,
						marginTop: 5,
					}}
				/>
			</TouchableOpacity>
		);

		heartIcon = (
			<View style={styles.like}>
				<Text>{recipeData.likeCount}</Text>
				<MaterialCommunityIcons
					name="heart"
					size={25}
					color="#ff4757"
					style={{}}
				/>
			</View >
		);
	} else {
		if (addedRecipes.includes(recipeData._id)) {
			addBookIcon = (
				<TouchableOpacity
					style={{}}
					onPress={() => {
						handleDeleteBook(recipeData, props.token);
					}}
				>
					<MaterialCommunityIcons
						name="notebook-minus-outline"
						size={25}
						color="#F19066"
						style={{
							paddingLeft: 10,
							marginTop: 5,
						}}
					/>
				</TouchableOpacity>
			);
		} else {
			addBookIcon = (
				<TouchableOpacity
					style={{}}
					onPress={() => {
						handleAddBook(recipeData, props.token);
					}}
				>
					<MaterialCommunityIcons
						name="notebook-plus-outline"
						size={25}
						color="#2f3542"
						style={{
							paddingLeft: 10,
							marginTop: 5,
						}}
					/>
				</TouchableOpacity>
			);
		}
	}

	var handlePressTrashIcon = async (id) => {
		var rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/recipesheet/delete-recipe`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `id=${id}`,
			}
		);

		var response = await rawResponse.json();
		if (response.result === true) {
			navigation.navigate("HomeDrawer2"); //vérifier s'il faut pas mettre "home"------------
		}
	};

	if (recipeData.ingredients && recipeData.ingredients.length > 0) {
		var ingredientList = recipeData.ingredients.map((ingredient, i) => {
			let finalQuantity = "";
			if (ingredient.quantity.match(/\d/) != null) {
				let quantity = parseInt(ingredient.quantity);
				finalQuantity = Math.round(
					(quantity / recipeData.servings) * nbPersonne
				);
			}
			//et la je le remplace
			var grammes = ingredient.quantity.replace(/\d/gi, "");

			return (
				<View key={i} style={styles.ligne}>
					<Text style={{ fontSize: 19, marginLeft: 25 }}>
						{ingredient.name}
					</Text>
					<View>
						<Text style={{ fontSize: 19, marginRight: 18 }}>
							{/* je divise la quantity par le nombre de personne qui a etais mit dans le formlaire (sa donne 1)
								et apres je le multipli par le nombre de personne que j'ai set (et je let un Math pour mettre
								un chiffre arrondi) */}
							{finalQuantity}
							{grammes}
						</Text>
					</View>
				</View>
			);
		});
	}

	if (recipeData.tags && recipeData.tags.length > 0) {
		var tag = recipeData.tags.map((data, i) => {
			return (
				<View style={styles.tag} key={i}>
					<Text>{data}</Text>
				</View>
			);
		});
	}
	// --------------------------------------------------------Boutons-------------------------------------------------
	const OpenModal = ({ onPress, title }) => (
		<TouchableOpacity
			onPress={() => setModalOpen(true)}
			style={styles.appButtonContainer}
		>
			<Text style={styles.appButtonText}>{title}</Text>
			<MaterialCommunityIcons
				name="play"
				size={28}
				color="#ffffff"
				onPress={() => setModalOpen(true)}
			/>
		</TouchableOpacity>
	);

	const CloseModal = ({ onPress, title }) => (
		<TouchableOpacity
			onPress={() => setModalOpen(false)}
			style={styles.appButtonContainer}
		>
			<Text style={styles.appButtonText}>{title}</Text>
			<MaterialCommunityIcons
				name="close"
				size={28}
				color="#ffffff"
				onPress={() => 
					setModalOpen(false)
				}
			/>
		</TouchableOpacity>
	);

	const PictureFullSize = ({ onPress }) => (
		<Image
			style={styles.fullSizePicture}
			source={{
				uri: recipeData.image,
			}}
		/>
	);


	const weekButtonsList = weekdays.map((item, i) => {
		return (
			<TouchableOpacity
				onPress={() => handleCalendarAdd(item, props.token, props.recipe)}
				style={{
					marginTop: 5,
					elevation: 8,
					backgroundColor: "#F19066",
					paddingVertical: 10,
					paddingHorizontal: 12,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					borderRadius:20,
					width:"70%",
					marginRight:"15%",
					marginLeft:"15%",
					marginBottom:"3%"
					
				}}
				key={i}
			>
				<Text style={styles.appButtonText}>{item.toLocaleString('fr-FR', {
					weekday: 'long',
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				})}</Text>

			</TouchableOpacity>


		)
	})



	// -----------------------------------------------------------Fin Boutons ----------------------------------------------------------------

	// --------------------------------------------------------Modales-------------------------------------------------
	var DeleteModalVerif = (
		<Modal
			visible={deleteModalOpen}
			animationType="slide"
			transparent={true}
			style={styles.deleteModal}
		>
			<View
				style={{
					alignItems: "center",

					// borderBottomLeftRadius: 20,
					// borderBottomRightRadius: 20,
					borderRadius: 100,
					backgroundColor: "#fff",
					width: "90%",
					height: 360,
					marginTop: "50%",
					marginLeft: "5%",
					
				}}
			>
				<Text
					style={{
						fontSize: 20,
						alignSelf: "center",
						textAlign: "center",
						marginTop: "30%",

						flexWrap: "wrap",
						marginLeft: "8%",
						marginLeft: "8%",
					}}
				>
					Êtes-vous certain de vouloir supprimer cette recette ?
				</Text>
				<View style={styles.deleteButton}>
					<TouchableOpacity
						style={styles.deleteButtonContainer}
						onPress={() => {
							handlePressTrashIcon(props.recipe._id);
							setShadow(false);
						}}
					>
						<Text style={styles.appButtonText}>Oui</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.deleteButtonContainer}
						onPress={() => {
							setDeleteModalOpen(false);
							setShadow(false);
						}}
					>
						<Text style={styles.appButtonText}>Non</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
	var overlayShadow;
	if (shadow) {
		overlayShadow = (
			<View style={[styles.overlayShadow, { height: "100%", }]} />
		);
	}

	var CalendarModal = (
		<Modal
			visible={calendarModalOpen}
			animationType="slide"
			transparent={true}
			style={styles.deleteModal}
		>
			<View
				style={{


					borderRadius: 100,
					backgroundColor: "#fff",
					width: "90%",
					height: "80%",
					marginTop: "15%",
					marginLeft: "5%",
					marginBottom:"10%"
				}}
			>
				<Text
					style={{
						fontSize: 20,
						marginTop: "30%",
						textAlign: "center",
						alignItems:"center",
						flexWrap: "wrap",
						marginLeft: "8%",
						marginLeft: "8%",

					}}
				>
					Ajouter ma recette le :
				</Text>
				<MaterialCommunityIcons
					name="close"
					size={28}
					color="#ddd"
					onPress={() => { 
						setCalendarModalOpen(false);
						setShadow(false)
					}}
				/>

				{weekButtonsList}


			</View>
		</Modal>
	)
	//----------------------------------------------------------------Fin Modale -------------------------------------------------------------------

	//---------------------------------------------------------- DELETE RECIPE -------------------------------------------
	var handlePressTrashIcon = async (id) => {
		var rawResponse = await fetch(
			`https://hungrybook-back.herokuapp.com/recipesheet/delete-recipe`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `id=${id}`,
			}
		);

		var response = await rawResponse.json();
		if (response.result === true) {
			navigation.navigate("Home");
		}
	};
	//---------------------------------------------------------- FIN DELETE RECIPE -------------------------------------------

	const [plus, setPlus] = useState(false);

	var plusPersonne;
	if (plus) {
		plusPersonne = (
			<View
				style={{
					borderWidth: 2,
					flex: 1,
					position: "absolute",
					bottom: 60,
					width: "50%",
					backgroundColor: "white",
					alignSelf: "center",
				}}
			>
				<ScrollPicker
					//avoir le tableau jusqu'a 100 ....
					dataSource={[...Array(21).keys()]}
					//mettre le compteur par defaut au nombre de personne que le mec a mit dans le formulaire
					selectedIndex={nbPersonne}
					onValueChange={(data, selectedIndex) => {
						//data = la valeur que la scrollPicker renvoi et on le set dans un etat
						setNbPersonne(data);
					}}
					wrapperHeight={180}
					wrapperWidth={150}
					wrapperColor="#FFFFFF"
					itemHeight={60}
					highlightColor="#f19066"
					highlightBorderWidth={3}
				/>
			</View>
		);
	}

	var handleGoBack = () => {
		if (props.fromWhichScreen === "FormScreen") {
			navigation.navigate("Home");
		} else {
			navigation.goBack();
		}
	};

	//Commentaires----------------------------------------------------------------------------------------------------
	const [commentsVisible, setCommentsVisible] = useState(false);
	const [inputCommentValue, setInputCommentValue] = useState("");
	/* const refInput = useRef(null); */
	console.log(inputCommentValue, "aaa---");
	const handlePressCommentsComponent = () => {
		setCommentsVisible(true);
	};

	const handleSubmitComment = (inputCommentValue) => {
		if (inputCommentValue != "") {
			async function saveComment() {
				var rawResponse = await fetch(
					`https://hungrybook-back.herokuapp.com/recipesheet/save-comment`,
					{
						method: "post",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: `token=${props.token}&id=${recipeData._id}&content=${inputCommentValue}&username=${props.username}`,
					}
				);

				var response = await rawResponse.json();
				console.log("response que tu cherches-----", response);
				setRecipeData({
					...recipeData,
					comments: JSON.parse(response.newComments),
				});
			}
			setInputCommentValue("");
			saveComment();
		}
	};

	var inputNewComment = (
		<KeyboardAvoidingView>
			<Text style={{ padding: 20, paddingBottom: 0, fontSize:18, marginTop:"10%",  }}>
				Ajouter un commentaire: 
			</Text>
			<View style={styles.inputContainer}>
			<TextInput
				/* ref={refInput} */
				style={styles.inputPass}
				multiline
				onChangeText={(value) => setInputCommentValue(value)}
				value={inputCommentValue}
			/>
			<TouchableOpacity
				style={{}}
				onPress={() => {
					handleSubmitComment(inputCommentValue);
				}}
			>
				<MaterialCommunityIcons
					name="send"
					size={28}
					color="#e67e22"
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
		</KeyboardAvoidingView>
	);

	var commentsSection = recipeData.comments.map((x, i) => (
		<View
			key={i}
			style={{
				width: "90%",
				padding: 10,
				margin: 5,
				borderRadius: 10,
				backgroundColor: "white",
				shadowColor: "#470000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				elevation: 1,
				alignSelf: "center",
				borderWidth:0.75
			}}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Text
					style={{
						fontSize: 14,
						color: "orange",
						fontWeight:"bold"
					}}
				>
					{x.author}
				</Text>
				<Text
					style={{
						fontSize: 12,
						color: "black",
						fontStyle: "italic",
					}}
				>
					{`le ${new Date(x.date).getDate()}/${new Date(x.date).getMonth() + 1}/${new Date(x.date).getFullYear()}`}
				</Text>
			</View>
			<Text
				style={{
					fontSize: 15,
					color: "black",
				}}
			>
				{x.content}
			</Text>
		</View>
	));

	return (
		<View style={styles.container}>
			{/*-----------------------------------------------------Nom de recette + edit ---------------------------------------------------------  */}

			<ScrollView>
				<Text h1 style={styles.recipeName}>
					{recipeData.name}
					{modificationPencilIcon}
				</Text>

				{/*-----------------------------------------------------nom du créateur + semainier + ajout a la collection + poubelle ---------------------------------------------------------  */}
				<View style={styles.ligne}>
					{addBookIcon}
					{trashIcon}

					<Text style={styles.userName}>
						{recipeData.author.username}
					</Text>
					<TouchableOpacity
						style={{
							marginRight: "2%"
						}}
						onPress={() => {
							setCalendarModalOpen(true);
							setShadow(true);
						}}
						
					>
						<MaterialCommunityIcons
							name="calendar"
							size={28}
							color="#2f3542"
							style={{
								zIndex: 1,
							}}
						/>
					</TouchableOpacity>
				</View>
				{/* ------------------------------------------------------------Image + tag------------------------------------------------- */}
				<View>
					<Image
						style={styles.recipePicture}
						source={{
							uri: recipeData.image,
						}}
						onPress={PictureFullSize}
					/>
				</View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={{}}
				>
					<View style={{ flexDirection: "row" }}>
						<View style={styles.tagligne}>{tag}</View>
					</View>
				</ScrollView>
				<View style={styles.like}>{heartIcon}</View>

				<View style={styles.center}>
					<View style={styles.time}>
						<View style={{ marginLeft: 8 }}>
							<Text
								style={{
									textAlign: "center",
									color: "#F19066",
									fontSize: 24,
								}}
							>
								{recipeData.prepTime < 60
									? `${recipeData.prepTime} min`
									: recipeData.prepTime % 60 > 9
										? `${Math.floor(
											recipeData.prepTime / 60
										)}h${recipeData.prepTime % 60}min`
										: recipeData.prepTime % 60 > 0
											? `${Math.floor(
												recipeData.prepTime / 60
											)}h0${recipeData.prepTime % 60}min`
											: `${Math.floor(
												recipeData.prepTime / 60
											)}h`}
							</Text>
							<Text>Préparation</Text>
						</View>
						<View>
							<Text
								style={{
									textAlign: "center",
									color: "#F19066",
									fontSize: 24,
								}}
							>
								{recipeData.cookTime < 60
									? `${recipeData.cookTime} min`
									: recipeData.cookTime % 60 > 9
										? `${Math.floor(
											recipeData.cookTime / 60
										)}h${recipeData.cookTime % 60}min`
										: recipeData.cookTime % 60 > 0
											? `${Math.floor(
												recipeData.cookTime / 60
											)}h0${recipeData.cookTime % 60}min`
											: `${Math.floor(
												recipeData.cookTime / 60
											)}h`}
							</Text>
							<Text>Cuisson</Text>
						</View>
						<View
							style={{ display: "flex", flexDirection: "column" }}
						>
							<TouchableOpacity
								style={{
									marginRight: 8,
									borderWidth: 1,
									borderRadius: 8,
									padding: 5,
									backgroundColor: "#F19066",
								}}
								onPress={() => setPlus(!plus)}
							>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
									}}
								>
									<View>
										<Text
											style={{
												textAlign: "center",
												color: "black",
												fontSize: 24,
											}}
										>
											{/* au lieu de lui mettre un recipeData.servings je lui met le nombre de personne mais ca va toujours
									garder le nombre de personne quil a mit dans le formulaire prck dans l'etat je lai mit par defaut
									au nombre de personne quil a mit dans le formulaire (recipeData.servings) */}
											{nbPersonne}
										</Text>

										<Text>Personnes</Text>
									</View>
									<MaterialCommunityIcons
										name="plus-minus-variant"
										size={28}
										color="#2f3542"
										style={{}}
									/>
								</View>
							</TouchableOpacity>
							{plusPersonne}
						</View>
					</View>
				</View>

				{/*--------------------------------------------------------------List des ingrédients ---------------------------------------------------------*/}
				<View style={styles.ligne}>
					<Text
						h1
						style={{
							fontSize: 24,
							fontWeight: "bold",
							marginBottom: 8,
						}}
					>
						{" "}
						Ingrédients
					</Text>
					<TouchableOpacity
						style={{ zIndex: 1 }}
						onPress={() =>
							handleCart(recipeData, props.token)
							// navigation.navigate("ShoppingListScreen")
						}
					>
						<MaterialCommunityIcons
							name="cart"
							size={28}
							color="#2f3542"
							style={{
								paddingLeft: 20,
								paddingRight: 20,
								zIndex: 1,
							}}
						/>
					</TouchableOpacity>
				</View>
				<ScrollView style={{ height: 140 }}>
					{ingredientList}
				</ScrollView>

				{/*---------------------------------------------------------------------Modale recette pas a pas ----------------------------------------------------------  */}

				<View style={styles.screenContainer}>
					<OpenModal title="Commencer à cuisiner" size="sm" />
				</View>
				<Modal visible={modalOpen} animationType="slide">
					<View style={styles.modal}>
						<ScrollView style={{ marginTop: 30 }}>
							<View
								style={{
									marginTop: 20,
									width: "95%",
									marginLeft: "3%",
									textAlign: "justify",
								}}
							>
								<Text h1 style={styles.recipeName}>
									{recipeData.name}
								</Text>

								<Text
									style={{
										fontSize: 20,
										marginTop: 30,
									}}
								>
									{recipeData.directions}
								</Text>
								{/* pour dire que les instruction sont pour le nombre de personne qui a etait mit dans le formulaire */}
								{/* <Text style={{ fontSize: 20 }}>
									(cette instruction est pour {recipeData.servings} personne)
								</Text> */}
							</View>
							<View style={styles.screenContainer}>
								<CloseModal
									title="Retour à la liste des ingédients"
									size="sm"
								/>
							</View>
						</ScrollView>
					</View>
				</Modal>

				{/* -----------------------------------------------------Commentaires----------------------------------------------------------------- */}
				<TouchableOpacity
					onPress={() => {
						handlePressCommentsComponent();
					}}
				>
					<View style={styles.like}>
						<Text style={{ fontSize: 18 }}>Commentaires </Text>
						<MaterialCommunityIcons
							name="comment-multiple"
							size={25}
							color="#e67e22"
							style={{
								marginRight:"2%"
							}}
						/>
						<Text>{recipeData.comments.length}</Text>
					</View>
				</TouchableOpacity>

				<Modal visible={commentsVisible} animationType="slide">
					<View>
						
						<ScrollView style={{ marginTop:"10%", height: 500 }}>
							{commentsSection}
						</ScrollView>
						<KeyboardAvoidingView>{inputNewComment}</KeyboardAvoidingView>
						<View style={styles.appButtonContainer}>
							<TouchableOpacity
								onPress={() => setCommentsVisible(false)}
								style={{
									
								}}
							>
								<View style={{ 
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",

								}}>
								<Text style={styles.appButtonText}>
									Retourner à la recette
								</Text>
								<MaterialCommunityIcons
									name="close"
									size={28}
									color="#ffffff"
								/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/*--------------------------------------------------------------Bottom page / retour a la page d'avant ------------------------------------------  */}




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

					<TouchableOpacity
						style={{}}
						onPress={onShare}
					>
						<MaterialCommunityIcons
							name="share-variant"
							size={25}
							color="#2f3542"
							style={{
								paddingLeft: 10,
								marginRight: "3%"
							}}
						/>
					</TouchableOpacity>
				</View >
			</ScrollView >
			{DeleteModalVerif}
			{overlayShadow}
			{CalendarModal}
		</View >
	);
}

function mapStateToProps(state) {
	return {
		bottomTabHeight: state.bottomTabHeight,
		recipe: state.recipe,
		token: state.token,
		likedRecipes: state.likedRecipes,
		fromWhichScreen: state.fromWhichScreen,
		username: state.username,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onSubmitBottomTabHeight: function (bottomTabHeight) {
			dispatch({
				type: "initializeBottomTabHeight",
				bottomTabHeight: bottomTabHeight,
			});
		},
		addLikedRecipes: function (likedRecipes) {
			dispatch({ type: "addLikedRecipes", likedRecipes: likedRecipes });
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeSheetScreen);

const STATUSBAR_HEIGHT =
	Platform.OS === "android" ? StatusBar.currentHeight : 44;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 50 : 56;
// https://stackoverflow.com/a/39300715

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f6fa",
		paddingTop: 35
	},
	recipeName: {
		textAlign: "center",
		fontSize: 25,
	},
	userName: {
		fontSize: 20,
		marginBottom: 5,
		marginTop: 2,
		textAlign: "center",
		alignSelf: "center",
	},
	recipePicture: {
		width: 420,
		height: 200,
	},
	tag: {
		backgroundColor: "#F19066",
		borderRadius: 100,
		marginLeft: 5,
		textAlign: "center",
		alignSelf: "center",
		paddingVertical: 1,
		paddingHorizontal: 10,
		// flexDirection: "row",
	},
	ligne: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 5,
		zIndex: 1,
		textAlign: "center"
	},
	tagligne: {
		flexDirection: "row",
		alignItems: "center",
		// justifyContent: "space-between",
		marginTop: 5,
	},
	like: {
		flexDirection: "row",
		alignItems: "center",
		// alignItems: "",
		justifyContent: "center",
		marginTop: 5,
	},
	time: {
		width: 350,
		height: 80,
		backgroundColor: "#dfe4ea",
		borderRadius: 15,
		marginLeft: 5,
		marginTop: 15,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		textAlign: "center",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	screenContainer: {
		//flex: 1,
		justifyContent: "center",
		padding: 16,
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
		width:"90%",
		marginRight:"5%",
		marginLeft:"5%"
	},
	appButtonText: {
		fontSize: 18,
		color: "#fff",
		fontWeight: "bold",
		alignSelf: "center",
	},

	title: {
		fontSize: 25,
		marginTop: 15,
		textAlign: "center",
		color: "#F19066",
	},
	step: {
		fontSize: 18,
		textAlign: "justify",
	},
	fullSizePicture: {
		width: window.width / 2,
		height: window.height / 2,
		resizeMode: "contain",
		alignSelf: "center",
		borderWidth: 1,
		borderRadius: 20,
	},
	deleteModal: {
		width: 150,
		height: 150,
	},
	overlayShadow: {
		flex: 1,
		position: "absolute",
		left: 0,
		top: 0,
		opacity: 0.6,

		backgroundColor: "black",
		width: "100%",
		height: "100%",
	},
	deleteButton: {
		flexDirection: "row",

		justifyContent: "center",
		marginTop: 40,
		alignItems: "center",
	},
	deleteButtonContainer: {
		elevation: 8,
		backgroundColor: "#2F3542",
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		// marginRight:25,
		width: 100,
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
		height:80,
		marginTop: 10,
		marginBottom:"5%",
		width:"95%",
		marginRight:"2.5%",
		marginLeft:"2.5%"
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
