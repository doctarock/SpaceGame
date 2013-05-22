//get mouse as related to canvas
Element.prototype.leftTopScreen = function () {
	var x = this.offsetLeft;
	var y = this.offsetTop;

	var element = this.offsetParent;

	while (element !== null) {
		x = parseInt (x) + parseInt (element.offsetLeft);
		y = parseInt (y) + parseInt (element.offsetTop);

		element = element.offsetParent;
	}

	return new Array (x, y);
} 