import { cardLimit, counter } from '..';
import skeletonTemplateFunction from '../template/skeleton-template.hbs';

const cardTotalElem = document.getElementById("card-total");
export const loader = document.getElementById("loader");
export const cardCountElem = document.getElementById("card-count");

export function renderLoader() {
    loader.innerHTML = '';
    cardCountElem.innerHTML = counter;
    cardTotalElem.innerHTML = cardLimit;
    loader.insertAdjacentHTML('afterbegin', skeletonTemplateFunction());
    loader.classList.remove('js-hidden');
}

export function hideLoader() {
    loader.innerHTML = '';
    loader.classList.add('js-hidden');
}