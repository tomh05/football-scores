angular.module('preferences',['ngCookies'])
		.factory('preferenceService',['$cookies', function($cookies) {
			return {
				getPreference:getPreference,
				setPreference:setPreference
			}
			
			function getCookieName(name) {
				return "pref."+name;
			}
			
			function getPreference(name,defaultValue) {
				var cookieName = getCookieName(name);
				if ($cookies[cookieName] == null) {
					if (defaultValue != null) {
						$cookies[cookieName]=defaultValue;
					} else {
						return null;
					}
				}
				return $cookies[cookieName];
			}
			
			function setPreference(name,value) {
				var cookieName = getCookieName(name);
				$cookies[cookieName]=value;
				return $cookies[cookieName];
			}
		}]);