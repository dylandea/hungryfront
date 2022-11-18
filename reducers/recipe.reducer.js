export default function (recipe = {}, action) {
    if (action.type == 'setRecipe') {
        return action.recipe;
    } else {
        return recipe;
    }
}