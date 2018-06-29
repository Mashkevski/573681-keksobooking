'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var MIN_LOCATION_X = 0;
  var MAX_LOCATION_X = 1200;
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var PIN_MAIN_DEFAULT_HEIGHT = 33;
  var PIN_MAIN_HEIGHT = 80;
  var PIN_MAIN_WIDTH = 65;
  var MAP_PIN_DEFAULT_STYLE = 'left: 570px; top: 375px';
  var OFFERS = [];
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var fieldsets = document.querySelectorAll('fieldset');
  var addressInput = document.querySelector('#address');
  var mapFiltersContainer = map.querySelector('map__filters-container');
  var selects = map.querySelectorAll('select');
  var mapPins = document.querySelector('.map__pins');
  var addForm = document.querySelector('.ad-form');

  var removeMapPins = function () {
    while (mapPins.lastChild.className === 'map__pin') {
      mapPins.removeChild(mapPins.lastChild);
    }
  };


  var getPinAddress = function (elem, width, height) {
    var locationX = elem.offsetLeft + Math.floor(width / 2);
    var locationY = elem.offsetTop + height;
    return locationX + ', ' + locationY;
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var closePopup = function () {
    var mapCardPopup = map.querySelector('.map__card');
    if (mapCardPopup) {
      map.removeChild(mapCardPopup);
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var openPopup = function (id) {
    var mapCardPopup = map.querySelector('.map__card');
    if (mapCardPopup) {
      map.replaceChild(window.renderMapCard(OFFERS[id]), mapCardPopup);
    } else {
      map.insertBefore(window.renderMapCard(OFFERS[id]), mapFiltersContainer);
    }

    var popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  var addPinClickHandler = function (pinElement) {
    pinElement.addEventListener('click', function () {
      openPopup(pinElement.id);
    });
  };

  var renderMapPins = function (offer) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offer.length; i++) {
      var pinElement = window.renderMapPin(offer[i]);
      addPinClickHandler(pinElement);
      fragment.appendChild(pinElement);
    }
    mapPins.appendChild(fragment);
  };

  window.setInactiveState = function () {
    removeMapPins();
    closePopup();
    map.classList.add('map--faded');
    addForm.classList.add('ad-form--disabled');
    for (var fieldsetsIndex = 0; fieldsetsIndex < fieldsets.length; fieldsetsIndex++) {
      fieldsets[fieldsetsIndex].disabled = true;
    }
    for (var selectsIndex = 0; selectsIndex < selects.length; selectsIndex++) {
      selects[selectsIndex].disabled = true;
    }
    mapPinMain.style = MAP_PIN_DEFAULT_STYLE;
    addressInput.value = getPinAddress(mapPinMain, PIN_MAIN_WIDTH, PIN_MAIN_DEFAULT_HEIGHT);
  };

  var setActiveState = function () {
    map.classList.remove('map--faded');
    addForm.classList.remove('ad-form--disabled');
    for (var fieldsetsIndex = 0; fieldsetsIndex < fieldsets.length; fieldsetsIndex++) {
      fieldsets[fieldsetsIndex].disabled = false;
    }
    for (var selectsIndex = 0; selectsIndex < selects.length; selectsIndex++) {
      selects[selectsIndex].disabled = false;
    }
    addressInput.value = getPinAddress(mapPinMain, PIN_MAIN_WIDTH, PIN_MAIN_HEIGHT);
  };

  addressInput.value = getPinAddress(mapPinMain, PIN_MAIN_WIDTH, PIN_MAIN_DEFAULT_HEIGHT);

  var startCoords = {x: 0, y: 0};

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords.x = moveEvt.clientX;
    startCoords.y = moveEvt.clientY;

    var positionLeft = mapPinMain.offsetLeft - shift.x;
    var positionTop = mapPinMain.offsetTop - shift.y;
    var addressTopValue = positionTop + PIN_MAIN_HEIGHT;
    var addressLeftValue = positionLeft + PIN_MAIN_WIDTH / 2;

    if (addressTopValue > MIN_LOCATION_Y && addressTopValue < MAX_LOCATION_Y) {
      mapPinMain.style.top = positionTop + 'px';

      if (positionLeft > MIN_LOCATION_X && positionLeft + PIN_MAIN_WIDTH < MAX_LOCATION_X) {
        mapPinMain.style.left = positionLeft + 'px';
      }

      addressInput.value = addressLeftValue.toFixed() + ', ' + addressTopValue;
    }
  };

  var onMouseUp = function (evtUp) {
    evtUp.preventDefault();

    var address = addressInput.value;

    addressInput.value = getPinAddress(mapPinMain, PIN_MAIN_WIDTH, PIN_MAIN_HEIGHT);
    if (address !== addressInput.value) {
      OFFERS = window.getOffers();
      setActiveState();
      removeMapPins();
      renderMapPins(OFFERS);
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', function (evt) {

    evt.preventDefault();

    startCoords.x = evt.clientX;
    startCoords.y = evt.clientY;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
