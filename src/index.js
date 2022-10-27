import './css/styles.css';
import Notiflix from 'notiflix';
import { PixabayfetchAPI } from './js/pixabeyApi.js';
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
    const { hits, totalHits } = await pixabayFetchAPI.fetchImage();
    console.log(hits);

    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const marcup = createImageItem(hits);
    gallery.insertAdjacentHTML('beforeend', marcup);
    lightbox.refresh();
    const totalPages = pixabayFetchAPI.calcTotalPages(totalHits);
    console.log(totalPages);
    if (totalHits >= pixabayFetchAPI.perPage) {
      loadMoreBtn.classList.remove('is-hidden');
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
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
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  pixabayFetchAPI.fetchImage().then(({ hits }) => {
    const marcup = createImageItem(hits);
    gallery.insertAdjacentHTML('beforeend', marcup);
    lightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
