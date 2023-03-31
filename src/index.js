import { Notify } from "notiflix";
import { fetchImages } from "./js/request";
import templateFunction from './template/template.hbs';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

form.addEventListener('submit', onSubmitBtnPressed);

function onSubmitBtnPressed(event) {
    event.preventDefault();
    const searchRequest = event.currentTarget.elements['searchQuery'].value;
    if (searchRequest === '') return;
    fetchImages(searchRequest)
        .then(result => {
            if (result.hits.length === 0) {
                const error = "Sorry, there are no images matching your search query. Please try again."
                throw error;
            }
            galleryEl.innerHTML = templateFunction(result.hits);
        })
        .catch(error => {
            console.log(error);
            Notify.failure(error);
        });
}
