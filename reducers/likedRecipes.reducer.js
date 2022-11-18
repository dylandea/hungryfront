export default function(likedRecipes = [], action){
    if(action.type == 'addLikedRecipes'){
        return action.likedRecipes
    } else {
        return likedRecipes
    }
}