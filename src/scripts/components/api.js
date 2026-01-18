import axios from 'axios';

const API_TOKEN = "2a265475-cdaa-4821-92ee-7c7a135f2899";
const IND_GROUP = "apf-cohort-202";

/* ========================================== */
/*   СОВЕРМЕННЫЙ ВАРИАНТ ЗАПРОСОВ НА СЕРВЕР   */
/* ========================================== */

const api = axios.create({
  baseURL: `https://mesto.nomoreparties.co/v1/${IND_GROUP}`,
  headers: {
    authorization: API_TOKEN,
    "Content-Type": "application/json",
  },
});

/* Получаем информацию о пользователе с сервера */
export const getUserInfo = () => {
  return api.get('/users/me')
    .then((response) => response.data);
};

/* Получение списка карточек с сервера */
export const getCardList = () => {
  return api.get('/cards')
    .then((response) => response.data);
};

/* Отправка обновлённых данных пользователя на сервер */
export const setUserInfo = ({ name, about }) => {
  return api.patch('/users/me', {
    name,
    about,
  })
  .then((response) => response.data);
};

/* Отправка обновлённого аватара пользователя на сервер */
export const setUserAvatar = ({ avatar }) => {
  return api.patch('/users/me/avatar', {
    avatar,
  })
  .then((response) => response.data);
};

/* Добавление новой карточки */
export const addCard = ({ name, link }) => {
  return api.post('/cards', {
    name,
    link,
  })
  .then((response) => response.data);
};

/* Удаление карточки */
export const deleteCardAPI = (cardId) => {
  return api.delete(`/cards/${cardId}`)
    .then((response) => response.data);
};

/* Изменение статуса лайка карточки */
export const changeLikeCardStatus = (cardID, isLiked) => {
  const method = isLiked ? 'delete' : 'put';
  return api[method](`/cards/likes/${cardID}`)
    .then((response) => response.data);
};

/* ========================================== */
/*      СТАРЫЙ ВАРИАНТ ЗАПРОСОВ НА СЕРВЕР     */
/* ========================================== */

// const config = {
//   baseUrl: `https://mesto.nomoreparties.co/v1/${IND_GROUP}`,
//   headers: {
//     authorization: API_TOKEN,
//     "Content-Type": "application/json",
//   },
// };

// /* Проверяем, успешно ли выполнен запрос, и отклоняем промис в случае ошибки. */
// const getResponseData = (res) => {
//   return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
// };

// /* Получаем информацию о пользователе с сервера */
// export const getUserInfo = () => {
//   return fetch(`${config.baseUrl}/users/me`, { // Запрос к API-серверу
//     headers: config.headers, // Подставляем заголовки
//   }).then(getResponseData);  // Проверяем успешность выполнения запроса
// };


// /* Получение списка карточек с сервера */
// export const getCardList = () => {
//   return fetch(`${config.baseUrl}/cards`, { // Запрос к API-серверу
//     headers: config.headers, // Подставляем заголовки
//   }).then(getResponseData);  // Проверяем успешность выполнения запроса
// };


// /* Отправка обновлённых данных пользователя на сервер */
// export const setUserInfo = ({ name, about }) => {
//   return fetch(`${config.baseUrl}/users/me`, {
//     method: "PATCH",
//     headers: config.headers,
//     body: JSON.stringify({
//       name,
//       about,
//     }),
//   }).then(getResponseData);
// };


// /* Отправка обновлённого аватара пользователя на сервер */
// export const setUserAvatar = ({ avatar }) => {
//   return fetch(`${config.baseUrl}/users/me/avatar`, {
//     method: "PATCH",
//     headers: config.headers,
//     body: JSON.stringify({
//       avatar,
//     }),
//   }).then(getResponseData);
// };


// /* Добавление новой карточки */
// export const addCard = ({ name, link }) => {
//   return fetch(`${config.baseUrl}/cards`, {
//     method: "POST",
//     headers: config.headers,
//     body: JSON.stringify({
//       name,
//       link,
//     }),
//   }).then(getResponseData);
// };


// /* Удаление карточки */
// export const deleteCardAPI = (cardId) => {
//   return fetch(`${config.baseUrl}/cards/${cardId}`, {
//     method: "DELETE",
//     headers: config.headers,
//   }).then(getResponseData);
// };


// /* Изменение статуса лайка карточки */
// export const changeLikeCardStatus = (cardID, isLiked) => {
//   return fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
//     method: isLiked ?  "DELETE" : "PUT",
//     headers: config.headers,
//   }).then((res) => getResponseData(res));
// };