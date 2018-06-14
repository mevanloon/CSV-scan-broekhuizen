var d = document.datainput;
var submitting = 0;

function dodebug(txt) {
	var o = document.getElementById('debugtxt');
	if (!o)
		return;
	document.getElementById('debugtxt').value += txt + '\n';
}

function FireEvent(eventName, eventPar) {
	//dodebug('FireEvent:' + eventName + ':' + eventPar);
	switch (eventName) {
		case 'toggle' : Toggle(eventPar); break;
		case 'keypress': KeyPress(eventPar); Changed(eventPar); break; // NOTE: THE CHANGED EVENT IS ADDED AND CURRENTLY IN BETA!!!!
		case 'change' : Changed(eventPar); break;
		case 'click' : Changed(eventPar); break;
		case 'blur' : Blur(eventPar); break;
	}
	FireUserEvent(eventName, eventPar); // Provide a hook for user-script
}

function OptionChanged(eventPar) {
	//dodebug('OptionChanged:' + eventPar);
	var o = eval("d." + eventPar);
	if (o && o.checked) {
		var n = parseInt(eval("d." + eventPar).value);
		SwapOptionText("E" + eval("d." + eventPar).name + n);
		// all other options get de-selected so need a change-event:
		var pos = eventPar.indexOf('A');
		var base = eventPar.substring(0, pos);
		var val = parseInt(eventPar.substr(pos + 1));
		var len = eval("d." + base + "A").length;
		for (var cnt=0; cnt<len; cnt++) {
			var o2 = eval("d." + base + "A[" + cnt + "]");
			if (o2 == o)
				continue;
			FireEvent('change', base + "A[" + cnt + "]");
		}
	}
}

function SwapCheckboxText(eventPar) {
	//dodebug('SwapCheckboxText:' + eventPar);
	if (eval("d." + eventPar).value != '') {
		var o = eval("d." + eventPar.substr(1));
		if (!o.checked)
		FireEvent('toggle', o.name);
	}
}

function CheckboxChanged(eventPar) {
	//dodebug('CheckboxChanged:' + eventPar);
	if (!eval('d.' + eventPar).checked) {
		var o = eval('d.E' + eventPar);
		if (o) {
			o.value = '';
		}
		return;
	}
	var pos = eventPar.indexOf('A');
	var base = eventPar.substr(1, pos - 1);
	try {
		c = new String(eval('Q' + base + 'Exclusives'));
	}
	catch(e) { return; }
	if (c) {
		a = c.split(";");
		for (var t=1; t<a.length; t++) {
			o = eval('d.' + a[t]);
			if (o.checked && (o.name != eventPar))
				FireEvent('toggle', o.name);
		}
	}
}

function Toggle(eventPar) {
	dodebug('Toggle:' + eventPar);
	var o = eval("d." + eventPar);
	if (o) {
		dodebug('click:' + eventPar);
		o.click()
	} else { // single response has only one option!
		eval('d.' + eventPar.substr(0, eventPar.length - 3)).checked = true;
	}
}

function getRadioValue(obj) {
	if (!obj[0]) return(obj.checked);
	for (var i=0; i < obj.length; i++)
	if (obj[i].checked)
		return obj[i].value;
	return 0;
}

function setRadioValue(obj, val) {
	for (var i=0; i < obj.length; i++) {
		if (val == (i + 1)) {
			if (obj[i].checked)
				return;
			if (obj[i])
				obj[i].click();
		} else
			obj[i].checked = false;
	}
}

