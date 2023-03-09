const FROM = 'https://restcountries.com/v3.1/name';

/* FILTER only required fields:
  name,  capital,  population, flags, languages(object) */
const FILTER =
  '?fields=name.official,flag,capital,population,languages';

const ERR_NO_COUNTRY_FOUND = 'Oops, there is no country with that name: ${name}';

let controller; //20230308 added to fix multiple results if server is slow

/***
  Function fetchCountries(name) shall make an HTTP-request to
  public API Rest Countries( name-resource )
  and shall return promise with array of countries.
  put it fetchCountries.js і зроби іменований експорт.
*/
export function fetchCountries(name) {
  if (controller) {
    controller.abort();
    console.log('abort', name);
  }
  console.log('fetch', name)
  controller = new AbortController();
  const signal = controller.signal;
  return fetch(`${FROM}/${name}?${FILTER}`,
  //'https://restcountries.com/v3.1/name/arub?fields=name,flag,capital,population,languages',
    { signal }
  ).then(response => {
    controller = null;

    // Response handling
    if (!response.ok) {
      /* IMPORTANT! response 404 is not an error -> throw error here */
      console.log('throw');
      throw new Error(ERR_NO_COUNTRY_FOUND);
    }
    return response.json();
  });
}

