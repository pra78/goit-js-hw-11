import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix";
import { throttle } from "lodash";
import { fetchImages } from "./js/request";
import templateFunction from './template/template.hbs';
import { cardCountElem, hideLoader, loader, renderLoader } from "./js/render";
import { addInfiniteScroll, removeInfiniteScroll } from "./js/infinite-scroll";

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

export const throttledInfiniteScroll = throttle(handleInfiniteScroll, 1000);

loader.classList.add('js-hidden');

form.addEventListener('submit', onSubmitBtnPressed);
addInfiniteScroll();

let page = 0;
let searchRequest = '';
let pageCount = 0;
export let counter = 0;
export let cardLimit = 0;

var lightbox = new SimpleLightbox('.gallery a', { /* options */ });

function onSubmitBtnPressed(event) {
    event.preventDefault();
    addInfiniteScroll();
    initialReset();
    renderLoader();
    searchRequest = event.currentTarget.elements['searchQuery'].value;
    if (searchRequest === '') {
        removeInfiniteScroll();
        hideLoader();
        return;
    }
    page += 1;
    fetchImages(searchRequest, page)
        .then(result => {
            if (result.hits.length === 0) {
                const error = "Sorry, there are no images matching your search query. Please try again."
                removeInfiniteScroll();
                hideLoader();
                throw error;
            }
            counter += result.hits.length;
            cardLimit = result.totalHits;
            pageCount = Math.ceil(cardLimit / counter);
            Notify.success(`Hooray! We found ${cardLimit} images.`)
            galleryEl.innerHTML = templateFunction(result.hits);
            renderLoader();
            lightbox.refresh();
            // ============== SMOOTH SCROLL ===================
            window.scroll({
                top: 0,
                behavior: "smooth",
            });
        })
        .catch(error => {
            console.log(error);
            Notify.failure(error);
        });
}

function initialReset() {
    counter = 0;
    pageCount = 0;
    cardLimit = 0;
    searchRequest = '';
    galleryEl.innerHTML = '';
    page = 0;
}

function handleInfiniteScroll() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (!endOfPage) return;
    page += 1;
    fetchImages(searchRequest, page)
        .then(result => {
            counter += result.hits.length;
            if (result.totalHits - counter <= 0) {
                const error = "We're sorry, but you've reached the end of search results.";
                removeInfiniteScroll();
                hideLoader();
                galleryEl.insertAdjacentHTML('beforeend', templateFunction(result.hits));
                lightbox.refresh();
                cardCountElem.innerHTML = counter;
                throw error;
            }
            loader.classList.add('js-hidden');
            renderLoader();
            galleryEl.insertAdjacentHTML('beforeend', templateFunction(result.hits));
            lightbox.refresh();
            loader.classList.remove('js-hidden');
        })
        .catch(error => {
            console.log(error);
            Notify.failure(error);
        });
};