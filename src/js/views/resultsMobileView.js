import View from './view.js';
import previewView from './previewView.js';
// import recipeView from './recipeView.js';
// import model from 'url:../model.js'
import icons from 'url:../../img/icons.svg'
class ResultsMobileView extends View {
  _parentElement = document.querySelector('.results-mobile');
  _errorMessage = 'No recipes found for your query. Please try again';
  _message = '';
  _resultsWindow = document.querySelector('.search-results-mobile');
  _result = document.querySelector('.results-mobile');
  _btnBookmark = document.querySelector('.nav__btn--bookmarks');
  _bookmark = document.querySelector('.bookmarks');
  _overlay = document.querySelector('.overlay-results');
  _searchBar = document.querySelector('.search');


  
constructor(){
    super();
    this.addHandlerSearchBar();
    this.addHandlerBookmarkShow();
    this.addHandlerBookmarkHide();
    this.addHandlerRecipeHide();
    this.addHandlerRecipeShow();
    }


showResults(){
    this._resultsWindow.classList.remove('hide-results');
    this._overlay.classList.remove('hide-results');
    }

hideResults(){
    this._resultsWindow.classList.add('hide-results');
    this._overlay.classList.add('hide-results');
    }

hideBookmarks(){
    this._bookmark.classList.toggle('hide-results');
    // this._overlay.classList.add('hide-results');
    }

showBookmarks(){
    this._bookmark.classList.toggle('hide-results');
        // this._overlay.classList.add('hide-results');
        }

addHandlerRecipeHide(handler){
    this._result.addEventListener('click', handler);
    this._overlay.addEventListener('click', handler);
    }

addHandlerRecipeShow(handler){
        this._result.addEventListener('click', handler);
        // this._overlay.addEventListener('click', handler);
        }

addHandlerBookmarkHide(handler){
     this._bookmark.addEventListener('click', handler);
     // this._overlay.addEventListener('click', handler);
    }

addHandlerBookmarkShow(handler){
        this._btnBookmark.addEventListener('click', handler);
        
        
       }

addHandlerSearchBar(handler) {
    this._searchBar.addEventListener('submit', handler);
    }

_generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }


}
export default new ResultsMobileView();



