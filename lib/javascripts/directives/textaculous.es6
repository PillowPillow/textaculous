angular.module('textaculous')
	.directive('textaculous', [
	'textaculous.parser',
	'textaculous.drop',
	'$interval',
	function(parserService, dropService, $interval){
		return {
			scope: {
				raw: '=ngModel'
			},
			restrict: 'AE',
			templateUrl: '../lib/templates/textaculous.jade',
			controller: 'textaculous.controllers.textaculous',
			controllerAs: 'Textaculous',
			require: ['textaculous','ngModel'],
			transclude: true,
			compile: () => ($scope, $node, attributes, [textaculous,ngModel], transclude) => {

				var node = $node[0];

				textaculous.text = [];
				textaculous.$$ranges = [];
				textaculous.$$highlighted = [];
				textaculous.$$textarea = node.querySelector('textarea');
				textaculous.$$tetherContent = node.querySelector('.tether-pop');
				textaculous.$$currentIndex = -1;

				Object.defineProperties(textaculous, {
					range: {
						get: () => !!~textaculous.$$currentIndex ? textaculous.$$ranges[textaculous.$$currentIndex] : undefined,
					},
					current: {
						get: () => !!~textaculous.$$currentIndex ? textaculous.$$highlighted[textaculous.$$currentIndex].slice(1) : '',
						set: (value) => !!~textaculous.$$currentIndex && replaceHighlighted(value)
					}
				});

				$scope.selectText = (event) =>
					textaculous.$$currentIndex = dropService.trigger({
						highlightedRanges:textaculous.$$ranges,
						positionStart:textaculous.$$textarea.selectionStart,
						positionEnd:textaculous.$$textarea.selectionEnd,
						event,
						node
					}, textaculous.$$tetherContent);

				$scope.isHighlighted = (index) => !!~textaculous.$$highlightedIndexes.indexOf(index);

				$scope.$watch('raw', (value) => {

					var {highlightedRanges, splitted, highlighted, highlightedIndexes} = parserService.parse(value);

					textaculous.text = splitted;
					textaculous.$$ranges = highlightedRanges;
					textaculous.$$highlighted = highlighted;
					textaculous.$$highlightedIndexes = highlightedIndexes;

					var index = parserService.isInRange(textaculous.$$ranges, {
							start:textaculous.$$textarea.selectionStart,
							end:textaculous.$$textarea.selectionEnd
						});

					if(!~index) {
						dropService.close();
						textaculous.$$currentIndex = -1;
					}
					else
						textaculous.$$currentIndex = index;
				});

				transclude($scope, (clone) => angular.element(textaculous.$$tetherContent).append(clone));

				function replaceHighlighted(value) {
				    return $scope.raw = `${$scope.raw.slice(0, textaculous.$$ranges[textaculous.$$currentIndex][0]+1)}${value}${$scope.raw.slice(textaculous.$$ranges[textaculous.$$currentIndex][1])}`;
				}
			}
		};
	}]);