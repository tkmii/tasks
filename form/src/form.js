export class Form {
  static SELECTORS = {
    name: '[data-type="name"]',
    email: '[data-type="email"]',
    password: '[data-type="password"]',
    confirm: '[data-type="confirm"]',
  };

  static ERRORMSGS = {
    name: 'Имя должно быть не менее 2х символов',
    email: 'Введите корректный email',
    password: 'Длина пароля должна быть не менее 8-ми символов, хотя бы одна цифра',
    confirm: 'Пароли не совпадают',
  }

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
    const re = /\d/;
    return this.password.value.length >= 8 && re.test(this.password.value)

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
        errorMsg: Form.ERRORMSGS.name
      },
      {
        isValid: this.validateEmail(),
        selector: Form.SELECTORS.email,
        errorMsg: Form.ERRORMSGS.email
      },
      {
        isValid: this.validatePass(),
        selector: Form.SELECTORS.password,
        errorMsg: Form.ERRORMSGS.password
      },
      {
        isValid: this.validateConfirm(),
        selector: Form.SELECTORS.confirm,
        errorMsg: Form.ERRORMSGS.confirm
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
      this.showError(this.validateName(), Form.SELECTORS.name, Form.ERRORMSGS.name);
    });

    this.email.addEventListener('input', () => {
      this.showError(this.validateEmail(), Form.SELECTORS.email, Form.ERRORMSGS.email);
    });

    this.password.addEventListener('input', () => {
      this.showError(this.validatePass(), Form.SELECTORS.password, Form.ERRORMSGS.password);
    });

    this.confirm.addEventListener('input', () => {
      this.showError(this.validateConfirm(), Form.SELECTORS.confirm, Form.ERRORMSGS.confirm);
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
      }
    });
  }
}