function SwapOptionText(eventPar) {
	//dodebug('SwapOptionText:' + eventPar);
	o = eval("d.H" + eventPar);
	if (o)
		o.value = eval("d." + eventPar).value;
	var pos = eventPar.indexOf('A');
	var base = eventPar.substring(1, pos);
	var val = parseInt(eventPar.substr(pos + 1));
	var len = eval("d." + base + "A").length;
	if (o && o.value != '') {
		for (var cnt=0; cnt<=len; cnt++) {
			o = eval("d." + base + "A[" + cnt + "]");
			if (!o)	break;
			if (o.value == val) {
				o.click();
				break;
			}
		}
	}
	for (var cnt=0; cnt<eval("d." + base + "A.length"); cnt++) {
		var o = eval("d." + base + "A[" + cnt + "]");
		var cur = o.value;
		if (cur != val) {
			var o2 = eval("d.E" + base + "A"  + cur);
			if (o2)
				o2.value = "";
		}
	}
}

function Swap(eventPar) {
	//dodebug('Swap:' + eventPar);
	var o = eval("d.H" + eventPar);
	o.value = eval("d." + eventPar).value;
	var p = eval('d.' + eventPar + 'Empty');
	if (!p)
		return;
	if (!p.length) {
		if (o.value != '' && p.checked)
			p.click();
	} else {
		for (var cnt = 0; cnt < p.length; cnt++) {
			var o = p[cnt];
			if (o.checked) {
				o.checked = false;
				o.onclick()?o.onclick():'';
			}
		}
	}
}

function ClearTxt(eventPar) {
	//dodebug('ClearTxt:' + eventPar);
	var o = eval('d.H' + eventPar.substr(0, eventPar.indexOf('Empty')));
	var c = eval('d.' + eventPar);
	o.value = eval('d.' + eventPar + '.checked')?c.value:'';
	if (c.checked)
		eval('d.' + eventPar.substr(0, eventPar.indexOf('Empty'))).value = '';
}


function HitExclusive(eventPar) {
	//dodebug('HitExclusive:' + eventPar);
	if (!eval('d.' + eventPar).checked)
		return;
	var pos = eventPar.indexOf('A');
	var base = eventPar.substr(0, pos);
	var max = parseInt(eval(base + 'Max'));
	for (var cnt=1; cnt<=max; cnt++) {
		var o = eval('d.' + base + 'A' + cnt);
		if (o && o.name != eventPar && o.checked)
				FireEvent('toggle', o.name);
	}
}

function keyDown(eventPar) {
	FireEvent('keypress', eventPar);
}

function preloadImages() {
	var d=document; if(d.images){ if(!d.p) d.p=new Array();
	var i,j=d.p.length,a=preloadImages.arguments; for(var i=0; i<a.length; i++)
	if (a[i].indexOf("#")!=0){ d.p[j]=new Image; d.p[j++].src=a[i];}}
}

function validateCheckboxes(name, nr) {
	for (var i=1; i <= nr; i++) {
		if (eval('d.' + name + i) && eval('d.' + name + i).checked)
			return true;
	}
	return false;
}

function countCheckboxes(name, nr, mincnt, maxcnt) {
	var cnt = 0;
	for (var i=1; i <= nr; i++)
		if (eval('d.' + name + i) && eval('d.' + name + i).checked) {
			if(eval('d.' + name + i).value == 99999997) return true;
			cnt++;
		}
	if (mincnt > 0 && cnt < mincnt) { return false; }
	if (maxcnt > 0 && cnt > maxcnt) { return false; }
	return true;
}

var propagating = false;

function PropagateDontKnow(eventPar) {
	if (!eval('d.' + eventPar).checked)
		return;
	if (propagating) {
		return;
	}
	propagating = true;
	var pos = eventPar.indexOf('S');
	var base = eventPar.substr(1, pos - 1);
	c = new String(eval('Q' + base + 'Propagate'));
	a = c.split(";");
	var llGo = false;
	for (var t=1; t<a.length; t++) {
		if (llGo) {
			o = eval('d.' + a[t]);
			if (!o.checked) o.click(); //FireEvent('toggle', o.name);
		}
		if (eventPar == a[t]) {
			llGo = true;
		}
	}
	propagating = false;
}

if (document.layers) {
//	document.captureEvents(Event.KEYDOWN);
}

//document.onkeydown = keyDown;

