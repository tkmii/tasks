export class DraggableTask {
  constructor() {
    this.available = document.querySelector('.available');
    this.completed = document.querySelector('.completed');
    this.availableColumn = document.querySelector('[data-available]');
    this.completedColumn = document.querySelector('[data-completed]');
    this.draggableElement = '';
    this.completedArray = ['Покормить Пеню', 'Начать новую задачку на JS'];
    this.availableArray = ['Начать учить TypeScript', 'Найти работу'];

    this.init();
  }

  init() {
    this.loadFromLocalStorage();
    this.renderList();
    this.setupEventListeners();
  }

  renderList() {
    this.available.innerHTML = '';
    this.completed.innerHTML = '';

    this.render(this.availableArray, this.available);
    this.render(this.completedArray, this.completed);
  }

  saveToLocalStorage() {
    this.availableArray = Array.from(this.available.querySelectorAll('.task')).map(node => node.textContent);
    this.completedArray = Array.from(this.completed.querySelectorAll('.task')).map(node => node.textContent);

    localStorage.setItem('available', JSON.stringify(this.availableArray));
    localStorage.setItem('completed', JSON.stringify(this.completedArray));
  }

  loadFromLocalStorage() {
    const availableTasks = localStorage.getItem('available');
    const completedTasks = localStorage.getItem('completed');

    if (availableTasks) {
      this.availableArray = JSON.parse(availableTasks);
    }

    if (completedTasks) {
      this.completedArray = JSON.parse(completedTasks);
    }
  }

  setupEventListeners() {
    this.dragstart(this.available);
    this.dragstart(this.completed);
    this.dragover(this.availableColumn);
    this.dragover(this.completedColumn);
    this.dragleave(this.availableColumn);
    this.dragleave(this.completedColumn);
    this.drop(this.available, this.availableColumn);
    this.drop(this.completed, this.completedColumn);
  }

  render(array, block) {
    array.forEach((task) => {
      block.insertAdjacentHTML('beforeend',
        `<li class="task" draggable="true">${task}</li>`
      );
    });
  }

  removeClass(el) {
    el.classList.remove('dragover');
  }

  addClass(el) {
    el.classList.add('dragover');
  }

  dragstart(array) {
    array.querySelectorAll('.task').forEach((task) => {
      task.addEventListener('dragstart', (e) => {
        this.draggableElement = task;
      });
    });
  }

  dragover(targetElem) {
    targetElem.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.addClass(targetElem);
    });
  }

  dragleave(targetElem) {
    targetElem.addEventListener('dragleave', (e) => {
      this.removeClass(targetElem);
    });
  }

  drop(targetElem, elemToRemoveClass) {
    targetElem.addEventListener('drop', (e) => {
      e.preventDefault();
      this.removeClass(elemToRemoveClass);

      if (this.draggableElement) {
        targetElem.appendChild(this.draggableElement);
        this.saveToLocalStorage();
      }
    });
  }
}