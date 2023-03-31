import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix";
import { fetchImages } from "./js/request";
import templateFunction from './template/template.hbs';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.classList.add('js-hidden');

form.addEventListener('submit', onSubmitBtnPressed);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClicked);

let page = 1;
let searchRequest = '';
let counter = 0;

var lightbox = new SimpleLightbox('.gallery a', { /* options */ });

const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});

function onSubmitBtnPressed(event) {
    counter = 0;
    loadMoreBtn.classList.add('js-hidden');
    event.preventDefault();
    page = 1;
    searchRequest = '';
    galleryEl.innerHTML = '';
    searchRequest = event.currentTarget.elements['searchQuery'].value;
    if (searchRequest === '') return;
    fetchImages(searchRequest, page)
        .then(result => {
            counter += result.hits.length;
            if (result.hits.length === 0) {
                const error = "Sorry, there are no images matching your search query. Please try again."
                throw error;
            }
            Notify.success(`Hooray! We found ${result.totalHits} images.`)
            galleryEl.innerHTML = templateFunction(result.hits);
            loadMoreBtn.classList.remove('js-hidden')
            lightbox.refresh();
        })
        .catch(error => {
            console.log(error);
            Notify.failure(error);
        });
}

function onLoadMoreBtnClicked() {
    page += 1;
    fetchImages(searchRequest, page)
        .then(result => {
            counter += result.hits.length;
            if (result.totalHits - counter <= 0) {
                const error = "We're sorry, but you've reached the end of search results.";
                counter = 0;
                loadMoreBtn.classList.add('js-hidden');
                throw error;
            }
            loadMoreBtn.classList.add('js-hidden');
            galleryEl.insertAdjacentHTML('beforeend', templateFunction(result.hits));
            loadMoreBtn.classList.remove('js-hidden')
            lightbox.refresh();
        })
        .catch(error => {
            console.log(error);
            Notify.failure(error);
        });
}