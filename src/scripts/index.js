/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { getCardList, getUserInfo, setUserInfo, setUserAvatar, addCard, deleteCardAPI, changeLikeCardStatus } from "./components/api.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";


// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");
const profileSubmitButton = profileForm.querySelector(".popup__button");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardSubmitButton = cardForm.querySelector(".popup__button");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const avatarSubmitButton = avatarForm.querySelector(".popup__button");

// Модальное окно подтверждения удаления
const deleteConfirmModalWindow = document.querySelector(".popup_type_remove-card");
const deleteConfirmForm = deleteConfirmModalWindow.querySelector(".popup__form");
const deleteConfirmButton = deleteConfirmForm.querySelector(".popup__button");

// Модальное окно статистики карточки
const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalText = cardInfoModalWindow.querySelector(".popup__text");
const cardInfoModalList = cardInfoModalWindow.querySelector(".popup__list");

const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template");
const userPreviewTemplate = document.querySelector("#popup-info-user-preview-template");

let cardToDelete;
let cardIdToDelete;

let currentUserId;

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


const createInfoString = (term, description) => {
  const infoItem = infoDefinitionTemplate.content.querySelector(".popup__info-item").cloneNode(true);
  
  infoItem.querySelector(".popup__info-term").textContent = term;
  infoItem.querySelector(".popup__info-description").textContent = description;

  return infoItem;
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const originalText = profileSubmitButton.textContent;
  
  profileSubmitButton.textContent = "Сохранение...";
  profileSubmitButton.disabled = true;

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      profileSubmitButton.textContent = originalText;
      profileSubmitButton.disabled = false;
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const originalText = avatarSubmitButton.textContent;
  
  avatarSubmitButton.textContent = "Сохранение...";
  avatarSubmitButton.disabled = true;

  setUserAvatar({
    avatar: avatarInput.value,
  })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
      avatarForm.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      avatarSubmitButton.textContent = originalText;
      avatarSubmitButton.disabled = false;
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const originalText = cardSubmitButton.textContent;
  
  cardSubmitButton.textContent = "Создание...";
  cardSubmitButton.disabled = true;

  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(cardData, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeCard,
          onDeleteCard: handleDeleteCard,
          onInfoClick: handleInfoClick,
        },
        currentUserId)
      );
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      cardSubmitButton.textContent = originalText;
      cardSubmitButton.disabled = false;
    });
};


/* Изменение статуса лайка карточки */
const handleLikeCard = (likeButton, cardId, isLiked) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      const newIsLiked = updatedCard.likes && updatedCard.likes.some((user) => user._id === currentUserId);
      
      if (newIsLiked) {
        likeButton.classList.add("card__like-button_is-active");
      } else {
        likeButton.classList.remove("card__like-button_is-active");
      }
      
      const cardElement = likeButton.closest(".card");
      const likeCountElement = cardElement.querySelector(".card__like-count");
      if (likeCountElement) {
        likeCountElement.textContent = updatedCard.likes ? updatedCard.likes.length : 0;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


/* Удаление карточки - теперь открывает модальное окно подтверждения */
const handleDeleteCard = (cardElement, cardId) => {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModalWindow(deleteConfirmModalWindow);
};

/* Подтверждение удаления карточки */
const handleDeleteConfirm = (evt) => {
  evt.preventDefault();
  
  if (cardToDelete && cardIdToDelete) {
    const originalText = deleteConfirmButton.textContent;
    
    deleteConfirmButton.textContent = "Удаление...";
    deleteConfirmButton.disabled = true;

    deleteCardAPI(cardIdToDelete)
      .then(() => {
        deleteCard(cardToDelete);
        closeModalWindow(deleteConfirmModalWindow);
        cardToDelete = null;
        cardIdToDelete = null;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        deleteConfirmButton.textContent = originalText;
        deleteConfirmButton.disabled = false;
      });
  }
};

/* Обработчик клика на кнопку информации карточки */
const handleInfoClick = (cardId) => {
  getCardList()
    .then((cards) => {
      const cardData = cards.find((card) => card._id === cardId);
      
      if (!cardData) {
        console.log("Карточка не найдена");
        return;
      }

      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalList.innerHTML = "";

      cardInfoModalTitle.textContent = "Информация о карточке";

      cardInfoModalInfoList.append(
        createInfoString(
          "Описание:",
          cardData.name
        )
      );

      cardInfoModalInfoList.append(
        createInfoString(
          "Дата создания:",
          formatDate(new Date(cardData.createdAt))
        )
      );

      if (cardData.owner) {
        cardInfoModalInfoList.append(
          createInfoString(
            "Владелец:",
            cardData.owner.name
          )
        );
      }

      const likesCount = cardData.likes ? cardData.likes.length : 0;
      cardInfoModalInfoList.append(
        createInfoString(
          "Количество лайков:",
          likesCount.toString()
        )
      );

      if (cardData.likes && cardData.likes.length > 0) {
        cardInfoModalText.textContent = "Лайкнули:";
        
        cardData.likes.forEach((user) => {
          const listItem = userPreviewTemplate.content.querySelector(".popup__list-item").cloneNode(true);
          const userName = user.name;
          listItem.textContent = userName;
          cardInfoModalList.append(listItem);
        });
      } else {
        cardInfoModalText.textContent = "Лайков пока нет";
      }

      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
}

enableValidation(validationSettings);

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);
deleteConfirmForm.addEventListener("submit", handleDeleteConfirm);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

// // отображение карточек
// initialCards.forEach((data) => {
//   placesWrap.append(
//     createCardElement(data, {
//       onPreviewPicture: handlePreviewPicture,
//       onLikeIcon: handleLikeCard,
//       onDeleteCard: handleDeleteCard,
//     })
//   );
// });

// настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});


Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    console.log(userData);

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    
    cards.forEach((card) => {
      placesWrap.append(
        createCardElement(card, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeCard,
          onDeleteCard: handleDeleteCard,
          onInfoClick: handleInfoClick,
        },
        currentUserId)
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });

