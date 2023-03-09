/***
  Function fetchCountries(name) shall make an HTTP-request to
  public API Rest Countries( name-resource )
  and shall return promise with array of countries.
  put it fetchCountries.js і зроби іменований експорт.
*/
/* FILTER only required fields:
  name,  capital,  population, flags, languages(object)
*/
//20230308 fixed multiple results if server is slow based on AbortController()

const FROM = 'https://restcountries.com/v3.1/name';
const FILTER = 'fields=name,flags,capital,population,languages'; //20230309 flag,
const ERR_NO_COUNTRY_FOUND =
  'Oops, there is no country with that name: ${name}';

let controller; //20230308 added to

export function fetchCountries(name) {
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  const signal = controller.signal;
  return fetch(
    `${FROM}/${name}?${FILTER}`,
    //'https://restcountries.com/v3.1/name/arub?fields=name,flags,capital,population,languages',
    { signal }
  ).then(response => {
    controller = null;

    // Response handling
    if (!response.ok) {
      /* IMPORTANT! response 404 is not an error -> throw error here */
      throw new Error(ERR_NO_COUNTRY_FOUND);
    }
    return response.json();
  });
}
