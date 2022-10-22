import axios from 'axios';
const API_KEY = '30769771-5aaaebc258ceb203584e6c265';
const BASE_URL = 'https://pixabay.com/api/';

export class PixabayfetchAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      orientation: 'horisontal',
      key: API_KEY,
      safesearch: true,
      image_type: 'photo',
    },
  };
  set query(userQuery) {
    this.#query = userQuery;
  }
  get query() {
    return this.#query;
  }
  incrementPage() {
    this.#page += 1;
  }
  resetPage() {
    this.#page = 1;
  }
  calcTotalPages(total) {
    return (this.#totalPages = Math.ceil(total / this.#perPage));
  }
  get isLoadMoreButton() {
    return this.#page < this.#totalPages;
  }
  get perPage() {
    return this.#perPage;
  }
  async fetchImage() {
    const url = `${BASE_URL}?${API_KEY}&q=${this.#query}&per_page=${
      this.#perPage
    }&page=${this.#page}`;
    const { data } = await axios.get(url, this.#params);

    return data;
  }
}
