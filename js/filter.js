'use strict';

(function () {
  var PRICE_LEVEL = ['low', 'middle', 'high'];
  var Price = {
    low: 10000,
    high: 50000
  };

  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelectorAll('#housing-features input');
  housingFeatures = Array.prototype.slice.call(housingFeatures);

  var getPriceLevel = function (price) {
    var i = 1;
    if (price < Price.low) {
      i = 0;
    }
    if (price > Price.high) {
      i = 2;
    }
    return PRICE_LEVEL[i];
  };

  window.pinFilter = function (offering) {
    var offer = offering.offer;

    return (housingType.value === 'any' || offer.type === housingType.value)
      && (housingPrice.value === 'any' || getPriceLevel(offer.price) === housingPrice.value)
      && (housingRooms.value === 'any' || offer.rooms === +housingRooms.value)
      && (housingGuests.value === 'any' || offer.guests === +housingGuests.value)
      && housingFeatures.reduce(function (isFeature, input) {
        return isFeature && (!input.checked || offer.features.some(function (feature) {
          return feature === input.value;
        }));
      }, true);
  };

})();
