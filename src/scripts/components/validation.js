// Отображает сообщение об ошибке под невалидным полем и добавляет соответствующие классы
const showInputError = (formElement, inputElement, inputErrorClass, errorMessage, errorClass) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
}

// Скрывает сообщение об ошибке и удаляет классы, связанные с ошибкой
const hideInputError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  inputElement.classList.remove(inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(errorClass);
}

// Проверяет валидность конкретного поля
const checkInputValidity = (formElement, inputElement, inputErrorClass, errorClass) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (inputElement.validity.valid) {
    hideInputError(formElement, inputElement, inputErrorClass, errorClass);
  } else {
    showInputError(
      formElement,
      inputElement,
      inputErrorClass,
      inputElement.validationMessage,
      errorClass
    );
  }
}

// Возвращает значение true, если хотя бы одно поле формы не прошло валидацию
const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => !inputElement.validity.valid);
}; 

// Делает кнопку формы неактивной
const disableSubmitButton = (submitButton, inactiveButtonClass) => {
  submitButton.classList.add(inactiveButtonClass);
  submitButton.disabled = true;
}

// Включает кнопку формы
const enableSubmitButton = (submitButton, inactiveButtonClass) => {
  submitButton.classList.remove(inactiveButtonClass);
  submitButton.disabled = false;
}

// Включает или отключает кнопку формы в зависимости от валидности всех полей
const toggleButtonState = (inputList, submitButton, inactiveButtonClass) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(submitButton, inactiveButtonClass);
  } else {
    enableSubmitButton(submitButton, inactiveButtonClass);
  }
}

// Добавляет обработчики события input для всех полей формы
const setEventListeners = (
  formElement,
  inputSelector,
  inputErrorClass,
  errorClass,
  submitButton,
  inactiveButtonClass
) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));

  toggleButtonState(inputList, submitButton, inactiveButtonClass);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, inputErrorClass, errorClass);
      toggleButtonState(inputList, submitButton, inactiveButtonClass);
    });
  });
}

// Очищает ошибки валидации формы и делает кнопку неактивной
export const clearValidation = (formElement, validationSettings) => {
  const {
    _,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
  } = validationSettings;

  const submitButton = document.querySelector(submitButtonSelector);
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));

  disableSubmitButton(submitButton, inactiveButtonClass);

  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, inputErrorClass, errorClass);
  });

  toggleButtonState(inputList, submitButton, inactiveButtonClass);
}

// Отвечает за включение валидации всех форм
export const enableValidation = (validationSettings) => {
  const {
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
  } = validationSettings;

  const formList = Array.from(document.querySelectorAll(formSelector));

  formList.forEach(formElement => {
    const submitButton = formElement.querySelector(submitButtonSelector);
    const inputList = Array.from(formElement.querySelectorAll(inputSelector));

    toggleButtonState(inputList, submitButton, inactiveButtonClass);
    setEventListeners(
      formElement,
      inputSelector,
      inputErrorClass,
      errorClass,
      submitButton,
      inactiveButtonClass
    );
  });
}

