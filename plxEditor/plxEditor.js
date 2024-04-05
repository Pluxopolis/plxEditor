/**
 * plxEditor
 *
 * @package PLX
 * @author	Stephane F, fork by Pedro "P3ter" CADETE
 **/
PLXEDITOR={};

function E$(id){return document.getElementById(id)}

PLXEDITOR.editor=function() {

	function create(editorName, textareaId){
		this.path = {
			editor : '../../'+PLXEDITOR_PATH_PLUGINS+'plxEditor/',
			images : '../../'+PLXEDITOR_PATH_PLUGINS+'plxEditor/plxEditor/images/',
			css	   : '../../'+PLXEDITOR_PATH_PLUGINS+'plxEditor/plxEditor/css/',
		}
		this.editor = editorName;
		this.textareaId = textareaId;
		// Chargement des données avec conversion des liens
		//this.textareaValue = this.convertLinks(E$(this.textareaId).value, 0);
		this.textareaValue = E$(this.textareaId).value;
		//
		this.viewSource = false;
		this.viewFullscreen = false;
		// browser detection
		this.IE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
		// EDITOR
		var editor = document.createElement("div");
		editor.id = this.textareaId+"-wysiwyg";
		editor.setAttribute('class', 'wysiwyg');
		editor.innerHTML = this.getEditorHtml();
		E$(this.textareaId).parentNode.replaceChild(editor, E$(this.textareaId));
		// FRAME
		this.frame = E$(this.textareaId+"-iframe").contentWindow;
		this.frame.document.designMode = "on";
		this.frame.document.open();
		this.frame.document.write(this.getFrameHtml());
		this.frame.document.close();
		this.setFrameContent();
		this.frame.focus();
		// Update the textarea with content in iframe when user submits form
		var f_submit = this.editor + '.updateTextArea()';
		for (var i=0;i<document.forms.length;i++) { PLXEDITOR.event.addEvent(document.forms[i], 'submit', function() { eval(f_submit) }); }
		// Word counter on keyup event
		var f = this.editor+".keyup()";
		PLXEDITOR.event.addEvent(this.frame, 'keyup', function(evt) { eval(f) });
		this.keyup(null);
	}
	//------------
	create.prototype.keyup=function(evt) {
		if(this.viewSource==true) {
			return;
		}
		// words counter
		//var txt = document.all ? this.frame.document.body.innerText : this.frame.document.body.textContent;
		if (document.body.innerText) {
			var txt = this.frame.document.body.innerText;
		} else {
			var txt = this.frame.document.body.innerHTML.replace(/<br>/gi,"\n");
			var txt = txt.replace(/<\/?[^>]+(>|$)/g, "");
		}
		var count = txt!=undefined ? txt.split(/\b\S+\b/g).length - 1 : 0;
		E$(this.textareaId+'-footer').innerHTML = lang.L_WORDS + " : " + count;
		// autoresize
		//E$(this.textareaId+"-iframe").style.height = this.frame.document.body.scrollHeight + "px";
	},
	create.prototype.getEditorHtml=function() {

		var toolbar = '\
	<div id="'+this.textareaId+'-toolbar-icons" class="show">\
	<select onchange="'+this.editor+'.execCommand(\'formatblock\', this.value);this.selectedIndex=0;">\
		<option value="">Style</option>\
		<option value="<h1>">H1</option>\
		<option value="<h2>">H2</option>\
		<option value="<h3>">H3</option>\
		<option value="<h4>">H4</option>\
		<option value="<h5>">H5</option>\
		<option value="<h6>">H6</option>\
		<option value="<p>">P</option>\
		<option value="<pre>">Pre</option>\
	</select>\
	<span class="tb-icon-paragraph-left" onclick="'+this.editor+'.execCommand(\'justifyleft\', \'<br />\')" title="'+lang.L_TOOLBAR_P_LEFT+'"></span>\
	<span class="tb-icon-paragraph-center" onclick="'+this.editor+'.execCommand(\'justifycenter\', \'<br />\')" title="'+lang.L_TOOLBAR_P_CENTER+'"></span>\
	<span class="tb-icon-paragraph-right" onclick="'+this.editor+'.execCommand(\'justifyright\', \'<br />\')" title="'+lang.L_TOOLBAR_P_RIGHT+'"></span>\
	<span class="tb-icon-paragraph-justify" onclick="'+this.editor+'.execCommand(\'justifyFull\', \'<br />\')" title="'+lang.L_TOOLBAR_P_JUSTIFY+'"></span>\
	<span class="tb-icon-pilcrow" onclick="'+this.editor+'.execCommand(\'inserthtml\', \'<br />\')" title="'+lang.L_TOOLBAR_BR+'"></span>\
	<span class="tb-icon-bold" onclick="'+this.editor+'.execCommand(\'bold\')" title="'+lang.L_TOOLBAR_BOLD+'"></span>\
	<span class="tb-icon-italic" onclick="'+this.editor+'.execCommand(\'italic\')" title="'+lang.L_TOOLBAR_ITALIC+'"></span>\
	<span class="tb-icon-underline" onclick="'+this.editor+'.execCommand(\'underline\')" title="'+lang.L_TOOLBAR_UNDERLINE+'"></span>\
	<span class="tb-icon-strikethrough" onclick="'+this.editor+'.execCommand(\'strikethrough\')" title="'+lang.L_TOOLBAR_STRIKE+'"></span>\
	<span id="'+this.textareaId+'-linker" class="tb-icon-link" onclick="'+this.editor+'.execCommand(\'link\')" title="'+lang.L_TOOLBAR_LINK+'"></span>\
	<span class="tb-icon-pagebreak" onclick="'+this.editor+'.execCommand(\'inserthtml\', \'<hr />\')" title="'+lang.L_TOOLBAR_HR+'"></span>\
	<span class="tb-icon-list-numbered" onclick="'+this.editor+'.execCommand(\'insertorderedlist\')" title="'+lang.L_TOOLBAR_OL+'"></span>\
	<span class="tb-icon-list2" onclick="'+this.editor+'.execCommand(\'insertunorderedlist\')" title="'+lang.L_TOOLBAR_UL+'"></span>\
	<span class="tb-icon-quotes-right" onclick="'+this.editor+'.execCommand(\'formatBlock\', \'<blockquote>\')" title="'+lang.L_TOOLBAR_QUOTE+'"></span>\
	<span class="tb-icon-superscript" onclick="'+this.editor+'.execCommand(\'superscript\')" title="'+lang.L_TOOLBAR_SUPERSCRIPT+'"></span>\
	<span class="tb-icon-subscript" onclick="'+this.editor+'.execCommand(\'subscript\')" title="'+lang.L_TOOLBAR_SUBSCRIPT+'"></span>\
	<span class="tb-icon-images" onclick="mediasManager.openPopup(\''+this.editor+'\', false, \'PLXEDITOR_fallback\')" title="'+lang.L_TOOLBAR_MEDIAS+'"></span>\
	<span class="tb-icon-youtube" onclick="'+this.editor+'.execCommand(\'youtube\')" title="'+lang.L_TOOLBAR_YOUTUBE+'"></span>\
	<span class="tb-icon-terminal" onclick="'+this.editor+'.execCommand(\'code\')" title="'+lang.L_TOOLBAR_CODE+'"></span>\
	<span id="'+this.textareaId+'-smilies" class="tb-icon-happy" onclick="'+this.editor+'.execCommand(\'smilies\')" title="'+lang.L_TOOLBAR_SMILIES+'"></span>\
	<span id="'+this.textareaId+'-forecolor" class="tb-icon-adjust" onclick="'+this.editor+'.execCommand(\'forecolor\')" title="'+lang.L_TOOLBAR_FORECOLOR+'"></span>\
	<span id="'+this.textareaId+'-backcolor" class="tb-icon-tint" onclick="'+this.editor+'.execCommand(\'backcolor\')" title="'+lang.L_TOOLBAR_BACKCOLOR+'"></span>\
	</div>\
	<span id="'+this.textareaId+'-html" class="tb-icon-embed2" onclick="'+this.editor+'.execCommand(\'html\')" title="'+lang.L_TOOLBAR_HTML+'"></span>\
	<span id="'+this.textareaId+'-fullscreen" class="tb-icon-expand" onclick="'+this.editor+'.execCommand(\'fullscreen\')" title="'+lang.L_TOOLBAR_FULLSCREEN+'"></span>\
	';

		var html = '';
		html += '<input type="hidden" id="'+this.textareaId+'" name="'+this.textareaId.replace(/id_/,'')+'" value="" />';
		html += '<div id="'+this.textareaId+'-toolbar" class="plxeditor-toolbar">';
		// toolbar
		html += toolbar;
		// iframe
		html += '</div>';
		html += '<div id="'+this.textareaId+'-editor" class="plxeditor">';
		html += '<iframe id="'+this.textareaId+'-iframe" class="plxeditor-iframe resizable" frameborder="0"></iframe>';
		html += '<div id="'+this.textareaId+'-footer" class="plxeditor-footer"></div>';
		html += '</div>'; // fin frame
		return html;
	},
	create.prototype.trim=function(str) {
		try {return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '') } catch(e) { return str; };
	},
	create.prototype.getselection=function() {
		var win = this.frame; var doc = win.document;
		var sel = doc.selection;
		if (this.IE && this.IE < 11) {
			try {
				return sel.createRange();
			} catch (e2) {
				return win.getSelection();
			}
		} else {
			return win.getSelection().getRangeAt(0).toString();
		}
		return null;
	},
	create.prototype.pasteHTML=function(html) {

		var sel = this.frame.document.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
		}

		var el = this.frame.document.createElement("div");
		el.innerHTML = html;
		var frag = this.frame.document.createDocumentFragment(), node, lastNode;
		while ( (node = el.firstChild) ) {
			lastNode = frag.appendChild(node);
		}

		var firstNode = frag.firstChild;
		range.insertNode(frag);

		if (lastNode) {
			range = range.cloneRange();
			range.setStartAfter(lastNode);
			//if (selectPastedContent) {
			//	range.setStartBefore(firstNode);
			//} else {
				range.collapse(true);
			//}
				sel.removeAllRanges();
				sel.addRange(range);
		}

	},
	create.prototype.execCommand=function(cmd, value) {
		this.frame.focus();
		if(this.viewSource===true && cmd !== "html" && cmd !== "fullscreen") return;
		if (cmd == "link" && !value) {
			sel = this.getselection();
			new PLXEDITOR.linker.create(this.editor, this.textareaId+'-linker', this.trim(sel));
		} else if (cmd == "forecolor" && !value) {
			new PLXEDITOR.cpicker.create(this.editor, this.textareaId+'-forecolor', "forecolor");
		} else if (cmd == "backcolor" && !value) {
			new PLXEDITOR.cpicker.create(this.editor, this.textareaId+'-backcolor', (this.IE ? "backcolor" : "hilitecolor") );
		} else if (cmd == "smilies" && !value) {
			new PLXEDITOR.smilies.create(this.editor, this.textareaId+'-smilies', "smilies", this.path);
		} else if (cmd == "html" && !value) {
			this.toggleSource();
		} else if (cmd == "fullscreen" && !value) {
			this.toggleFullscreen();
		} else if (cmd == "inserthtml" && this.IE) { // IE
			this.pasteHTML(value);
		} else if (cmd == "code" && !value) {
			sel = this.getselection();
			this.frame.document.execCommand('inserthtml', false, '<code>'+sel+'</code>');
		} else if (cmd == "youtube" && !value) {
			var url = prompt(lang.L_TOOLBAR_YOUTUBELINK, '');
			if(url!==null) {
				var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11,11}).*/;
				var match = url.match(regExp);
				if (match) if (match.length >= 2) {
					var videoId = match[2];
					var s = '<div class="frame youtube"><iframe src="https://www.youtube.com/embed/'+videoId+'" width="560" height="315" allowfullscreen></iframe></div>';
					this.frame.document.execCommand('inserthtml', false, s);
				}
			}
		} else {
			this.frame.document.execCommand(cmd, false, value);
		}
		this.frame.focus();
	},
	create.prototype.updateTextArea=function() {
		if(this.viewSource) { this.toggleSource(); }
		txt = this.frame.document.body.innerHTML;
		txt = this.convertLinks(txt, 1); // conversion des liens
		txt = this.toXHTML(txt);
		E$(this.textareaId).value = txt.replace(/<br\s*?\/?>$/, '');
	},
	create.prototype.setFrameContent=function () {
		try { this.frame.document.body.innerHTML = this.textareaValue; } catch (e) { setTimeout(this.setFrameContent, 10); }
	},
	create.prototype.getFrameHtml=function() {
		var html = "";
		html += '<!DOCTYPE html>';
		html += '<html><head>';
		html += '<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">';
		html += '<style type="text/css">pre { background-color: #fff; padding: 0.75em 1.5em; border: 1px solid #dddddd;* }</style>';
		html += '<style type="text/css">html,body { font-family: helvetica, arial, sans-serif; cursor: text; } body { margin: 0.5em; padding: 0; } img { border:none; max-width: 100%; } a { color: #258fd6; text-decoration:none; }</style>';
		html += '</head><body></body></html>';
		return html;
	},
	create.prototype.toggleFullscreen = function() {
		if (!this.viewFullscreen) {
			E$(this.textareaId+'-wysiwyg').setAttribute('class', 'wysiwyg-fullscreen');
			E$(this.textareaId+'-fullscreen').setAttribute('class', 'tb-icon-compress');
			this.viewFullscreen = true;
			E$("form_article").style.height = "0";
		} else {
			E$(this.textareaId+'-wysiwyg').setAttribute('class', 'wysiwyg');
			E$(this.textareaId+'-fullscreen').setAttribute('class', 'tb-icon-expand');
			this.viewFullscreen = false;
			E$("form_article").style.height = "100%";
		}

		this.frame.focus();
	},
	create.prototype.getViewportHeight=function() {
		var height;
		if (window.innerHeight!=window.undefined) height=window.innerHeight;
		else if (document.compatMode=='CSS1Compat') height=document.documentElement.clientHeight;
		else if (document.body) height=document.body.clientHeight;
		return height-100;
	},
	create.prototype.convertLinks=function(txt, how) {
		// conversion des liens
		if(how==0) {
			txt=txt.replace(new RegExp(PLXEDITOR_PATH_MEDIAS, 'g'), "../../"+PLXEDITOR_PATH_MEDIAS);
			txt=txt.replace(new RegExp(PLXEDITOR_PATH_PLUGINS, 'g'), "../../"+PLXEDITOR_PATH_PLUGINS);
		} else {
			txt=txt.replace(new RegExp("../../"+PLXEDITOR_PATH_MEDIAS, 'g'), PLXEDITOR_PATH_MEDIAS);
			txt=txt.replace(new RegExp("../../"+PLXEDITOR_PATH_PLUGINS, 'g'), PLXEDITOR_PATH_PLUGINS);
		}
		return txt;
	},
	create.prototype.toggleSource=function() {
		var html, txt;
		if (!this.viewSource) {
			E$(this.textareaId+'-toolbar-icons').setAttribute('class', 'hide');
			E$(this.textareaId+'-footer').setAttribute('class', 'plxeditor-footer hide');
			txt = this.frame.document.body.innerHTML;
			// conversion des liens
			txt = this.convertLinks(txt, 1);
			txt = this.toXHTML(txt);
			txt = this.formatHTML(txt);
			this.frame.document.body.innerHTML = txt.toString();
			// change icon image
			E$(this.textareaId+'-html').setAttribute('class', 'tb-icon-embed');
			// set color css file
			var filecss=this.frame.document.createElement("link");
			filecss.rel = 'stylesheet'
			filecss.type = 'text/css';
			filecss.href = this.path.css+'viewsource.css';
			this.frame.document.getElementsByTagName("head")[0].appendChild(filecss);
			// set the font values for displaying HTML source
			this.frame.document.body.style.fontSize = "13px";
			this.frame.document.body.style.fontFamily = "Courier New";
			this.viewSource = true;
			E$(this.textareaId+'-footer').innerHTML = "";
		} else {
			E$(this.textareaId+'-toolbar-icons').setAttribute('class', 'show');
			E$(this.textareaId+'-footer').setAttribute('class', 'plxeditor-footer show');
			if (this.IE) {
				txt = this.frame.document.body.innerText;
				// conversion des liens
				txt = this.convertLinks(txt.toString(), 0);
				this.frame.document.body.innerHTML = txt;
			} else {
				html = this.frame.document.body.ownerDocument.createRange();
				html.selectNodeContents(this.frame.document.body);
				// conversion des liens
				txt = this.convertLinks(html.toString(), 0);
				this.frame.document.body.innerHTML = txt;
			}
			// change icon image
			E$(this.textareaId+'-html').setAttribute('class', 'tb-icon-embed2');
			// set the font values for displaying HTML source
			this.frame.document.body.style.fontSize = "";
			this.frame.document.body.style.fontFamily = "";
			this.viewSource = false;
			this.keyup(null);
		}
	},
	create.prototype.toXHTML=function(v) {
		return v;
		function lc(str){return str.toLowerCase()}
		function sa(str){return str.replace(/("|;)\s*[A-Z-]+\s*:/g,lc);}
		v=v.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/gi, function toHex($1,$2,$3,$4) { return '#' + (1 << 24 | $2 << 16 | $3 << 8 | $4).toString(16).substr(1); });
		v=v.replace(/<span class="apple-style-span">(.*)<\/span>/gi,'$1');
		v=v.replace(/s*class="apple-style-span"/gi,'');
		v=v.replace(/s*class="webkit-indent-blockquote"/gi,'');
		v=v.replace(/<span style="">/gi,'');
		v=v.replace(/s*style="font-size: (.*?);"/gi,'');
		//	v=v.replace(/<span\b[^>]*>(.*?)<\/span[^>]*>/gi,'$1');
		v=v.replace(/<b\b[^>]*>(.*?)<\/b[^>]*>/gi,'<strong>$1</strong>');
		v=v.replace(/<i\b[^>]*>(.*?)<\/i[^>]*>/gi,'<em>$1</em>');
		v=v.replace(/<(s|strike)\b[^>]*>(.*?)<\/(s|strike)[^>]*>/gi,'<span style="text-decoration: line-through;">$2</span>');
		v=v.replace(/<u\b[^>]*>(.*?)<\/u[^>]*>/gi,'<span style="text-decoration:underline">$1</span>');
		v=v.replace(/<(b|strong|em|i|u) style="font-weight: normal;?">(.*)<\/(b|strong|em|i|u)>/gi,'$2');
		v=v.replace(/<(b|strong|em|i|u) style="(.*)">(.*)<\/(b|strong|em|i|u)>/gi,'<span style="$2"><$4>$3</$4></span>');
		v=v.replace(/<blockquote .*?>(.*?)<\/blockquote>/gi,'<blockquote>$1<\/blockquote>');
		v=v.replace(/<span style="font-weight: normal;?">(.*?)<\/span>/gi,'$1');
		v=v.replace(/<span style="font-weight: bold;?">(.*?)<\/span>/gi,'<strong>$1</strong>');
		v=v.replace(/<span style="font-style: italic;?">(.*?)<\/span>/gi,'<em>$1</em>');
		v=v.replace(/<span style="font-weight: bold;?">(.*?)<\/span>|<b\b[^>]*>(.*?)<\/b[^>]*>/gi,'<strong>$1</strong>')
		v=v.replace(/BACKGROUND-COLOR/gi,'background-color');
		v=v.replace(/<(IMG|INPUT|BR|HR|LINK|META)([^>]*)>/gi,"<$1$2 />") //self-close tags
		v=v.replace(/(<\/?[A-Z]*)/g,lc) // lowercase tags
		v=v.replace(/STYLE="[^"]*"/gi,sa); //lc style atts
		v=v.replace(/<br\b[^>]*>/gi,'<br />'); // clean line-break options
		v=v.replace(/<div\b[^>]*><br \/><\/div[^>]*>/gi, '<br />'); // clean line break enclosed in div
		v=v.replace(/<div\b[^>]*><code><br \/><\/code><\/div[^>]*>/gi, '<br />'); // clean line break enclosed in div/code
		v=v.replace(/<div\b[^>]*><strong><br \/><\/strong><\/div[^>]*>/gi, '<br />'); // clean line break exeption
		return v;
	},
	create.prototype.formatHTML=function(html) {
		//strip white space
		html = html.replace(/ /g, ' ');
		//strip tab
		html = html.replace(/\t/g, ' ');
		//strip carriage return
		html = html.replace(/\r/g, ' ');
		//convert html to text
		html = html.replace(/&/g, '&amp;');
		html = html.replace(/</g, '&lt;');
		html = html.replace(/>/g, '&gt;');
		//change all attributes " to &quot; so they can be distinguished from the html we are adding
		html = html.replace(/="/g, '=&quot;');
		html = html.replace(/=&quot;(.*?)"/g, '=&quot;$1&quot;');
		//search for opening tags
		html = html.replace(/&lt;([a-z](?:[^&|^<]+|&(?!gt;))*?)&gt;/gi, "<span class=\"tag\">&lt;$1&gt;</span><blockquote>");
		//Search for closing tags
		html = html.replace(/&lt;\/([a-z].*?)&gt;/gi, "</blockquote><span class=\"tag\">&lt;/$1&gt;</span>");
		//search for self closing tags
		html = html.replace(/\/&gt;<\/span><blockquote>/gi, "/&gt;</span>");
		//Search for values
		html = html.replace(/&quot;(.*?)&quot;/gi, "<span class=\"literal\">\"$1\"</span>");
		//search for comments
		html = html.replace(/&lt;!--(.*?)--&gt;/gi, "<span class=\"comment\">&lt;!--$1--&gt;</span>");
		//search for html entities
		html = html.replace(/&amp;(.*?);/gi, "<span class=\"entities\">&amp;$1;</span>");
		return html;
	};
	return{create:create}
}();

PLXEDITOR_fallback = function(cible, txt, replace) {
	var editor = 'window.opener.' + cible.replace('id_', 'editor_');
	txt = '../../'+txt.replace(PLUXML_ROOT, '');
	var res = txt.match(/\.tb\.(jpe?g|gif|png)$/gi);
	var ext = txt.substr(txt.lastIndexOf('.') + 1);
	if(res) {
		var f = txt.replace(res[0], '.'+ext);
		var s = '<a href="'+f+'" title=""><img src="'+txt+'" alt="" /></a>'+"\n";
		eval(editor).execCommand('inserthtml', s);
	} else {
		eval(editor).execCommand('InsertImage', txt);
	}
}

PLXEDITOR.event=function() {
	return {
		addEvent:function(obj, evType, fn){
			if (obj.addEventListener){
				obj.addEventListener(evType, fn, false);
				return true;
			} else if (obj.attachEvent){
				var r = obj.attachEvent("on"+evType, fn);
				return r;
			} else {
				return false;
			}
		},
		removeEvent:function removeEvent(obj, evType, fn, useCapture){
			if (obj.removeEventListener){
				obj.removeEventListener(evType, fn, useCapture);
				return true;
			} else if (obj.detachEvent){
				var r = obj.detachEvent("on"+evType, fn);
				return r;
			} else {
				alert("Handler could not be removed");
			}
		}
	}
}();

PLXEDITOR.dialog=function() {
	return {
		close:function(obj){
			var dialog = E$(obj);
			if(dialog!=null) {
				document.body.removeChild(dialog); return;
			}
		},
		getAbsoluteOffsetTop:function(obj){
			var top = obj.offsetTop;
			var parent = obj.offsetParent;
			while (parent != document.body && parent != null) {
				top += parent.offsetTop;
				parent = parent.offsetParent;

			}
			return top;
		},
		getAbsoluteOffsetLeft:function(obj) {
			var left = obj.offsetLeft;
			var parent = obj.offsetParent;
			while (parent != document.body && parent != null) {
				left += parent.offsetLeft;
				parent = parent.offsetParent;
			}
			return left;
		}
	}
}();

PLXEDITOR.linker=function() {
	function create(editor, button, value){
		this.editor=editor;
		this.button=button;
		this.value=value;
		if(E$('linker')) return PLXEDITOR.dialog.close('linker');
		this.showPanel();
	}
	//------------
	create.prototype.showPanel=function(){
		var elemDiv = document.createElement('div');
		elemDiv.id = 'linker';
	    elemDiv.style.position = 'absolute';
		elemDiv.style.display = 'block';
		elemDiv.style.border = '#aaa 1px solid';
		elemDiv.style.zIndex = "2";
		var top = PLXEDITOR.dialog.getAbsoluteOffsetTop(E$(this.button)) + 20;
		var left = PLXEDITOR.dialog.getAbsoluteOffsetLeft(E$(this.button));
		elemDiv.style.top = top + 'px';
		elemDiv.style.left = left + 'px';
		elemDiv.innerHTML = this.panel();
		document.body.appendChild(elemDiv);
	},
	create.prototype.panel=function() {
		var table = '<table id="popup" border="0" cellspacing="0" cellpadding="0">';
		table += '<tr><td>Lien :</td><td><input type="text" value="http://" id="txtHref" /></td></tr>';
		table += '<tr><td>Titre du lien :</td><td><input type="text" value="'+this.value+'" id="txtTitle" /></td></tr>';
		table += '<tr><td>class :</td><td><input type="text" value="" id="txtClass" /></td></tr>';
		table += '<tr><td>rel :</td><td><input type="text" value="" id="txtRel" /></td></tr>';
		table += '<tr><td colspan="2" style="text-align:center"><input type="submit" value="Ajouter" onclick="PLXEDITOR.linker.setLink('+this.editor+')" />&nbsp;<input type="submit" name="btnCancel" id="btnCancel" value="Annuler" onclick="PLXEDITOR.dialog.close(\'linker\')" /></td></tr>';
		table += '</table>';
		return table;
	};
	return{
		create:create,
		setLink:function(editor) {
			var sHref = (E$('txtHref') ? E$('txtHref').value : '');
			var sTtitle = (E$('txtTitle') ? E$('txtTitle').value : '');
			var sClass = (E$('txtClass') ? (E$('txtClass').value!=''? ' class="'+E$('txtClass').value+'"':'') : '');
			var sRel = (E$('txtRel') ? (E$('txtRel').value!=''? ' rel="'+E$('txtRel').value+'"':'') : '');
			if(sTtitle=='' || PLXEDITOR.linker.isUrl(sHref)==false) return;
			editor.execCommand('inserthtml', '<a href="'+sHref+'" title="'+sTtitle+'"'+sClass+sRel+'>'+sTtitle+'</a> ');
			PLXEDITOR.dialog.close('linker');
		},
		isUrl:function(s) {
			var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
			return regexp.test(s);
		}
	}
}();

PLXEDITOR.cpicker=function(){

	var colors = [
		["ffffff", "ffcccc", "ffcc99", "ffff99", "ffffcc", "99ff99", "99ffff", "ccffff", "ccccff", "ffccff"],
		["cccccc", "ff6666", "ff9966", "ffff66", "ffff33", "66ff99", "33ffff", "66ffff", "9999ff", "ff99ff"],
		["c0c0c0", "ff0000", "ff9900", "ffcc66", "ffff00", "33ff33", "66cccc", "33ccff", "6666cc", "cc66cc"],
		["999999", "cc0000", "ff6600", "ffcc33", "ffcc00", "33cc00", "00cccc", "3366ff", "6633ff", "cc33cc"],
		["666666", "990000", "cc6600", "cc9933", "999900", "009900", "339999", "3333ff", "6600cc", "993399"],
		["333333", "660000", "993300", "996633", "666600", "006600", "336666", "000099", "333399", "663366"],
		["000000", "330000", "663300", "663333", "333300", "003300", "003333", "000066", "330099", "330033"]];

	function create(editor, button, action){
		this.editor=editor;
		this.button=button;
		this.action=action;
		if(E$('colorpicker')) return PLXEDITOR.dialog.close('colorpicker');
		this.displayPanel();
	}
	//------------
	create.prototype.displayPanel=function(){
		var elemDiv = document.createElement('div');
		elemDiv.id = 'colorpicker';
	    elemDiv.style.position = 'absolute';
		elemDiv.style.display = 'block';
		elemDiv.style.zIndex = "2";
		var top = PLXEDITOR.dialog.getAbsoluteOffsetTop(E$(this.button)) + 20;
		var left = PLXEDITOR.dialog.getAbsoluteOffsetLeft(E$(this.button));
		elemDiv.style.top = top + 'px';
		elemDiv.style.left = left + 'px';
		elemDiv.innerHTML = this.panel();
		document.body.appendChild(elemDiv);
	},
	create.prototype.panel=function() {
		var table = '<table id="popup" border="0" cellspacing="0" cellpadding="0">';
		for(var y=0; y < colors.length; y++) {
			table += '<tr style="padding:0;margin:0;border:none;line-height:10px">';
			for(var x=0; x < colors[y].length; x++) {
				table += '<td style="padding:0;margin:0;border:none"><a style="border:1px solid #222; color: #' + colors[y][x] + '; background-color: #' + colors[y][x] + ';font-size: 10px;" title="' + colors[y][x] + '" href="javascript:'+this.editor+'.execCommand(\''+this.action+'\', \'#' + colors[y][x] + '\');PLXEDITOR.dialog.close(\'colorpicker\');">&nbsp;&nbsp;&nbsp;&nbsp;</a></td>';
			}
			table += '</tr>';
		}
		table += '</table>';
		return table;
	};
	return{create:create}
}();

PLXEDITOR.smilies=function(){
	var smilies = [
			["big_smile.png", "cool.png", "hmm.png", "icon_arrow.gif", "icon_eek.gif", "icon_exclaim.gif"],
			["icon_question.gif", "icon_redface.gif", "icon_twisted.gif", "lol.png", "mad.png", "neutral.png"],
			["roll.png", "sad.png", "smile.png", "tongue.png", "wink.png", "yikes.png"]];

	function create(editor, button, action, path){
		this.editor=editor;
		this.button=button;
		this.action=action;
		this.path = path;
		if(E$('smilies')) return PLXEDITOR.dialog.close('smilies');
		this.displayPanel();
	}
	//------------
	create.prototype.displayPanel=function(){
		var elemDiv = document.createElement('div');
		elemDiv.id = 'smilies';
	    elemDiv.style.position = 'absolute';
		elemDiv.style.display = 'block';
		elemDiv.style.border = '#aaa 1px solid';
		elemDiv.style.zIndex = "2";
		var top = PLXEDITOR.dialog.getAbsoluteOffsetTop(E$(this.button)) + 20;
		var left = PLXEDITOR.dialog.getAbsoluteOffsetLeft(E$(this.button));
		elemDiv.style.top = top + 'px';
		elemDiv.style.left = left + 'px';
		elemDiv.innerHTML = this.panel();
		document.body.appendChild(elemDiv);
	},
	create.prototype.panel=function() {
		var table = '<table id="popup" border="0" cellspacing="1" cellpadding="0">';
		for(var y=0; y < smilies.length; y++) {
			table += '<tr>';
			for(var x=0; x < smilies[y].length; x++) {
				table += '<td><a href="javascript:'+this.editor+'.execCommand(\'InsertImage\', \''+this.path.editor+'plxEditor/smilies/' + smilies[y][x] + '\');PLXEDITOR.dialog.close(\'smilies\');"><img alt="" src="'+this.path.editor+'plxEditor/smilies/'+smilies[y][x]+'" /></a></td>';
			}
			table += '</tr>';
		}
		table += '</table>';
		return table;
	};
	return{create:create}
}();
