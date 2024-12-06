/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
			/******/
};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
		/******/
}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
	/******/
})
/************************************************************************/
/******/([
/* 0 */
/***/ (function (module, exports, __webpack_require__) {

		"use strict";
		Object.defineProperty(exports, "__esModule", { value: true });
		var entcore_1 = __webpack_require__(1);
		var activation_1 = __webpack_require__(2);
		var forgot_1 = __webpack_require__(3);
		var reset_1 = __webpack_require__(4);
		var login_1 = __webpack_require__(5);
		var termsRevalidation_1 = __webpack_require__(6);
		entcore_1.routes.define(function ($routeProvider) {
			$routeProvider
				.when('/id', {
					action: 'actionId'
				})
				.when('/password', {
					action: 'actionPassword'
				})
				.otherwise({
					redirectTo: '/'
				});
		});
		entcore_1.ng.controllers.push(activation_1.activationController);
		entcore_1.ng.controllers.push(forgot_1.forgotController);
		entcore_1.ng.controllers.push(reset_1.resetController);
		entcore_1.ng.controllers.push(login_1.loginController);
		entcore_1.ng.controllers.push(termsRevalidation_1.termsRevalidationController);


		/***/
}),
/* 1 */
/***/ (function (module, exports) {

		module.exports = entcore;

		/***/
}),
/* 2 */
/***/ (function (module, exports, __webpack_require__) {

		"use strict";
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.cguController = exports.activationController = void 0;
		var entcore_1 = __webpack_require__(1);
		exports.activationController = entcore_1.ng.controller('ActivationController', ['$scope', function ($scope) {
			$scope.template = entcore_1.template;
			$scope.lang = entcore_1.idiom;
			$scope.user = { themes: {} };
			$scope.phonePattern = new RegExp("^(00|\\+)?(?:[0-9] ?-?\\.?){6,14}[0-9]$");
			$scope.welcome = {};
			entcore_1.template.open('main', 'activation-form');
			var currentTheme;
			var conf = { overriding: [] };
			var xhr = new XMLHttpRequest();
			xhr.open('get', '/assets/theme-conf.js');
			xhr.onload = function () {
				eval(xhr.responseText.split('exports.')[1]);
				currentTheme = conf.overriding.find(function (t) { return t.child === entcore_1.skin.skin; });
				$scope.childTheme = currentTheme.child;
				if (currentTheme.group) {
					$scope.themes = conf.overriding.filter(function (t) { return t.group === currentTheme.group; });
				}
				else {
					$scope.themes = conf.overriding;
				}
			};
			xhr.send();
			(0, entcore_1.http)().get('/auth/configure/welcome').done(function (d) {
				$scope.welcome.content = d.welcomeMessage;
				if (!d.enabled) {
					$scope.welcome.hideContent = true;
				}
				$scope.$apply();
			})
				.e404(function () {
					$scope.welcome.hideContent = true;
					$scope.$apply();
				});
			if (window.location.href.indexOf('?') !== -1) {
				if (window.location.href.split('login=').length > 1) {
					$scope.user.login = window.location.href.split('login=')[1].split('&')[0];
				}
				if (window.location.href.split('activationCode=').length > 1) {
					$scope.user.activationCode = window.location.href.split('activationCode=')[1].split('&')[0];
				}
			}
			(0, entcore_1.http)().get('/auth/context').done(function (data) {
				$scope.callBack = data.callBack;
				$scope.cgu = data.cgu;
				$scope.passwordRegex = data.passwordRegex;
				$scope.mandatory = data.mandatory;
				$scope.$apply('cgu');
			});
			$scope.identicalRegex = function (str) {
				if (!str)
					return new RegExp("^$");
				return new RegExp("^" + str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$");
			};
			$scope.refreshInput = function (form, inputName) {
				form[inputName].$setViewValue(form[inputName].$viewValue);
			};
			$scope.passwordComplexity = function (password) {
				if (!password)
					return 0;
				if (password.length < 6)
					return password.length;
				var score = password.length;
				if (/[0-9]+/.test(password) && /[a-zA-Z]+/.test(password)) {
					score += 5;
				}
				if (!/^[a-zA-Z0-9- ]+$/.test(password)) {
					score += 5;
				}
				return score;
			};
			$scope.translateComplexity = function (password) {
				var score = $scope.passwordComplexity(password);
				if (score < 12) {
					return entcore_1.idiom.translate("weak");
				}
				if (score < 20)
					return entcore_1.idiom.translate("moderate");
				return entcore_1.idiom.translate("strong");
			};
			$scope.getThemeChoiceLabel = function (theme) { return entcore_1.idiom.translate("".concat(theme, ".choice")); };
			$scope.noThemePicked = function () { return !Object.keys($scope.user.themes).length; };
			$scope.refreshSelectionTheme = function (theme) {
				var selected = $scope.user.themes[theme];
				$scope.user.themes = {};
				if (selected) {
					$scope.user.themes[theme] = true;
				}
			};
			$scope.activate = function (forceCurrentTheme) {
				if ($scope.themes.length > 1 && $scope.noThemePicked() && !forceCurrentTheme) {
					entcore_1.template.open('main', 'activation-themes');
					return;
				}
				if ($scope.themes.length === 1 && conf.overriding.length > 1) {
					$scope.user.theme = $scope.themes[0].child;
				}
				if (forceCurrentTheme) {
					$scope.user.theme = currentTheme.child;
				}
				else {
					if (Object.keys($scope.user.themes).length > 1) {
						var foundTheme_1 = false;
						conf.overriding.forEach(function (o) {
							if (o.parent === 'theme-open-ent' && $scope.user.themes[o.child]) {
								$scope.user.theme = o.child;
								foundTheme_1 = true;
							}
						});
						if (!foundTheme_1) {
							conf.overriding.forEach(function (o) {
								if ($scope.user.themes[o.child]) {
									$scope.user.theme = o.child;
									foundTheme_1 = true;
								}
							});
						}
					}
					else if (Object.keys($scope.user.themes).length > 0) {
						$scope.user.theme = Object.keys($scope.user.themes)[0];
					}
				}
				var emptyIfUndefined = function (item) {
					return item ? item : "";
				};
				(0, entcore_1.http)().post('/auth/activation', (0, entcore_1.http)().serialize({
					theme: $scope.user.theme || '',
					login: $scope.user.login,
					password: $scope.user.password,
					confirmPassword: $scope.user.confirmPassword,
					acceptCGU: $scope.user.acceptCGU,
					activationCode: $scope.user.activationCode,
					callBack: $scope.callBack,
					mail: emptyIfUndefined($scope.user.email),
					phone: emptyIfUndefined($scope.user.phone)
				}))
					.done(function (data) {
						if (typeof data !== 'object') {
							window.location.href = '/';
						}
						if (data.error) {
							$scope.error = data.error.message;
						}
						$scope.$apply('error');
					});
			};
		}]);
		exports.cguController = entcore_1.ng.controller('CGUController', ['$scope', function ($scope) {
			$scope.template = entcore_1.template;
			$scope.template.open('main', 'cgu-content');
		}]);


		/***/
}),
/* 3 */
/***/ (function (module, exports, __webpack_require__) {

		"use strict";
		var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
			function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
			return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
				function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
				function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
		};
		var __generator = (this && this.__generator) || function (thisArg, body) {
			var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
			return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
			function verb(n) { return function (v) { return step([n, v]); }; }
			function step(op) {
				if (f) throw new TypeError("Generator is already executing.");
				while (g && (g = 0, op[0] && (_ = 0)), _) try {
					if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
					if (y = 0, t) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0: case 1: t = op; break;
						case 4: _.label++; return { value: op[1], done: false };
						case 5: _.label++; y = op[1]; op = [0]; continue;
						case 7: op = _.ops.pop(); _.trys.pop(); continue;
						default:
							if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
							if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
							if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
							if (t[2]) _.ops.pop();
							_.trys.pop(); continue;
					}
					op = body.call(thisArg, _);
				} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
				if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
			}
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.forgotController = void 0;
		var entcore_1 = __webpack_require__(1);
		exports.forgotController = entcore_1.ng.controller('ForgotController', ['$scope', 'route', function ($scope, route) {
			$scope.template = entcore_1.template;
			$scope.template.open('main', 'forgot-form');
			$scope.user = {};
			$scope.welcome = {};
			//===Private methods
			var _promise = Promise.resolve();
			var resetError = function () {
				//reset message if exists and wait 1seconds #21699
				if ($scope.error) {
					$scope.error = "";
					_promise = new Promise(function (resolve) {
						setTimeout(resolve, 1000);
					});
					$scope.$apply();
				}
				else {
					return _promise;
				}
			};
			var setError = function (text) {
				return __awaiter(void 0, void 0, void 0, function () {
					return __generator(this, function (_a) {
						switch (_a.label) {
							case 0:
								//reset message if exists and wait 2seconds #21699
								return [4 /*yield*/, resetError()];
							case 1:
								//reset message if exists and wait 2seconds #21699
								_a.sent();
								$scope.error = text;
								$scope.$apply();
								return [2 /*return*/];
						}
					});
				});
			};
			//===Init
			(0, entcore_1.http)().get('/auth/configure/welcome').done(function (d) {
				$scope.welcome.content = d.welcomeMessage;
				if (!d.enabled) {
					$scope.welcome.hideContent = true;
				}
				$scope.$apply();
			})
				.e404(function () {
					$scope.welcome.hideContent = true;
					$scope.$apply();
				});
			if (window.location.href.indexOf('?') !== -1) {
				if (window.location.href.split('login=').length > 1) {
					$scope.login = window.location.href.split('login=')[1].split('&')[0];
				}
				if (window.location.href.split('activationCode=').length > 1) {
					$scope.activationCode = window.location.href.split('activationCode=')[1].split('&')[0];
				}
			}
			var conf = { overriding: [] };
			var xhr = new XMLHttpRequest();
			xhr.open('get', '/assets/theme-conf.js');
			xhr.onload = function () {
				return __awaiter(void 0, void 0, void 0, function () {
					var currentTheme;
					return __generator(this, function (_a) {
						eval(xhr.responseText.split('exports.')[1]);
						currentTheme = conf.overriding.find(function (t) { return t.child === entcore_1.skin.skin; });
						$scope.childTheme = currentTheme.child;
						return [2 /*return*/];
					});
				});
			};
			xhr.send();
			//===Routes
			route({
				actionId: function (params) {
					$scope.user.mode = "id";
					$scope.showWhat = "forgotId";
				},
				actionPassword: function (params) {
					$scope.user.mode = "password";
					$scope.showWhat = "forgotPassword";
				}
			});
			//===Public methods
			$scope.initUser = function () {
				$scope.user = {};
			};
			$scope.shouldAskForPwd = function () {
				return $scope.user && $scope.user.mode == "password";
			};
			$scope.shouldAskForEmail = function () {
				return $scope.user && ($scope.user.mode == "id" || $scope.user.mode == "idExtras");
			};
			$scope.shouldAskForNameAndStructure = function () {
				return $scope.user && $scope.user.mode == "idExtras";
			};
			$scope.forgot = function (service) {
				if ($scope.user.mode === 'password') {
					$scope.forgotPassword($scope.user.login, service);
				}
				else if ($scope.user.mode === 'idExtras') {
					$scope.forgotId({
						mail: $scope.user.mail,
						firstName: $scope.user.firstName,
						structureId: $scope.user.structureId
					}, service);
				}
				else {
					$scope.forgotId({
						mail: $scope.user.mail,
						firstName: null,
						structureId: null
					}, service);
				}
			};
			$scope.passwordChannels = function (login) {
				(0, entcore_1.http)().get('/auth/password-channels', { login: login })
					.done(function (data) {
						$scope.user.channels = {
							mail: data.mail,
							mobile: data.mobile
						};
						$scope.$apply();
					})
					.e400(function (data) {
						setError('auth.notify.' + JSON.parse(data.responseText).error + '.login');
					});
			};
			$scope.forgotPassword = function (login, service) {
				$scope.showWhat = null;
				$scope.sendingMailAndWaitingFeedback = true;
				(0, entcore_1.http)().postJson('/auth/forgot-password', { login: login, service: service })
					.done(function (data) {
						entcore_1.notify.info("auth.notify.password.forgotten", 8000);
						$scope.user.channels = {};
						$scope.sendingMailAndWaitingFeedback = false;
						$scope.$apply();
					})
					.e400(function (data) {
						$scope.sendingMailAndWaitingFeedback = false;
						setError('auth.notify.' + JSON.parse(data.responseText).error + '.login');
					});
			};
			$scope.canSubmitForgotForm = function (isInputValid) {
				return isInputValid && !$scope.sendingMailAndWaitingFeedback;
			};
			$scope.forgotId = function (_a, service) {
				var mail = _a.mail, firstName = _a.firstName, structureId = _a.structureId;
				resetError();
				(0, entcore_1.http)().postJson('/auth/forgot-id', { mail: mail, firstName: firstName, structureId: structureId, service: service })
					.done(function (data) {
						if (data.structures) {
							$scope.structures = data.structures;
							if (firstName === null || structureId === null) {
								$scope.user.mode = 'idExtras';
							}
							else {
								$scope.user.mode = 'notFound';
								setError('auth.notify.id.forgotten');
							}
						}
						else {
							entcore_1.notify.info("auth.notify." + service + ".sent", 5000);
							if (data.mobile) {
								$scope.user.channels = {
									mobile: data.mobile
								};
							}
							else {
								$scope.user.channels = {};
							}
						}
						$scope.$apply();
					})
					.e400(function (data) {
						var err = JSON.parse(data.responseText);
						if (err.error == "no.match" && $scope.user.mode == "idExtras") {
							setError('auth.notify.no.match.mail.laststep');
						}
						else {
							setError('auth.notify.' + err.error + '.mail');
						}
						$scope.$apply();
					});
			};
			$scope.noSpace = function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			};
			$scope.noUpperCase = function () {
				$scope.user.login = $scope.user.login.toLowerCase();
			};
		}]);


		/***/
}),
/* 4 */
/***/ (function (module, exports, __webpack_require__) {

		"use strict";
		var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
			function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
			return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
				function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
				function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
		};
		var __generator = (this && this.__generator) || function (thisArg, body) {
			var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
			return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
			function verb(n) { return function (v) { return step([n, v]); }; }
			function step(op) {
				if (f) throw new TypeError("Generator is already executing.");
				while (g && (g = 0, op[0] && (_ = 0)), _) try {
					if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
					if (y = 0, t) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0: case 1: t = op; break;
						case 4: _.label++; return { value: op[1], done: false };
						case 5: _.label++; y = op[1]; op = [0]; continue;
						case 7: op = _.ops.pop(); _.trys.pop(); continue;
						default:
							if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
							if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
							if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
							if (t[2]) _.ops.pop();
							_.trys.pop(); continue;
					}
					op = body.call(thisArg, _);
				} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
				if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
			}
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.resetController = void 0;
		var entcore_1 = __webpack_require__(1);
		exports.resetController = entcore_1.ng.controller('ResetController', ['$scope', function ($scope) {
			$scope.template = entcore_1.template;
			$scope.lang = entcore_1.idiom;
			$scope.template.open('main', 'reset-form');
			$scope.user = {};
			$scope.welcome = {};
			(0, entcore_1.http)().get('/auth/configure/welcome').done(function (d) {
				$scope.welcome.content = d.welcomeMessage;
				if (!d.enabled) {
					$scope.welcome.hideContent = true;
				}
				$scope.$apply();
			})
				.e404(function () {
					$scope.welcome.hideContent = true;
					$scope.$apply();
				});
			if (window.location.href.indexOf('?') !== -1) {
				if (window.location.href.split('login=').length > 1) {
					$scope.login = window.location.href.split('login=')[1].split('&')[0];
				}
				if (window.location.href.split('activationCode=').length > 1) {
					$scope.activationCode = window.location.href.split('activationCode=')[1].split('&')[0];
				}
			}
			(0, entcore_1.http)().get('/auth/context').done(function (data) {
				$scope.passwordRegex = data.passwordRegex;
			});
			var conf = { overriding: [] };
			var xhr = new XMLHttpRequest();
			xhr.open('get', '/assets/theme-conf.js');
			xhr.onload = function () {
				return __awaiter(void 0, void 0, void 0, function () {
					var currentTheme;
					return __generator(this, function (_a) {
						eval(xhr.responseText.split('exports.')[1]);
						currentTheme = conf.overriding.find(function (t) { return t.child === entcore_1.skin.skin; });
						$scope.childTheme = currentTheme.child;
						return [2 /*return*/];
					});
				});
			};
			xhr.send();
			$scope.identicalRegex = function (str) {
				if (!str)
					return new RegExp("^$");
				return new RegExp("^" + str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$");
			};
			$scope.refreshInput = function (form, inputName) {
				form[inputName].$setViewValue(form[inputName].$viewValue);
			};
			$scope.passwordComplexity = function (password) {
				if (!password)
					return 0;
				if (password.length < 6)
					return password.length;
				var score = password.length;
				if (/[0-9]+/.test(password) && /[a-zA-Z]+/.test(password)) {
					score += 5;
				}
				if (!/^[a-zA-Z0-9- ]+$/.test(password)) {
					score += 5;
				}
				return score;
			};
			$scope.translateComplexity = function (password) {
				var score = $scope.passwordComplexity(password);
				if (score < 12) {
					return entcore_1.idiom.translate("weak");
				}
				if (score < 20)
					return entcore_1.idiom.translate("moderate");
				return entcore_1.idiom.translate("strong");
			};
			$scope.reset = function () {
				(0, entcore_1.http)().post('/auth/reset', (0, entcore_1.http)().serialize({
					login: $scope.user.login.trim(),
					password: $scope.user.password,
					confirmPassword: $scope.user.confirmPassword,
					resetCode: resetCode
				}))
					.done(function (data) {
						if (typeof data !== 'object') {
							window.location.href = '/';
						}
						if (data.error) {
							$scope.error = data.error.message;
						}
						$scope.$apply('error');
					});
			};
			$scope.resetForce = function () {
				(0, entcore_1.http)().post('/auth/reset', (0, entcore_1.http)().serialize({
					login: login,
					password: $scope.user.password,
					confirmPassword: $scope.user.confirmPassword,
					oldPassword: $scope.user.oldPassword,
					callback: callback,
					forceChange: "force"
				}))
					.done(function (data) {
						if (typeof data !== 'object') {
							if (callback) {
								window.location.href = callback;
							}
							else {
								window.location.href = '/';
							}
						}
						if (data.error) {
							$scope.error = data.error.message;
						}
						$scope.$apply('error');
					});
			};
			$scope.noSpace = function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			};
			$scope.noUpperCase = function () {
				$scope.user.login = $scope.user.login.toLowerCase();
			};
		}]);


		/***/
}),
/* 5 */
/***/ (function (module, exports, __webpack_require__) {

		"use strict";
		var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
			function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
			return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
				function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
				function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
		};
		var __generator = (this && this.__generator) || function (thisArg, body) {
			var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
			return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
			function verb(n) { return function (v) { return step([n, v]); }; }
			function step(op) {
				if (f) throw new TypeError("Generator is already executing.");
				while (g && (g = 0, op[0] && (_ = 0)), _) try {
					if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
					if (y = 0, t) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0: case 1: t = op; break;
						case 4: _.label++; return { value: op[1], done: false };
						case 5: _.label++; y = op[1]; op = [0]; continue;
						case 7: op = _.ops.pop(); _.trys.pop(); continue;
						default:
							if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
							if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
							if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
							if (t[2]) _.ops.pop();
							_.trys.pop(); continue;
					}
					op = body.call(thisArg, _);
				} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
				if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
			}
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.loginController = void 0;
		var entcore_1 = __webpack_require__(1);
		exports.loginController = entcore_1.ng.controller('LoginController', ['$scope', function ($scope) {
			$scope.template = entcore_1.template;
			$scope.template.open('main', 'login-form');
			$scope.user = {};
			$scope.lang = entcore_1.idiom;
			$scope.welcome = {};
			var _callback = $scope.callBack;
			//init callback only if not already setted
			Object.defineProperty($scope, "callBack", {
				get: function () {
					return _callback;
				}, set: function (value) {
					if (!_callback) {
						_callback = value;
					}
				}
			});
			(0, entcore_1.http)().get('/auth/configure/welcome').done(function (d) {
				$scope.welcome.content = d.welcomeMessage;
				if (!d.enabled) {
					$scope.welcome.hideContent = true;
				}
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			})
				.e404(function () {
					$scope.welcome.hideContent = true;
					if (!$scope.$$phase) {
						$scope.$apply();
					}
				});
			$scope.cookieEnabled = navigator.cookieEnabled;
			var safeSplit = function (str, pattern) {
				if (str === void 0) { str = ""; }
				if (pattern === void 0) { pattern = ""; }
				if (typeof str == "string") {
					return str.split(pattern);
				}
				else {
					return [];
				}
			};
			var checkBrowser = function (browser) {
				if (typeof browser == "undefined") {
					console.warn("[Auth][Login.checkBrowser] chould not identify browser NAME: ", browser, navigator.userAgent);
				}
				else if (typeof browser.version == "undefined") {
					console.warn("[Auth][Login.checkBrowser] chould not identify browser VERSION: ", browser, navigator.userAgent);
				}
			};
			var browser = function (userAgent) {
				if (userAgent.indexOf('Chrome') !== -1) {
					var chromeVersion = safeSplit(userAgent, 'Chrome/')[1];
					var version = parseInt(safeSplit(chromeVersion, '.')[0]);
					return {
						browser: 'Chrome',
						version: version,
						outdated: version < 39
					};
				}
				else if (userAgent.indexOf('IEMobile') !== -1) {
					var ieVersion = safeSplit(userAgent, 'IEMobile/')[1];
					var version = parseInt(safeSplit(ieVersion, ';')[0]);
					return {
						browser: 'MSIE',
						version: version,
						outdated: version < 10
					};
				}
				else if (userAgent.indexOf('AppleWebKit') !== -1 && userAgent.indexOf('Chrome') === -1) {
					var safariVersion = safeSplit(userAgent, 'Version/')[1];
					var version = parseInt(safeSplit(safariVersion, '.')[0]);
					return {
						browser: 'Safari',
						version: version,
						outdated: version < 7
					};
				}
				else if (userAgent.indexOf('Firefox') !== -1) {
					var ffVersion = safeSplit(userAgent, 'Firefox/')[1];
					var version = parseInt(safeSplit(ffVersion, '.')[0]);
					return {
						browser: 'Firefox',
						version: version,
						outdated: version < 34
					};
				}
				else if (userAgent.indexOf('MSIE') !== -1) {
					var msVersion = safeSplit(userAgent, 'MSIE ')[1];
					var version = parseInt(safeSplit(msVersion, ';')[0]);
					return {
						browser: 'MSIE',
						version: version,
						outdated: version < 10
					};
				}
				else if (userAgent.indexOf('MSIE') === -1 && userAgent.indexOf('Trident') !== -1) {
					var msVersion = safeSplit(userAgent, 'rv:')[1];
					var version = parseInt(safeSplit(msVersion, '.')[0]);
					return {
						browser: 'MSIE',
						version: version,
						outdated: version < 10
					};
				}
			};
			$scope.browser = browser(navigator.userAgent);
			checkBrowser($scope.browser);
			if (window.location.href.indexOf('?') !== -1) {
				if (window.location.href.split('login=').length > 1) {
					$scope.login = window.location.href.split('login=')[1].split('&')[0];
				}
				if (window.location.href.split('activationCode=').length > 1) {
					$scope.activationCode = window.location.href.split('activationCode=')[1].split('&')[0];
				}
				if (window.location.href.split('callback=').length > 1) {
					var details = window.location.href.split('callback=')[1].split('&')[0].split('#');
					_callback = details[0];
					$scope.details = details.length > 1 ? details[1] : "";
				}
				else if (window.location.href.split('callBack=').length > 1) {
					var details = window.location.href.split('callBack=')[1].split('&')[0].split('#');
					_callback = details[0];
					$scope.details = details.length > 1 ? details[1] : "";
				}
			}
			(0, entcore_1.http)().get('/auth/context').done(function (data) {
				//$scope.callBack = data.callBack;
				$scope.cgu = data.cgu;
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			});
			var conf = { overriding: [] };
			var xhr = new XMLHttpRequest();
			xhr.open('get', '/assets/theme-conf.js');
			xhr.onload = function () {
				return __awaiter(void 0, void 0, void 0, function () {
					var currentTheme;
					return __generator(this, function (_a) {
						eval(xhr.responseText.split('exports.')[1]);
						currentTheme = conf.overriding.find(function (t) { return t.child === entcore_1.skin.skin; });
						$scope.childTheme = currentTheme.child;
						return [2 /*return*/];
					});
				});
			};
			xhr.send();
			$scope.connect = function () {
				console.log('connect');
				// picking up values manually because the browser autofill isn't registered by angular
				(0, entcore_1.http)().post('/auth/login', (0, entcore_1.http)().serialize({
					email: (0, entcore_1.$)('#email').val(),
					password: (0, entcore_1.$)('#password').val(),
					rememberMe: $scope.user.rememberMe,
					secureLocation: $scope.user.secureLocation,
					callBack: $scope.callBack,
					details: $scope.details
				}))
					.done(function (data) {
						if (typeof data !== 'object') {
							if (window.location.href.indexOf('callback=') !== -1) {
								window.location.href = window.unescape(window.location.href.split('callback=')[1]);
							}
							else {
								window.location.href = $scope.callBack;
							}
						}
						if (data.error) {
							$scope.error = data.error.message;
						}
						if (!$scope.$$phase) {
							$scope.$apply();
						}
					});
			};
			for (var i = 0; i < 10; i++) {
				if (history.pushState) {
					history.pushState('', '');
				}
			}
			$scope.noSpace = function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			};
			$scope.noUpperCase = function () {
				$scope.user.email = $scope.user.email.toLowerCase();
			};
		}]);


		/***/
}),
/* 6 */
/***/ (function (module, exports, __webpack_require__) {

		"use strict";
		var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
			function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
			return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
				function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
				function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
		};
		var __generator = (this && this.__generator) || function (thisArg, body) {
			var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
			return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
			function verb(n) { return function (v) { return step([n, v]); }; }
			function step(op) {
				if (f) throw new TypeError("Generator is already executing.");
				while (g && (g = 0, op[0] && (_ = 0)), _) try {
					if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
					if (y = 0, t) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0: case 1: t = op; break;
						case 4: _.label++; return { value: op[1], done: false };
						case 5: _.label++; y = op[1]; op = [0]; continue;
						case 7: op = _.ops.pop(); _.trys.pop(); continue;
						default:
							if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
							if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
							if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
							if (t[2]) _.ops.pop();
							_.trys.pop(); continue;
					}
					op = body.call(thisArg, _);
				} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
				if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
			}
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.termsRevalidationController = void 0;
		var entcore_1 = __webpack_require__(1);
		var axios_1 = __webpack_require__(7);
		exports.termsRevalidationController = entcore_1.ng.controller('TermsRevalidationController', ['$scope', function ($scope) {
			$scope.chartUrl = entcore_1.idiom.translate('auth.charter');
			$scope.cguUrl = entcore_1.idiom.translate('cgu.file');
			$scope.validate = function () {
				return __awaiter(void 0, void 0, void 0, function () {
					return __generator(this, function (_a) {
						switch (_a.label) {
							case 0: return [4 /*yield*/, axios_1.default.put("/auth/cgu/revalidate", {}, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })];
							case 1:
								_a.sent();
								document.location.href = '/timeline/timeline';
								return [2 /*return*/];
						}
					});
				});
			};
		}]);


		/***/
}),
/* 7 */
/***/ (function (module, exports, __webpack_require__) {

		module.exports = __webpack_require__(8);

		/***/
}),
/* 8 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);
		var bind = __webpack_require__(10);
		var Axios = __webpack_require__(11);
		var defaults = __webpack_require__(12);

		/**
		 * Create an instance of Axios
		 *
		 * @param {Object} defaultConfig The default config for the instance
		 * @return {Axios} A new instance of Axios
		 */
		function createInstance(defaultConfig) {
			var context = new Axios(defaultConfig);
			var instance = bind(Axios.prototype.request, context);

			// Copy axios.prototype to instance
			utils.extend(instance, Axios.prototype, context);

			// Copy context to instance
			utils.extend(instance, context);

			return instance;
		}

		// Create the default instance to be exported
		var axios = createInstance(defaults);

		// Expose Axios class to allow class inheritance
		axios.Axios = Axios;

		// Factory for creating new instances
		axios.create = function create(instanceConfig) {
			return createInstance(utils.merge(defaults, instanceConfig));
		};

		// Expose Cancel & CancelToken
		axios.Cancel = __webpack_require__(30);
		axios.CancelToken = __webpack_require__(31);
		axios.isCancel = __webpack_require__(27);

		// Expose all/spread
		axios.all = function all(promises) {
			return Promise.all(promises);
		};
		axios.spread = __webpack_require__(32);

		module.exports = axios;

		// Allow use of default import syntax in TypeScript
		module.exports.default = axios;


		/***/
}),
/* 9 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var bind = __webpack_require__(10);

		/*global toString:true*/

		// utils is a library of generic helper functions non-specific to axios

		var toString = Object.prototype.toString;

		/**
		 * Determine if a value is an Array
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an Array, otherwise false
		 */
		function isArray(val) {
			return toString.call(val) === '[object Array]';
		}

		/**
		 * Determine if a value is an ArrayBuffer
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
		 */
		function isArrayBuffer(val) {
			return toString.call(val) === '[object ArrayBuffer]';
		}

		/**
		 * Determine if a value is a FormData
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an FormData, otherwise false
		 */
		function isFormData(val) {
			return (typeof FormData !== 'undefined') && (val instanceof FormData);
		}

		/**
		 * Determine if a value is a view on an ArrayBuffer
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
		 */
		function isArrayBufferView(val) {
			var result;
			if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
				result = ArrayBuffer.isView(val);
			} else {
				result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
			}
			return result;
		}

		/**
		 * Determine if a value is a String
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a String, otherwise false
		 */
		function isString(val) {
			return typeof val === 'string';
		}

		/**
		 * Determine if a value is a Number
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Number, otherwise false
		 */
		function isNumber(val) {
			return typeof val === 'number';
		}

		/**
		 * Determine if a value is undefined
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if the value is undefined, otherwise false
		 */
		function isUndefined(val) {
			return typeof val === 'undefined';
		}

		/**
		 * Determine if a value is an Object
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an Object, otherwise false
		 */
		function isObject(val) {
			return val !== null && typeof val === 'object';
		}

		/**
		 * Determine if a value is a Date
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Date, otherwise false
		 */
		function isDate(val) {
			return toString.call(val) === '[object Date]';
		}

		/**
		 * Determine if a value is a File
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a File, otherwise false
		 */
		function isFile(val) {
			return toString.call(val) === '[object File]';
		}

		/**
		 * Determine if a value is a Blob
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Blob, otherwise false
		 */
		function isBlob(val) {
			return toString.call(val) === '[object Blob]';
		}

		/**
		 * Determine if a value is a Function
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Function, otherwise false
		 */
		function isFunction(val) {
			return toString.call(val) === '[object Function]';
		}

		/**
		 * Determine if a value is a Stream
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Stream, otherwise false
		 */
		function isStream(val) {
			return isObject(val) && isFunction(val.pipe);
		}

		/**
		 * Determine if a value is a URLSearchParams object
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
		 */
		function isURLSearchParams(val) {
			return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
		}

		/**
		 * Trim excess whitespace off the beginning and end of a string
		 *
		 * @param {String} str The String to trim
		 * @returns {String} The String freed of excess whitespace
		 */
		function trim(str) {
			return str.replace(/^\s*/, '').replace(/\s*$/, '');
		}

		/**
		 * Determine if we're running in a standard browser environment
		 *
		 * This allows axios to run in a web worker, and react-native.
		 * Both environments support XMLHttpRequest, but not fully standard globals.
		 *
		 * web workers:
		 *  typeof window -> undefined
		 *  typeof document -> undefined
		 *
		 * react-native:
		 *  typeof document.createElement -> undefined
		 */
		function isStandardBrowserEnv() {
			return (
				typeof window !== 'undefined' &&
				typeof document !== 'undefined' &&
				typeof document.createElement === 'function'
			);
		}

		/**
		 * Iterate over an Array or an Object invoking a function for each item.
		 *
		 * If `obj` is an Array callback will be called passing
		 * the value, index, and complete array for each item.
		 *
		 * If 'obj' is an Object callback will be called passing
		 * the value, key, and complete object for each property.
		 *
		 * @param {Object|Array} obj The object to iterate
		 * @param {Function} fn The callback to invoke for each item
		 */
		function forEach(obj, fn) {
			// Don't bother if no value provided
			if (obj === null || typeof obj === 'undefined') {
				return;
			}

			// Force an array if not already something iterable
			if (typeof obj !== 'object' && !isArray(obj)) {
				/*eslint no-param-reassign:0*/
				obj = [obj];
			}

			if (isArray(obj)) {
				// Iterate over array values
				for (var i = 0, l = obj.length; i < l; i++) {
					fn.call(null, obj[i], i, obj);
				}
			} else {
				// Iterate over object keys
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) {
						fn.call(null, obj[key], key, obj);
					}
				}
			}
		}

		/**
		 * Accepts varargs expecting each argument to be an object, then
		 * immutably merges the properties of each object and returns result.
		 *
		 * When multiple objects contain the same key the later object in
		 * the arguments list will take precedence.
		 *
		 * Example:
		 *
		 * ```js
		 * var result = merge({foo: 123}, {foo: 456});
		 * console.log(result.foo); // outputs 456
		 * ```
		 *
		 * @param {Object} obj1 Object to merge
		 * @returns {Object} Result of all merge properties
		 */
		function merge(/* obj1, obj2, obj3, ... */) {
			var result = {};
			function assignValue(val, key) {
				if (typeof result[key] === 'object' && typeof val === 'object') {
					result[key] = merge(result[key], val);
				} else {
					result[key] = val;
				}
			}

			for (var i = 0, l = arguments.length; i < l; i++) {
				forEach(arguments[i], assignValue);
			}
			return result;
		}

		/**
		 * Extends object a by mutably adding to it the properties of object b.
		 *
		 * @param {Object} a The object to be extended
		 * @param {Object} b The object to copy properties from
		 * @param {Object} thisArg The object to bind function to
		 * @return {Object} The resulting value of object a
		 */
		function extend(a, b, thisArg) {
			forEach(b, function assignValue(val, key) {
				if (thisArg && typeof val === 'function') {
					a[key] = bind(val, thisArg);
				} else {
					a[key] = val;
				}
			});
			return a;
		}

		module.exports = {
			isArray: isArray,
			isArrayBuffer: isArrayBuffer,
			isFormData: isFormData,
			isArrayBufferView: isArrayBufferView,
			isString: isString,
			isNumber: isNumber,
			isObject: isObject,
			isUndefined: isUndefined,
			isDate: isDate,
			isFile: isFile,
			isBlob: isBlob,
			isFunction: isFunction,
			isStream: isStream,
			isURLSearchParams: isURLSearchParams,
			isStandardBrowserEnv: isStandardBrowserEnv,
			forEach: forEach,
			merge: merge,
			extend: extend,
			trim: trim
		};


		/***/
}),
/* 10 */
/***/ (function (module, exports) {

		'use strict';

		module.exports = function bind(fn, thisArg) {
			return function wrap() {
				var args = new Array(arguments.length);
				for (var i = 0; i < args.length; i++) {
					args[i] = arguments[i];
				}
				return fn.apply(thisArg, args);
			};
		};


		/***/
}),
/* 11 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var defaults = __webpack_require__(12);
		var utils = __webpack_require__(9);
		var InterceptorManager = __webpack_require__(24);
		var dispatchRequest = __webpack_require__(25);
		var isAbsoluteURL = __webpack_require__(28);
		var combineURLs = __webpack_require__(29);

		/**
		 * Create a new instance of Axios
		 *
		 * @param {Object} instanceConfig The default config for the instance
		 */
		function Axios(instanceConfig) {
			this.defaults = instanceConfig;
			this.interceptors = {
				request: new InterceptorManager(),
				response: new InterceptorManager()
			};
		}

		/**
		 * Dispatch a request
		 *
		 * @param {Object} config The config specific for this request (merged with this.defaults)
		 */
		Axios.prototype.request = function request(config) {
			/*eslint no-param-reassign:0*/
			// Allow for axios('example/url'[, config]) a la fetch API
			if (typeof config === 'string') {
				config = utils.merge({
					url: arguments[0]
				}, arguments[1]);
			}

			config = utils.merge(defaults, this.defaults, { method: 'get' }, config);

			// Support baseURL config
			if (config.baseURL && !isAbsoluteURL(config.url)) {
				config.url = combineURLs(config.baseURL, config.url);
			}

			// Hook up interceptors middleware
			var chain = [dispatchRequest, undefined];
			var promise = Promise.resolve(config);

			this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
				chain.unshift(interceptor.fulfilled, interceptor.rejected);
			});

			this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
				chain.push(interceptor.fulfilled, interceptor.rejected);
			});

			while (chain.length) {
				promise = promise.then(chain.shift(), chain.shift());
			}

			return promise;
		};

		// Provide aliases for supported request methods
		utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
			/*eslint func-names:0*/
			Axios.prototype[method] = function (url, config) {
				return this.request(utils.merge(config || {}, {
					method: method,
					url: url
				}));
			};
		});

		utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
			/*eslint func-names:0*/
			Axios.prototype[method] = function (url, data, config) {
				return this.request(utils.merge(config || {}, {
					method: method,
					url: url,
					data: data
				}));
			};
		});

		module.exports = Axios;


		/***/
}),
/* 12 */
/***/ (function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (process) {
			'use strict';

			var utils = __webpack_require__(9);
			var normalizeHeaderName = __webpack_require__(14);

			var PROTECTION_PREFIX = /^\)\]\}',?\n/;
			var DEFAULT_CONTENT_TYPE = {
				'Content-Type': 'application/x-www-form-urlencoded'
			};

			function setContentTypeIfUnset(headers, value) {
				if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
					headers['Content-Type'] = value;
				}
			}

			function getDefaultAdapter() {
				var adapter;
				if (typeof XMLHttpRequest !== 'undefined') {
					// For browsers use XHR adapter
					adapter = __webpack_require__(15);
				} else if (typeof process !== 'undefined') {
					// For node use HTTP adapter
					adapter = __webpack_require__(15);
				}
				return adapter;
			}

			var defaults = {
				adapter: getDefaultAdapter(),

				transformRequest: [function transformRequest(data, headers) {
					normalizeHeaderName(headers, 'Content-Type');
					if (utils.isFormData(data) ||
						utils.isArrayBuffer(data) ||
						utils.isStream(data) ||
						utils.isFile(data) ||
						utils.isBlob(data)
					) {
						return data;
					}
					if (utils.isArrayBufferView(data)) {
						return data.buffer;
					}
					if (utils.isURLSearchParams(data)) {
						setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
						return data.toString();
					}
					if (utils.isObject(data)) {
						setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
						return JSON.stringify(data);
					}
					return data;
				}],

				transformResponse: [function transformResponse(data) {
					/*eslint no-param-reassign:0*/
					if (typeof data === 'string') {
						data = data.replace(PROTECTION_PREFIX, '');
						try {
							data = JSON.parse(data);
						} catch (e) { /* Ignore */ }
					}
					return data;
				}],

				timeout: 0,

				xsrfCookieName: 'XSRF-TOKEN',
				xsrfHeaderName: 'X-XSRF-TOKEN',

				maxContentLength: -1,

				validateStatus: function validateStatus(status) {
					return status >= 200 && status < 300;
				}
			};

			defaults.headers = {
				common: {
					'Accept': 'application/json, text/plain, */*'
				}
			};

			utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
				defaults.headers[method] = {};
			});

			utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
				defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
			});

			module.exports = defaults;

			/* WEBPACK VAR INJECTION */
}.call(exports, __webpack_require__(13)))

		/***/
}),
/* 13 */
/***/ (function (module, exports) {

		// shim for using process in browser
		var process = module.exports = {};

		// cached from whatever global is present so that test runners that stub it
		// don't break things.  But we need to wrap it in a try catch in case it is
		// wrapped in strict mode code which doesn't define any globals.  It's inside a
		// function because try/catches deoptimize in certain engines.

		var cachedSetTimeout;
		var cachedClearTimeout;

		function defaultSetTimout() {
			throw new Error('setTimeout has not been defined');
		}
		function defaultClearTimeout() {
			throw new Error('clearTimeout has not been defined');
		}
		(function () {
			try {
				if (typeof setTimeout === 'function') {
					cachedSetTimeout = setTimeout;
				} else {
					cachedSetTimeout = defaultSetTimout;
				}
			} catch (e) {
				cachedSetTimeout = defaultSetTimout;
			}
			try {
				if (typeof clearTimeout === 'function') {
					cachedClearTimeout = clearTimeout;
				} else {
					cachedClearTimeout = defaultClearTimeout;
				}
			} catch (e) {
				cachedClearTimeout = defaultClearTimeout;
			}
		}())
		function runTimeout(fun) {
			if (cachedSetTimeout === setTimeout) {
				//normal enviroments in sane situations
				return setTimeout(fun, 0);
			}
			// if setTimeout wasn't available but was latter defined
			if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
				cachedSetTimeout = setTimeout;
				return setTimeout(fun, 0);
			}
			try {
				// when when somebody has screwed with setTimeout but no I.E. maddness
				return cachedSetTimeout(fun, 0);
			} catch (e) {
				try {
					// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
					return cachedSetTimeout.call(null, fun, 0);
				} catch (e) {
					// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
					return cachedSetTimeout.call(this, fun, 0);
				}
			}


		}
		function runClearTimeout(marker) {
			if (cachedClearTimeout === clearTimeout) {
				//normal enviroments in sane situations
				return clearTimeout(marker);
			}
			// if clearTimeout wasn't available but was latter defined
			if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
				cachedClearTimeout = clearTimeout;
				return clearTimeout(marker);
			}
			try {
				// when when somebody has screwed with setTimeout but no I.E. maddness
				return cachedClearTimeout(marker);
			} catch (e) {
				try {
					// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
					return cachedClearTimeout.call(null, marker);
				} catch (e) {
					// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
					// Some versions of I.E. have different rules for clearTimeout vs setTimeout
					return cachedClearTimeout.call(this, marker);
				}
			}



		}
		var queue = [];
		var draining = false;
		var currentQueue;
		var queueIndex = -1;

		function cleanUpNextTick() {
			if (!draining || !currentQueue) {
				return;
			}
			draining = false;
			if (currentQueue.length) {
				queue = currentQueue.concat(queue);
			} else {
				queueIndex = -1;
			}
			if (queue.length) {
				drainQueue();
			}
		}

		function drainQueue() {
			if (draining) {
				return;
			}
			var timeout = runTimeout(cleanUpNextTick);
			draining = true;

			var len = queue.length;
			while (len) {
				currentQueue = queue;
				queue = [];
				while (++queueIndex < len) {
					if (currentQueue) {
						currentQueue[queueIndex].run();
					}
				}
				queueIndex = -1;
				len = queue.length;
			}
			currentQueue = null;
			draining = false;
			runClearTimeout(timeout);
		}

		process.nextTick = function (fun) {
			var args = new Array(arguments.length - 1);
			if (arguments.length > 1) {
				for (var i = 1; i < arguments.length; i++) {
					args[i - 1] = arguments[i];
				}
			}
			queue.push(new Item(fun, args));
			if (queue.length === 1 && !draining) {
				runTimeout(drainQueue);
			}
		};

		// v8 likes predictible objects
		function Item(fun, array) {
			this.fun = fun;
			this.array = array;
		}
		Item.prototype.run = function () {
			this.fun.apply(null, this.array);
		};
		process.title = 'browser';
		process.browser = true;
		process.env = {};
		process.argv = [];
		process.version = ''; // empty string to avoid regexp issues
		process.versions = {};

		function noop() { }

		process.on = noop;
		process.addListener = noop;
		process.once = noop;
		process.off = noop;
		process.removeListener = noop;
		process.removeAllListeners = noop;
		process.emit = noop;
		process.prependListener = noop;
		process.prependOnceListener = noop;

		process.listeners = function (name) { return [] }

		process.binding = function (name) {
			throw new Error('process.binding is not supported');
		};

		process.cwd = function () { return '/' };
		process.chdir = function (dir) {
			throw new Error('process.chdir is not supported');
		};
		process.umask = function () { return 0; };


		/***/
}),
/* 14 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);

		module.exports = function normalizeHeaderName(headers, normalizedName) {
			utils.forEach(headers, function processHeader(value, name) {
				if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
					headers[normalizedName] = value;
					delete headers[name];
				}
			});
		};


		/***/
}),
/* 15 */
/***/ (function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (process) {
			'use strict';

			var utils = __webpack_require__(9);
			var settle = __webpack_require__(16);
			var buildURL = __webpack_require__(19);
			var parseHeaders = __webpack_require__(20);
			var isURLSameOrigin = __webpack_require__(21);
			var createError = __webpack_require__(17);
			var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(22);

			module.exports = function xhrAdapter(config) {
				return new Promise(function dispatchXhrRequest(resolve, reject) {
					var requestData = config.data;
					var requestHeaders = config.headers;

					if (utils.isFormData(requestData)) {
						delete requestHeaders['Content-Type']; // Let the browser set it
					}

					var request = new XMLHttpRequest();
					var loadEvent = 'onreadystatechange';
					var xDomain = false;

					// For IE 8/9 CORS support
					// Only supports POST and GET calls and doesn't returns the response headers.
					// DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
					if (process.env.NODE_ENV !== 'test' &&
						typeof window !== 'undefined' &&
						window.XDomainRequest && !('withCredentials' in request) &&
						!isURLSameOrigin(config.url)) {
						request = new window.XDomainRequest();
						loadEvent = 'onload';
						xDomain = true;
						request.onprogress = function handleProgress() { };
						request.ontimeout = function handleTimeout() { };
					}

					// HTTP basic authentication
					if (config.auth) {
						var username = config.auth.username || '';
						var password = config.auth.password || '';
						requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
					}

					request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

					// Set the request timeout in MS
					request.timeout = config.timeout;

					// Listen for ready state
					request[loadEvent] = function handleLoad() {
						if (!request || (request.readyState !== 4 && !xDomain)) {
							return;
						}

						// The request errored out and we didn't get a response, this will be
						// handled by onerror instead
						// With one exception: request that using file: protocol, most browsers
						// will return status as 0 even though it's a successful request
						if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
							return;
						}

						// Prepare the response
						var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
						var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
						var response = {
							data: responseData,
							// IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
							status: request.status === 1223 ? 204 : request.status,
							statusText: request.status === 1223 ? 'No Content' : request.statusText,
							headers: responseHeaders,
							config: config,
							request: request
						};

						settle(resolve, reject, response);

						// Clean up request
						request = null;
					};

					// Handle low level network errors
					request.onerror = function handleError() {
						// Real errors are hidden from us by the browser
						// onerror should only fire if it's a network error
						reject(createError('Network Error', config));

						// Clean up request
						request = null;
					};

					// Handle timeout
					request.ontimeout = function handleTimeout() {
						reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));

						// Clean up request
						request = null;
					};

					// Add xsrf header
					// This is only done if running in a standard browser environment.
					// Specifically not if we're in a web worker, or react-native.
					if (utils.isStandardBrowserEnv()) {
						var cookies = __webpack_require__(23);

						// Add xsrf header
						var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
							cookies.read(config.xsrfCookieName) :
							undefined;

						if (xsrfValue) {
							requestHeaders[config.xsrfHeaderName] = xsrfValue;
						}
					}

					// Add headers to the request
					if ('setRequestHeader' in request) {
						utils.forEach(requestHeaders, function setRequestHeader(val, key) {
							if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
								// Remove Content-Type if data is undefined
								delete requestHeaders[key];
							} else {
								// Otherwise add header to the request
								request.setRequestHeader(key, val);
							}
						});
					}

					// Add withCredentials to request if needed
					if (config.withCredentials) {
						request.withCredentials = true;
					}

					// Add responseType to request if needed
					if (config.responseType) {
						try {
							request.responseType = config.responseType;
						} catch (e) {
							if (request.responseType !== 'json') {
								throw e;
							}
						}
					}

					// Handle progress if needed
					if (typeof config.onDownloadProgress === 'function') {
						request.addEventListener('progress', config.onDownloadProgress);
					}

					// Not all browsers support upload events
					if (typeof config.onUploadProgress === 'function' && request.upload) {
						request.upload.addEventListener('progress', config.onUploadProgress);
					}

					if (config.cancelToken) {
						// Handle cancellation
						config.cancelToken.promise.then(function onCanceled(cancel) {
							if (!request) {
								return;
							}

							request.abort();
							reject(cancel);
							// Clean up request
							request = null;
						});
					}

					if (requestData === undefined) {
						requestData = null;
					}

					// Send the request
					request.send(requestData);
				});
			};

			/* WEBPACK VAR INJECTION */
}.call(exports, __webpack_require__(13)))

		/***/
}),
/* 16 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var createError = __webpack_require__(17);

		/**
		 * Resolve or reject a Promise based on response status.
		 *
		 * @param {Function} resolve A function that resolves the promise.
		 * @param {Function} reject A function that rejects the promise.
		 * @param {object} response The response.
		 */
		module.exports = function settle(resolve, reject, response) {
			var validateStatus = response.config.validateStatus;
			// Note: status is not exposed by XDomainRequest
			if (!response.status || !validateStatus || validateStatus(response.status)) {
				resolve(response);
			} else {
				reject(createError(
					'Request failed with status code ' + response.status,
					response.config,
					null,
					response
				));
			}
		};


		/***/
}),
/* 17 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var enhanceError = __webpack_require__(18);

		/**
		 * Create an Error with the specified message, config, error code, and response.
		 *
		 * @param {string} message The error message.
		 * @param {Object} config The config.
		 * @param {string} [code] The error code (for example, 'ECONNABORTED').
		 @ @param {Object} [response] The response.
		 * @returns {Error} The created error.
		 */
		module.exports = function createError(message, config, code, response) {
			var error = new Error(message);
			return enhanceError(error, config, code, response);
		};


		/***/
}),
/* 18 */
/***/ (function (module, exports) {

		'use strict';

		/**
		 * Update an Error with the specified config, error code, and response.
		 *
		 * @param {Error} error The error to update.
		 * @param {Object} config The config.
		 * @param {string} [code] The error code (for example, 'ECONNABORTED').
		 @ @param {Object} [response] The response.
		 * @returns {Error} The error.
		 */
		module.exports = function enhanceError(error, config, code, response) {
			error.config = config;
			if (code) {
				error.code = code;
			}
			error.response = response;
			return error;
		};


		/***/
}),
/* 19 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);

		function encode(val) {
			return encodeURIComponent(val).
				replace(/%40/gi, '@').
				replace(/%3A/gi, ':').
				replace(/%24/g, '$').
				replace(/%2C/gi, ',').
				replace(/%20/g, '+').
				replace(/%5B/gi, '[').
				replace(/%5D/gi, ']');
		}

		/**
		 * Build a URL by appending params to the end
		 *
		 * @param {string} url The base of the url (e.g., http://www.google.com)
		 * @param {object} [params] The params to be appended
		 * @returns {string} The formatted url
		 */
		module.exports = function buildURL(url, params, paramsSerializer) {
			/*eslint no-param-reassign:0*/
			if (!params) {
				return url;
			}

			var serializedParams;
			if (paramsSerializer) {
				serializedParams = paramsSerializer(params);
			} else if (utils.isURLSearchParams(params)) {
				serializedParams = params.toString();
			} else {
				var parts = [];

				utils.forEach(params, function serialize(val, key) {
					if (val === null || typeof val === 'undefined') {
						return;
					}

					if (utils.isArray(val)) {
						key = key + '[]';
					}

					if (!utils.isArray(val)) {
						val = [val];
					}

					utils.forEach(val, function parseValue(v) {
						if (utils.isDate(v)) {
							v = v.toISOString();
						} else if (utils.isObject(v)) {
							v = JSON.stringify(v);
						}
						parts.push(encode(key) + '=' + encode(v));
					});
				});

				serializedParams = parts.join('&');
			}

			if (serializedParams) {
				url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
			}

			return url;
		};


		/***/
}),
/* 20 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);

		/**
		 * Parse headers into an object
		 *
		 * ```
		 * Date: Wed, 27 Aug 2014 08:58:49 GMT
		 * Content-Type: application/json
		 * Connection: keep-alive
		 * Transfer-Encoding: chunked
		 * ```
		 *
		 * @param {String} headers Headers needing to be parsed
		 * @returns {Object} Headers parsed into an object
		 */
		module.exports = function parseHeaders(headers) {
			var parsed = {};
			var key;
			var val;
			var i;

			if (!headers) { return parsed; }

			utils.forEach(headers.split('\n'), function parser(line) {
				i = line.indexOf(':');
				key = utils.trim(line.substr(0, i)).toLowerCase();
				val = utils.trim(line.substr(i + 1));

				if (key) {
					parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
				}
			});

			return parsed;
		};


		/***/
}),
/* 21 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);

		module.exports = (
			utils.isStandardBrowserEnv() ?

				// Standard browser envs have full support of the APIs needed to test
				// whether the request URL is of the same origin as current location.
				(function standardBrowserEnv() {
					var msie = /(msie|trident)/i.test(navigator.userAgent);
					var urlParsingNode = document.createElement('a');
					var originURL;

					/**
					* Parse a URL to discover it's components
					*
					* @param {String} url The URL to be parsed
					* @returns {Object}
					*/
					function resolveURL(url) {
						var href = url;

						if (msie) {
							// IE needs attribute set twice to normalize properties
							urlParsingNode.setAttribute('href', href);
							href = urlParsingNode.href;
						}

						urlParsingNode.setAttribute('href', href);

						// urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
						return {
							href: urlParsingNode.href,
							protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
							host: urlParsingNode.host,
							search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
							hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
							hostname: urlParsingNode.hostname,
							port: urlParsingNode.port,
							pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
								urlParsingNode.pathname :
								'/' + urlParsingNode.pathname
						};
					}

					originURL = resolveURL(window.location.href);

					/**
					* Determine if a URL shares the same origin as the current location
					*
					* @param {String} requestURL The URL to test
					* @returns {boolean} True if URL shares the same origin, otherwise false
					*/
					return function isURLSameOrigin(requestURL) {
						var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
						return (parsed.protocol === originURL.protocol &&
							parsed.host === originURL.host);
					};
				})() :

				// Non standard browser envs (web workers, react-native) lack needed support.
				(function nonStandardBrowserEnv() {
					return function isURLSameOrigin() {
						return true;
					};
				})()
		);


		/***/
}),
/* 22 */
/***/ (function (module, exports) {

		'use strict';

		// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

		function E() {
			this.message = 'String contains an invalid character';
		}
		E.prototype = new Error;
		E.prototype.code = 5;
		E.prototype.name = 'InvalidCharacterError';

		function btoa(input) {
			var str = String(input);
			var output = '';
			for (
				// initialize result and counter
				var block, charCode, idx = 0, map = chars;
				// if the next str index does not exist:
				//   change the mapping table to "="
				//   check if d has no fractional digits
				str.charAt(idx | 0) || (map = '=', idx % 1);
				// "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
				output += map.charAt(63 & block >> 8 - idx % 1 * 8)
			) {
				charCode = str.charCodeAt(idx += 3 / 4);
				if (charCode > 0xFF) {
					throw new E();
				}
				block = block << 8 | charCode;
			}
			return output;
		}

		module.exports = btoa;


		/***/
}),
/* 23 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);

		module.exports = (
			utils.isStandardBrowserEnv() ?

				// Standard browser envs support document.cookie
				(function standardBrowserEnv() {
					return {
						write: function write(name, value, expires, path, domain, secure) {
							var cookie = [];
							cookie.push(name + '=' + encodeURIComponent(value));

							if (utils.isNumber(expires)) {
								cookie.push('expires=' + new Date(expires).toGMTString());
							}

							if (utils.isString(path)) {
								cookie.push('path=' + path);
							}

							if (utils.isString(domain)) {
								cookie.push('domain=' + domain);
							}

							if (secure === true) {
								cookie.push('secure');
							}

							document.cookie = cookie.join('; ');
						},

						read: function read(name) {
							var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
							return (match ? decodeURIComponent(match[3]) : null);
						},

						remove: function remove(name) {
							this.write(name, '', Date.now() - 86400000);
						}
					};
				})() :

				// Non standard browser env (web workers, react-native) lack needed support.
				(function nonStandardBrowserEnv() {
					return {
						write: function write() { },
						read: function read() { return null; },
						remove: function remove() { }
					};
				})()
		);


		/***/
}),
/* 24 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);

		function InterceptorManager() {
			this.handlers = [];
		}

		/**
		 * Add a new interceptor to the stack
		 *
		 * @param {Function} fulfilled The function to handle `then` for a `Promise`
		 * @param {Function} rejected The function to handle `reject` for a `Promise`
		 *
		 * @return {Number} An ID used to remove interceptor later
		 */
		InterceptorManager.prototype.use = function use(fulfilled, rejected) {
			this.handlers.push({
				fulfilled: fulfilled,
				rejected: rejected
			});
			return this.handlers.length - 1;
		};

		/**
		 * Remove an interceptor from the stack
		 *
		 * @param {Number} id The ID that was returned by `use`
		 */
		InterceptorManager.prototype.eject = function eject(id) {
			if (this.handlers[id]) {
				this.handlers[id] = null;
			}
		};

		/**
		 * Iterate over all the registered interceptors
		 *
		 * This method is particularly useful for skipping over any
		 * interceptors that may have become `null` calling `eject`.
		 *
		 * @param {Function} fn The function to call for each interceptor
		 */
		InterceptorManager.prototype.forEach = function forEach(fn) {
			utils.forEach(this.handlers, function forEachHandler(h) {
				if (h !== null) {
					fn(h);
				}
			});
		};

		module.exports = InterceptorManager;


		/***/
}),
/* 25 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);
		var transformData = __webpack_require__(26);
		var isCancel = __webpack_require__(27);
		var defaults = __webpack_require__(12);

		/**
		 * Throws a `Cancel` if cancellation has been requested.
		 */
		function throwIfCancellationRequested(config) {
			if (config.cancelToken) {
				config.cancelToken.throwIfRequested();
			}
		}

		/**
		 * Dispatch a request to the server using the configured adapter.
		 *
		 * @param {object} config The config that is to be used for the request
		 * @returns {Promise} The Promise to be fulfilled
		 */
		module.exports = function dispatchRequest(config) {
			throwIfCancellationRequested(config);

			// Ensure headers exist
			config.headers = config.headers || {};

			// Transform request data
			config.data = transformData(
				config.data,
				config.headers,
				config.transformRequest
			);

			// Flatten headers
			config.headers = utils.merge(
				config.headers.common || {},
				config.headers[config.method] || {},
				config.headers || {}
			);

			utils.forEach(
				['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
				function cleanHeaderConfig(method) {
					delete config.headers[method];
				}
			);

			var adapter = config.adapter || defaults.adapter;

			return adapter(config).then(function onAdapterResolution(response) {
				throwIfCancellationRequested(config);

				// Transform response data
				response.data = transformData(
					response.data,
					response.headers,
					config.transformResponse
				);

				return response;
			}, function onAdapterRejection(reason) {
				if (!isCancel(reason)) {
					throwIfCancellationRequested(config);

					// Transform response data
					if (reason && reason.response) {
						reason.response.data = transformData(
							reason.response.data,
							reason.response.headers,
							config.transformResponse
						);
					}
				}

				return Promise.reject(reason);
			});
		};


		/***/
}),
/* 26 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var utils = __webpack_require__(9);

		/**
		 * Transform the data for a request or a response
		 *
		 * @param {Object|String} data The data to be transformed
		 * @param {Array} headers The headers for the request or response
		 * @param {Array|Function} fns A single function or Array of functions
		 * @returns {*} The resulting transformed data
		 */
		module.exports = function transformData(data, headers, fns) {
			/*eslint no-param-reassign:0*/
			utils.forEach(fns, function transform(fn) {
				data = fn(data, headers);
			});

			return data;
		};


		/***/
}),
/* 27 */
/***/ (function (module, exports) {

		'use strict';

		module.exports = function isCancel(value) {
			return !!(value && value.__CANCEL__);
		};


		/***/
}),
/* 28 */
/***/ (function (module, exports) {

		'use strict';

		/**
		 * Determines whether the specified URL is absolute
		 *
		 * @param {string} url The URL to test
		 * @returns {boolean} True if the specified URL is absolute, otherwise false
		 */
		module.exports = function isAbsoluteURL(url) {
			// A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
			// RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
			// by any combination of letters, digits, plus, period, or hyphen.
			return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
		};


		/***/
}),
/* 29 */
/***/ (function (module, exports) {

		'use strict';

		/**
		 * Creates a new URL by combining the specified URLs
		 *
		 * @param {string} baseURL The base URL
		 * @param {string} relativeURL The relative URL
		 * @returns {string} The combined URL
		 */
		module.exports = function combineURLs(baseURL, relativeURL) {
			return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
		};


		/***/
}),
/* 30 */
/***/ (function (module, exports) {

		'use strict';

		/**
		 * A `Cancel` is an object that is thrown when an operation is canceled.
		 *
		 * @class
		 * @param {string=} message The message.
		 */
		function Cancel(message) {
			this.message = message;
		}

		Cancel.prototype.toString = function toString() {
			return 'Cancel' + (this.message ? ': ' + this.message : '');
		};

		Cancel.prototype.__CANCEL__ = true;

		module.exports = Cancel;


		/***/
}),
/* 31 */
/***/ (function (module, exports, __webpack_require__) {

		'use strict';

		var Cancel = __webpack_require__(30);

		/**
		 * A `CancelToken` is an object that can be used to request cancellation of an operation.
		 *
		 * @class
		 * @param {Function} executor The executor function.
		 */
		function CancelToken(executor) {
			if (typeof executor !== 'function') {
				throw new TypeError('executor must be a function.');
			}

			var resolvePromise;
			this.promise = new Promise(function promiseExecutor(resolve) {
				resolvePromise = resolve;
			});

			var token = this;
			executor(function cancel(message) {
				if (token.reason) {
					// Cancellation has already been requested
					return;
				}

				token.reason = new Cancel(message);
				resolvePromise(token.reason);
			});
		}

		/**
		 * Throws a `Cancel` if cancellation has been requested.
		 */
		CancelToken.prototype.throwIfRequested = function throwIfRequested() {
			if (this.reason) {
				throw this.reason;
			}
		};

		/**
		 * Returns an object that contains a new `CancelToken` and a function that, when called,
		 * cancels the `CancelToken`.
		 */
		CancelToken.source = function source() {
			var cancel;
			var token = new CancelToken(function executor(c) {
				cancel = c;
			});
			return {
				token: token,
				cancel: cancel
			};
		};

		module.exports = CancelToken;


		/***/
}),
/* 32 */
/***/ (function (module, exports) {

		'use strict';

		/**
		 * Syntactic sugar for invoking a function and expanding an array for arguments.
		 *
		 * Common use case would be to use `Function.prototype.apply`.
		 *
		 *  ```js
		 *  function f(x, y, z) {}
		 *  var args = [1, 2, 3];
		 *  f.apply(null, args);
		 *  ```
		 *
		 * With `spread` this example can be re-written.
		 *
		 *  ```js
		 *  spread(function(x, y, z) {})([1, 2, 3]);
		 *  ```
		 *
		 * @param {Function} callback
		 * @returns {Function}
		 */
		module.exports = function spread(callback) {
			return function wrap(arr) {
				return callback.apply(null, arr);
			};
		};


		/***/
})
/******/]);
//# sourceMappingURL=application.js.map