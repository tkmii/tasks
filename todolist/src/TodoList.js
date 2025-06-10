export class TodoList {
  static SELECTORS = {
    BUTTON: '.head button',
    INPUT: '.head input',
    LIST: '.list ul',
    REMOVE_BTN: 'remove',
    ABC_BTN: '.sort-abc',
    DATE_BTN: '.sort-date',
    ACTIVE_BTN: '.filter-active',
    DONE_BTN: '.filter-done',
    RESET: '.reset'
  };

  static flags = {
    sortngABC: true,
    sortingDate: true,
    reset_on: false
  };

  constructor() {
    this.button = document.querySelector(TodoList.SELECTORS.BUTTON);
    this.input = document.querySelector(TodoList.SELECTORS.INPUT);
    this.list = document.querySelector(TodoList.SELECTORS.LIST);
    this.sortabs = document.querySelector(TodoList.SELECTORS.ABC_BTN);
    this.sortdate = document.querySelector(TodoList.SELECTORS.DATE_BTN);
    this.filteractive = document.querySelector(TodoList.SELECTORS.ACTIVE_BTN);
    this.filterdone = document.querySelector(TodoList.SELECTORS.DONE_BTN);
    this.reset = document.querySelector(TodoList.SELECTORS.RESET);
    this.tasks = [];

    if (!this.button) throw new Error('Кнопка не найдена');
    this.init();
  }

  init() {
    this.#loadFromLocalStorage()
    this.renderList(this.tasks);
    this.setupEventListeners();
  }

  renderList(arr) {
    this.list.innerHTML = '';
    arr.forEach((task, index) => {
      const checked = task.checked ? 'checked' : '';
      const createdAt = new Date(task.createdAt).toLocaleString().split(',')[0];
      this.list.insertAdjacentHTML('beforeend',
        `<li>
          <input type="checkbox" data-index="${index}" ${checked}>
          <span ...>${this.#escapeHtml(task.text)}</span>
          <span class="task-date">(Добавлена: ${createdAt})</span>
          <button class="remove">Удалить</button>
        </li>`
      );
    });
  }

  #clearInput() {
    this.input.value = '';
  }

  #escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  handleAddTask() {
    const taskText = this.input.value.trim();
    if (taskText === '') {
      alert('Введите задачу');
    } else {
      this.tasks.push({
        text: taskText,
        checked: false,
        createdAt: new Date().toISOString()
      });
      this.#saveToLocalStorage(this.tasks)
      this.renderList(this.tasks);
    }
    this.#clearInput();
  }

  handleCheckboxChange(e) {
    if (e.target.type === 'checkbox') {
      const index = e.target.dataset.index;
      this.tasks[index].checked = e.target.checked;
      this.#saveToLocalStorage(this.tasks)

      const textSpan = e.target.nextElementSibling;
      if (e.target.checked) {
        textSpan.classList.add('completed');
      } else {
        textSpan.classList.remove('completed');
      }
    }
  }

  handleDeleteTask(e) {
    if (e.target.classList.contains(TodoList.SELECTORS.REMOVE_BTN)) {
      const li = e.target.closest('li');
      const index = parseInt(e.target.closest('li').querySelector('input').dataset.index);
      if (!isNaN(index) && index >= 0 && index < this.tasks.length) {
        this.tasks.splice(index, 1);
        this.#saveToLocalStorage(this.tasks);
        this.renderList(this.tasks);
      }
    }
  }

  #saveToLocalStorage(array) {
    localStorage.setItem('list', JSON.stringify(array));
  }

  #loadFromLocalStorage() {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('list')) || [];
      this.tasks = savedTasks.map(task => {
        if (!task.createdAt) {
          return { ...task, createdAt: new Date().toISOString() };
        }
        return task;
      });
    } catch (e) {
      this.tasks = [];
      console.error('Ошибка чтения localStorage', e);
    }
  }

  sortABC() {
    let sortedABC;

    if (TodoList.flags.sortngABC) {
      this.sortabs.classList.add('reverse')
      sortedABC = this.tasks.slice().sort((a, b) => a.text.localeCompare(b.text));
      TodoList.flags.sortngABC = false
    } else {
      this.sortabs.classList.remove('reverse')
      sortedABC = this.tasks.slice().sort((a, b) => b.text.localeCompare(a.text));
      TodoList.flags.sortngABC = true;
    }
    this.renderList(sortedABC);
    TodoList.flags.reset_on = true
  }

  sortDate() {
    let sortedDate;

    if (TodoList.flags.sortingDate) {
      this.sortdate.classList.add('reverse')
      sortedDate = this.tasks.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      TodoList.flags.sortingDate = false
    } else {
      this.sortdate.classList.remove('reverse')
      sortedDate = this.tasks.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));;
      TodoList.flags.sortingDate = true;
    }
    this.renderList(sortedDate);
    TodoList.flags.reset_on = true
  }

  filteredDone() {
    const filteredItems = this.tasks.filter((task) => task.checked === true)
    this.renderList(filteredItems);
    TodoList.flags.reset_on = true
  }

  filteredActive() {
    const filteredItems = this.tasks.filter((task) => task.checked === false)
    this.renderList(filteredItems);
    TodoList.flags.reset_on = true
  }

  resetFandS() {
    if (TodoList.flags.reset_on) {
      this.renderList(this.tasks);
      const btnsReverse = [this.sortabs, this.sortdate]

      btnsReverse.forEach((btn) => {
        if (btn.classList.contains('reverse')) {
          btn.classList.remove('reverse')
        }
      })
      TodoList.flags.reset_on = false
    } else {
      alert('Сброс недоступен')
    }

  }

  setupEventListeners() {
    this.button.addEventListener('click', () => this.handleAddTask());
    this.list.addEventListener('click', (e) => {
      if (e.target.classList.contains(TodoList.SELECTORS.REMOVE_BTN)) {
        this.handleDeleteTask(e);
      } else if (e.target.type === 'checkbox') {
        this.handleCheckboxChange(e);
      }
    });
    this.sortabs.addEventListener('click', () => this.sortABC())
    this.sortdate.addEventListener('click', () => this.sortDate())
    this.filteractive.addEventListener('click', () => this.filteredActive())
    this.filterdone.addEventListener('click', () => this.filteredDone())
    this.reset.addEventListener('click', () => this.resetFandS())
  }
}