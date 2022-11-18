import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";
import {
	View,
	Platform,
	Image,
	StyleSheet,
	Button,
	TouchableOpacity,
	Text,
	StatusBar,
} from "react-native";

import { MaterialCommunityIcons } from "react-native-vector-icons";

function DrawerScreen(props) {
	const bottomTabHeight = props.bottomTabHeight;
	const navigation = useNavigation();
	const [active, setActive] = useState("");

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

	var avatar = <View style={{backgroundColor: 'white', width: 60,
	height: 60,
	
	borderRadius: 100, display: "flex", justifyContent:"center", alignItems:"center"}}><Text style={{fontSize:24}}>{props.username[0].toUpperCase()}</Text></View>
	if (props.avatar !== "") {
		avatar = (
			<Image
				source={{ uri: props.avatar }}
				style={{
					width: 60,
					height: 60,
					
					borderRadius: 100,
				}}
			></Image>
		);
	} 

	return (
		<View style={{ flex: 1 }}>
			<MyStatusBar backgroundColor="#dfe4ea" />

			<View style={styles.content}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						backgroundColor: "#2F3542",
					}}
				>
					<View
						style={{
							marginTop: 20,
							marginLeft: 20,
							width: 60,
							height: 60,
							borderWidth: 1,
							borderRadius: 100,
							display: "flex",
					justifyContent:"center",
					alignItems:"center",
						}}
					>
						{avatar}
					</View>
					<View
						style={{
							flex: 1,
							paddingLeft: 30,
							paddingTop: 30,
							paddingBottom: 30,
						}}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "flex-start",
							}}
						>
							<Text style={{ marginBottom: 10, color:"white", fontSize:24 }}>Bonjour {props.username}</Text>
							{/* <MaterialCommunityIcons
								name="pencil"
								size={15}
								color="#2f3542"
							/> */}
						</View>
						{/* <View
							style={{
								width: "80%",
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text
								style={{
									marginBottom: 10,
									textAlign: "justify",
								}}
							>
								J'habite pas à Saint FRANCISco et je suis pas
								FRANCIScain. J'aime la cuisine FRANCAISe !
							</Text>
							<MaterialCommunityIcons
								name="pencil"
								size={15}
								color="#2f3542"
							/>
						</View> */}
					</View>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: "space-between",
						paddingTop: 10,
					}}
				>
					<View>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderWidth: 1,
								marginLeft: 20,
								marginBottom: 10,
								borderRadius: 100,
								alignSelf: "flex-start",
								paddingVertical: 5,
								paddingHorizontal: 10,
							}}
						>
							<TouchableOpacity
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
								onPress={() =>
									navigation.navigate("ShoppingList")
								}
							>
								<MaterialCommunityIcons
									name="cart"
									size={24}
									color="#2f3542"
								/>
								<Text
									style={{
										color: "black",
										fontSize: 18,
										marginLeft: 10,
									}}
								>
									Ma liste de course
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderWidth: 1,
								marginLeft: 20,
								marginBottom: 10,
								borderRadius: 100,
								alignSelf: "flex-start",
								paddingVertical: 5,
								paddingHorizontal: 10,
							}}
						>
							<TouchableOpacity
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
								onPress={() => navigation.navigate("Planner")}
							>
								<MaterialCommunityIcons
									name="calendar"
									size={24}
									color="#2f3542"
								/>
								<Text
									style={{
										color: "black",
										fontSize: 18,
										marginLeft: 10,
									}}
								>
									Mon planning
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View
						style={{
							height: props.bottomTabHeight,
							backgroundColor: "#2f3542",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<TouchableOpacity
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifySelf: "flex-end",
								paddingLeft: 20,
							}}
							onPress={() => navigation.navigate("Account")}
						>
							<MaterialCommunityIcons
								name="cog"
								size={28}
								color="#F19066"
							/>
							<Text
								style={{
									color: "#f5f6fa",
									fontSize: 18,
									marginLeft: 10,
								}}
							>
								Paramètres
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}

function mapStateToProps(state) {
	return { bottomTabHeight: state.bottomTabHeight, token: state.token, username: state.username, avatar: state.avatar };
}

/*function mapDispatchToProps(dispatch) {
	return {
		onSubmitBottomTabHeight: function (bottomTabHeight) {
			dispatch({ type: "initializeBottomTabHeight", bottomTabHeight: bottomTabHeight });
		},
	};
}*/

export default connect(mapStateToProps, null)(DrawerScreen);

const STATUSBAR_HEIGHT =
	Platform.OS === "android" ? StatusBar.currentHeight : 44;

const styles = StyleSheet.create({
	statusBar: {
		height: STATUSBAR_HEIGHT,
	},
	content: {
		flex: 1,
		backgroundColor: "#f5f6fa",
	},
});
