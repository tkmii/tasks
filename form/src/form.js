export class Form {
  static SELECTORS = {
    name: '[data-type="name"]',
    email: '[data-type="email"]',
    password: '[data-type="password"]',
    confirm: '[data-type="confirm"]',
  };

  constructor() {
    this.form = document.querySelector('#form');
    this.name = document.querySelector('#name');
    this.email = document.querySelector('#email');
    this.password = document.querySelector('#password');
    this.confirm = document.querySelector('#confirm');
    this.btn = document.querySelector('#submit');
    this.errors = [];
    this.formValue = {
      name: '',
      email: '',
      password: '',
    }
    this.init();
  }

  init() {
    this.setupEventListener();
  }

  validateName() {
    return this.name.value.length >= 2;
  }

  validateEmail() {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(this.email.value);
  }

  validatePass() {
    return this.password.value.length >= 3;
  }

  validateConfirm() {
    return this.password.value === this.confirm.value;
  }

  validateAll() {
    this.errors = [];

    const validationRules = [
      {
        isValid: this.validateName(),
        selector: Form.SELECTORS.name,
        errorMsg: 'Имя должно быть не менее 2х символов'
      },
      {
        isValid: this.validateEmail(),
        selector: Form.SELECTORS.email,
        errorMsg: 'Введите корректный email'
      },
      {
        isValid: this.validatePass(),
        selector: Form.SELECTORS.password,
        errorMsg: 'Длина пароля должна быть не менее 3х символов'
      },
      {
        isValid: this.validateConfirm(),
        selector: Form.SELECTORS.confirm,
        errorMsg: 'Пароли не совпадают'
      }
    ];

    validationRules.forEach(({ isValid, selector, errorMsg }) => {
      if (!isValid) {
        this.errors.push(errorMsg);
        this.showError(false, selector, errorMsg);
      } else {
        this.showError(true, selector, '');
      }
    });

    return this.errors.length === 0;
  }

  showError(isValid, selector, errorMsg) {
    const field = document.querySelector(selector);
    const errorElement = field.querySelector('.error');

    if (errorElement) {
      errorElement.remove();
    }

    if (!isValid && errorMsg) {
      field.insertAdjacentHTML('beforeend',
        `<div class="error">${errorMsg}</div>`
      );
    }
  }

  setupEventListener() {
    this.name.addEventListener('input', () => {
      this.showError(this.validateName(), Form.SELECTORS.name, 'Имя должно быть не менее 2х символов');
    });

    this.email.addEventListener('input', () => {
      this.showError(this.validateEmail(), Form.SELECTORS.email, 'Введите корректный email');
    });

    this.password.addEventListener('input', () => {
      this.showError(this.validatePass(), Form.SELECTORS.password, 'Длина пароля должна быть не менее 3х символов');
    });

    this.confirm.addEventListener('input', () => {
      this.showError(this.validateConfirm(), Form.SELECTORS.confirm, 'Пароли не совпадают');
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isValid = this.validateAll();

      if (isValid) {
        this.formValue.name = this.name.value
        this.formValue.email = this.email.value
        this.formValue.password = this.password.value
        console.log(this.formValue)
        console.log('Форма успешно отправлена');
      } else {
        console.log('Ошибки валидации:', this.errors.join(', '));
      }
    });
  }
}