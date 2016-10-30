function init() {
	function randomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	document.body.style.backgroundColor = "hsl(" + randomInt(0, 359) + ", 50%, 50%)";
}

init();


// validation of color input
function isValidHex(color) {
	return color.match(/^#[a-f0-9]{6}$/i) !== null || color.match(/^\b[a-f0-9]{6}$\b/gi) !== null || 
		color.match(/^#[a-f0-9]{3}$/i) !== null || color.match(/^\b[a-f0-9]{3}$\b/gi) !== null;
}

function isValidRgb(color) {
	var r1 = /rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)/;
	var r2 = /^([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})$/;
	return r1.exec(color) !== null || r2.exec(color) !== null;
}

function isValidHsl(color) {
	var h1 = /hsl\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)/;
	var h2 = /hsl\(([0-9]{1,3}),([0-9]{1,3}%),([0-9]{1,3}%)\)/;
	var h3 = /^([0-9]{1,3}),([0-9]{1,3}%),([0-9]{1,3}%)$/;
	return h1.exec(color) !== null || h2.exec(color) !== null || h3.exec(color) !== null;
}


// main conversion helpers
function rgbToHex(v) {
	v = parseInt(v, 10).toString(16);
    return v.length === 1 ? '0' + v : v;
}

function rgbToHsl(rgb) {
	for (i = 0; i < rgb.length; i++) {
		rgb[i] /= 255;
	}

	var max = Math.max.apply(Math, rgb);
	var min = Math.min.apply(Math, rgb);
	var h, s, l, h_f, s_f, l_f;
	l = (max + min) / 2;

	if (max == min) h = s = 0;
	else {
		if (l < 0.5) s = (max - min) / (max + min);
		else s = (max - min) / (2 - max - min);

		if 		(max == rgb[0]) h = (rgb[1] - rgb[2]) / (max - min);
		else if (max == rgb[1]) h = 2 + (rgb[2] - rgb[0]) / (max - min);
		else if (max == rgb[2]) h = 4 + (rgb[0] - rgb[1]) / (max - min);
	}

	h = Math.round(h * 60);
	h_f = h < 0 ? h + 360 : h;
	s_f = Math.round(s * 100) + '%';
	l_f = Math.round(l * 100) + '%';

	return [h_f, s_f, l_f];
}

function hexToRgb(color, mini) {
	function hexToR(hex, mini) {
		if (mini) {
			var r = hex.substring(1,2);
			return parseInt(r+r, 16);
		} else return parseInt(hex.substring(1,3), 16);
	}

	function hexToG(hex, mini) {
		if (mini) {
			var g = hex.substring(2,3);
			return parseInt(g+g, 16);
		} else return parseInt(hex.substring(3,5), 16);
	}

	function hexToB(hex, mini) {
		if (mini) {
			var b = hex.substring(3,4);
			return parseInt(b+b, 16);
		} else return parseInt(hex.substring(5,7), 16);
	}

	var r = hexToR(color, mini);
	var g = hexToG(color, mini);
	var b = hexToB(color, mini);
	return [r, g, b];
}



