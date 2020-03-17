'use strict';

(function () {
  var TIMEOUT = 10000;
  var Url = {
    GET: 'https://js.dump.academy/kekstagram/data',
    POST: 'https://js.dump.academy/kekstagram'
  };
  var Code = {
    SUCCESS: 200,
    BAD_REQUEST_ERROR: 400,
    FORBIDDEN_ERROR: 403,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE_ERROR: 503
  };

  var processServerResponce = function (xhr, method, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Code.SUCCESS:
          onLoad(xhr.response);
          break;
        case Code.BAD_REQUEST_ERROR:
          onError('Сервер не смог обработать ваш запрос. Попробуйте открыть сайт другим браузером.');
          break;
        case Code.FORBIDDEN_ERROR:
          onError('У вас нет прав для просмотра данной страницы, или просмотра страницы необходимо зарегистрироваться.');
          break;
        case Code.NOT_FOUND_ERROR:
          onError('Запрашиваемая страница не найдена. Проверьте правильность набора адреса страницы в адресной строке браузера.');
          break;
        case Code.SERVER_ERROR:
          onError('Сервер не отвечает. Повторите попытку позже.');
          break;
        case Code.SERVICE_UNAVAILABLE_ERROR:
          onError('Сервер перегружен. Повторите попытку позже.');
          break;
        default:
          onError('Произошла ошибка соединения. Повторите попытку позже.');
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Проверьте ваше интернет соединение.');
    });
    xhr.addEventListener('timeout', function () {
      onError('Время ожидания ответа от сервера истекло. Проверьте ваше интернет соединение.');
    });

    xhr.open(method, Url[method]);
  };

  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    processServerResponce(xhr, 'GET', onLoad, onError);
    xhr.send();
  };

  var sendData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    processServerResponce(xhr, 'POST', onLoad, onError);
    xhr.send(data);
  };

  window.backend = {
    load: loadData,
    save: sendData
  };

})();
