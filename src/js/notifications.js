/* ************************* NOTIFICATIONS **********************************
  * based on notiflix

  * init() changes notiflix.notify default options
  * error(err) displays err string as error message
  * warning(warn) displays warn string as warning message
  * default() displays default message, which if empty by default
  * setDefault(txt) sets txt string as default message
*/

import { Notify } from 'notiflix/build/notiflix-notify-aio';

export {
  init,
  setDefaultMsg as setDefault,
  showDefaultMsg as default,
  showWarning as warning,
  showError as error,
};

function showError(txt) {
  Notify.failure(txt);
}

function showWarning(txt) {
  Notify.warning(txt);
}

function init() {
  Notify.init({
    width: '320px',
    position: 'right-bottom',
    closeButton: true,
    useIcon: false,
    showOnlyTheLastOne: true,
  });
}

let defaultMsg = '';

function showDefaultMsg() {
  Notify.info(defaultMsg);
}

function setDefaultMsg(msg) {
  defaultMsg = msg;
}

