// main dispatching function
function convertColor() {
	var color_input = document.getElementById("color-input").value;
	if 		(isValidHex(color_input)) fromHex(color_input);
	else if (isValidRgb(color_input)) fromRgb(color_input);
	else if (isValidHsl(color_input)) fromHsl(color_input);
	else 	colorError();
}

// check for valid input
function isValidHex(color) {
	return color.match(/^#[a-f0-9]{6}$/i) !== null || color.match(/\b[a-f0-9]{6}\b/gi) !== null || 
		color.match(/^#[a-f0-9]{3}$/i) !== null || color.match(/\b[a-f0-9]{3}\b/gi) !== null;
}

function isValidRgb(color) {
	var match = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
	return match.exec(color) !== null ;
}

function isValidHsl(color) {
	return;
}



// Handling the conversion:
// from HEX
function fromHex(color) {

	if (color.charAt(0) !== '#') color = '#' + color;

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

	function setRGBfromHEX(color, mini) {
		var r = hexToR(color, mini);
		var g = hexToG(color, mini);
		var b = hexToB(color, mini);
		return [r, g, b];
	}

	// setting HEX
	document.getElementById("result-hex").value = color;


	// setting RGB depending on minified HEX or not
	var rgb;
	if (color.match(/^#[a-f0-9]{3}$/i) !== null) rgb = setRGBfromHEX(color, true);
	else rgb = setRGBfromHEX(color, false);

	document.getElementById("result-rgb").value = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";


	// setting HSL
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

	h = Math.round(h * 60)
	h_f = h < 0 ? h + 360 : h;
	s_f = Math.round(s * 100) + '%';
	l_f = Math.round(l * 100) + '%';

	document.getElementById("result-hsl").value = "hsl(" + h_f + ", " + s_f + ", " + l_f + ")";


	colorSuccess(color);
}

// from RGB
function fromRgb(color) {
	console.log("fromRgb");
	document.getElementById("result-rgb").value = color;
	colorSuccess(color);

	function rgbToHex(R,G,B) {
		return toHex(R)+toHex(G)+toHex(B);
	}
	function toHex(n) {
	 n = parseInt(n,10);
	 if (isNaN(n)) return "00";
	 n = Math.max(0,Math.min(n,255));
	 return "0123456789ABCDEF".charAt((n-n%16)/16)
	      + "0123456789ABCDEF".charAt(n%16);
	}

}

// from HSL
function fromHsl(color) {
	console.log("fromHsl");
}



// success and error
function colorSuccess(color) {
	document.body.style.backgroundColor = color;
	document.getElementById("results-container").style.visibility = "visible";
	document.getElementById("color-error").style.display = "none";
}

function colorError() {
	document.getElementById("results-container").style.visibility = "hidden";
	document.getElementById("color-error").style.display = "block";
}



// listener for Enter key
document.getElementById("color-input").addEventListener("keyup", function(e) {
    e.preventDefault();
    if (e.keyCode == 13) document.getElementById("color-button").click();
});



// Copy to clipboard feature
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



// input autofocus onload
window.onload = function(){
	var color_input = document.getElementById("color-input");
  	color_input.focus();
  	color_input.select();
}