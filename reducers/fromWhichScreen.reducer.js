export default function (fromWhichScreen = "", action) {
    if (action.type == 'fromWhichScreen') {
        return action.fromWhichScreen;
    } else {
        return fromWhichScreen;
    }
}