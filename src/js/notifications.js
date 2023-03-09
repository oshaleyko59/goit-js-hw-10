/* ************************* NOTIFICATIONS ********************************** */

import { Notify } from 'notiflix/build/notiflix-notify-aio';

function showError(txt) {
  Notify.failure(txt);
}

function showWarning(txt) {
  Notify.warning(txt);
}

function init() {
  Notify.init({
    width: '320px',
    position: 'center-bottom',
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

export {
  init,
  setDefaultMsg as setDefault,
  showDefaultMsg as default,
  showWarning as warning,
  showError as error,

};

