import { Pagination } from './pagination.js';

export class UsersList {
  constructor() {
    this.list = document.querySelector('.users-list');
    this.search = document.querySelector('#search');
    this.sortName = document.querySelector('.sort-name');
    this.sortMail = document.querySelector('.sort-mail');
    this.paginationContainer = document.querySelector('#pagination-container');

    this.originalData = [];
    this.filteredData = [];
    this.currentSort = {
      field: null,
      direction: 'asc'
    };

    this.pagination = new Pagination(this.paginationContainer, 5);
    this.pagination.onPageChange = (pageData) => this.renderData(pageData);

    this.loadData();
  }

  async loadData() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      this.originalData = await response.json();
      this.filteredData = [...this.originalData];
      this.init();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  init() {
    this.setupEventListeners();
    this.updateData();
  }

  renderData(data) {
    this.list.innerHTML = '';

    if (data.length === 0) {
      this.list.innerHTML = '<div class="no-results">Здесь ничего нет</div>';
      return;
    }

    data.forEach((e) => {
      this.list.insertAdjacentHTML('beforeend',
        `<div class="user">
          <div class="field"> <strong>Имя:</strong> ${e.name} </div>
          <div class="field"> <strong>Email:</strong> ${e.email} </div>
          <div class="field"> <strong>Телефон:</strong> ${e.phone} </div>
        </div>`
      );
    });
  }

  searching() {
    const searchTerm = this.search.value.toLowerCase();
    this.filteredData = this.originalData.filter((e) =>
      e.name.toLowerCase().includes(searchTerm)
    );
    this.updateData();
  }

  sorting(field) {
    if (this.currentSort.field === field) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.field = field;
      this.currentSort.direction = 'asc';
    }

    this.filteredData = [...this.filteredData].sort((a, b) => {
      const compareResult = a[field].localeCompare(b[field]);
      return this.currentSort.direction === 'asc' ? compareResult : -compareResult;
    });

    this.updateSortButtons();
    this.updateData();
  }

  updateSortButtons() {
    this.sortName.classList.remove('asc', 'desc');
    this.sortMail.classList.remove('asc', 'desc');

    if (this.currentSort.field === 'name') {
      this.sortName.classList.add(this.currentSort.direction);
    } else if (this.currentSort.field === 'email') {
      this.sortMail.classList.add(this.currentSort.direction);
    }
  }

  updateData() {
    this.pagination.init(this.filteredData);

    const pageData = this.pagination.goToPage(1);
    this.renderData(pageData);
  }

  setupEventListeners() {
    this.search.addEventListener('input', () => this.searching());
    this.sortName.addEventListener('click', () => this.sorting('name'));
    this.sortMail.addEventListener('click', () => this.sorting('email'));
  }
}