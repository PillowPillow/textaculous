angular.module('textaculous')
	.service('textaculous.parser', [
		'textaculous.constants.config',
		function(CONFIG) {

		var regex = generateRegex(CONFIG.tag);

		this.parse = parse;
		this.isInRange = isInRange;

		function isInRange(ranges, {start, end}) {
			var searchIndex = -1;
			for(var index = 0; index<ranges.length; index++)
				if(ranges[index][0] <= start && end <= ranges[index][1]) {
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

			for(var i = 0; i<splitted.length; i++) {
				if(splitted[i][0] === CONFIG.tag && splitted[i].length > 1) {
					highlighted.push(splitted[i]);
					highlightedIndexes.push(i);
					highlightedRanges.push([$length, $length+splitted[i].length]);
				}
				$length += splitted[i].length;
			}

			return {splitted, highlightedRanges, highlighted, highlightedIndexes};
		}

		function splitRaw(string) {
			return string.split(regex);
		}

		function generateRegex(tag) {
		    return new RegExp("(\\"+tag+"[^\\s]+)");
		}
	}]);