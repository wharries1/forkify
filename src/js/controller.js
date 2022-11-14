import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import resultsMobileView from './views/resultsMobileView.js';
import paginationView from './views/paginationView.js';
import paginationMobileView from './views/paginationMobileView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView';
import 'core-js/stable';
import 'regenerator-runtime';

// if(module.hot) {
//   module.hot.accept();
// }


const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlLandingPage = async function () {
  try {
    
    const id ='5ed6604591c37cdc054bc886';

    recipeView.renderSpinner(recipeContainer);

    // 1) Update results to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    resultsMobileView.update(model.getSearchResultsPageMob());
    bookmarksView.update(model.state.bookmarks);

    // 2) loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    
  } catch (err) {
    recipeView.renderError();
  }
};

const controlRecipes = async function () {
  try {
    
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner(recipeContainer);

    // 1) Update results to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    resultsMobileView.update(model.getSearchResultsPageMob());
    bookmarksView.update(model.state.bookmarks);

    // 2) loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    resultsMobileView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) {resultsMobileView.renderError()};

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());
    resultsMobileView.render(model.getSearchResultsPageMob()); 
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
    paginationMobileView.render(model.state.search);
  } catch(err){
    // resultsView.renderError();
  }
};



const controlPagination = function(goToPage){
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  resultsMobileView.render(model.getSearchResultsPageMob(goToPage));
  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
  paginationMobileView.render(model.state.search);
}

const controlServings = function(newServings){
  // 1) Update recipe servings (in state)
  model.updateServings(newServings);
  // 2) Update the recipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  // 1) Add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner

    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    //Display success message
    addRecipeView.renderMessage();

    
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change URL ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 500);

    setTimeout(function () {
      addRecipeView.renderForm();
    }, MODAL_CLOSE_SEC * 800);

  } catch (err) {
    console.log('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
}

const controlRemoveRecipe = async function () {
  try {
    // Get current ID
    const id = window.location.hash.slice(1);

    // 1) Add or remove bookmark
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
    bookmarksView.render(model.state.bookmarks);
    // remove current recipe data
    await model.deleteRecipe(id);

    // Render recipe
    console.log('MEOW')
    recipeView.renderError('Your Recipe Was Succesfully Deleted');

  } catch (err) {
    console.log('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
}



const controlToggleSearch = function(){
  resultsMobileView.showResults();
}

const controlRenderHide = function(){
  resultsMobileView.hideResults();
  //recipeView.render(model.state.recipe);
}

const controlBookmarkShow = function(){
  resultsMobileView.showBookmarks();
  //recipeView.render(model.state.recipe);
}

const controlBookmarkHide = function(){
  resultsMobileView.hideBookmarks();
  //recipeView.render(model.state.recipe);
}

const init = function(){

  controlLandingPage();
  bookmarksView.addHandlerRender(controlBookmarks)

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  recipeView.addHandlerRemove(controlRemoveRecipe);

  searchView.addHandlerSearch(controlSearchResults);  

  paginationView.addHandlerClick(controlPagination);
  paginationMobileView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);

  resultsMobileView.addHandlerSearchBar(controlToggleSearch);
  resultsMobileView.addHandlerRecipeHide(controlRenderHide);
  resultsMobileView.addHandlerBookmarkShow(controlBookmarkShow);
  resultsMobileView.addHandlerBookmarkHide(controlBookmarkHide);
  
};

init();