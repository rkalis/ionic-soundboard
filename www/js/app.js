var app = angular.module('soundboard', ['ionic']);

app.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

app.controller('SoundBoardCtrl', function ($scope, $http, $window) {
	/* EDIT THESE */
	$scope.base_url = "http://kalis.me";
	$scope.sounds_url = "/sounds";
	$scope.title = "Soundboard"


	$scope.model = {
		sounds: []
	};

	$http.get($scope.base_url + $scope.sounds_url).then(function(response) {
		var raw_html = response.data;
		var doc = document.createElement("html");
		doc.innerHTML = raw_html;
		var links = doc.getElementsByTagName("a");

		for (var i = 0; i < links.length; i++) {
		    $scope.model.sounds.push({
		        title: links[i].innerHTML,
		        file: $scope.base_url + links[i].getAttribute("href")
		    });
		}
	});

	$scope.media = null;

	$scope.play = function (sound) {

		if ($scope.media) {
			$scope.media.pause();
		}

		if ($window.cordova) {
			console.log("Play called on device");
			ionic.Platform.ready(function () {

				var src = sound.file;
				$scope.media = new $window.Media(src);
				$scope.media.play();
			});
		} else {
			$scope.media = new Audio();
			$scope.media.src = sound.file;
			$scope.media.load();
			$scope.media.play();
		}
	};
});

