function convertColor() {
	var color_input = document.getElementById("color-input").value;

	if (isValidHex(color_input)) {
		fromHex(color_input);
	} else if (isValidRgb(color_input)) {
		fromRgb(color_input);
	} else if (isValidHsl(color_input)) {
		fromHsl(color_input);
	} else {
		colorError();
	}
}

function fromHex(color) {
	console.log("fromHex");

	if (color.charAt(0) !== '#') {
		color = '#' + color;
	}

	function hexToR(hex) {
		return parseInt(hex.substring(1,3), 16);
	}
	function hexToG(hex) {
		return parseInt(hex.substring(3,5), 16);
	}
	function hexToB(hex) {
		return parseInt(hex.substring(5,7), 16);
	}

	document.getElementById("result-hex").value = color;
	document.getElementById("result-rgb").value = "rgb(" + hexToR(color) + ", " + hexToG(color) + ", " + hexToB(color) + ")";
	document.getElementById("result-hsl").value = "";
	colorSuccess(color);
}

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

function fromHsl(color) {
	console.log("fromHsl");
}

function isValidHex(color) {
	return color.match(/^#[a-f0-9]{6}$/i) !== null || color.match(/\b[a-f0-9]{6}\b/gi) !== null;
}

function isValidRgb(color) {
	var match = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
	return match.exec(color) !== null;
}

function isValidHsl(color) {
	return;
}

function colorSuccess(color) {
	document.body.style.backgroundColor = color;
	document.getElementById("results-container").style.visibility = "visible";
	document.getElementById("color-error").style.display = "none";
}

function colorError() {
	document.getElementById("results-container").style.visibility = "hidden";
	document.getElementById("color-error").style.display = "block";
}

document.getElementById("color-input").addEventListener("keyup", function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        document.getElementById("color-button").click();
    }
});

var resultParent = document.querySelector("#results-container");
resultParent.addEventListener("click", copyToClipboard, false);
 
function copyToClipboard(e) {
    if (e.target !== e.currentTarget && ((e.target.id == "result-hex-btn") || (e.target.id == "result-rgb-btn") || (e.target.id == "result-hsl-btn"))) {
        var clickedBtnId = e.target.id;
        if (clickedBtnId.indexOf("hex") != -1) {
        	console.log("hex");

			var copyInput = document.querySelector('#result-hex');
			copyInput.select();

			try {
			    var successful = document.execCommand('copy');
			    var msg = successful ? 'successful' : 'unsuccessful';
			    console.log('Copying text command was ' + msg);
			} catch (err) {
			    console.log('Oops, unable to copy');
			}
        } else if (clickedBtnId.indexOf("rgb") != -1) {
			console.log("rgb");

			var copyInput = document.querySelector('#result-rgb');
			copyInput.select();

			try {
			    var successful = document.execCommand('copy');
			    var msg = successful ? 'successful' : 'unsuccessful';
			    console.log('Copying text command was ' + msg);
			} catch (err) {
			    console.log('Oops, unable to copy');
			}
        } else if (clickedBtnId.indexOf("hsl") != -1) {
        	console.log("hsl");
        } else {
        	console.log("nothing");
        }
    } else {
    	console.log("Oups");
    }
    e.stopPropagation();
}