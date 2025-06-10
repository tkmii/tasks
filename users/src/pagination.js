export class Pagination {
  constructor(container, itemsPerPage = 5, visiblePages = 5) {
    this.container = container;
    this.itemsPerPage = itemsPerPage;
    this.visiblePages = visiblePages;
    this.currentPage = 1;
    this.totalPages = 1;
    this.data = [];
  }

  init(data) {
    this.data = data;
    this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const prevLi = this.createPageItem('&laquo;', this.currentPage > 1, () => {
      if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
    });
    this.container.appendChild(prevLi);

    const { startPage, endPage } = this.calculateVisiblePages();

    if (startPage > 1) {
      this.container.appendChild(this.createPageItem('1', false, () => this.goToPage(1)));
      if (startPage > 2) {
        this.container.appendChild(this.createPageItem('...', true));
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageItem = this.createPageItem(
        i.toString(),
        false,
        () => this.goToPage(i),
        i === this.currentPage
      );
      this.container.appendChild(pageItem);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        this.container.appendChild(this.createPageItem('...', true));
      }
      this.container.appendChild(
        this.createPageItem(this.totalPages.toString(), false, () => this.goToPage(this.totalPages))
      );
    }

    const nextLi = this.createPageItem('&raquo;', this.currentPage < this.totalPages, () => {
      if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
    });
    this.container.appendChild(nextLi);
  }

  createPageItem(text, disabled, onClick = null, active = false) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.innerHTML = text;

    if (disabled) link.classList.add('disabled');
    if (active) link.classList.add('active');
    if (onClick) link.addEventListener('click', (e) => {
      e.preventDefault();
      onClick();
    });

    li.appendChild(link);
    return li;
  }

  calculateVisiblePages() {
    let startPage, endPage;

    if (this.totalPages <= this.visiblePages) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      const maxVisibleBeforeCurrent = Math.floor(this.visiblePages / 2);
      const maxVisibleAfterCurrent = Math.ceil(this.visiblePages / 2) - 1;

      if (this.currentPage <= maxVisibleBeforeCurrent) {
        startPage = 1;
        endPage = this.visiblePages;
      } else if (this.currentPage + maxVisibleAfterCurrent >= this.totalPages) {
        startPage = this.totalPages - this.visiblePages + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - maxVisibleBeforeCurrent;
        endPage = this.currentPage + maxVisibleAfterCurrent;
      }
    }

    return { startPage, endPage };
  }

  goToPage(page) {
    this.currentPage = page;
    this.render();

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageData = this.data.slice(startIndex, endIndex);

    if (this.onPageChange) {
      this.onPageChange(pageData);
    }

    return pageData; 
  }
}