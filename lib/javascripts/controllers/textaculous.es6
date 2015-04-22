angular.module('textaculous')
	.controller('textaculous.controllers.textaculous', function() {

		this.$$ranges = [];
		this.$$highlighted = [];
		this.$$highlightedIndexes = [];
		this.$$textarea = undefined;
		this.$$tetherContent = undefined;
		this.$$currentIndex = -1;
	})