'use strict';

(function () {
  var NUMBER_OFFERS = 8;
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
  var MIN_LOCATION_OFFERS_X = 300;
  var MAX_LOCATION_OFFERS_X = 900;
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
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
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];


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
    var LOCATION_X = getRandomNumber(MIN_LOCATION_OFFERS_X, MAX_LOCATION_OFFERS_X);
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

  window.getOffers = function () {
    var offers = [];
    for (var i = 0; i < NUMBER_OFFERS; i++) {
      offers.push(getOffer(i));
    }
    return offers;
  };
})();
