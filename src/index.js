import { Notify } from "notiflix";
import { fetchImages } from "./js/request";
import templateFunction from './template/template.hbs';

const galleryEl = document.querySelector('.gallery');
const form = document.querySelector('#search-form');

form.addEventListener('submit', onSubmitBtnPressed);

function onSubmitBtnPressed(event) {
    event.preventDefault();
    const searchRequest = event.currentTarget.elements['searchQuery'].value;
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
