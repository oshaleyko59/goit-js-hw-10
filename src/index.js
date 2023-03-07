import './css/styles.css';

// Додай мінімальне оформлення елементів інтерфейсу. TODO:

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

/* Створи фронтенд частину програми пошуку даних про країну за її частковою
або повною назвою */

const DEBOUNCE_DELAY = 600; //TODO: 300;
const MAX_NUMBER_COUNTRIES = 10;
const COUNTRIES_URL = 'https://restcountries.com';
const COUNTRIES_RES = '/v3.1/name';

/* FILTER only required fields:
  name.official - повна назва країни
  capital - столиця
  population - населення
  flags.svg - посилання на зображення прапора
  languages - масив мов */
const COUNTRIES_FILTER = '?fields=name,flag,capital,population,languages';

/* INTERFACE
+ if response > 10 країн - show warning notiflix
- if response = 2 - render list(flag and name official)
- if response = 2 - render country card (flag, name official, capital, population and languages)
*/
const WARN_TOO_MANY_COUNTRIES =
  'Too many matches found. Please enter a more specific name.';

/* ERRORS: If nothing found, error 404 returned. Add msg (notiflix) */
const ERR_NO_COUNTRY_FOUND = 'Oops, there is no country with that name';

/* NB! Достатньо, щоб застосунок працював для більшості країн. Деякі країни,
як-от Sudan, можуть створювати проблеми, оскільки назва країни є частиною
назви іншої країни - South Sudan. Не потрібно турбуватися про ці винятки.
*/

/* INPUT
  - Назву країни користувач вводить у текстове поле input#search-box.
  - HTTP-запити виконуються на події input.
  + use lodash.debounce with 300 ms delay.
  + use trim()
  - If input value is empty, no HTTP-request and any output markup is removed
 */
const USE_OFFICIAL =
  'Ctrl-click on input element to revert to OFFICIAL name';
const USE_COMMON =
  'Ctrl-click on input element to see country COMMON name';

const CONF = {
  useCommon: false,
};

const refs = {
  input: document.querySelector('#search-box'),
  countries: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.countries.classList.add('invisible');
refs.countryInfo.classList.add('invisible');
refs.input.addEventListener(
  'input',
  debounce(e => processInput(e.target.value), DEBOUNCE_DELAY)
);
refs.input.addEventListener('click', handleInputClick);
informOfUseCommon(USE_COMMON);

/* ********************************************************************* */

function processInput(name) {
  name = name.trim().toLowerCase();
  console.log('process name', name);

  clearOutput();
  if (name === '') {
    return;
  }

  fetchCountries(name);
}

/*
  Function fetchCountries(name) shall make an HTTP-request to
  public API Rest Countries - name-resource.
  and shall return promise with array of countries.
  put it fetchCountries.js і зроби іменований експорт.

https://restcountries.com/v3.1/name/{any-name}
https://restcountries.com/v3.1/name/united

HTTP-request повертає масив об'єктів країн, що задовольнили критерій пошуку.
*/

function fetchCountries(name) {
  //TODO:  localStorage.setItem();
  console.log(
    'fetch',
    COUNTRIES_URL + COUNTRIES_RES + '/' + name + COUNTRIES_FILTER
  );

  fetch(COUNTRIES_URL + COUNTRIES_RES + '/' + name + COUNTRIES_FILTER)
    .then(response => {
      // Response handling
      if (!response.ok) {
        /* IMPORTANT! response 404 is not an error -> throw error here */
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      // Data handling -       renderData(data);
      console.log('then', data);
      if (data.length === 1) {
        renderCountry(data[0]);
      } else if (data.length <= MAX_NUMBER_COUNTRIES) {
        renderListOfCountries(data);
      } else {
        showWarning(WARN_TOO_MANY_COUNTRIES);
      }
    })
    .catch(error => {
      // Error handling
      console.log('catch', error); //TODO:
      showError(ERR_NO_COUNTRY_FOUND);
    });
}

function renderCountry({ name, flag, population, capital, languages }) {
  console.log('render country', name); //TODO:
  refs.countryInfo.classList.remove('invisible'); //          <tr><th>Official name:</th><td>${name.official}</td></tr>
  const markup = `<h1>${flag} ${getName(name)}</h1>
        <table>
          ${getOfficialNameMarkup(name)}
          <tr><th>Capital:</th><td>${capital[0]}</td></tr
          <tr><th>Population:</th><td>${transformNumber(population)}</td></tr>
          <tr><th>Languages:</th><td>${transformLang(languages)}</td></tr>
        </table>`;
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function renderListOfCountries(list) {
  console.log('render list', list); //TODO:

  refs.countries.classList.remove('invisible');
  const markup = list
    .map(({ name, flag }) => {
      //flag & official name only
      return `<li>${flag} ${getName(name)}</li>`;
    })
    .join('');
  refs.countries.insertAdjacentHTML('beforeend', markup);
}

function showError(txt) {
  Notify.failure(txt, { position: 'center-bottom' });
}

function showWarning(txt) {
  Notify.warning(txt, { position: 'center-bottom' });
}

//clear output from previous data
function clearOutput() {
  refs.countries.classList.add('invisible');
  refs.countryInfo.classList.add('invisible');
  refs.countries.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function transformNumber(num) {
  console.log('to locale', num.toLocaleString());
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
  if (!e.ctrlKey) {
    return;
  }
  console.log('ctrl-click', e);
  CONF.useCommon = !CONF.useCommon;
  informOfUseCommon(CONF.useCommon ? USE_OFFICIAL : USE_COMMON);
  processInput(refs.input.value);
}

function informOfUseCommon(txt) {
  Notify.info(txt, {
    position: 'center-bottom',
    closeButton: true,
    showOnlyTheLastOne: true,
  });
}
