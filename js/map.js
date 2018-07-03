'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var Location = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630
  };
  var PinMain = {
    DEFAULT_HEIGHT: 33,
    HEIGHT: 80,
    WIDTH: 65,
    DEFAULT_STYLE: 'left: 570px; top: 375px'
  };
  var OFFERS = [];
  var filteredOffers = [];
  var stateStatus = false;
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var mapFiltersContainer = map.querySelector('map__filters-container');
  var mapFilters = document.querySelector('.map__filters');
  var mapPins = document.querySelector('.map__pins');
  var addForm = document.querySelector('.ad-form');
  var selects = addForm.querySelectorAll('select');
  var fieldsets = addForm.querySelectorAll('fieldset');
  var mapInputFilter = document.querySelectorAll('.map__filter');
  var housingFeatures = document.querySelector('#housing-features');
  var mapPinTemplate = document.querySelector('template')
    .content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  var success = document.querySelector('.success');
  var unsuccess = document.querySelector('.unsuccess');
  var unsuccessMessage = document.querySelector('.unsuccess__message');

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

  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
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

  var openPopup = function (i) {
    var mapCardPopup = map.querySelector('.map__card');
    if (mapCardPopup) {
      map.replaceChild(window.renderMapCard(filteredOffers[i] || OFFERS[i]), mapCardPopup);
    } else {
      map.insertBefore(window.renderMapCard(filteredOffers[i] || OFFERS[i]), mapFiltersContainer);
    }
    var popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  var addPinClickHandler = function (pinElement, i) {
    pinElement.addEventListener('click', function () {
      openPopup(i);
    });
  };

  var renderMapPins = function (offers) {
    var length = offers.length < 6 ? offers.length : 5;
    for (var i = 0; i < length; i++) {
      var pinElement = window.renderMapPin(offers[i], mapPinTemplate);
      addPinClickHandler(pinElement, i);
      fragment.appendChild(pinElement);
    }
    mapPins.appendChild(fragment);
  };

  var disableForm = function (list) {
    for (var i = 0; i < list.length; i++) {
      list[i].disabled = true;
    }
  };

  var enableForm = function (list) {
    for (var i = 0; i < list.length; i++) {
      list[i].disabled = false;
    }
  };

  window.setInactiveState = function () {
    removeMapPins();
    closePopup();
    map.classList.add('map--faded');
    addForm.classList.add('ad-form--disabled');

    disableForm(fieldsets);
    disableForm(selects);
    disableForm(mapInputFilter);
    housingFeatures.disable = true;

    mapPinMain.style = PinMain.DEFAULT_STYLE;
    addressInput.value = getPinAddress(mapPinMain, PinMain.WIDTH, PinMain.DEFAULT_HEIGHT);
    stateStatus = false;
  };

  var setActiveState = function () {
    map.classList.remove('map--faded');
    addForm.classList.remove('ad-form--disabled');

    enableForm(fieldsets);
    enableForm(selects);

    addressInput.value = getPinAddress(mapPinMain, PinMain.WIDTH, PinMain.HEIGHT);
  };

  addressInput.value = getPinAddress(mapPinMain, PinMain.WIDTH, PinMain.DEFAULT_HEIGHT);

  var startCoords = {x: 0, y: 0};

  var onMouseMove = function (e) {
    e.preventDefault();

    var shift = {
      x: startCoords.x - e.clientX,
      y: startCoords.y - e.clientY
    };

    startCoords.x = e.clientX;
    startCoords.y = e.clientY;

    var positionLeft = mapPinMain.offsetLeft - shift.x;
    var positionTop = mapPinMain.offsetTop - shift.y;
    var addressTopValue = positionTop + PinMain.HEIGHT;
    var addressLeftValue = positionLeft + PinMain.WIDTH / 2;

    if (addressTopValue > Location.MIN_Y && addressTopValue < Location.MAX_Y) {
      mapPinMain.style.top = positionTop + 'px';
    }

    if (positionLeft > Location.MIN_X && positionLeft + PinMain.WIDTH < Location.MAX_X) {
      mapPinMain.style.left = positionLeft + 'px';
    }

    addressInput.value = addressLeftValue.toFixed() + ', ' + addressTopValue;
  };

  var onUnsuccessMessageClose = function (e) {
    e.preventDefault();
    unsuccess.classList.add('hidden');

    document.removeEventListener('click', onUnsuccessMessageClose);
    document.removeEventListener('keydown', onUnsuccessMessageClose);
  };

  var onSuccessMessageClose = function (e) {
    e.preventDefault();
    success.classList.add('hidden');

    document.removeEventListener('click', onSuccessMessageClose);
    document.removeEventListener('keydown', onSuccessMessageClose);
  };

  var onLoad = function (data) {
    OFFERS = data;
    renderMapPins(OFFERS);

    enableForm(mapInputFilter);
    housingFeatures.disabled = false;
  };

  var onError = function (error) {
    unsuccessMessage.textContent = error;
    unsuccess.classList.remove('hidden');

    document.addEventListener('click', onUnsuccessMessageClose);
    document.addEventListener('keydown', onUnsuccessMessageClose);
  };

  var onMouseUp = function (e) {
    e.preventDefault();

    addressInput.value = getPinAddress(mapPinMain, PinMain.WIDTH, PinMain.HEIGHT);

    if (!stateStatus) {
      window.backend.load(onLoad, onError);
      setActiveState();
      stateStatus = true;
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', function (e) {

    e.preventDefault();

    startCoords.x = e.clientX;
    startCoords.y = e.clientY;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onUpload = function () {
    window.addFormReset();
    success.classList.remove('hidden');
    addressInput.value = getPinAddress(mapPinMain, PinMain.WIDTH, PinMain.DEFAULT_HEIGHT);

    document.addEventListener('click', onSuccessMessageClose);
    document.addEventListener('keydown', onSuccessMessageClose);
  };

  var onFormSubmit = function (e) {
    var formData = new FormData(addForm);
    window.backend.upload(formData, onUpload, onError);
    e.preventDefault();
  };

  addForm.addEventListener('submit', onFormSubmit);

  var renderMapPinsDebounce = window.debounce(function () {
    renderMapPins(filteredOffers);
  });

  mapFilters.addEventListener('change', function () {
    filteredOffers = OFFERS.filter(function (offering) {
      return window.pinFilter(offering);
    });
    removeMapPins();
    renderMapPinsDebounce();
    closePopup();
  });

})();
