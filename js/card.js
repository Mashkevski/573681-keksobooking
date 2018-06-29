'use strict';

(function () {
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

  window.renderMapCard = function (obj) {
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
})();
