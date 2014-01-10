String.prototype.lpad = function (fill, width) {
  var str = this;
  while (str.length < width) {
    str = fill + str;
  }
  return str;
};

String.prototype.zfill = function (width) {
  return this.lpad('0', width);
};

var decoders = angular.module('decoders', []);
decoders.controller('DecoderCtrl', function ($scope) {
  $scope.supportedFormats = [
    {
      // Dummy first entry.
      'name': '-Select Action-',
      'modifier': function (text) {
        return text;
      }
    },
    {
      'name': 'Echo',
      'modifier': function (text) {
        return text;
      }
    },
    {
      'name': 'URL Encode',
      'modifier': function (text) {
        return encodeURIComponent(text);
      }
    },
    {
      'name': 'URL Decode',
      'modifier': function (text) {
        return decodeURIComponent(text);
      }
    },
    {
      'name': 'Base64 Encode',
      'modifier': function (text) {
        return btoa(text);
      }
    },
    {
      'name': 'Base64 Decode',
      'modifier': function (text) {
        return atob(text);
      }
    },
    {
      'name': 'Hexlify',
      'modifier': function (text) {
        var result = '';
        for (var i = 0; i < text.length; i++) {
          result += text.charCodeAt(i).toString(16).zfill(2);
        }
        return result;
      }
    },
    {
      'name': 'Unhexlify',
      'modifier': function (text) {
        if (text.length % 2 != 0) {
          return undefined;
        }
        var result = '';
        for (var i = 0; i < text.length; i += 2) {
          var hexCh = text.slice(i, i + 2);
          result += String.fromCharCode(parseInt(hexCh, 16));
        }
        return result;
      }
    }
  ];

  $scope.outputDrivers = [
    {
      'name': 'Text',
      'modifier': function (data) {
        return data;
      }
    },
    {
      'name': 'Binary',
      'modifier': function (data) {
        var out = '';
        for (var i = 0; i < data.length; i++) {
          out += data.charCodeAt(i).toString(16).zfill(2) + ' ';
        }
        return out;
      }
    }
  ];

  $scope.iterations = [{
    'prev': 0,
    'rawData': '',
    'text': '',
    'codec': $scope.supportedFormats[0],
    'format': $scope.outputDrivers[0]
  }];

  $scope.pushNew = function (prev) {
    $scope.iterations = $scope.iterations.slice(0, prev + 1);

    $scope.iterations.push({
      'prev': prev,
      'rawData': '',
      'text': '',
      'codec': $scope.supportedFormats[0],
      'format': $scope.outputDrivers[0]
    });
  };

  $scope.computeTransform = function (index) {
    var itr = $scope.iterations[index];
    var prev = $scope.iterations[itr.prev];
    var modifier = prev.codec.modifier;
    itr.rawData = modifier(prev.rawData);
    return itr.format.modifier(itr.rawData);
  };

});
