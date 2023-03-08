import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

//function fetchCountries() shall be imported from  fetchCountries.js
import { fetchCountries } from './js/fetchCountries';

/******
Створи фронтенд частину програми пошуку даних про країну за її частковою
або повною назвою */

const DEBOUNCE_DELAY = 300; //Too fast actually...
const MAX_NUMBER_COUNTRIES = 10;

// configuration object for modification of output appearance
const CONF = {
  useCommon: false, //use common name for a header if true, official name by default
};
const USE_OFFICIAL = 'Alt-click on input element to revert to OFFICIAL name';
const USE_COMMON = 'Alt-click on input element to see country COMMON name';

/* INTERFACE
+ if response > 10 - show warning notiflix
+ if response = 2 - render list(only flag and name official)
+ if response = 1 - render country card (flag, name official, capital, population and languages)
*/
const WARN_TOO_MANY_COUNTRIES =
  'Too many matches found. Please enter a more specific name.';

const refs = {
  // input#search-box for kbd input
  input: document.querySelector('#search-box'),
  countries: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countries.classList.add('invisible');
refs.countryInfo.classList.add('invisible');
  // HTTP-запити виконуються на події input
refs.input.addEventListener(
  'input',
  // use lodash.debounce with 300 ms delay
  debounce(e => processInput(e.target.value), DEBOUNCE_DELAY)
);

//to allow change appearance - use of name fields - by Ctrl-click
refs.input.addEventListener('click', handleInputClick);
informOfUseCommon(USE_COMMON);

/* ************************* FUNCTIONS ********************************** */
function processInput(name) {
  clearOutput();

  name = name.trim().toLowerCase();
  if (name === '') {
    return;
  }

  fetchCountries(name)
    .then(data => {
      if (data.length === 1) {
        renderCountry(data[0]);
      } else if (data.length <= MAX_NUMBER_COUNTRIES) {
        renderListOfCountries(data);
      } else {
        showWarning(WARN_TOO_MANY_COUNTRIES);
      }
    })
    .catch(error => showError(error.message));
}

function renderCountry({ name, flag, population, capital, languages }) {
  refs.countryInfo.classList.remove('invisible');

  refs.countryInfo.insertAdjacentHTML(
    'beforeend',
    `<h1>${flag} ${getName(name)}</h1>
      <table>
        ${getOfficialNameMarkup(name)}
        <tr><th>Capital:</th><td>${capital[0]}</td></tr>
        <tr><th>Population:</th><td>${transformNumber(population)}</td></tr>
        <tr><th>Languages:</th><td>${transformLang(languages)}</td></tr>
      </table>`
  );
}

function renderListOfCountries(list) {
  refs.countries.classList.remove('invisible');

  //flag & official name only
  refs.countries.insertAdjacentHTML(
    'beforeend',
    list.map(({ name, flag }) => `<li>${flag} ${getName(name)}</li>`).join('')
  );
}

//clear output from previous data
function clearOutput() {
  refs.countries.classList.add('invisible');
  refs.countryInfo.classList.add('invisible');
  refs.countries.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function transformNumber(num) {
  return num.toLocaleString();
}

function transformLang(obj) {
  return Object.values(obj).join(', ');
}

function getName(name) {
  return CONF.useCommon ? name.common : name.official;
}

function getOfficialNameMarkup(name) {
  return !CONF.useCommon
    ? ''
    : '<tr><th>Official name:</th><td>' + name.official + '</td></tr';
}

function handleInputClick(e) {
  if (!e.altKey) {
    return;
  }
  e.preventDefault();
  CONF.useCommon = !CONF.useCommon;
  informOfUseCommon(CONF.useCommon ? USE_OFFICIAL : USE_COMMON);
  processInput(refs.input.value);
}

/* ************************* NOTIFICATIONS ********************************** */

function showError(txt) {
  Notify.failure(txt, { position: 'center-bottom' });
}

function showWarning(txt) {
  Notify.warning(txt, { position: 'center-bottom' });
}

function informOfUseCommon(txt) {
  Notify.info(txt, {
    position: 'center-bottom',
    closeButton: true,
    showOnlyTheLastOne: true,
  });
}


