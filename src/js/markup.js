export function createMarkup(searchResults) {
    const images = searchResults.hits;
    const markup = images.map(image => {
        return `
        <div class="photo-card">
            <a class="gallery__item" href="${image.largeImageURL}">
                <img
                    class="gallery__image"
                    src="${image.webformatURL}" 
                    alt="${image.tags}"
                    loading="lazy"
                />
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
            </a>
        </div>`
    }).join("");
    console.log(markup);
}

/*
likes - кількість лайків.
views - кількість переглядів.
comments - кількість коментарів.
downloads - кількість завантажень.
*/