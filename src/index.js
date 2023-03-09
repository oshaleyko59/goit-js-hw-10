/***************************** REQUIREMENTS ****************************
* Створи фронтенд частину програми пошуку даних про країну за її частковою
  або повною назвою

* function fetchCountries() shall be imported from  fetchCountries.js
* HTTP-запити виконуються на події input. Use lodash.debounce with 300 ms delay
* INTERFACE
  + if response > 10 - show warning notiflix
  + if response = 2 - render list(only flag and name official)
  + if response = 1 - render country card (flag, name official, capital, population and languages)

  УВАГА - ОБЛАМАЛАСЯ ... там мабуть RegExp потрібній, а в доку нічого не написано)))
Достатньо, щоб застосунок працював для більшості країн. Деякі країни,
як-от Sudan, можуть створювати проблеми, оскільки назва країни є
частиною назви іншої країни - South Sudan. Не потрібно турбуватися
про ці винятки.
  */

import './css/styles.css';

import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

import * as show from './js/notifications';
import { CONF} from './js/config';

const refs = {
  input: document.querySelector('#search-box'),
  countries: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.placeholder = CONF.PLACEHOLDER;
refs.countries.classList.add('invisible');
refs.countryInfo.classList.add('invisible');

refs.input.addEventListener('input',
  debounce(e => processInput(e.target.value), CONF.DEBOUNCE_DELAY)
);

document.addEventListener('keydown', handleKeyDown);
show.init();
show.setDefault(CONF.getInfoStr());
show.default();
//************************* end of sync code *********************

function processInput(name) {
  name = name.trim().toLowerCase();
  if (name === '') {
    refs.input.value = '';
    refs.input.placeholder = CONF.PLACEHOLDER;
    clearOutput();
    show.default();
    return;
  }

  fetchCountries(name)
    .then(data => {
      if (CONF.filterStrict) {
        data = data.filter(
          el =>
            el.name.common.toLowerCase().startsWith(name) ||
            el.name.official.toLowerCase().startsWith(name)
        );
      }
      if (data.length === 1) {
        refs.countries.classList.add('invisible');

        renderCountry(data[0]);
      } else if (data.length <= CONF.MAX_NUMBER_COUNTRIES) {
        refs.countryInfo.classList.add('invisible');
        renderListOfCountries(data);
      } else {
        clearOutput();

        show.warning(
          `Too many matches found (${data.length}). Please enter a more specific name.`
        );
        return;
      }
      show.default();
    })
    .catch(error => {
      if (/aborted a request.$/.test(error.message)) { //not display aborted
        return;
      }

      clearOutput();
      show.error(error.message);
    });
}

function getFlagMarkup(flags, height) {
  return `<img src='${flags.svg}' height=${height}rem width=auto
  } alt='Flag'/>`;
}

function renderCountry({ name, flags, population, capital, languages }) {
  refs.countryInfo.innerHTML = `<h1>${getFlagMarkup(flags, 43)} ${CONF.getName(
    name
  )}</h1>
      <table>
        ${CONF.getOfficialNameMarkup(name)}
        <tr><th>Capital:</th><td>${capital[0]}</td></tr>
        <tr><th>Population:</th><td>${CONF.transformPopulation(population)}</td></tr>
        <tr><th>Languages:</th><td>${CONF.transformLang(languages)}</td></tr>
      </table>`;
  showCountryCard();
}

function renderListOfCountries(list) {
  //flag & official name only
  refs.countries.innerHTML = list
    .map(
      ({ name, flags }) =>
        `<li class='country-list__item'>
        <span class='country-list__flag'>${getFlagMarkup(flags, 30)}</span>
        <span class='country-list__name'>${CONF.getName(name)}</span></li>`
    )
    .join('');
  showCountryList();
}

//clear output from previous data
function clearOutput() {
  hideCountryCard();
  hideCountryList();
}

function hideCountryCard() {
  refs.countryInfo.classList.add('invisible');
}

function hideCountryList() {
  refs.countries.classList.add('invisible');
}

function showCountryCard() {
  refs.countryInfo.classList.remove('invisible');
}

function showCountryList() {
  refs.countries.classList.remove('invisible');
}

function handleKeyDown(e) {
  if (!e.altKey || !e.shiftKey) {
    return;
  }
  e.preventDefault();

  if (e.code === 'KeyN') {
    CONF.useCommon = !CONF.useCommon;
  } else if (e.code === 'KeyF') {
    CONF.filterStrict = !CONF.filterStrict;
  }

  show.setDefault(CONF.getInfoStr());
  processInput(refs.input.value);
}

