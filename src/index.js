import { Notify } from "notiflix";
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
            console.log(result.hits.length)
        })
        .catch(error => {
            console.log(error);
            Notify.failure(error);
        });
}


/*
webformatURL - посилання на маленьке зображення для списку карток.
largeImageURL - посилання на велике зображення.
tags - рядок з описом зображення. Підійде для атрибуту alt.
likes - кількість лайків.
views - кількість переглядів.
comments - кількість коментарів.
downloads - кількість завантажень.
*/

/*
<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>
*/