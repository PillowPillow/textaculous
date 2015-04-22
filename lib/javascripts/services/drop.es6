angular.module('textaculous')
	.service('textaculous.drop', [
	'textaculous.parser',
	function(parserService) {
		var currentTether,
			currentTarget;

		this.trigger = trigger;
		this.pop = pop;
		this.close = close;

		this._init = _init;

		this._init();

		function trigger({highlightedRanges,positionStart,positionEnd,event,node},content) {

			positionEnd = positionEnd || positionStart;

			var index = parserService.isInRange(highlightedRanges, {start:positionStart, end:positionEnd});
			if(!!~index) {
				this.pop({index, node}, content);
				event && event.stopPropagation();
			}
			else
				this.close();

			return index;
		}

		function pop({index, node}, content) {

			var newTarget = index === undefined ? node : node.querySelectorAll('.highlighted')[index];
			if(!newTarget || newTarget === currentTarget)
				return;

			if(currentTether)
				currentTether.destroy();

			currentTether = new Drop({
				target: newTarget,
				content: content,
				classes: 'drop-theme-arrows-bounce',
				position: 'bottom left',
				constrainToWindow: false,
				constrainToScrollParent: false,
				openOn: ''
			});

			currentTarget = newTarget;
			currentTether.content.addEventListener('click', (event) => event.stopPropagation());
			currentTether.setupTether();
			currentTether.open();
		}

		function close() {
			if(currentTether) {
				currentTarget = null;
				currentTether.close();
			}
		}

		function _init() {
			var html = document.querySelector('html');
			html.addEventListener('click', () => this.close());
		}

	}]);