// Handling the conversion:
// from HEX
function fromHex(color) {

	if (color.charAt(0) !== '#') color = '#' + color;


	// setting HEX
	document.getElementById("result-hex").value = color;


	// setting RGB depending on minified HEX or not
	var rgb;
	if (color.match(/^#[a-f0-9]{3}$/i) !== null) rgb = hexToRgb(color, true);
	else rgb = hexToRgb(color, false);

	document.getElementById("result-rgb").value = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";


	// setting HSL
	var hsl = rgbToHsl(rgb);
	document.getElementById("result-hsl").value = "hsl(" + hsl[0] + ", " + hsl[1] + ", " + hsl[2] + ")";


	colorSuccess(color);
}

// from RGB
function fromRgb(color) {

	var rgb, r, g, b;
	if (/rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)/.exec(color) !== null) {
		rgb = color.substring(4, color.length-1).split(',');
	} else if (/^([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})$/.exec(color) !== null) {
		rgb = color.split(',');
	}

	r = rgb[0];
	g = rgb[1];
	b = rgb[2];

	if ((r && g && b) > 255) colorError();
	else {

		// setting HEX
		var hex = '#' + rgbToHex(r).toUpperCase() + rgbToHex(g).toUpperCase() + rgbToHex(b).toUpperCase();
		document.getElementById("result-hex").value = hex;

		// setting RGB
		var new_rgb = "rgb(" + r + ", " + g + ", " + b + ")"
		document.getElementById("result-rgb").value = new_rgb;

		// setting HSL
		var hsl = rgbToHsl(rgb);
		document.getElementById("result-hsl").value = "hsl(" + hsl[0] + ", " + hsl[1] + ", " + hsl[2] + ")";

		colorSuccess(new_rgb);
	}
}

// from HSL
function fromHsl(color) {

	var hsl, h, s, l;
	if (/hsl\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)/.exec(color) !== null) {
		hsl = color.substring(4, color.length-1).split(',');
	} else if (/hsl\(([0-9]{1,3}),([0-9]{1,3}%),([0-9]{1,3}%)\)/.exec(color) !== null) {
		hsl = color.substring(4, color.length-1).split(',');
		hsl[1] = hsl[1].substring(0, hsl[1].length-1);
		hsl[2] = hsl[2].substring(0, hsl[2].length-1);
	} else if (/^([0-9]{1,3}),([0-9]{1,3}%),([0-9]{1,3}%)$/.exec(color) !== null) {
		hsl = color.split(',');
		hsl[1] = hsl[1].substring(0, hsl[1].length-1);
		hsl[2] = hsl[2].substring(0, hsl[2].length-1);
	}

	h = hsl[0];
	s = hsl[1];
	l = hsl[2];

	if ((h > 359) || ((s && l) > 100)) colorError();
	else {

		// setting HSL
		var new_hsl = "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)"
		document.getElementById("result-hsl").value = new_hsl;

		// setting RGB
		var r, g, b;
		if (h == 0 && s == 0) r = g = b = Math.round(l / 100 * 255);
		else {
			h = h / 360;
			s = s / 100;
			l = l / 100;
			
			var t1, t2;
			if (l < 0.5) t1 = l * (1 + s);
			else t1 = l + s - l * s;

			t2 = 2 * l - t1;

			function check1(v) {
				if 		(v < 0) return v + 1;
				else if (v > 1) return v - 1;
				else return v;
			}

			function check2(t, t1, t2) {
				if 		(6 * t < 1) 	return t2 + (t1 - t2) * 6 * t;
				else if (2 * t < 1) 	return t1;
				else if (3 * t < 2) 	return t2 + (t1 - t2) * (0.666 - t) * 6;
				else 					return t2;
			}

			r = Math.round(check2(check1(h + 0.333), t1, t2) * 255);
			g = Math.round(check2(check1(h), t1, t2) * 255);
			b = Math.round(check2(check1(h - 0.333), t1, t2) * 255);
		}

		document.getElementById("result-rgb").value = "rgb(" + r + ", " + g + ", " + b + ")";

		// setting HEX
		var hex = '#' + rgbToHex(r).toUpperCase() + rgbToHex(g).toUpperCase() + rgbToHex(b).toUpperCase();
		document.getElementById("result-hex").value = hex;

		colorSuccess(new_hsl);
	}
}


function convertColor() {
	var color_input = document.getElementById("color-input").value.replace(/ /g, "");
	if 		(isValidHex(color_input)) fromHex(color_input);
	else if (isValidRgb(color_input)) fromRgb(color_input);
	else if (isValidHsl(color_input)) fromHsl(color_input);
	else 	colorError();
}

function colorSuccess(color) {
	document.body.style.backgroundColor = color;
	document.getElementById("results-container").classList.remove("hide-results");
	document.getElementById("color-error").style.display = "none";
}

function colorError() {
	if (document.getElementById("results-container").getAttribute("hide-results") == null) {
		document.getElementById("results-container").classList.add("hide-results");
	}
	document.getElementById("color-error").style.display = "block";
}



document.getElementById("color-input").addEventListener("keyup", function(e) {
    e.preventDefault();
    if (e.keyCode == 13) document.getElementById("color-button").click();
});



// Copy to clipboard
var resultParent = document.querySelector("#results-container");
resultParent.addEventListener("click", copyToClipboard, false);
 
function copyToClipboard(e) {
    if (e.target !== e.currentTarget && ((e.target.id == "result-hex-btn") || 
    		(e.target.id == "result-rgb-btn") || (e.target.id == "result-hsl-btn"))) {

		function toggleCopied() {
			document.getElementById("copied-to-clipboard").classList.toggle('copied-hidden');
		}

		function copyExec(input) {
			input.select();
			try {
			    document.execCommand('copy');
		        toggleCopied();
		        setTimeout(function () {
			    	toggleCopied();
			    }, 750);
			} catch (err) {
				console.log('An error occurred.');
			}
		}

        var clickedBtnId = e.target.id;
        if (clickedBtnId.indexOf("hex") != -1) {
			var copyInput = document.getElementById('result-hex');
			copyExec(copyInput);
        } else if (clickedBtnId.indexOf("rgb") != -1) {
			var copyInput = document.getElementById('result-rgb');
			copyExec(copyInput);
        } else if (clickedBtnId.indexOf("hsl") != -1) {
			var copyInput = document.getElementById('result-hsl');
			copyExec(copyInput);
        }
    }
    e.stopPropagation();
}

function showMore() {
	document.getElementById("error-list").classList.toggle('error-hide');
}


// input autofocus onload
window.onload = function(){
	var color_input = document.getElementById("color-input");
  	color_input.focus();
  	color_input.select();
}