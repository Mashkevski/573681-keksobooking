'use strict';

var ESC_KEYCODE = 27;
var NUMBER_OFFERS = 8;
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_QUESTS = 1;
var MAX_QUESTS = 10;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MIN_LOCATION_X = 300;
var MAX_LOCATION_X = 900;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var PIN_MAIN_DEFAULT_HEIGHT = 33;
var PIN_MAIN_HEIGHT = 87;
var PIN_MAIN_WIDTH = 65;
var OFFERS = [];

var map = document.querySelector('.map');
var offerListElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template')
  .content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template')
  .content.querySelector('.map__card');

var getRandomArrayElement = function (array) {
  return array[Math.round(Math.random() * (array.length - 1))];
};

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min)) + min;
};

var getMixedArray = function (array) {
  var fullCopyArray = array.slice();
  var compare = function () {
    return Math.random() - 0.5;
  };
  return fullCopyArray.sort(compare);
};

var getArrayOfRandomLength = function (array) {
  return array.slice(getRandomNumber(0, array.length));
};

var getOffer = function (index) {
  var LOCATION_X = getRandomNumber(MIN_LOCATION_X, MAX_LOCATION_X);
  var LOCATION_Y = getRandomNumber(MIN_LOCATION_Y, MAX_LOCATION_Y);
  var avatarIndex = index + 1;
  var offer =
    {
      id: index,
      author: {
        avatar: 'img/avatars/user0' + avatarIndex + '.png'
      },
      offer: {
        title: TITLES[index],
        address: LOCATION_X + ', ' + LOCATION_Y,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayElement(TYPES),
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_QUESTS, MAX_QUESTS),
        checkin: getRandomArrayElement(CHECKIN_TIMES),
        checkout: getRandomArrayElement(CHECKOUT_TIMES),
        features: getArrayOfRandomLength(FEATURES),
        description: '',
        photos: getMixedArray(PHOTOS)
      },
      location: {
        x: LOCATION_X,
        y: LOCATION_Y
      },
    };
  return offer;
};

var getOffers = function () {
  for (var i = 0; i < NUMBER_OFFERS; i++) {
    OFFERS.push(getOffer(i));
  }
};

var renderMapPin = function (obj) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.id = obj.id;
  mapPinElement.style.left = obj.location.x - PIN_WIDTH / 2 + 'px';
  mapPinElement.style.top = obj.location.y - PIN_HEIGHT + 'px';
  mapPinElement.querySelector('img').src = obj.author.avatar;
  mapPinElement.querySelector('img').alt = obj.offer.title;
  return mapPinElement;
};

var convertOfferType = function (type) {
  var offerType = '';
  switch (type) {
    case 'palace': offerType = 'Дворец';
      break;
    case 'flat': offerType = 'Квартира';
      break;
    case 'house': offerType = 'Дом';
      break;
    case 'bungalo': offerType = 'Бунгало';
      break;
  }
  return offerType;
};

var getPhotoList = function (array) {
  var photoListFragment = document.createDocumentFragment();
  var photoTemplate = mapCardTemplate.querySelector('.popup__photo');
  for (var i = 0; i < array.length; i++) {
    var photoElement = photoTemplate.cloneNode();
    photoElement.src = array[i];
    photoListFragment.appendChild(photoElement);
  }
  return photoListFragment;
};

var getFeatureList = function (array) {
  var featureListFragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + array[i]);
    featureListFragment.appendChild(li);
  }
  return featureListFragment;
};

var renderMapCard = function (obj) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var features = mapCardElement.querySelector('.popup__features');
  while (features.firstChild) {
    features.removeChild(features.firstChild);
  }
  features.appendChild(getFeatureList(obj.offer.features));
  mapCardElement.querySelector('.popup__avatar').src = obj.author.avatar;
  mapCardElement.querySelector('.popup__title').textContent = obj.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = obj.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = obj.offer.price + ' ₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = convertOfferType(obj.offer.type);
  mapCardElement.querySelector('.popup__text--capacity')
    .textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time')
    .textContent = 'Заезд после ' + obj.offer.checkin + ' выезд до ' + obj.offer.checkout;
  mapCardElement.querySelector('.popup__description').textContent = obj.offer.description;
  mapCardElement.querySelector('.popup__photos')
    .replaceChild(getPhotoList(obj.offer.photos), mapCardElement.querySelector('.popup__photo'));
  return mapCardElement;
};

var mapPinMain = document.querySelector('.map__pin--main');
var addForm = document.querySelector('.ad-form');
var fieldsets = addForm.querySelectorAll('fieldset');
var addressInput = document.querySelector('#address');
var mapFiltersContainer = map.querySelector('map__filters-container');

var setInactiveState = function () {
  map.classList.add('map--faded');
  addForm.classList.add('ad-form--disabled');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = true;
  }

  mapPinMain.addEventListener('mouseup', onPinMainClick);
};

var onPinMainClick = function () {
  setActiveState();
};

var getPinAddress = function (elem, width, height) {
  var locationX = parseInt(elem.style.left, 10) + Math.floor(width / 2);
  var locationY = parseInt(elem.style.top, 10) + height;
  return locationX + ', ' + locationY;
};

var setActiveState = function () {
  map.classList.remove('map--faded');
  addForm.classList.remove('ad-form--disabled');
  for (var fieldsetsIndex = 0; fieldsetsIndex < fieldsets.length; fieldsetsIndex++) {
    fieldsets[fieldsetsIndex].disabled = false;
  }

  mapPinMain.removeEventListener('mouseup', onPinMainClick);
};

var addListener = function (pinElement) {
  pinElement.addEventListener('click', function () {
    openPopup(pinElement.id);
  });
};

var renderOffers = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < OFFERS.length; i++) {
    var pinElement = renderMapPin(OFFERS[i]);
    addListener(pinElement);
    fragment.appendChild(pinElement);
  }
  offerListElement.appendChild(fragment);
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  var mapCardPopup = map.querySelector('.map__card');
  map.removeChild(mapCardPopup);
  document.removeEventListener('keydown', onPopupEscPress);
};

var openPopup = function (id) {
  var mapCardPopup = map.querySelector('.map__card');
  if (mapCardPopup) {
    map.replaceChild(renderMapCard(OFFERS[id]), mapCardPopup);
  } else {
    map.insertBefore(renderMapCard(OFFERS[id]), mapFiltersContainer);
  }

  var popupClose = map.querySelector('.popup__close');
  popupClose.addEventListener('click', function () {
    closePopup();
  });
  document.addEventListener('keydown', onPopupEscPress);
};

mapPinMain.addEventListener('mouseup', function () {
  var address = addressInput.value;
  addressInput.value = getPinAddress(mapPinMain, PIN_MAIN_WIDTH, PIN_MAIN_HEIGHT);
  if (address !== addressInput.value) {
    getOffers();
    renderOffers();
  }
});

setInactiveState();
addressInput.value = getPinAddress(mapPinMain, PIN_WIDTH, PIN_MAIN_DEFAULT_HEIGHT);
