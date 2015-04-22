angular.module('textaculous')
	.directive('highlighted', [
		'textaculous.drop',
		function(dropService) {
		return {
			restrict: 'C',
			scope:{},
			require:'^textaculous',
			link: ($scope, $node, attributes, textaculous) => {
				dropService.pop({node:$node[0]}, textaculous.$$tetherContent);
			}
		};
	}]);