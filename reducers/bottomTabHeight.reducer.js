export default function (bottomTabHeight = 0, action) {
	if (action.type == "sendBottomTabHeight") {
		return action.bottomTabHeight;
	} else {
		return bottomTabHeight;
	}
}
