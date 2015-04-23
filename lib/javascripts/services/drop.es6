angular.module('textaculous')
	.service('textaculous.drop', [
		'textaculous.parser',
		'textaculous.constants.config',
		function(parserService, CONFIG) {
			var currentTether,
			currentTarget,
			closeEvents = [];

			this.trigger = trigger;
			this.pop = pop;
			this.close = close;
			this.onClose = onClose;

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
					classes: CONFIG.classes,
					position: CONFIG.position,
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
					execOnClosEvents();
				}
			}

			function execOnClosEvents() {
				for(var i = 0; i<closeEvents.length; i++)
					closeEvents[i].call();
			}

			function onClose(callback) {
				closeEvents.push(callback);
			}

			function _init() {
				var html = document.querySelector('html');
				html.addEventListener('click', () => this.close());
			}

		}]);