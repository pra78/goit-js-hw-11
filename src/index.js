import { Notify } from "notiflix";
import { createMarkup } from "./js/markup";
import { fetchImages } from "./js/request";

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
            // console.log(result.hits[0].webformatURL);
            createMarkup(result);
        })
        .catch(error => {
            console.log(error);
            Notify.failure(error);
        });
}
