export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick },
  userId
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Сохраняем ID карточки в элементе для использования при удалении
  cardElement.dataset.cardId = data._id;

  // Отображаем количество лайков
  if (likeCountElement) {
    likeCountElement.textContent = data.likes ? data.likes.length : 0;
  }

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = data.likes && data.likes.some((user) => user._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (data.owner._id !== userId) { 
    deleteButton.remove();
  }

  if (onInfoClick) {
    infoButton.addEventListener("click", () => {
      onInfoClick(data._id);
    });
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      // Определяем текущее состояние лайка из класса кнопки
      const currentIsLiked = likeButton.classList.contains("card__like-button_is-active");
      onLikeIcon(likeButton, data._id, currentIsLiked);
    });
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => {
      // Передаем cardElement и cardId из dataset
      onDeleteCard(cardElement, cardElement.dataset.cardId);
    });
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
