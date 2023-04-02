import { throttledInfiniteScroll } from "..";

export function addInfiniteScroll() {
    window.addEventListener("scroll", throttledInfiniteScroll);
}

export function removeInfiniteScroll() {
    window.removeEventListener("scroll", throttledInfiniteScroll);
};