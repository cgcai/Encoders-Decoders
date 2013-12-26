var decoders = angular.module('decoders', []);

decoders.controller('DecoderCtrl', function ($scope) {
  $scope.supportedFormats = [
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
          result += text.charCodeAt(i).toString(16);
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

  $scope.iterations = [{
    'prev': 0,
    'rawText': '',
    'codec': $scope.supportedFormats[0]
  }];

  $scope.pushNew = function (prev) {
    $scope.iterations = $scope.iterations.slice(0, prev + 1);

    $scope.iterations.push({
      'prev': prev,
      'rawText': '',
      'codec': $scope.supportedFormats[0]
    });
  };

  $scope.computeTransform = function (index) {
    var itr = $scope.iterations[index];
    var prev = $scope.iterations[itr.prev];
    var modifier = prev.codec.modifier;
    itr.rawText = modifier(prev.rawText);
    return itr.rawText;
  };

});
