// textaculous
// version: 0.1.0
// author: 
// generated: Wed Apr 22 2015 15:17:53 GMT+0200 (Paris, Madrid (heure d’été))
// Autogenerated, do not edit. All changes will be undone.
(function (window,document,angular) {

	" use strict; ";
	angular.module("textaculous", []);
	angular.module("textaculous").constant("textaculous.constants.config", {
		tag: "@"
	});
	angular.module('textaculous').run(['$templateCache', function($templateCache) {
		$templateCache.put('../lib/templates/textaculous.jade',
			'<section class="front">\n' +
			'  <textarea ng-click="selectText($event)" ng-model="raw" ng-trim="false" wrap="hard"></textarea>\n' +
			'</section>\n' +
			'<section class="back">\n' +
			'  <pre class="highlight"><span ng-repeat="part in Textaculous.text track by $index"><span ng-if="!isHighlighted($index)">{{part}}</span><span ng-if="isHighlighted($index)" class="highlighted">{{part}}</span></span></pre>\n' +
			'</section>\n' +
			'<section class="hidden-container">\n' +
			'  <article class="tether-pop"></article>\n' +
			'</section>');
	}]);
	
	angular.module("textaculous").service("textaculous.drop", ["textaculous.parser", function (parserService) {
		var currentTether, currentTarget;
	
		this.trigger = trigger;
		this.pop = pop;
		this.close = close;
	
		this._init = _init;
	
		this._init();
	
		function trigger(_ref, content) {
			var highlightedRanges = _ref.highlightedRanges;
			var positionStart = _ref.positionStart;
			var positionEnd = _ref.positionEnd;
			var event = _ref.event;
			var node = _ref.node;
	
			positionEnd = positionEnd || positionStart;
	
			var index = parserService.isInRange(highlightedRanges, { start: positionStart, end: positionEnd });
			if (!! ~index) {
				this.pop({ index: index, node: node }, content);
				event && event.stopPropagation();
			} else this.close();
	
			return index;
		}
	
		function pop(_ref, content) {
			var index = _ref.index;
			var node = _ref.node;
	
			var newTarget = index === undefined ? node : node.querySelectorAll(".highlighted")[index];
			if (!newTarget || newTarget === currentTarget) {
				return;
			}if (currentTether) currentTether.destroy();
	
			currentTether = new Drop({
				target: newTarget,
				content: content,
				classes: "drop-theme-arrows-bounce",
				position: "bottom left",
				constrainToWindow: false,
				constrainToScrollParent: false,
				openOn: ""
			});
	
			currentTarget = newTarget;
			currentTether.content.addEventListener("click", function (event) {
				return event.stopPropagation();
			});
			currentTether.setupTether();
			currentTether.open();
		}
	
		function close() {
			if (currentTether) {
				currentTarget = null;
				currentTether.close();
			}
		}
	
		function _init() {
			var _this = this;
	
			var html = document.querySelector("html");
			html.addEventListener("click", function () {
				return _this.close();
			});
		}
	}]);
	angular.module("textaculous").service("textaculous.parser", ["textaculous.constants.config", function (CONFIG) {
	
		var regex = generateRegex(CONFIG.tag);
	
		this.parse = parse;
		this.isInRange = isInRange;
	
		function isInRange(ranges, _ref) {
			var start = _ref.start;
			var end = _ref.end;
	
			var searchIndex = -1;
			for (var index = 0; index < ranges.length; index++) if (ranges[index][0] <= start && end <= ranges[index][1]) {
				searchIndex = index;
				break;
			}
	
			return searchIndex;
		}
	
		function parse(value) {
	
			var splitted = splitRaw(value),
			    $length = 0,
			    highlightedRanges = [],
			    highlightedIndexes = [],
			    highlighted = [];
	
			for (var i = 0; i < splitted.length; i++) {
				if (splitted[i][0] === CONFIG.tag) {
					highlighted.push(splitted[i]);
					highlightedIndexes.push(i);
					highlightedRanges.push([$length, $length + splitted[i].length]);
				}
				$length += splitted[i].length;
			}
	
			return { splitted: splitted, highlightedRanges: highlightedRanges, highlighted: highlighted, highlightedIndexes: highlightedIndexes };
		}
	
		function splitRaw(string) {
			return string.split(regex);
		}
	
		function generateRegex(tag) {
			return new RegExp("(\\" + tag + "[^\\s]+)");
		}
	}]);
	angular.module("textaculous").controller("textaculous.controllers.textaculous", function () {
	
		this.$$ranges = [];
		this.$$highlighted = [];
		this.$$highlightedIndexes = [];
		this.$$textarea = undefined;
		this.$$tetherContent = undefined;
		this.$$currentIndex = -1;
	});
	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };
	
	angular.module("textaculous").directive("textaculous", ["textaculous.parser", "textaculous.drop", "$interval", function (parserService, dropService, $interval) {
		return {
			scope: {
				raw: "=ngModel"
			},
			restrict: "AE",
			templateUrl: "../lib/templates/textaculous.jade",
			controller: "textaculous.controllers.textaculous",
			controllerAs: "Textaculous",
			require: ["textaculous", "ngModel"],
			transclude: true,
			compile: function () {
				return function ($scope, $node, attributes, _ref, transclude) {
					var _ref2 = _slicedToArray(_ref, 2);
	
					var textaculous = _ref2[0];
					var ngModel = _ref2[1];
	
					var node = $node[0];
	
					textaculous.text = [];
					textaculous.$$ranges = [];
					textaculous.$$highlighted = [];
					textaculous.$$textarea = node.querySelector("textarea");
					textaculous.$$tetherContent = node.querySelector(".tether-pop");
					textaculous.$$currentIndex = -1;
	
					Object.defineProperties(textaculous, {
						range: {
							get: function () {
								return !! ~textaculous.$$currentIndex ? textaculous.$$ranges[textaculous.$$currentIndex] : undefined;
							} },
						current: {
							get: function () {
								return !! ~textaculous.$$currentIndex ? textaculous.$$highlighted[textaculous.$$currentIndex].slice(1) : "";
							},
							set: function (value) {
								return !! ~textaculous.$$currentIndex && replaceHighlighted(value);
							}
						}
					});
	
					$scope.selectText = function (event) {
						return textaculous.$$currentIndex = dropService.trigger({
							highlightedRanges: textaculous.$$ranges,
							positionStart: textaculous.$$textarea.selectionStart,
							positionEnd: textaculous.$$textarea.selectionEnd,
							event: event,
							node: node
						}, textaculous.$$tetherContent);
					};
	
					$scope.isHighlighted = function (index) {
						return !! ~textaculous.$$highlightedIndexes.indexOf(index);
					};
	
					$scope.$watch("raw", function (value) {
						var _parserService$parse = parserService.parse(value);
	
						var highlightedRanges = _parserService$parse.highlightedRanges;
						var splitted = _parserService$parse.splitted;
						var highlighted = _parserService$parse.highlighted;
						var highlightedIndexes = _parserService$parse.highlightedIndexes;
	
						textaculous.text = splitted;
						textaculous.$$ranges = highlightedRanges;
						textaculous.$$highlighted = highlighted;
						textaculous.$$highlightedIndexes = highlightedIndexes;
	
						var index = parserService.isInRange(textaculous.$$ranges, {
							start: textaculous.$$textarea.selectionStart,
							end: textaculous.$$textarea.selectionEnd
						});
	
						if (! ~index) {
							dropService.close();
							textaculous.$$currentIndex = -1;
						} else textaculous.$$currentIndex = index;
					});
	
					transclude($scope, function (clone) {
						return angular.element(textaculous.$$tetherContent).append(clone);
					});
	
					function replaceHighlighted(value) {
						return $scope.raw = "" + $scope.raw.slice(0, textaculous.$$ranges[textaculous.$$currentIndex][0] + 1) + "" + value + "" + $scope.raw.slice(textaculous.$$ranges[textaculous.$$currentIndex][1]);
					}
				};
			}
		};
	}]);
	angular.module("textaculous").directive("highlighted", ["textaculous.drop", function (dropService) {
		return {
			restrict: "C",
			scope: {},
			require: "^textaculous",
			link: function ($scope, $node, attributes, textaculous) {
				dropService.pop({ node: $node[0] }, textaculous.$$tetherContent);
			}
		};
	}]);

})(window,window.document,window.angular);