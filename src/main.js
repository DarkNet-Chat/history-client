var angular = require("angular");
require("angular-material");

require("!style!css!less!./main.less");

angular.module("old-chat", [ "ngMaterial" ])
	.controller("main", [ "$scope", "$http", function($scope, $http) {
		var users = require("./users.js");

		var printed = false;
		$scope.chatItems = {
			maxTimestamp: 0,
			fetchingTimestamp: -1,
			items: [ ],
			getItemAtIndex: function(index) {
				if(this.items.length <= index) {
					if(this.maxTimestamp != this.fetchingTimestamp) {
						this.getMoreChatItems();
					}
					return null;
				}
				if(!printed) {
					console.log(index);
					console.log(this.items);
				}
				printed = true;
				return this.items[index];
			},
			getLength: function() {
				return 277679;
			},
			getMoreChatItems: function() {
				this.fetchingTimestamp = this.maxTimestamp;
				$http.get("http://localhost:3482/after/" + this.maxTimestamp + "/40")
				.then(function(res) {
					res.data.forEach(function(line) {
						line.user = users[line.userID];
						$scope.chatItems.items.push(line);
						$scope.chatItems.maxTimestamp = line.timestamp;
					});
					$scope.chatItems.fetchingTimestamp = -1;
				});
			}
		};
	}]);
