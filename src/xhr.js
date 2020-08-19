
const STATUS_OK = 200;
const TIMEOUT_MS = 3000;
const TIMEOUT_SEC = TIMEOUT_MS / 1000;

const onSuccess = (data) => {
  console.log(data)
}

const onError = (data) => {
  console.log(data)
}

const defects = {
  type: 'GET',
  url: 'C:/Users/fox/OneDrive/systems-defects/src/models/defects.json',
  overrideMimeType: 'JSON',
  onSuccess: onSuccess,
  onError: onError,
};

const createXhrRequest = (config = defects) => {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType = config.overrideMimeType;
  xhr.timeout = TIMEOUT_MS;

  xhr.addEventListener('load', function () {
    if (xhr.status === STATUS_OK) {
      config.onSuccess(xhr.responseText);
    } else {
      config.onError('Не удалось соединиться с сервером. Статус ответа: ' + xhr.status);
    }
  });

  xhr.addEventListener('error', () => {
    config.onError('Не удалось соединиться с сервером');
  });

  xhr.addEventListener('timeout', () => {
    config.onError('Запрос не успел выполниться за ' + TIMEOUT_SEC + ' секунды');
  });

  xhr.open(config.type, config.url);
  xhr.send();

  return xhr;
};

export default createXhrRequest;

