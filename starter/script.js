'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const resetButton = document.querySelector('.reset');

class Workout {
  date = new Date();
  id = Date.now() + ''.slice(-10);
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //Running on April 14
    this.Description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run = new Running([12, 11], 5, 10, 100);
// const cycle = new Cycling([53, 110], 15, 130, 2100);
// console.log(run, cycle);

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #zoomLevel = 17;
  constructor() {
    this._getPosition();
    this._getLocalStorage();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    resetButton.addEventListener('click', this.reset);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadPosition.bind(this),
        function () {
          alert("Couldn't find your location");
        }
      );
    }
  }
  _loadPosition(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);
    console.log(`www.google.com/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    // console.log(this);
    this.#map = L.map('map').setView(coords, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._showForm.bind(this));
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _newWorkout(e) {
    e.preventDefault();
    const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !validInput(duration, distance, cadence) ||
        !allPositive(duration, distance)
      ) {
        return alert('Number should be positive');
      }
      workout = new Running({ lat, lng }, distance, duration, cadence);
      // console.log(workout);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInput(duration, distance, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('Number should be positive');
      }
      workout = new Cycling({ lat, lng }, distance, duration, elevation);
    }
    this.#workouts.push(workout);
    // console.log(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideform(workout);
    this._setWorkout();
    // console.log(this.#mapEvent.latlng);
  }
  _hideform(workout) {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '👷' : '👨‍💼'} ${
          workout.type == 'running' ? 'Worker ' : 'Tenant'
        }`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id=${
      workout.id
    }>
          <h2 class="workout__title">${
            workout.type == 'running' ? 'Active 🟢' : 'Tenant 👨‍💼'
          }</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '👷' : '👨‍💼'
            }</span>
            <span class="workout__unit">Rs</span>
            <span class="workout__value">${workout.distance}</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">👨‍🦱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;
    if (workout.type === 'running') {
      html += ` 
          <div class="workout__details">
            <span class="workout__icon">⌛</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">Years</span>
          </div>
        </li>`;
    } else {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">Years</span>
          </div>
        </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _moveToPopup(e) {
    const moveMarker = e.target.closest('.workout');
    // console.log(moveMarker);

    if (!moveMarker) return;

    const marker = this.#workouts.find(
      work => work.id === moveMarker.dataset.id
    );
    this.#map.setView(marker.coords, this.#zoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
    marker.click();
    console.log(marker);
  }
  _setWorkout() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    data.forEach(work => {
      work.click = function () {
        this.clicks++;
      };
    });

    this.#workouts = data;
    this.#workouts.forEach(work => {
      // this._renderWorkoutMarker(work);
      this._renderWorkout(work);
    });
  }
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
