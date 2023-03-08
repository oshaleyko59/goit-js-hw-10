const COUNTRIES_URL = 'https://restcountries.com';
const COUNTRIES_RES = '/v3.1/name';
/* FILTER only required fields:
  name,  capital,  population, flags, languages(object) */
const COUNTRIES_FILTER = '?fields=name,flag,capital,population,languages';
const ERR_NO_COUNTRY_FOUND = 'Oops, there is no country with that name';

/***
  Function fetchCountries(name) shall make an HTTP-request to
  public API Rest Countries( name-resource )
  and shall return promise with array of countries.
  put it fetchCountries.js і зроби іменований експорт.
*/
export function fetchCountries(name) {
  return fetch(
    COUNTRIES_URL + COUNTRIES_RES + '/' + name + COUNTRIES_FILTER
  ).then(response => {
    // Response handling
    if (!response.ok) {
      /* IMPORTANT! response 404 is not an error -> throw error here */
      throw new Error(ERR_NO_COUNTRY_FOUND);
    }
    return response.json();
  });
}

  