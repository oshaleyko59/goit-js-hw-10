import './css/styles.css';

import debounce from 'lodash.debounce';

//function fetchCountries() shall be imported from  fetchCountries.js
import { fetchCountries } from './js/fetchCountries';
import * as show from './js/notifications';

/******
Створи фронтенд частину програми пошуку даних про країну за її частковою
або повною назвою */

const DEBOUNCE_DELAY = 30; //Too fast actually...
const MAX_NUMBER_COUNTRIES = 10;

// configuration object for modification of output appearance
const CONF = {
  useCommon: false, //use common name for a header if true, official name by default
  filterStrict: false, //if true, fetched data will be filtered out if not start from entered letters
  getInfoStr() {
  return `ALT+SHIFT-F - toggle filter, ALT+SHIFT-N - toggle name. Name option: ${
    CONF.useCommon ? 'COMMON' : 'OFFICIAL'
  } Filter option: ${CONF.filterStrict ? 'YES' : 'NO'}`;
}
};

/* INTERFACE
+ if response > 10 - show warning notiflix
+ if response = 2 - render list(only flag and name official)
+ if response = 1 - render country card (flag, name official, capital, population and languages)
*/

const refs = {
  // input#search-box for kbd input
  input: document.querySelector('#search-box'),
  countries: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.placeholder = 'Please input country name here';
refs.countries.classList.add('invisible');
refs.countryInfo.classList.add('invisible');
// HTTP-запити виконуються на події input
refs.input.addEventListener(
  'input',
  // use lodash.debounce with 300 ms delay
  debounce(e => processInput(e.target.value), DEBOUNCE_DELAY)
);

/* to toggle appearance:
  ALT-N - name.common vs name.official
  ALT-F - toggle no filter vs filter
    Filter out if fetched name(any) does not start with entered sequenc
 */
document.addEventListener('keydown', handleKeyDown);
show.init();
show.setDefault(CONF.getInfoStr());
/*   `ALT+SHIFT-F - toggle filter, ALT+SHIFT-N - toggle name. Name option: ${
    CONF.useCommon ? 'COMMON' : 'OFFICIAL'
  } Filter option: ${CONF.filterStrict ? 'YES' : 'NO'}`
); */
show.default();
processInput('grou');
//************************* end of sync code *********************

/* ************************* FUNCTIONS ********************************** */

function processInput(name) {
  name = name.trim().toLowerCase();
  if (name === '') {
    refs.input.value = '';
    refs.input.placeholder = 'Please enter country name';
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
        console.log(data[0]);
        refs.countries.classList.add('invisible');

        renderCountry(data[0]);
      } else if (data.length <= MAX_NUMBER_COUNTRIES) {
        console.log(data);
        refs.countryInfo.classList.add('invisible');
        renderListOfCountries(data);
      } else {
        clearOutput();
        console.log(data);

        show.warning(
          `Too many matches found (${data.length}). Please enter a more specific name.`
        );
        return;
      }
      show.default();
    })
    .catch(error => {
      console.log('error: ', error.message);
      if (/aborted a request.$/.test(error.message)) {
        return;
      }

      clearOutput();
      show.error(error.message);
    });
}

function renderCountry({ name, flag, population, capital, languages }) {
  refs.countryInfo.innerHTML = `<h1>${flag} ${getName(name)}</h1>
      <table>
        ${getOfficialNameMarkup(name)}
        <tr><th>Capital:</th><td>${capital[0]}</td></tr>
        <tr><th>Population:</th><td>${transformNumber(population)}</td></tr>
        <tr><th>Languages:</th><td>${transformLang(languages)}</td></tr>
      </table>`;
  showCountryCard();
}

function renderListOfCountries(list) {
  //flag & official name only
  refs.countries.innerHTML = list
    .map(({ name, flag }) => `<li>${flag} ${getName(name)}</li>`)
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

function handleKeyDown(e) {
  if (!e.altKey || !e.shiftKey) {
    return;
  }
  e.preventDefault();

  //console.log(e.code);
  if (e.code === 'KeyN') {
    CONF.useCommon = !CONF.useCommon;
  } else if (e.code === 'KeyF') {
    CONF.filterStrict = !CONF.filterStrict;
  }

  show.setDefault(CONF.getInfoStr());
  processInput(refs.input.value);
}

