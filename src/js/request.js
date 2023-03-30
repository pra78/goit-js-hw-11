const API_URL = "https://pixabay.com/api/";
const KEY = "34884087-7348ee16e468132adc353bbfc";

export async function fetchImages(userRequest) {
    const encoded_url = encodeURI(userRequest);
    const request_url = `${API_URL}?key=${KEY}&q=${encoded_url}&image_type=photo&orientation=horizontal&safesearch=true`;
    const request = await fetch(request_url);
    const response = await request.json();
    return response;
};