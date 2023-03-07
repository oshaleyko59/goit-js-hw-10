import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const MAX_NUMBER_COUNTRIES = 10;
const COUNTRIES_URL = 'https://restcountries.com/v3.1'; 
const COUNTRIES_RES = '/name';

/* Створи фронтенд частину програми пошуку даних про країну за її частковою
або повною назвою */

/* FILTER
У відповіді від бекенду повертаються об'єкти,
велика частина властивостей яких, тобі не знадобиться.
Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту
- таким чином цей бекенд реалізує фільтрацію полів.
*/

/* INTERFACE
Якщо бекенд повернув більше 10 країн, з'являється повідомлення, що назва
повинна бути специфічнішою.
використовуй notiflix, виводь "Too many matches found. Please enter a more specific name."

Якщо від 2-х до 10-и країн, відображається список знайдених країн.
Кожен елемент списку складається з прапора та назви країни.

Якщо результат - масив з однією країною, відображається розмітка картки
з даними про країну: прапор, назва, столиця, населення і мови.
*/
/* ???? Достатньо, щоб застосунок працював для більшості країн. Деякі країни,
як-от Sudan, можуть створювати проблеми, оскільки назва країни є частиною
назви іншої країни - South Sudan. Не потрібно турбуватися про ці винятки.
*/
/* ERRORS
Якщо користувач ввів назву країни, якої не існує, бекенд поверне помилку
з кодом 404.  Додай повідомлення у разі помилки (notiflix),
"Oops, there is no country with that name"
 */
/* ???? fetch не вважає 404 помилкою -> необхідно
явно відхилити проміс, щоб можна було зловити і обробити помилку */


/* INPUT
  - Назву країни користувач вводить у текстове поле input#search-box.
  - HTTP-запити виконуються на події input.
  + use lodash.debounce with 300 ms delay.
  + use trim()
  - If input value is empty, no HTTP-request and any output markup is removed
 */
const refs = {
  input: document.querySelector('#search-box'),
  countries: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));


/* ********************************************************************* */
function handleInput(e) {
  const name = e.target.value.trim().toLowerCase();
  if (name === '') {
    console.log('_empty_');//clear output and return TODO:
    refs.countries.innerHTML = '';
    refs.countryInfo.innerHTML = ''
    return;
  }
  console.log('input', name);
  fetchCountries(name);
}
/*
  Function fetchCountries(name) shall make an HTTP-request to
  public API Rest Countries v2,  namely, name-resource.
  and shall return promise with array of countries.
  put it fetchCountries.js і зроби іменований експорт.


https://restcountries.com/v3.1/name/{name}
https://restcountries.com/v3.1/name/peru
https://restcountries.com/v3.1/name/united

HTTP-request повертає масив об'єктів країн, що задовольнили критерій пошуку.
Додай мінімальне оформлення елементів інтерфейсу.
*/

function fetchCountries(name) {
  //TODO:
  console.log(COUNTRIES_URL + COUNTRIES_RES + '/' + name); //
  fetch(COUNTRIES_URL + COUNTRIES_RES + '/' + name) //name)
    .then(response => {
      // Response handling
      if (!response.ok) {
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
      }
    })
    .catch(error => {
      // Error handling
      console.log('catch', error); //TODO:
      showError();
    });
}

/* потрібні властивості:
  name.official - повна назва країни
  capital - столиця
  population - населення
  flags.svg - посилання на зображення прапора
  languages - масив мов  */
function renderCountry({ name, flag, population, capital, languages }) {
  console.log('render country', name); //TODO:
  const markup = `<div>${flag} ${name['official']}</div>
          <div><b>Capital</b>: ${capital[0]} (${capital.length})</div>
          <div><b>Population</b>: ${population}</div>`;
        //   <div><b>Languages:</b>: ${languages}</div>
  /*       .map(data => {
        return `<li>
          <p><b>Name</b>: ${data.name.official}</p>
          <p><b>Capital</b>: ${data.capital}</p>
          <p><b>population</b>: ${data.population}</p>
        </li>`;
      })
      .join(''); */ //flag & languages
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function renderListOfCountries(list) {
    console.log('render list', list); //TODO:
    const markup = list
      .map(({name, flag})=> { //flag & official name only
        return `<li>${flag} ${name['official']}</li>`;
      })
      .join('');
    refs.countries.insertAdjacentHTML('beforeend', markup);
}

function showError() {
  Notify.failure('Oops, there is no country with that name'); //TODO: error code?
}
