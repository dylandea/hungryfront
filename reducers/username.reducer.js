export default function(username = '', action){
    if(action.type == 'addUsername'){
        return action.username
    } else {
        return username
    }
}