function syncPic(eventPar, img1, img2, class1, class2) {
	//dodebug('syncPic:' + eventPar);
	var o = eval("d." + eventPar);
	var picID = 'img' + eventPar.replace('[', '').replace(']', '');
	var img = document.getElementById(picID);
	if (eval("d." + eventPar + ".checked")) {
		if (img.className.toLowerCase() != class2.toLowerCase())
			img.className = class2;
		var src = eval('document.' + picID + '_2').src;
		if (img.src != src)
			img.src = src;
		img.blur();
		var pos = eventPar.indexOf('A');
		var base = eventPar.substring(0, pos);
		var val = parseInt(eventPar.substr(pos + 1));
		if (!eval("d." + base + "A")) // multiple response
			return;
		var len = eval("d." + base + "A").length;
		for (var cnt=0; cnt<len; cnt++) {
			var o2 = eval("d." + base + "A[" + cnt + "]");
			if (o2 == o)
				continue;
			FireEvent('change', base + "A[" + cnt + "]");
		}
	} else {
		if (img.className.toLowerCase() != class1.toLowerCase())
			img.className = class1;
		var src = eval('document.' + picID + '_1').src;
		if (img.src != src)
			img.src = src;
	}
}

function initPic(picID, img1, img2, activeImage) {
	var img = document.getElementById(picID);

	var varName1 = 'document.' + picID + '_1';
	var cmd = varName1 + '= new Image();';
	eval(cmd);
	eval(varName1).src = img1;

	var varName2 = 'document.' + picID + '_2';
	var cmd = varName2 + '= new Image();';
	eval(cmd);
	eval(varName2).src = img2;

	img.src = eval(activeImage=='1'?varName1:varName2).src;
	img.style.display = 'block';
}

function getStyleVal(source_id, IEStyleName, CSSStyleName) {
	var elem = document.getElementById(source_id);
	if (elem.currentStyle) {
		result = elem.currentStyle[IEStyleName];
	} else if (window.getComputedStyle) {
		var compStyle = window.getComputedStyle(elem, "");
		result = compStyle.getPropertyValue(CSSStyleName);
	} else {
		result = "";
	}
	return result;
}

function getVal(id) {
	value = parseFloat(document.getElementById(id).value.replace(',', '.'));
	if (isNaN(value))
		return 0;
	return value;
}

function setVal(id, value) {
	o = document.getElementById(id);
	value = value.toString(); // else numeric 0 equals ''
	if (o.value != value) {
		o.value = value;
		if (o.onchange)
			o.onchange();
	}
}

function setTxt(id, txt) {
	o = document.getElementById(id);
	txt = txt.toString();
	if (o.value != txt) {
		o.value = txt;
		if (o.onchange)
			o.onchange();
	}
}

function runOnloadHooks() {
	if (!window.onloadHooks)
		return;
	for (var cnt = 0; cnt < window.onloadHooks.length; cnt++) {
		if (window.onloadHooks[cnt]) {
			var func = window.onloadHooks[cnt];
			window.onloadHooks[cnt] = null;
			func();
		}
	}
}

function registerOnloadHook(func) {
	if (!window.onloadHooks) {
		window.onloadHooks = new Array();
		if (window.onload && (window.onload!=runOnloadHooks)) {
			registerOnloadHook(window.onload);
		}
	}
	window.onloadHooks[window.onloadHooks.length] = (typeof func == 'function')?func:new Function(func);
	window.onload = runOnloadHooks;
}

registerOnloadHook(firstTextFocus);

function firstTextFocus() {
	var n = 0;
	while ((n < d.elements.length) && (d.elements[n].type == 'hidden'))
		n++;
	if ((d.elements[n] && d.elements[n].type=="text") || (d.elements[n] && d.elements[n].type=="textarea"))
		if (d.elements[n].className == 'textarea' || d.elements[n].className == 'inputbox')
			d.elements[n].focus();
}

function AutoMaxLen(control, len) {
}
