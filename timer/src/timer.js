export class Timer {
  static SELECTORS = {
    START: '[data-start]',
    PAUSE: '[data-pause]',
    STOP: '[data-stop]',
    TIMER: '[data-timer]',
    SETTING: '[data-setting]',
    INPUT: '#time',
  }

  static secondsTimeStart = 300;

  constructor() {
    this.start = document.querySelector(Timer.SELECTORS.START);
    this.pause = document.querySelector(Timer.SELECTORS.PAUSE);
    this.stop = document.querySelector(Timer.SELECTORS.STOP);
    this.timer = document.querySelector(Timer.SELECTORS.TIMER);
    this.setting = document.querySelector(Timer.SELECTORS.SETTING);
    this.input = document.querySelector(Timer.SELECTORS.INPUT);
    this.state = 'inited';
    this.hasCustomTime = false;
    this.secondsTime = Timer.secondsTimeStart;
    this.formatedTime = '';
    this.interval = '';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.formatTime();
    this.textTimer();
    this.updateButtonsState();
  }

  updateState(state) {
    this.state = state;
    this.updateButtonsState();
  }

  updateButtonsState() {
    const { state } = this;

    this.start.disabled = state === 'started';
    this.start.textContent = state === 'paused' ? 'Продолжить' : 'Старт';

    this.pause.disabled = state !== 'started';

    this.stop.disabled = state === 'inited';
  }

  // updateConditions() {
  //   if (this.flags.isInited) {
  //     this.addOrDeleteDisabled(this.start, false)
  //     this.addOrDeleteDisabled(this.pause, true)
  //     this.addOrDeleteDisabled(this.stop, true)
  //     this.start.textContent = 'Старт'
  //   } else if (this.flags.isStarted) {
  //     this.addOrDeleteDisabled(this.start, true)
  //     this.addOrDeleteDisabled(this.pause, false)
  //     this.addOrDeleteDisabled(this.stop, false)
  //     this.start.textContent = 'Старт'
  //   } else if (this.flags.isPaused) {
  //     this.addOrDeleteDisabled(this.start, false)
  //     this.addOrDeleteDisabled(this.pause, true)
  //     this.addOrDeleteDisabled(this.stop, false)
  //     this.start.textContent = 'Продолжить'
  //   }
  // }

  // addOrDeleteDisabled(btn, boolean) {
  //   btn.disabled = boolean
  // }

  textTimer() {
    this.timer.textContent = this.formatedTime;
  }

  formatTime() {
    const minutes = Math.floor(this.secondsTime / 60);
    const remainingSeconds = this.secondsTime % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    this.formatedTime = `${formattedMinutes}:${formattedSeconds}`;
  }

  toSeconds() {
    const [minutes, seconds] = this.input.value.split(":").map(Number);
    this.secondsTime = minutes * 60 + seconds;
  }

  startOn() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(() => {
      this.secondsTime--
      this.formatTime()
      if (this.secondsTime <= -1) {
        clearInterval(this.interval)
        alert("Время вышло!");
        this.backToStart()
      } else {
        this.updateState('started')
      }
      this.textTimer();

    }, 1000);
  }

  pauseOn() {
    clearInterval(this.interval)
    this.updateState('paused')
  }

  backToStart() {
    if (this.interval) {
      clearInterval(this.interval)
    }

    if (!this.hasCustomTime) {
      this.secondsTime = Timer.secondsTimeStart
    } else {
      this.toSeconds()
    }

    this.formatTime()
    this.textTimer();
    this.updateState('inited')
  }

  addYourTimer() {
    this.hasCustomTime = true
    this.toSeconds()
    this.startOn()
  }

  setupEventListeners() {
    this.start.addEventListener('click', () => this.startOn());
    this.pause.addEventListener('click', () => this.pauseOn());
    this.stop.addEventListener('click', () => this.backToStart());
    this.setting.addEventListener('click', () => this.addYourTimer());
  }
}