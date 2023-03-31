import axios, {isCancel, AxiosError} from 'axios';

const API_URL = "https://pixabay.com/api/";
const KEY = "34884087-7348ee16e468132adc353bbfc";

export async function fetchImages(userRequest, page) {
    const encoded_url = encodeURI(userRequest);
    const request_url = `${API_URL}?key=${KEY}&q=${encoded_url}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    try {
        const request = await axios(request_url);
        return request.data;
    } catch (error) {
        console.error(error);
    }
}