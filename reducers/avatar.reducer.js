export default function(avatar = '', action){
    if(action.type == 'addAvatar'){
        return action.avatar
    } else {
        return avatar
    }
}