function E$(id){return document.getElementById(id)}

PLXEDITOR={};

PLXEDITOR = {

	options : {},

	editor : function() {

		function create(selectorId, options){
			this.selectorId = selectorId;
			this.selector = E$(selectorId);
			if(this.selector) {
				this.options = options;
				this.init();
			} else {
				console.log(selectorId+' element not found');
			}
		}

		//=============================

		create.prototype.init=function() {
			// add hidden field with textarea content
			this.hidden = document.createElement("input");
			this.hidden.setAttribute('type', 'hidden');
			this.hidden.setAttribute('name', this.selector.name);
			this.hidden.setAttribute('id', this.selector.id);
			this.hidden.setAttribute('value', this.selector.value);
			// add container editor
			this.container = document.createElement("div");
			this.container.id = this.selector.id.replace("id","plxeditor");
			this.container.setAttribute('class', 'plxeditor');
			this.container.appendChild(this.hidden);
			this.selector.parentNode.replaceChild(this.container, this.selector);
			// add toolbar editor
			this.toolbar = document.createElement('div');
			this.toolbar.id = 'plxeditor-'+this.selector.id+'-toolbar';
			this.toolbar.setAttribute('class', 'plxeditor-toolbar');
			this.toolbar.innerHTML = this.getToolbarHTML();
			this.container.appendChild(this.toolbar);
			// add editor
			this.editor = document.createElement("div");
			this.editor.innerHTML = this.selector.value;
			this.editor.id = 'plxeditor-'+this.selector.id;
			this.editor.setAttribute('class', 'plxeditor-textarea');
			this.container.appendChild(this.editor);
			this.editor.setAttribute('contenteditable',true);
			// add footer editor
			this.footer = document.createElement("div");
			this.footer.id = 'plxeditor-'+this.selector.id+'-footer';
			this.footer.setAttribute('class', 'plxeditor-footer');
			this.container.appendChild(this.footer);
			// add buttons events management
			this.addButtonEvents();
			// add event for updating hidden field value
			this.onSubmit();
			// words counter
			PLXEDITOR.editor.wordsCounter(this.editor.id);
			this.editor.addEventListener('keyup',function(e) {
				PLXEDITOR.editor.wordsCounter(this.id);
			});
		},

		create.prototype.onSubmit=function(){
			node = this.container;
			while (node.nodeName != "FORM" && node.parentNode) {
				node = node.parentNode;
			}
			var f = function(selectorId){
				return (function (){
					E$(selectorId).value=E$('plxeditor-'+selectorId).innerHTML;
				});
			}(this.selectorId);
			node.addEventListener('submit', f);
			return f;
		},
		create.prototype.getToolbarHTML=function() {
			return '\
				<div id="plxeditor-'+this.selectorId+'-subtoolbar" style="display:inline-block;margin:0;padding:0">\
				<select id="plxtoolbar-'+this.selectorId+'-sel-style" data-tag="heading">\
					<option value="">Style</option>\
					<option value="h1">H1</option>\
					<option value="h2">H2</option>\
					<option value="h3">H3</option>\
					<option value="h4">H4</option>\
					<option value="h5">H5</option>\
					<option value="h6">H6</option>\
					<option value="p">P</option>\
					<option value="pre">Pre</option>\
				</select>\
				<select id="'+this.selectorId+'-sel align" data-tag="align">\
					<option value="">Align</option>\
					<option value="Left">&#xe911 Left</option>\
					<option value="Center">&#xe912 Center</option>\
					<option value="Right">&#xe913 Right</option>\
					<option value="Full">&#xe914 Justify</option>\
				</select>\
				<button id="'+this.selectorId+'-btn-bold" class="icon-bold" data-tag="bold"><b>Bold</b></button>\
				<button id="'+this.selectorId+'-btn-italic" class="icon-italic" data-tag="italic"><em>Italic</em></button>\
				<button id="'+this.selectorId+'-btn-underline" class="icon-underline" data-tag="underline"><ins>Underline</ins></button>\
				<button id="'+this.selectorId+'-btn-strikethrough" class="icon-strikethrough" data-tag="strikeThrough"><del>Strike</del></button>\
				<button id="'+this.selectorId+'-btn-superscript" class="icon-superscript" data-tag="superscript"><del>Superscript</del></button>\
				<button id="'+this.selectorId+'-btn-subscript" class="icon-subscript" data-tag="subscript"><del>Subscript</del></button>\
				<button id="'+this.selectorId+'-btn-unordered-list" class="icon-list2" data-tag="insertUnorderedList">Unordered List</button>\
				<button id="'+this.selectorId+'-btn-ordered-list" class="icon-list-numbered" data-tag="insertOrderedList">Ordered List</button>\
				<button id="'+this.selectorId+'-btn-indent-increase" class="icon-indent-increase" data-tag="indent">Indent</button>\
				<button id="'+this.selectorId+'-btn-indent-decrease" class="icon-indent-decrease" data-tag="outdent">Outdent</button>\
				<button id="'+this.selectorId+'-btn-quotes-right" class="icon-quotes-right" data-tag="blockquote">Blockquote</button>\
				<button id="'+this.selectorId+'-btn-link" class="icon-link" data-tag="createLink"><ins style="color: blue;">Link</ins></button>\
				<button id="'+this.selectorId+'-btn-removeformat" class="icon-clear-formatting" data-tag="removeFormat">Remove format</button>\
				<button id="'+this.selectorId+'-btn-forecolor" class="icon-tint" data-tag="forecolor">Remove format</button>\
				<button id="'+this.selectorId+'-btn-backcolor" class="icon-adjust" data-tag="backcolor">Remove format</button>\
				</div>\
				<button id="'+this.selectorId+'-btn-viewhtml" class="icon-embed2" data-tag="viewcode" data-type="viewhtml">View HTML</button>\
			';
		},
		create.prototype.addButtonEvents=function() {
			var sels = this.container.querySelectorAll('select[data-tag]');
			for(var i=0, l=sels.length; i<l; i++){
				sels[i].addEventListener('change',function(e) {
					var action = this.getAttribute('data-tag');
					switch(action) {
						case 'heading':
							document.execCommand('formatBlock', false, '<'+this.options[this.selectedIndex].value+'>');
							this.options.selectedIndex=0;
							break;
						case 'align':
							document.execCommand('justify'+this.options[this.selectedIndex].value, false);
							this.options.selectedIndex=0;
							break;
					}
					e.preventDefault();
				});
			}
			var btns = this.container.querySelectorAll('button[data-tag]');
			for(var i=0, l=btns.length; i<l; i++){
				btns[i].innerHTML = "";
				btns[i].editorId = this.editor.id
				btns[i].addEventListener('click',function(e) {
					var action = this.getAttribute('data-tag');
					switch(action) {
						case 'forecolor':
						case 'backcolor':
							new PLXEDITOR.cpicker.create(E$(this.getAttribute('id')),action);
							break;
						case 'blockquote':
							document.execCommand('formatBlock', false, '<blockquote>');
							break;
						case 'createLink':
							new PLXEDITOR.linker.create(this.editorId, E$(this.getAttribute('id')));
							break;
						case 'insertImage':
							var src = prompt('Please specify the link of the image.');
							if(src)	{
								document.execCommand('insertImage', false, src);
							}
							break;
						case 'viewcode':
							if(E$(this.getAttribute('id')).getAttribute('data-type')=='viewhtml') {
								// on change l'icone
								E$(this.getAttribute('id')).setAttribute('data-type', 'viewtext');
								E$(this.getAttribute('id')).setAttribute('class', 'icon-embed');
								// on remplace le texte par le code html
								var txt = E$(this.editorId).innerHTML;
								txt = PLXEDITOR.editor.toXHTML(txt);
								txt = PLXEDITOR.editor.formatHTML(txt);
								E$(this.editorId).innerHTML=txt;
								// on masque les icones et le compteur de mots
								E$(this.editorId+'-subtoolbar').style.display = "none";
								E$(this.editorId+'-footer').style.display = "none";
							} else {
								// on change l'icone
								E$(this.getAttribute('id')).setAttribute('data-type', 'viewhtml');
								E$(this.getAttribute('id')).setAttribute('class', 'icon-embed2');
								// on remplace le code html par le texte
								E$(this.editorId).innerHTML=E$(this.editorId).innerText;
								// on réaffiche les icones et le compteur de mots
								E$(this.editorId+'-subtoolbar').style.display = "inline-block";
								PLXEDITOR.editor.wordsCounter(this.editor.id); // réactualisation du compteur
								E$(this.editorId+'-footer').style.display = "block";
							}
							break;
						default:
							document.execCommand(action, false, this.getAttribute('data-value'));
					}
					e.preventDefault();
				});

			}
		}

		return {
			create: create,

			test:function() {
				alert('fonction test');
			},
			getSelectedText:function() {
				var sel, txt = "";
				if (document.getSelection) {
					txt = document.getSelection().toString();
				} else if ( (sel = document.selection) && sel.type == "Text") {
					txt = sel.createRange().text;
				}
				return txt;
			},
			isOrContainsNode:function(ancestor, descendant) {
				var node = descendant;
				while (node) {
					if (node === ancestor) {
						return true;
					}
					node = node.parentNode;
				}
				return false;
			},
			insertNodeOverSelection:function(node, containerNode) {
				var sel, range, html;
				if (window.getSelection) {
					sel = window.getSelection();
					if (sel.getRangeAt && sel.rangeCount) {
						range = sel.getRangeAt(0);
						if (this.isOrContainsNode(containerNode, range.commonAncestorContainer)) {
							range.deleteContents();
							range.insertNode(node);
						} else {
							containerNode.appendChild(node);
						}
					}
				} else if (document.selection && document.selection.createRange) {
					range = document.selection.createRange();
					if (this.isOrContainsNode(containerNode, range.parentElement())) {
						html = (node.nodeType == 3) ? node.data : node.outerHTML;
						range.pasteHTML(html);
					} else {
						containerNode.appendChild(node);
					}
				}
			},
			insertHTML:function(node, containerNode) {
				this.insertNodeOverSelection(node, containerNode);
			},
			wordsCounter:function(id){
				var txt = E$(id).innerHTML.replace(/<br>/gi,"\n");
				var txt = txt.replace(/<\/?[^>]+(>|$)/g, " ");
				var txt = txt.replace(/&nbsp;/g, " ");
				var count = txt!=undefined ? txt.split(/\b\S+\b/g).length - 1 : 0;
				E$(id+'-footer').innerHTML = "Mots" + " : " + count;
			},
			formatHTML:function(html) {
				//strip white space
				html = html.replace(/\s/g, ' ');
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
				html = html.replace(/&amp;(.*?);/g, '<b>&amp;$1;</b>');
				return html;
			},
			toXHTML:function(v) {
				function lc(str){return str.toLowerCase()}
				function sa(str){return str.replace(/("|;)\s*[A-Z-]+\s*:/g,lc);}
				//v=v.replace(/<(\/)?div>/gi, function(m, p) { return p ? '<br>' : ''; });
				v=v.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/gi, function toHex($1,$2,$3,$4) { return '#' + (1 << 24 | $2 << 16 | $3 << 8 | $4).toString(16).substr(1); });
				v=v.replace(/<span class="apple-style-span">(.*)<\/span>/gi,'$1');
				v=v.replace(/s*class="apple-style-span"/gi,'');
				v=v.replace(/s*class="webkit-indent-blockquote"/gi,'');
				v=v.replace(/<span style="">/gi,'');
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
				return v;
			}
		}

	}(),

	/* **************** cpicker object ************ */
	cpicker : function(){

		function create(button, action){
			if(E$('plxeditor-cpicker')) return PLXEDITOR.dialog.close('plxeditor-cpicker');
			var	elemDiv = document.createElement('div');
			elemDiv.id = 'plxeditor-cpicker';
			elemDiv.className = 'plxeditor-popup';
			elemDiv.innerHTML = this.panel();
			elemDiv.addEventListener('click', function(event) {
				if (event.target.tagName == 'A') {
					document.execCommand(action, false, event.target.title);
					PLXEDITOR.dialog.close('plxeditor-cpicker');
				}
			});
			PLXEDITOR.dialog.setPosition(elemDiv, button);
			document.body.appendChild(elemDiv);
		};
		create.prototype.panel=function() {
			var colors = [
				'ffffff ffcccc ffcc99 ffff99 ffffcc 99ff99 99ffff ccffff ccccff ffccff',
				'cccccc ff6666 ff9966 ffff66 ffff33 66ff99 33ffff 66ffff 9999ff ff99ff',
				'c0c0c0 ff0000 ff9900 ffcc66 ffff00 33ff33 66cccc 33ccff 6666cc cc66cc',
				'999999 cc0000 ff6600 ffcc33 ffcc00 33cc00 00cccc 3366ff 6633ff cc33cc',
				'666666 990000 cc6600 cc9933 999900 009900 339999 3333ff 6600cc 993399',
				'333333 660000 993300 996633 666600 006600 336666 000099 333399 663366',
				'000000 330000 663300 663333 333300 003300 003333 000066 330099 330033'
			];

			var table = '<table>';
			colors.forEach(function (row, y, rows) {
				table += '<tr>';
				row.split(' ').forEach(function (color, x, cells){
					table += '<td><a href="#" title="#'+color+'" style="background-color: #'+color+';">&nbsp;</a></td>';
				});
				table += '</tr>';
			});
			table += '</table>';
			return table;
		};

		return { create:create }
	}(),


	/* **************** linker object ************* */
	linker: function() {

		function create(editorId, button){
			if(E$('plxeditor-linker')) return PLXEDITOR.dialog.close('plxeditor-linker');
			var elemDiv = document.createElement('div');
			elemDiv.innerHTML = this.panel();
			elemDiv.editorId = editorId;
			elemDiv.addEventListener('click', function (event) {
				var target = event.target;
				if (/(?:btnClose|btnCancel)$/i.test(target.id)) {
					event.preventDefault();
					E$('plxEditorModal').style.display = "none";
					document.body.removeChild(elemDiv);
				}
				if (/(?:btnSave)$/i.test(target.id)) {
					event.preventDefault();
					PLXEDITOR.linker.setLink(this.editorId);
					E$('plxEditorModal').style.display = "none";
					document.body.removeChild(elemDiv);
				}
			});
			document.body.appendChild(elemDiv);
			E$('plxEditorModal').style.display = "block";
		};

		create.prototype.panel=function() {
			var table = '<div id="plxEditorModal" class="plxeditor-modal">';
			table += '<div class="plxeditor-modal-content"><span id="modal-btnClose" class="plxeditor-modal-close">×</span><div class="plxeditor-modal-title">Insérer un lien</div>';
			table += '<table>';
			table += '<tr><td>Lien :</td><td><input type="text" value="http://www.pluxml.org" id="txtHref" /></td></tr>';
			table += '<tr><td>Titre du lien :</td><td><input type="text" value="'+PLXEDITOR.editor.getSelectedText()+'" id="txtTitle" /></td></tr>';
			table += '<tr><td>class :</td><td><input type="text" value="" id="txtClass" /></td></tr>';
			table += '<tr><td>rel :</td><td><input type="text" value="" id="txtRel" /></td></tr>';
			table += '<tr><td colspan="2"><input type="submit" id="modal-btnSave" class="btn" value="Ajouter" />&nbsp;<input type="submit" id="modal-btnCancel" class="btn" value="Annuler" /></td></tr>';
			table += '</table>';
			table += '</div></div>';
			return table;
		};

		return {
			create:create,
			setLink:function(editorId) {
				var sHref = E$('txtHref').value.trim();
				if(this.isUrl(sHref)) {
					var sTitle = E$('txtTitle').value.trim();
					sTitle = sTitle=='' ? sHref : sTitle;
					var sClass = E$('txtClass').value.trim();
					var sRel = E$('txtRel').value.trim();
					sClass = sClass=='' ? '' : ' class="'+sClass+'"';
					sRel = sRel=='' ? '' : ' rel="'+sRel+'"';
					var a = document.createElement('a');
					a.setAttribute('href',sHref);
					a.setAttribute('title',sTitle);
					a.setAttribute('rel',sRel);
					a.setAttribute('class',sClass);
					a.innerHTML = sTitle;
					E$(editorId).focus();
					PLXEDITOR.editor.insertHTML(a, E$(editorId));
				}
			},
			isUrl:function(s) {
				var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
				return regexp.test(s);
			}
		}
	}(),

	/* **************** dialog object ************* */
	dialog: function() {
		return {
			close:function(obj){
				var dialog = E$(obj);
				if(dialog!=null) {
					document.body.removeChild(dialog); return;
				}
			},
			getPosition: function getPosition(element) {
			    var xPosition = 0;
			    var yPosition = 0;
			    while(element) {
			        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			        element = element.offsetParent;
			    }
			    return { x: xPosition, y: yPosition };
			},
			setPosition: function(element, origin) {
				var position = this.getPosition(origin);
				element.style.left = position.x + 'px';
				element.style.top = (position.y + 22) +'px';
			}
		}
	}()

}
