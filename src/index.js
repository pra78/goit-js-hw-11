import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { throttle } from "lodash";
import { Notify } from "notiflix";
import { fetchImages } from "./js/request";
import templateFunction from './template/template.hbs';
import skeletonTemplateFunction from './template/skeleton-template.hbs';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const cardCountElem = document.getElementById("card-count");
const cardTotalElem = document.getElementById("card-total");
const loader = document.getElementById("loader");

loader.classList.add('js-hidden');
const throttledInfiniteScroll = throttle(handleInfiniteScroll, 1000);

form.addEventListener('submit', onSubmitBtnPressed);
window.addEventListener("scroll", throttledInfiniteScroll);

let page = 0;
let searchRequest = '';
let counter = 0;
let cardLimit = 0;
let pageCount = 0;

var lightbox = new SimpleLightbox('.gallery a', { /* options */ });

function onSubmitBtnPressed(event) {
    event.preventDefault();
    window.addEventListener("scroll", throttledInfiniteScroll);
    initialReset();
    renderLoader();
    loader.classList.remove('js-hidden');
    searchRequest = event.currentTarget.elements['searchQuery'].value;
    if (searchRequest === '') return;
    page += 1;
    fetchImages(searchRequest, page)
        .then(result => {
            if (result.hits.length === 0) {
                const error = "Sorry, there are no images matching your search query. Please try again."
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
    loader.innerHTML = '';
    loader.classList.add('js-hidden');
    page = 0;
}

function handleInfiniteScroll() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (!endOfPage) { 
        return;
    }
    page += 1;
    fetchImages(searchRequest, page)
        .then(result => {
            counter += result.hits.length;
            if (result.totalHits - counter <= 0) {
                console.log("infinite scroll should stop now");
                const error = "We're sorry, but you've reached the end of search results.";
                console.log("page: ", page);
                console.log("pageCount: ", pageCount);
                console.log("counter", counter);
                removeInfiniteScroll();
                loader.classList.add('js-hidden');
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

function removeInfiniteScroll() {
  window.removeEventListener("scroll", throttledInfiniteScroll);
};

function renderLoader() {
    cardCountElem.innerHTML = counter;
    cardTotalElem.innerHTML = cardLimit;
    loader.innerHTML = skeletonTemplateFunction();
    loader.classList.remove('js-hidden');
}