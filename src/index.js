import './css/styles.css';
import Notiflix from 'notiflix';
import { PixabayfetchAPI } from './js/pixabeyApi.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createImageItem } from './js/createImageItem';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const pixabayFetchAPI = new PixabayfetchAPI();
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onImageSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onImageSearch(evt) {
  evt.preventDefault();
  const {
    elements: { searchQuery },
  } = evt.currentTarget;
  const userQuery = searchQuery.value.trim();
  if (userQuery.length < 1) {
    Notiflix.Notify.info('Please, enter yuor query');
    return;
  }
  pixabayFetchAPI.query = userQuery;
  console.log(userQuery);
  try {
    const { hits, totalHits, total } = await pixabayFetchAPI.fetchImage();
    console.log(hits);
    const marcup = createImageItem(hits);
    gallery.insertAdjacentHTML('beforeend', marcup);
    const totalPages = await pixabayFetchAPI.calcTotalPages(totalHits);
    console.log(totalPages);
    if (totalHits >= pixabayFetchAPI.perPage) {
      loadMoreBtn.classList.remove('is-hidden');
    }
    console.log(totalHits);
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure('Sorry, error');
  }
}

function onLoadMore() {
  pixabayFetchAPI.incrementPage();
  if (!pixabayFetchAPI.isLoadMoreButton) {
    loadMoreBtn.classList.add('is-hidden');
  }
  pixabayFetchAPI.fetchImage().then(({ hits }) => {
    const marcup = createImageItem(hits);
    gallery.insertAdjacentHTML('beforeend', marcup);
  });
}
