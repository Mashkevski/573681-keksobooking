'use strict';

(function () {
  var addForm = document.querySelector('.ad-form');
  var formReset = document.querySelector('.ad-form__reset');
  var mapFilters = document.querySelector('.map__filters');
  var type = document.querySelector('#type');
  var timeInSelect = document.querySelector('#timein');
  var timeOutSelect = document.querySelector('#timeout');
  var roomNumberSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');

  window.addFormReset = function () {
    addForm.reset();
    changeMinPrice(type.value);
  };

  formReset.addEventListener('click', function () {
    mapFilters.reset();
    window.addFormReset();
    window.setInactiveState();
  });

  var changeMinPrice = function (typeValue) {
    var priceInput = document.querySelector('#price');
    switch (typeValue) {
      case 'palace': priceInput.min = 10000; priceInput.placeholder = '10000';
        break;
      case 'flat': priceInput.min = 1000; priceInput.placeholder = '1000';
        break;
      case 'house': priceInput.min = 5000; priceInput.placeholder = '5000';
        break;
      case 'bungalo': priceInput.min = 0; priceInput.placeholder = '0';
        break;
      default: break;
    }
  };

  type.addEventListener('change', function () {
    changeMinPrice(type.value);
  });

  timeInSelect.addEventListener('change', function () {
    var selectedIindex = timeInSelect.selectedIndex;
    var options = timeOutSelect.options;
    options[selectedIindex].selected = true;
  });

  timeOutSelect.addEventListener('change', function () {
    var selectedIindex = timeOutSelect.selectedIndex;
    var options = timeInSelect.options;
    options[selectedIindex].selected = true;
  });

  var validateRoomsForCapacity = function () {
    var selectedIndex = roomNumberSelect.selectedIndex;
    var capacityIndex = capacitySelect.selectedIndex;
    if (selectedIndex < capacityIndex) {
      switch (selectedIndex) {
        case 0: capacitySelect.setCustomValidity('1 комната для 1 гостя');
          break;
        case 1: capacitySelect.setCustomValidity('2 комнаты «для 2 гостей» или «для 1 гостя»');
          break;
        case 2: capacitySelect.setCustomValidity('3 комнаты «для 3 гостей», «для 2 гостей» или «для 1 гостя»');
          break;
        default: break;
      }
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  roomNumberSelect.addEventListener('change', function () {
    validateRoomsForCapacity();
  });

  capacitySelect.addEventListener('change', function () {
    validateRoomsForCapacity();
  });
})();
