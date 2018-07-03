'use strict';
(function () {
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;

  window.renderMapPin = function (obj, template) {
    var mapPinElement = template.cloneNode(true);
    mapPinElement.style.left = obj.location.x - PIN_WIDTH / 2 + 'px';
    mapPinElement.style.top = obj.location.y - PIN_HEIGHT + 'px';
    mapPinElement.querySelector('img').src = obj.author.avatar;
    mapPinElement.querySelector('img').alt = obj.offer.title;
    return mapPinElement;
  };
})();
