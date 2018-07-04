'use strict';

(function () {
  var typeListMap = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var ROOM_NAMES = ['комната', 'комнаты', 'комнат'];

  var mapCardTemplate = document.querySelector('template')
    .content.querySelector('.map__card');
  var photoListFragment = document.createDocumentFragment();
  var photoTemplate = mapCardTemplate.querySelector('.popup__photo');

  var getPhotoList = function (array) {
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

  var getPluralName = function (roomNumber) {
    var n = roomNumber;
    var index = 2;

    if (n % 10 === 1 && n % 100 !== 11) {
      index = 0;
    }

    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
      index = 1;
    }

    return ROOM_NAMES[index];
  };

  window.renderMapCard = function (obj) {
    var mapCardElement = mapCardTemplate.cloneNode(true);
    var features = mapCardElement.querySelector('.popup__features');
    var avatar = mapCardElement.querySelector('.popup__avatar');
    var title = mapCardElement.querySelector('.popup__title');
    var address = mapCardElement.querySelector('.popup__text--address');
    var price = mapCardElement.querySelector('.popup__text--price');
    var type = mapCardElement.querySelector('.popup__type');
    var capacity = mapCardElement.querySelector('.popup__text--capacity');
    var time = mapCardElement.querySelector('.popup__text--time');
    var description = mapCardElement.querySelector('.popup__description');
    var photos = mapCardElement.querySelector('.popup__photos');
    var photo = mapCardElement.querySelector('.popup__photo');

    while (features.firstChild) {
      features.removeChild(features.firstChild);
    }

    if (obj.offer.features.length !== 0) {
      features.appendChild(getFeatureList(obj.offer.features));
    } else {
      features.classList.add('hidden');
    }

    if (obj.author.avatar) {
      avatar.src = obj.author.avatar;
    } else {
      avatar.classList.add('hidden');
    }

    if (obj.offer.title) {
      title.textContent = obj.offer.title;
    } else {
      title.classList.add('hidden');
    }

    if (obj.offer.address) {
      address.textContent = obj.offer.address;
    } else {
      address.classList.add('hidden');
    }

    if (obj.offer.price) {
      price.textContent = obj.offer.price + ' ₽/ночь';
    } else {
      price.classList.add('hidden');
    }

    if (obj.offer.type) {
      type.textContent = typeListMap[obj.offer.type];
    } else {
      type.classList.add('hidden');
    }

    if (obj.offer.rooms) {
      capacity.textContent = obj.offer.rooms + ' ' + getPluralName(obj.offer.rooms) + ' для ' + obj.offer.guests + ' гостей';
    } else {
      capacity.classList.add('hidden');
    }

    if (obj.offer.checkin && obj.offer.checkin) {
      time.textContent = 'Заезд после ' + obj.offer.checkin + ' выезд до ' + obj.offer.checkout;
    } else {
      time.classList.add('hidden');
    }

    if (obj.offer.description) {
      description.textContent = obj.offer.description;
    } else {
      description.classList.add('hidden');
    }

    if (obj.offer.photos) {
      photos.replaceChild(getPhotoList(obj.offer.photos), photo);
    } else {
      photos.classList.add('hidden');
    }

    return mapCardElement;
  };
})();
