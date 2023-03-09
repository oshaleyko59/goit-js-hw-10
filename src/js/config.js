/* ************************* CONFIGURATION ***************************

  * to toggle appearance:
    - ALT-N - name.common vs name.official
    - ALT-F - toggle no filter vs filter
    NB!Filter allows only names(common or official) that start with entered sequenc

*/

export const CONF = {
  DEBOUNCE_DELAY: 30, //TODO:
  MAX_NUMBER_COUNTRIES: 10,
  PLACEHOLDER: 'Please input country name here',

  useCommon: false, //use common name for a header if true, official name by default
  filterStrict: false, //if true, fetched data will be filtered out if not start from entered letters

  getInfoStr() {
    return `ALT+SHIFT-F - toggle filter, ALT+SHIFT-N - toggle name. Name option: ${
      this.useCommon ? 'COMMON' : 'OFFICIAL'
    } Filter option: ${this.filterStrict ? 'YES' : 'NO'}`;
  },

  transformPopulation(num) {
    return num.toLocaleString();
  },

  transformLang(obj) {
    return Object.values(obj).join(', ');
  },

  getName(name) {
    return this.useCommon ? name.common : name.official;
  },

  getOfficialNameMarkup(name) {
    return !this.useCommon
      ? ''
      : '<tr><th>Official name:</th><td>' + name.official + '</td></tr';
  },
};

