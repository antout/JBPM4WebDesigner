/**
 * @author LIUWENYING
 * @description jbpm4 web designer
 * @mail jmose@139.com
 * @version 1.4rel
 * @date
 * 
 */
Object.extend = function(destination, source) {
	for (property in source) {
		destination[property] = source[property];
	}
	return destination;
};
Object.prototype.extend = function(object) {
	return Object.extend.apply(this, [this, object]);
};
String.prototype.trim = function(){
    return this.replace(/(^s*)|(s*$)/g, "");
};
JBPM = function(obj){this.init.apply(this,[obj]);};
JBPM.DocUtil=new Object();
JBPM.DocUtil.BindAsEventListener = function(object, fun) {return function(event) {return fun.call(object, (event || window.event));}};
JBPM.DocUtil.addEventHandler = function(oTarget, sEventType, fnHandler) {
	if (oTarget.addEventListener) {
		oTarget.addEventListener(sEventType, fnHandler, false);
	} else if (oTarget.attachEvent) {
		oTarget.attachEvent("on" + sEventType, fnHandler);
	} else {
		oTarget["on" + sEventType] = fnHandler;
	}
};
JBPM.DocUtil.isIE=(navigator.appName.indexOf('Explorer')>-1);
JBPM.DocUtil.isFF=(navigator.userAgent.indexOf('Firefox')>-1);
JBPM.DocUtil.isCh=(navigator.userAgent.indexOf('Chrome')>-1);
JBPM.DocUtil.isSa=(navigator.userAgent.indexOf('Safari')>-1);
JBPM.DocUtil.getIEVersion=function(){
	if(JBPM.DocUtil.isIE){
		var b_version=navigator.appVersion
		var version=b_version.split(";");
		var trim_Version=version[1].replace(/[ ]/g,"");
		trim_Version = trim_Version.split("\.");
		return trim_Version[0].replace("MSIE","");
	}
	return null;
};
JBPM.DocUtil.removeEventHandler = function(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else { 
        oTarget["on" + sEventType] = null;
    }
};
JBPM.DocUtil.appendJScript = function(fileStr){document.write("<script type='text/javascript' src='"+fileStr+"'></script>");};
JBPM.DocUtil.appendCanvasJS = function(){
	if(JBPM.DocUtil.isIE&&JBPM.DocUtil.getIEVersion()<9){
		if(window.G_vmlCanvasManager==null){
			JBPM.DocUtil.appendJScript("excanvas.js");
		}
	}
};
JBPM.DocUtil.getLeft = function(id){
	var e=id;
	if(typeof(id)=='string'){
		e=document.getElementById(id);
	}
	var l=e.offsetLeft;
	while(e=e.offsetParent){
		l+=e.offsetLeft;
	}
	if(l<0){
		l=0;
	}
	return l;
};
JBPM.DocUtil.getTop = function(id){
	var e=id;
	if(typeof(id)=='string'){
		e=document.getElementById(id);
	}
	var t=e.offsetTop;
	while(e=e.offsetParent){
		t+=e.offsetTop;
	}
	if(t<0){
		t=0;
	}
	return t;
};
JBPM.DocUtil.appendCanvasJS();
JBPM.container = document.body;
JBPM.FlowArea = document.createElement("div");
JBPM.FlowArea.getLeft = function(){
	return parseInt(JBPM.FlowArea.style.left);
};
JBPM.FlowArea.getTop = function(){
	return parseInt(JBPM.FlowArea.style.top);
};

JBPM.getX = function(event){
	var temp = event.x;
	if(JBPM.DocUtil.isIE&&(JBPM.DocUtil.getIEVersion()==8||JBPM.DocUtil.getIEVersion()==6)){
		temp = event.clientX+document.documentElement.scrollLeft-document.body.clientLeft;
	}
	var x = event.pageX || temp;
	if(!JBPM.DocUtil.isIE||(JBPM.DocUtil.isIE&&JBPM.DocUtil.getIEVersion()>=8)||(JBPM.DocUtil.isIE&&JBPM.DocUtil.getIEVersion()==6)){
		x = x-JBPM.DocUtil.getLeft(JBPM.container);
	}
	return x;
};
JBPM.getY = function(event){
	var temp = event.y;
	if(JBPM.DocUtil.isIE&&(JBPM.DocUtil.getIEVersion()==8||JBPM.DocUtil.getIEVersion()==6)){
		temp = event.clientY+document.documentElement.scrollTop-document.body.clientTop;
	}
	var y = event.pageY || temp;
	if (!JBPM.DocUtil.isIE||(JBPM.DocUtil.isIE&&JBPM.DocUtil.getIEVersion()>=8)||(JBPM.DocUtil.isIE&&JBPM.DocUtil.getIEVersion()==6)) {
		y = y-JBPM.DocUtil.getTop(JBPM.container);
	}
	return y;
};

JBPM.pen = null;
JBPM.console = document.createElement('DIV');
JBPM.console.lineCount =0;
JBPM.console.appendInfo = function(str,type){
	var content = JBPM.console.lastChild;
	var fc = content.firstChild;
	JBPM.console.lineCount++;
	if(JBPM.console.lineCount==100){
		content.innerHTML = "";
	}
	var cd = new Date();
	var dt = type?type:'info';
	var s = cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()+' '+dt+' '+str;
	if(type=='error'||type=='e'){
		s = '<font color=red>'+s+'</font>';
	}
	if(type=='success'||type=='s'){
		s = '<font color=#005C00>'+s+'</font>';
	}
	if (fc&&(fc.innerText||fc.textContent)) {
		var t = fc.innerText?fc.innerText:fc.textContent;
		if(t.indexOf(str)>-1){
			fc.innerHTML = s;
			JBPM.console.lineCount--;
			return;
		}
	}
	var d = document.createElement("div");
	d.style.wordBreak="break-all";
	d.innerHTML = s;
	try{
		content.insertBefore(d,fc);
	}catch(e){
	}
};
JBPM.window = {};
JBPM.window.container = document.createElement('DIV');
JBPM.window.showInfo = function(htmlStr){
	var content = JBPM.window.container.lastChild;
	content.innerHTML= htmlStr;
	JBPM.window.show();
	JBPM.window.container.style.top = parseInt((JBPM.container.offsetHeight-JBPM.window.container.offsetHeight)/2)+'px';
};
JBPM.window.hidden = function(){
	var content = JBPM.window.container.lastChild;
	content.innerHTML= "";
	JBPM.window.container.style.display="none";
};
JBPM.window.show = function(){
	JBPM.window.container.style.display="";
};
JBPM.propertiesContainer = document.createElement('DIV');
JBPM.propertiesContainer.appendTable = function(tableObj){
	var div = JBPM.propertiesContainer.lastChild;
	div.appendChild(tableObj);
};
JBPM.propertiesContainer.removeTable = function(tableObj){
	if(tableObj==null){
		return;
	}
	var div = JBPM.propertiesContainer.lastChild;
	if(div==null){
		return;
	}
	div.removeChild(tableObj);
	tableObj = null;
};
JBPM.propertiesContainer.show = function(databaseNode){
	if(databaseNode instanceof JBPM.DataBase.Node){
		
	}
};
JBPM.toolBarContainer = document.createElement('DIV');
JBPM.toolBarContainer.changeModel=function(str){
	var label = JBPM.toolBarContainer.getElementsByTagName('label')[0];
	if(label==null){
		return;
	}
	if(str.indexOf('select')>-1){
		label.innerHTML = JBPM.Text.selectMode;
	}else{
		label.innerHTML = JBPM.Text.transitionMode;
	}
};
JBPM.toolBox = null;
JBPM.prototype = {
	init:function(obj){
		if(obj.container!=null){
			JBPM.container = document.getElementById(obj.container);
		}else{
			var msg = JBPM.Text.title+":Please check paramters! [container]";
			document.writeln("<font color=red>"+msg+"</font>");
			throw new Error(msg);
		}
		if(obj.color){
			JBPM.CSS.backgroundColor = obj.color;
		}
		JBPM.container.className = "jbpm";
		JBPM.Image.relative_path = obj.relative_path?obj.relative_path:"images1/";
		JBPM.container.style.cssText = obj.cssText?obj.cssText:"";
		JBPM.container.style.width = obj.width?obj.width:"800px";
		JBPM.container.style.height = obj.height?obj.height:"600px";
		JBPM.container.style.position = 'relative';
		JBPM.container.style.border = obj.border?obj.border:'black 1px solid';
		if(obj.painter==null){
			this.painter = new JBPM.Painter();
			obj.painter={};
		}else{
			this.painter = new JBPM.Painter(obj.painter);
			if(this.painter==null){
				throw new Error("canvas not exist.");
			}
		}
		this.initWindow();
		JBPM.container.appendChild(JBPM.window.container);
		var mh = obj.painter.maxHeight?obj.painter.maxHeight:1000;
		var mw = obj.painter.maxWidth?obj.painter.maxWidth:1000;
		this.initFlowArea(mw,mh);
		JBPM.container.appendChild(JBPM.FlowArea);
		if(obj.painter!=null){
			JBPM.Util.appendPainterToContainer(this.painter);
		}
		JBPM.pen = this.createPen(obj.pen);
		JBPM.Util.appendPenToContainer(JBPM.pen,obj.pen);
		JBPM.window.showInfo("loading toolbox window ......");
		if(obj.toolBox==null){
			obj.toolBox={};
			obj.toolBox.xmlResult = obj.xmlResult?obj.xmlResult:null;
		}
		JBPM.toolBox = new JBPM.ToolBox(obj.toolBox);
		JBPM.window.showInfo("loading console window ......");
		this.initConsoleContainer();
		JBPM.container.appendChild(JBPM.console);
		JBPM.window.showInfo("loading properties window ......");
		this.initPropertiesContainer();
		JBPM.container.appendChild(JBPM.propertiesContainer);
		JBPM.window.showInfo("loading toolbar window ......");
		this.initToolBarContainer();
		JBPM.container.appendChild(JBPM.toolBarContainer);
		JBPM.window.showInfo("loading images ......");
		var _this = this;
		JBPM.Util.loadImages(
			function(){
				if(obj.initXML){
					if (obj.initXML.replace(new RegExp("[\t|\n|\r]", "g"), "") != '') {
						JBPM.window.showInfo("loading xml ......");
						var xml = obj.initXML;
						xml = xml.replace("]]-->", "").replace("]]&gt;", "");
						var c = xml.split("[CDATA[");
						xml = c[c.length - 1];
						xml = xml.replace(new RegExp("[\t|\n|\r]", "g"), "");
						JBPM.console.appendInfo("loading xml......");
						JBPM.Util.initNodes(xml.trim());
						JBPM.Util.activeNodeContainer();
					}
				}
				_this.showContainers();
				JBPM.window.hidden();
			}
		);
	},
	hiddenContainers:function(){
		JBPM.toolBarContainer.style.display = "none";
		JBPM.propertiesContainer.style.display = "none";
		JBPM.toolBox.container.style.display="none";
	},
	showContainers:function(){
		JBPM.toolBarContainer.style.display = "";
		JBPM.propertiesContainer.style.display = "";
		JBPM.toolBox.container.style.display="";
	},
	initFlowArea:function(mw,mh){
		with (JBPM.FlowArea.style) {
			width = mw+'px';
			height = mh+'px';
			left = '0px';
			top = '0px';
			position = 'absolute';
			zIndex = 1;
		}
		JBPM.FlowArea.className = "jbpm";
		return JBPM.FlowArea;
	},
	initToolBarContainer:function(){
		if(JBPM.toolBarContainer==null){
			JBPM.toolBarContainer = document.createElement('DIV');
		}
		with (JBPM.toolBarContainer.style) {
			width = '420px';
			height = 'auto';
			left = parseInt(JBPM.toolBox.left+JBPM.toolBox.getWidth()+10)+'px';
			var bt = parseInt(JBPM.container.style.borderTopWidth);
			if(!JBPM.DocUtil.isIE)bt = bt+1;
			top = bt+'px';
			position = 'absolute';
			zIndex = 20000;
			border = 'black 1px solid';
			background = JBPM.CSS.backgroundColor;
			padding = '2px 2px';
			display = 'none';
		}
		var content = document.createElement('DIV');
		with(content.style){
			overflow = 'auto';
			height = '90%';
			width = '100%';
			backgroundColor = '#ffffff';
		}
		var table = document.createElement('table');
		with(table.style){
			width='100%';
			fontSize = '12px';
			border = 'none';
		}
		var tbody = document.createElement('tbody');
		var tr = document.createElement('tr')
		var td = document.createElement('td');
		td.style.whiteSpace="nowrap";
		td.innerHTML = JBPM.Text.modeLabel+':<label></label>';
		tr.appendChild(td);
		td = document.createElement('td');
		td.style.width = '120px'
		td.style.whiteSpace="nowrap";
		td.align = 'center';
		td.innerHTML = JBPM.Text.priorityLabel;
		var select = document.createElement('select');
		var option = document.createElement('option');
		option.value=1;
		option.innerHTML=JBPM.Text.selectSpeed;
		select.appendChild(option);
		option = document.createElement('option');
		option.value=2;
		option.innerHTML=JBPM.Text.selectEffect;
		select.appendChild(option);
		select.onchange=function(){
			if(this.value==1){
				JBPM.pen.animat = false;
			}else{
				JBPM.pen.animat = true;
			}
		};
		td.appendChild(select);
		tr.appendChild(td);
		td = document.createElement('td');
		td.style.width = '50px'
		td.style.whiteSpace="nowrap";
		td.align = 'center';
		td.innerHTML = '<a href="'+JBPM.Text.help+'" target="_blank" style="color:black;text-decoration:none;">'+JBPM.Text.helpBtn+'</a>';
		tr.appendChild(td);
		td = document.createElement('td');
		td.style.width = '50px'
		td.style.whiteSpace="nowrap";
		td.align = 'center';
		var about = document.createElement('a');
		about.href = 'javascript:void(0);';
		about.onclick = function(){
			JBPM.window.showInfo(JBPM.Text.about+"<br>"+JBPM.Text.moreInfo+"<a target='_blank' href='"+JBPM.Text.help+"'>"+JBPM.Text.help+"</a>");
		};
		about.style.color = 'black';
		about.style.textDecoration = 'none';
		about.innerHTML = JBPM.Text.aboutBtn;
		td.appendChild(about);
		tr.appendChild(td);
		tbody.appendChild(tr);
		table.appendChild(tbody);
		content.appendChild(table);
		JBPM.toolBarContainer.appendChild(content);
		return JBPM.toolBarContainer;
	},
	initWindow:function(){
		if(JBPM.window.container==null){
			JBPM.window.container = document.createElement('DIV');
		}
		with (JBPM.window.container.style) {
			width = '200px';
			height = 'auto';
			left = parseInt((JBPM.container.offsetWidth-200)/2)+'px';
			top = parseInt((JBPM.container.offsetHeight-100)/2)+'px';
			position = 'absolute';
			zIndex = 20000;
			border = 'black 1px solid';
			background = JBPM.CSS.backgroundColor;
			padding = '2px 2px';
			display = "none";
			textAlign="center";
			if(JBPM.DocUtil.isIE)
			filter = 'progid:DXImageTransform.Microsoft.Shadow(color=#9F9F9F,direction=135,strength=3)';
			if(!JBPM.DocUtil.isIE)
			MozBoxShadow='3px 3px 3px #9F9F9F';
		}
		var title = document.createElement('DIV');
		title.style.textAlign = "right";
		var imgBtn = document.createElement('img');
		imgBtn.style.cursor = 'pointer';
		imgBtn.src = JBPM.Image.deleteBtn;
		JBPM.DocUtil.addEventHandler(imgBtn,'click', function(){
			JBPM.window.hidden();
		});
		title.appendChild(imgBtn);
		JBPM.window.container.appendChild(title);
		var content = document.createElement('DIV');
		content.innerHTML = "<div>"+JBPM.Text.version+"</div>";
		content.style.fontSize = '12px';
		content.style.overflow = 'auto';
		content.style.height = 'auto';
		content.style.textAlign = "left";
		content.style.width = '98%';
		content.style.padding = '2px';
		content.style.backgroundColor = '#ffffff';
		JBPM.window.container.appendChild(content);
		return JBPM.window.container;
	},
	initConsoleContainer:function(){
		if(JBPM.console==null){
			JBPM.console = document.createElement('DIV');
		}
		with (JBPM.console.style) {
			width = '250px';
			height = '120px';
			right = parseInt(JBPM.container.style.borderRightWidth)+'px';
			var bt = parseInt(JBPM.container.style.borderTopWidth);
			if(!JBPM.DocUtil.isIE)bt = bt;
			bottom = bt+'px';
			position = 'absolute';
			zIndex = 20000;
			border = 'black 1px solid';
			background = JBPM.CSS.backgroundColor;
			scrollbarBaseColor = JBPM.CSS.backgroundColor;
			padding = '2px 2px';
		}
		var title = document.createElement('DIV');
		var imgBtn = document.createElement('img');
		imgBtn.style.cursor = 'pointer';
		imgBtn.src = JBPM.Image.hidden;
		JBPM.DocUtil.addEventHandler(imgBtn,'click', function(){
			if(imgBtn.src.indexOf(JBPM.Image.hidden)>-1){
				imgBtn.src = JBPM.Image.show;
				JBPM.console.lastChild.style.display = 'none';
				JBPM.console.style.height = 'auto';
			}else{
				imgBtn.src = JBPM.Image.hidden;
				JBPM.console.lastChild.style.display = '';
				JBPM.console.style.height = '120px';
			}
		});
		title.appendChild(imgBtn);
		title.appendChild(document.createTextNode(' Console'+'['+JBPM.Text.version+']'));
		title.style.fontSize = '12px';
		JBPM.console.appendChild(title);
		var content = document.createElement('DIV');
		content.innerHTML = "<div>"+JBPM.Text.version+"</div>";
		content.style.fontSize = '12px';
		content.style.overflow = 'auto';
		content.style.height = '100px';
		content.style.width = '100%';
		content.style.backgroundColor = '#ffffff';
		JBPM.console.appendChild(content);
		return JBPM.console;
	},
	initPropertiesContainer:function(){
		if(JBPM.propertiesContainer==null){
			JBPM.propertiesContainer = document.createElement('DIV');
		}
		with (JBPM.propertiesContainer.style) {
			width = '250px';
			right = parseInt(JBPM.container.style.borderRightWidth)+'px';
			var bt = parseInt(JBPM.container.style.borderTopWidth);
			if(!JBPM.DocUtil.isIE)bt = bt+1;
			top = bt+'px';
			position = 'absolute';
			zIndex = 20000;
			border = 'black 1px solid';
			background = JBPM.CSS.backgroundColor;
			padding = '2px 2px';
			display = 'none';
		}
		var title = document.createElement('DIV');
		var imgBtn = document.createElement('img');
		imgBtn.style.cursor = 'pointer';
		imgBtn.src = JBPM.Image.hidden;
		JBPM.DocUtil.addEventHandler(imgBtn,'click', function(){
			if(imgBtn.src.indexOf(JBPM.Image.hidden)>-1){
				imgBtn.src = JBPM.Image.show;
				JBPM.propertiesContainer.lastChild.style.display = 'none';
			}else{
				imgBtn.src = JBPM.Image.hidden;
				JBPM.propertiesContainer.lastChild.style.display = '';
			}
		});
		title.appendChild(imgBtn);
		title.appendChild(document.createTextNode(' Properties'));
		title.style.fontSize = '12px';
		JBPM.propertiesContainer.appendChild(title);
		var content = document.createElement('DIV');
		content.style.fontSize = '12px';
		content.style.overflow = 'auto';
		content.style.height = '90%';
		content.style.width = '100%';
		content.style.backgroundColor = '#ffffff';
		JBPM.propertiesContainer.appendChild(content);
		return JBPM.propertiesContainer;
	},
	getXML:function(){},
	createPen:function(obj){
		if (this.painter) {
			return new JBPM.Pen(this.painter, obj);
		}else{
			return null;
		}
	}
};

JBPM.Painter = function(obj){this.init.apply(this,[obj]);};
JBPM.Painter.prototype = {
	init:function(obj){
		this.paramObj = obj?obj:{};
		if(this.paramObj.canvasId==null){
			this.canvas = document.createElement('canvas');
			this.canvas.id='cv';
		}else{
			this.canvas = document.getElementById(this.paramObj.canvasId);
			if(this.canvas==null){
				throw new Error("canvas not exist.");
			}
    	}
		this._clickHandle = JBPM.DocUtil.BindAsEventListener(this, this.clickHandler);
		JBPM.DocUtil.addEventHandler(this.canvas, "click",this._clickHandle);
	},
	initPainter:function(){
		var css = this.paramObj.cssStyle?this.paramObj.cssStyle.replace("position",";position"):"";
		if(this.paramObj.showGrid!=false){
			css = "background:url("+JBPM.Image.canvas_bg+") -9px 9px repeat;"+css;
		}
		this.canvas.style.cssText = this.canvas.style.cssText+";"+css;
		this.canvas.width = JBPM.FlowArea.offsetWidth;
		this.canvas.height = JBPM.FlowArea.offsetHeight;
		this.canvas.style.zIndex = 1;
		this.canvas.style.left="0px";
		this.canvas.style.top="0px";
		this.canvas.style.position = "absolute";
		if(JBPM.DocUtil.isIE){
			this.canvas.style.width =JBPM.FlowArea.offsetWidth+ "px";
			this.canvas.style.height = JBPM.FlowArea.offsetHeight+"px";
		}
		this.context = this.canvas.getContext('2d');
		if(this.paramObj.lineStyle!=null){
			this.initStyle(this.paramObj.lineStyle);
		}
		this.initEvent();
	},
	initStyle:function(obj){
		this.context.strokeStyle = obj.lineColor?obj.lineColor:'black';
		this.context.fillStyle = obj.lineColor?obj.lineColor:'black';
  		this.context.lineWidth = obj.lineWidth?obj.lineWidth:1;
		this.angle = obj.angle?obj.angle:45;
		this.arrowLength = obj.arrowLength?obj.arrowLength:10*this.context.lineWidth;
	},
	initEvent:function(){
		this._startHandle = JBPM.DocUtil.BindAsEventListener(this, this.startMove);
		this._moveHandler = JBPM.DocUtil.BindAsEventListener(this, this.moving);
		this._endHandler = JBPM.DocUtil.BindAsEventListener(this, this.endMove);	
		this._clickHandler = JBPM.DocUtil.BindAsEventListener(this, this.showPoints);	
		JBPM.DocUtil.addEventHandler(this.canvas, "mousedown",this._startHandle);
		JBPM.DocUtil.addEventHandler(this.canvas, "click",this._clickHandler);
		
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.addEventHandler(this.canvas, "mousemove",this._moveHandler);
			JBPM.DocUtil.addEventHandler(this.canvas, "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.addEventHandler(document, "mousemove",this._moveHandler);
			JBPM.DocUtil.addEventHandler(document, "mouseup",this._endHandler);
		}
	},
	removeEvent:function(){
		JBPM.DocUtil.removeEventHandler(this.canvas, "mousedown", this._startHandle);
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.removeEventHandler(this.canvas, "mousemove",this._moveHandler);
			JBPM.DocUtil.removeEventHandler(this.canvas, "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.removeEventHandler(document, "mousemove",this._moveHandler);
			JBPM.DocUtil.removeEventHandler(document, "mouseup",this._endHandler);
		}
	},
	showPoints:function(event){
		var e = event||window.event;
		var downPoint = {};
		downPoint.x = JBPM.getX(e)-JBPM.FlowArea.getLeft();
		downPoint.y = JBPM.getY(e)-JBPM.FlowArea.getTop();
		var rs = JBPM.DataBase.NodeRelations;
		for(var i=0;i<rs.length;i++){
			if(rs[i].isPointOnRelation(downPoint)){
				rs[i].showPoints();
			}else{
				rs[i].hiddenPoints();
			}
		}
	},
	startMove:function(event){
		var e = event||window.event;
		if(this.downPoint==null) this.downPoint = {};
		this.downPoint.x = JBPM.getX(e);
		this.downPoint.y = JBPM.getY(e);
		var md = JBPM.FlowArea;
		if(md==null){
			return;
		}
		JBPM.Util.setInitPosition(md);
	},
	moving:function(event){
		var e = event||window.event;
		if(this.downPoint==null){
			return;
		}
		var e = event||window.event;
		var obj = JBPM.Util.getEventObj(e);
		var upPoint={};
		upPoint.x = JBPM.getX(e);
		upPoint.y = JBPM.getY(e);
		var offsetX = upPoint.x-this.downPoint.x;
		var offsetY = upPoint.y-this.downPoint.y;
		var md = JBPM.FlowArea;
		if(md==null){
			JBPM.console.appendInfo(JBPM.Text.canvasFail);
			return;
		}
		with(md.style){
			var l = JBPM.Util.getInitLeft(md)+offsetX;
			if(l>0){
				l=0;
			}
			if(Math.abs(l)+JBPM.container.offsetWidth>=md.offsetWidth-2*parseInt(JBPM.container.style.borderWidth)){
				l=-(md.offsetWidth-JBPM.container.offsetWidth);
			}
			left = l+'px';
			
			var t = JBPM.Util.getInitTop(md)+offsetY;
			if(t>0){
				t=0;
			}
			if(Math.abs(t)+JBPM.container.offsetHeight>=md.offsetHeight-2*parseInt(JBPM.container.style.borderWidth)){
				t=-(md.offsetHeight-JBPM.container.offsetHeight);
			}
			top = t+'px';
		}
	},
	endMove:function(event){
		if(this.downPoint==null){
			return;
		}
		var e = event||window.event;
		var upPoint={};
		upPoint.x = JBPM.getX(e);
		upPoint.y = JBPM.getY(e);
		this.downPoint = null;
		var md = JBPM.FlowArea;
		if(md!=null){
			JBPM.Util.resetInitPosition(md);
		}
		if (JBPM.DocUtil.isIE&&md) {
			md.style.zIndex = 1;
		}
		if (JBPM.DocUtil.isFF) {
		}
	},
	drawArrow:function(startPoint,endPoint){
		var points = JBPM.Pen.getArrowPoint(startPoint,endPoint,this.angle,this.arrowLength);
		if(!JBPM.Util.checkPoint(startPoint)){
			return;
		}
		if(!JBPM.Util.checkPoint(endPoint)){
			return;
		}
		this.drawLine(startPoint,endPoint);
		this.context.beginPath();
	    this.context.moveTo(endPoint.x, endPoint.y);
	    this.context.lineTo(points[1].x,points[1].y);
		this.context.lineTo(points[2].x,points[2].y);
		this.context.fill();
	},
	drawLine: function(startPoint, endPoint){
		this.context.beginPath();
		if(!JBPM.Util.checkPoint(startPoint)){
			return;
		}
		if(!JBPM.Util.checkPoint(endPoint)){
			return;
		}
	    this.context.moveTo(startPoint.x, startPoint.y);
	    this.context.lineTo(endPoint.x,endPoint.y);
	    this.context.closePath();
	    this.context.stroke();
	},
	drawCurve:function(points){
		if(points.length<=1){
			return;
		}else{
			var bp = points[0];
			for(var i=1;i<points.length;i++){
				this.drawLine(bp,points[i]);
				bp = points[i];
			}
		}
	},
	drawLineArrow:function(points){
		if(points.length<=1){
			return;
		}else if(points.length==2){
			this.drawArrow(points[0],points[1]);
		}else{
			var lines = points.slice(0,points.length-1);
			this.drawCurve(lines);
			this.drawArrow(points[points.length-2],points[points.length-1]);
		}
	},
	clearLine:function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	clickHandler:function(){
		if(JBPM.DataBase.process==null){
			JBPM.DataBase.process = new JBPM.DataBase.Process();
		}
		JBPM.DataBase.process.showProperties();
	},
	repaint:function(){
		this.clearLine();
		for(var i=0;i<JBPM.DataBase.NodeRelations.length;i++){
			var nr = JBPM.DataBase.NodeRelations[i];
			this.drawLineArrow(nr.getLinePoints());
			nr.showLabel();
		}
	}
};
JBPM.Pen = function(painter,obj){this.init.apply(this,[painter,obj]);};

JBPM.Pen.getArrowPoint = function(startPoint,endPoint,ang,alength){
	var points = [];
	if (startPoint == null) {
		return null;
	}else if (endPoint == null) {
		return null;
	}else {
		var x1 = startPoint.x;
		var y1 = startPoint.y;
		var x2 = endPoint.x;
		var y2 = endPoint.y;
		if (x1 == null || y1 == null || x2 == null || y2 == null||(x1==x2&&y1==y2)) {
			JBPM.console.appendInfo(JBPM.Text.paramterFail);
			return null;
		}
		points.push(endPoint);
		var arrow = 45;    
		if(ang!=null){
			arrow = ang;
		}                                   
		var lenth = 10;   
		if(alength!=null){
			lenth = alength;
		}                               
		var angle = 0;
		if (Math.abs(x2 - x1) < 0.1 && y2 < y1) {
			angle = -90;
		}else {
			if (Math.abs(x2 - x1) < 0.1 && y2 > y1) {
				angle = 90;
			}else {
				if (x1 == x2){
					angle = 180;
				}else {
					angle = Math.atan(parseFloat(y1 - y2) / (x1 - x2)) * 180 / Math.PI
				}
			}
		}	
		if (x1 > x2) {
			angle = 180 + angle;
		}
		var left = 270 - angle - arrow / 2;
		var right = 270 - angle + arrow / 2;
		var rx = lenth * Math.sin(right * Math.PI / 180);
		var ry = lenth * Math.cos(right * Math.PI / 180);
		var lx = lenth * Math.sin(left * Math.PI / 180);
		var ly = lenth * Math.cos(left * Math.PI / 180);
		points.push({
			x:x2 + parseInt(lx),
			y:y2 + parseInt(ly)
		});
		points.push({
			x:x2 + parseInt(rx),
			y:y2 + parseInt(ry)
		});
		
	}  
	return points;
};
JBPM.Pen.prototype = {
	init:function(painter,obj){
		if(painter==null){
			throw new Error("lose param canvas.");
		}else{
			this._painter = painter;
			this.canvas = document.createElement("canvas");
			var temp = new Date();
			this.canvas.id = this.canvas.id+"_"+temp.getMilliseconds();
			this.canvas.height = this._painter.canvas.height;
			this.canvas.width = this._painter.canvas.width;
			with(this.canvas.style){
				position='absolute';
				left=this.canvas.offsetLeft+'px';
				top=this.canvas.offsetTop+'px';
				background='url('+JBPM.Image.transparent+') repeat';
				zIndex = parseInt(this._painter.canvas.style.zIndex)+2;
			}
			this._isActive = false;
			if(this.canvas==null){
				throw new Error("pen.canvas not exist.");
			}
		}
		var tobj = {};
		if(obj!=null){
			tobj = obj;
		}
		if(!JBPM.DocUtil.isIE){
			this.initPen(tobj);
		}else{
			if(JBPM.DocUtil.getIEVersion()>=9){
				this.initPen(tobj);
			}
		}
	},
	getPainter:function(){
		return this._painter;
	},
	clearLine:function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	show:function(){
		this.canvas.style.display = 'block';
	},
	hidden:function(){
		this.canvas.style.display = 'none';
	},
	active:function(){
		if(!this._isActive){
			this.show();
			this.bindEvent();
			this._isActive = true;
		}
	},
	inActive:function(){
		if(this._isActive){
			this.hidden();
			this.removeEvent();
			this._isActive = false;
		}
	},
	bindEvent:function(){
		this._startHandle = JBPM.DocUtil.BindAsEventListener(this, this.startPen);
		this._moveHandler = JBPM.DocUtil.BindAsEventListener(this, this.movePen);
		this._endHandler = JBPM.DocUtil.BindAsEventListener(this, this.endPen);	
		JBPM.DocUtil.addEventHandler(this.canvas, "mousedown",this._startHandle);
		JBPM.DocUtil.addEventHandler(this.canvas, "mousemove",this._moveHandler);
		JBPM.DocUtil.addEventHandler(this.canvas, "mouseup",this._endHandler);
	},
	removeEvent:function(){
		JBPM.DocUtil.removeEventHandler(this.canvas, "mousedown", this._startHandle);
		JBPM.DocUtil.removeEventHandler(this.canvas, "mousemove", this._moveHandler);
		JBPM.DocUtil.removeEventHandler(this.canvas, "mouseup", this._endHandler);
	},
	initPen:function(obj){
		this.context = this.canvas.getContext('2d');
		this.context.strokeStyle = obj&&obj.lineColor?obj.lineColor:'red';
		this.context.fillStyle = obj&&obj.lineColor?obj.lineColor:'red';
  		this.context.lineWidth = obj&&obj.lineWidth?obj.lineWidth:1;
		this.angle = obj&&obj.angle?obj.angle:45;
		this.animat = obj&&obj.animat==true?true:false;
		this.arrowLength = obj.arrowLength?obj.arrowLength:10*this.context.lineWidth;
	},
	drawArrow:function(startPoint,endPoint){
		var points = JBPM.Pen.getArrowPoint(startPoint,endPoint,this.angle,this.arrowLength);
		if(points==null){
			return;
		}
		this.drawLine(startPoint,endPoint);
		this.context.beginPath();
	    this.context.moveTo(endPoint.x, endPoint.y);
	    this.context.lineTo(points[1].x,points[1].y);
		this.context.lineTo(points[2].x,points[2].y);
		this.context.fill();
	},
	drawLine: function(startPoint, endPoint){
		this.context.beginPath();
		if(startPoint==null||endPoint==null||startPoint.x==null||startPoint.y==null||endPoint.x==null||endPoint.y==null){
			return;
		}
	    this.context.moveTo(startPoint.x, startPoint.y);
	    this.context.lineTo(endPoint.x,endPoint.y);
	    this.context.closePath();
	    this.context.stroke();
	},
	isMouseDownOnNode:function(){
		if(this.downPoint==null){
			return false;
		}else{
			if(JBPM.DataBase.Nodes.length!=0){
				for(var i=0;i<JBPM.DataBase.Nodes.length;i++){
					var temp = JBPM.DataBase.Nodes[i].HTMLObj;
					if (((this.downPoint.x-JBPM.FlowArea.getLeft() - temp.offsetLeft) * (this.downPoint.x-JBPM.FlowArea.getLeft() - (temp.offsetLeft+temp.offsetWidth)) < 0) && ((this.downPoint.y-JBPM.FlowArea.getTop() - temp.offsetTop) * (this.downPoint.y-JBPM.FlowArea.getTop() - (temp.offsetTop+temp.offsetHeight)) < 0)) {
						this.downPoint.x = parseInt(temp.offsetLeft+temp.offsetWidth/2);
						this.downPoint.y = parseInt(temp.offsetTop+temp.offsetHeight/2);
						this.startNode = temp;
						this._startNodeObj = JBPM.DataBase.Nodes[i];
						return true;
					}
				}
			}
			JBPM.console.appendInfo(JBPM.Text.startNode,'error');
			return false;
		}
	},
	isMouseUpOnNode:function(){
		if(this.upPoint==null){
			return false;
		}else{
			if(JBPM.DataBase.Nodes.length!=0){
				for(var i=0;i<JBPM.DataBase.Nodes.length;i++){
					var temp = JBPM.DataBase.Nodes[i].HTMLObj;
					if (((this.upPoint.x-JBPM.FlowArea.getLeft() - temp.offsetLeft) * (this.upPoint.x-JBPM.FlowArea.getLeft() - (temp.offsetLeft+temp.offsetWidth)) < 0) && ((this.upPoint.y-JBPM.FlowArea.getTop() - temp.offsetTop) * (this.upPoint.y-JBPM.FlowArea.getTop() - (temp.offsetTop+temp.offsetHeight)) < 0)) {
						this.upPoint.x = parseInt(temp.offsetLeft+temp.offsetWidth/2);
						this.upPoint.y = parseInt(temp.offsetTop+temp.offsetHeight/2);
						this.endNode = temp;
						this._endNodeObj = JBPM.DataBase.Nodes[i];
						return true;
					}
				}
			}
			JBPM.console.appendInfo(JBPM.Text.endNode,'error');
			return false;
		}
	},
	startPen:function(event){
		this.clearLine();
		var e = event||window.event;
		if(this.downPoint==null) this.downPoint = {};
		this.downPoint.x = JBPM.getX(e);
		this.downPoint.y = JBPM.getY(e);
		if(!this.isMouseDownOnNode()){
			this.downPoint=null;
		}
		e.cancelBubble=true;
		if (JBPM.DocUtil.isIE) {
			this.canvas.setCapture();
		}
	},
	movePen:function(event){
		if(this.downPoint==null||this.downPoint.x==null){
			return;
		}
		var e = event||window.event;
		this.upPoint={};
		this.upPoint.x = JBPM.getX(e);
		this.upPoint.y = JBPM.getY(e);
		this.clearLine();
		if(this.downPoint==null) return;
		var up = {};
		up.x = parseInt(this.upPoint.x)-JBPM.FlowArea.getLeft();
		up.y = parseInt(this.upPoint.y)-JBPM.FlowArea.getTop();
		this.drawArrow(this.downPoint, up);
	},
	endPen:function(event){
		var e = event||window.event;
		this.upPoint={};
		this.upPoint.x = JBPM.getX(e);
		this.upPoint.y = JBPM.getY(e);
		if(!this.isMouseUpOnNode()){
			this.upPoint=null;
			this.downPoint = null;
			this.clearLine();
		}
		if (this.upPoint && this.downPoint) {
			var a = Math.pow(this.upPoint.y - this.downPoint.y, 2);
			var b = Math.pow(this.upPoint.x - this.downPoint.x, 2);
			this.clearLine();
			if (a + b > 25) {
				var nr = new JBPM.DataBase.NodeRelation({
					startNodeId: this.startNode.id,
					endNodeId: this.endNode.id,
					startPoint: this.downPoint,
					endPoint: this.upPoint,
					labelText: "to " + this._endNodeObj.id.replace("_", '')
				});
				if(!JBPM.DataBase.NodeRelations.isExist(nr)){
					this.getJoint();
					this._painter.drawArrow(this.downPoint, this.upPoint);
					JBPM.DataBase.NodeRelations.push(nr);
					nr.showLabel();
				}else{
					JBPM.console.appendInfo(JBPM.Text.relationExist);
				}
			}
			this.downPoint = null;
			this.upPoint = null;
		}
		if (JBPM.DocUtil.isIE) {
			this.canvas.releaseCapture();
		}
	},
	getJoint:function(){
		var x1 = this.downPoint.x,y1 = this.downPoint.y,x2 = this.upPoint.x,y2 = this.upPoint.y;
		if (x1 == null || y1 == null || x2 == null || y2 == null||(x1==x2&&y1==y2)) {
			throw new Error(JBPM.Text.paramterInvalid);
		}
		var k = null;b=null;
		if(x2-x1!=0){
			k = (y2-y1)/(x2-x1);
			b = (x2*y1-x1*y2)/(x2-x1);
		}
		var sw = this.startNode.offsetWidth,sh = this.startNode.offsetHeight,sl = parseInt(this.startNode.style.left),st = parseInt(this.startNode.style.top);
		this.downPoint = getXPoint(st,'y','start')||getXPoint(st+sh,'y','start')||getXPoint(sl,'x','start')||getXPoint(sl+sw,'x','start');
		var ew = this.endNode.offsetWidth,eh = this.endNode.offsetHeight,el = parseInt(this.endNode.style.left),et = parseInt(this.endNode.style.top);
		this.upPoint = getXPoint(et,'y','end')||getXPoint(et+eh,'y','end')||getXPoint(el,'x','end')||getXPoint(el+ew,'x','end');
		function getXPoint(a,fx,nodeType){
			var xPoint ={};
			if(fx=='y'){
				xPoint.x=k==null?x1:parseInt((a - b) / k);
				xPoint.y=a;
			}
			if(fx=='x'){
				xPoint.x=a;
				xPoint.y=k==0?y1:parseInt(k*a+b);
			}
			if (((xPoint.x - x2) * (xPoint.x - x1) <= 0) && ((xPoint.y - y2) * (xPoint.y - y1) <= 0)) {
				if (nodeType == 'start') {
					if ((xPoint.x - sl) >= 0 && (xPoint.x - (sl + sw)) <= 0 && (xPoint.y - st) >= 0 && (xPoint.y - (st + sh)) <= 0) {
						return xPoint;
					}
				}
				else {
					if ((xPoint.x - el) >= 0 && (xPoint.x - (el + ew)) <= 0 && (xPoint.y - et) >= 0 && (xPoint.y - (et + eh)) <= 0) {
						return xPoint;
					}
				}
			}
			return null;
		}
	}
};
JBPM.Util = new Object();
JBPM.Util.checkPoint=function(point){
	if(point==null){
		return false;
	}else{
		if(point.x==null||point.y==null){
			return false;
		}else{
			return true;
		}
	}
};
JBPM.Util.getParentNode = function(obj,parentTagName,level){
	var result = obj;
	while(result.tagName.toLowerCase()!=parentTagName.toLowerCase()){
		result = result.parentNode;
		if(result.tagName==null||result.tagName.toLowerCase()=='body'){
			break;
		}
	}
	return result;
};
JBPM.Util.loadImage = function(src,callback){
	var image = new Image();
	image.src = src;
	var imageName = src.split("/")[1];
	var info = "source "+imageName+' ok';
	if (image.complete){
		JBPM.console.appendInfo(info);
		callback.call(image);
		return;
	}
	image.onload = function(){
		JBPM.console.appendInfo(info);
		callback.call(image);
	};
};
JBPM.Util.loadImages = function(callback){
	var time = null;
	var imageCount=0;
	var completeCount = 0;
	var imageStr = "";
	var beginTime = new Date();
	for (property in JBPM.Image) {
		var src = JBPM.Image[property];
		if(imageStr.indexOf(","+src+",")!=-1){
			continue;
		}
		imageStr += ","+src+",";
		if(typeof(src)=='string'&&src.indexOf(".")!=-1){
			imageCount++;
			var imageName = src.split("/")[1];
			JBPM.console.appendInfo("loading "+imageName+'......');
			JBPM.Util.loadImage(src,function(){
				completeCount++;
			});
		}
	}
	function check(){
		var endTime  = new Date();
		var userTime = (endTime-beginTime)/1000/60;
		if(userTime>=0.5){
			JBPM.console.appendInfo(JBPM.Text.loadImageFail);
			window.clearInterval(time);
			callback.call(this);
			return;
		}
		if(imageCount==completeCount){
			window.clearInterval(time);
			callback.call(this);
			return;
		}
	}
	time = window.setInterval(check,100);
};
JBPM.Util.resetMoveDiv = function(moveDiv){
	var span = moveDiv.getElementsByTagName("span")[0];
	moveDiv.style.width = span.offsetWidth+33+"px";
	if(JBPM.DocUtil.isIE){
		var img = moveDiv.lastChild;
		img.style.left=22+span.offsetWidth+"px";
	}
	var l= parseInt(moveDiv.style.left);
	if(l+moveDiv.offsetWidth>JBPM.container.offsetWidth-2*parseInt(JBPM.container.style.borderWidth)){
		moveDiv.style.left=JBPM.container.offsetWidth-moveDiv.offsetWidth-2*parseInt(JBPM.container.style.borderWidth)+"px";
	}
	JBPM.pen.getPainter().repaint();
};
JBPM.Util.resetMoveLabel = function(moveDiv){
	var l= parseInt(moveDiv.style.left);
	if(l+moveDiv.offsetWidth>JBPM.container.offsetWidth-2*parseInt(JBPM.container.style.borderWidth)){
		moveDiv.style.left=JBPM.container.offsetWidth-moveDiv.offsetWidth-2*parseInt(JBPM.container.style.borderWidth)+"px";
	}
};
JBPM.Util.resetInitPosition=function(md){
	var l=0,t=0;
	if(md.style.left!=""){
		l = parseInt(md.style.left);
	}
	if(md.style.top!=""){
		t = parseInt(md.style.top);
	}
	md.setAttribute("initLeft",l);
	md.setAttribute("initTop",t);
};
JBPM.Util.setInitPosition=function(md){
	var il = md.getAttribute("initLeft");
	var it = md.getAttribute("initTop");
	if(il==null||it==null){
		JBPM.Util.resetInitPosition(md);
	}
};
JBPM.Util.getInitLeft=function(md){
	JBPM.Util.setInitPosition(md);
	return parseInt(md.getAttribute("initLeft"));
};
JBPM.Util.getInitTop=function(md){
	JBPM.Util.setInitPosition(md);
	return parseInt(md.getAttribute("initTop"));
};
JBPM.Util.cloneObject = function(myObj){
  	if(typeof(myObj) != 'object') return myObj;
	if(myObj instanceof Array){
		return JBPM.Util.cloneArray(myObj);
	}
  	if(myObj == null) return myObj;
  	var myNewObj = new Object();
  	for(var i in myObj)
    	myNewObj[i] = JBPM.Util.cloneObject(myObj[i]);
  	return myNewObj;
};
JBPM.Util.cloneArray = function(myAry){
  	var a=[]; 
	for(var i=0,l=myAry.length;i<l;i++) 
		a.push(JBPM.Util.cloneObject(myAry[i])); 
	return a; 
};
JBPM.Util.getEvent = function(event){
	var e = event||window.event;
	return e;
};
JBPM.Util.getEventObj = function(event){
	var e = JBPM.Util.getEvent(event);
	var obj = null;
	if(JBPM.DocUtil.isIE){
		obj = e.srcElement;
	}else{
		obj = e.target;
	}
	return obj;
};
JBPM.Util.appendPenToContainer = function(pen,obj){
	var canvas = pen.canvas;
	if (canvas != null) {
		JBPM.FlowArea.appendChild(canvas);
		if (JBPM.DocUtil.isIE&&JBPM.DocUtil.getIEVersion()<9) {
			window.G_vmlCanvasManager.initElement(canvas);
			pen.initPen(obj);
		}
	}
};
JBPM.Util.appendPainterToContainer = function(painter){
	var canvas = painter.canvas;
	if (canvas != null&&canvas.parentNode!=JBPM.container) {
		JBPM.FlowArea.appendChild(canvas);
		if (JBPM.DocUtil.isIE&&JBPM.DocUtil.getIEVersion()<9) {
			window.G_vmlCanvasManager.initElement(canvas);
		}
		painter.initPainter();
	}
};
JBPM.Util.activeNodeContainer = function(){
	JBPM.pen.inActive();
	JBPM.toolBox.initNodeEvents();
	JBPM.toolBarContainer.changeModel('select');
};
JBPM.Util.activePenCanvas = function(){
	JBPM.pen.clearLine();
	JBPM.pen.active();
	JBPM.toolBox.removeNodeEvents();
	JBPM.toolBarContainer.changeModel('');
};
JBPM.Util.parseXML = function(xml){
	var xmlDoc;
	if(JBPM.DocUtil.isIE){
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xml);
    } else{
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
    }
	return xmlDoc;
};
JBPM.Util.getZoom=function(xmlStr){
	if(xmlStr==''){
		return;
	}
	var reg = /(([\d]+,){3}\d+)/ig;
	var result = xmlStr.match(reg);
	var info = "";
	JBPM.console.appendInfo("node number:"+result.length);
	for(var i=0;i<result.length;i++){
		info+="|"+result[i];
	}
	reg = /"((\d+,\d+)(;\d+,\d+)*:(\d+,\d+))"|"(\d+,\d+)"/ig;
	result = xmlStr.match(reg);
	info = "";
	JBPM.console.appendInfo("transition number:"+result.length);
	for(var i=0;i<result.length;i++){
		info+="|"+result[i];
	}
};
JBPM.Util.getNodePosition = function(gStr){
	if(gStr==''){
		return [0,0];
	}else{
		var patrn=/(([\d]+,){3}\d+)/ig;
		if (!patrn.exec(gStr)){
			throw new Error("attribute [g] invalid");
		}
		var result=[];
		var temp= result.split(",");
		if(temp[0]+temp[2]>(JBPM.container.offsetWidth-2*parseInt(JBPM.container.style.borderWidth))){
			result[0]=JBPM.container.offsetWidth-2*parseInt(JBPM.container.style.borderWidth);
		}else{
			result[0]=temp[0];
		}
		if(temp[1]+temp[3]>(JBPM.container.offsetHeight-2*parseInt(JBPM.container.style.borderWidth))){
			result[1]=JBPM.container.offsetHeight-2*parseInt(JBPM.container.style.borderWidth);
		}else{
			result[1]=temp[1];
		}
		return result;
	}
};
JBPM.Util.checkNodesPosition=function(){
	var nodes = JBPM.DataBase.Nodes;
	var jw = JBPM.container.offsetWidth-2*parseInt(JBPM.container.style.borderWidth);
	var jh = JBPM.container.offsetHeight-2*parseInt(JBPM.container.style.borderWidth);
	for(var i=0;i<nodes.length;i++){
		var isChange = false;
		var node = nodes[i];
		var moveDiv = node.HTMLObj;
		var l = parseInt(moveDiv.style.left);
		var t = parseInt(moveDiv.style.top);
		var w = moveDiv.offsetWidth;
		var h = moveDiv.offsetHeight;
		if(l+w>jw){
			moveDiv.style.left = jw-w+"px";
			isChange = true;
		}
		if(t+h>jh){
			moveDiv.style.top = jh-h+"px";
			isChange = true;
		}
		if(isChange){
			JBPM.Util.setInitPosition(moveDiv);
		}
	}
};
JBPM.Util.checkRelationsPosition=function(){
	var relations = JBPM.DataBase.NodeRelations;
	var jw = JBPM.container.offsetWidth-2*parseInt(JBPM.container.style.borderWidth);
	var jh = JBPM.container.offsetHeight-2*parseInt(JBPM.container.style.borderWidth);
	for(var i=0;i<relations.length;i++){
		var isChange = false;
		var relation = relations[i];
		var moveDiv = relation.label;
		var l = parseInt(moveDiv.style.left);
		var t = parseInt(moveDiv.style.top);
		var w = moveDiv.offsetWidth;
		var h = moveDiv.offsetHeight;
		if(l+w>jw){
			moveDiv.style.left = jw-w+"px";
			isChange = true;
		}
		if(t+h>jh){
			moveDiv.style.top = jh-h+"px";
			isChange = true;
		}
		if(isChange){
			JBPM.Util.setInitPosition(moveDiv);
		}
	}
};
JBPM.Util.initNodes = function(xml){
	var xmlDoc = JBPM.Util.parseXML(xml);
	var process = xmlDoc.getElementsByTagName("process")[0];
	if(JBPM.DataBase.process==null){
		JBPM.DataBase.process = new JBPM.DataBase.Process();
	}
	var t = JBPM.NodeToolMap.get(process.tagName);
	for(var i=0;i<t.properties.length;i++){
		var item = t.properties[i];
		var name = item.name;
		var value = process.getAttribute(name);
		JBPM.DataBase.process.setValue(name,value);
	}
	JBPM.DataBase.process.showProperties();
	var nodes = process.childNodes;
	
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].tagName == null) {
			continue;
		}
		var nodename = nodes[i].tagName;
		var nodeTool = JBPM.NodeToolMap.get(nodename);
		var obj = {}
		obj.name = nodes[i].getAttribute("name");
		var g = nodes[i].getAttribute("g");
		if(g!=null){
			JBPM.console.appendInfo("loading "+obj.name+"......");
		}else{
			JBPM.console.appendInfo(obj.name+" no attribute 'g'");
			continue;
		}
		var positions = g.split(",");
		obj.left = positions[0];
		obj.top = positions[1];
		var moveDiv = nodeTool.createMoveDiv(obj);
		var newNode = new JBPM.DataBase.Node({
			HTMLObj:moveDiv,
			isNormal:nodeTool.isNormal,
			properties:JBPM.Util.cloneArray(nodeTool.properties),
			type:nodename
		});
		for(var j=0;j<newNode.properties.length;j++){
			var item = newNode.properties[j];
			var name = item.name;
			var value = nodes[i].getAttribute(name);
			if(item.isChild){
				var c = nodes[i].getElementsByTagName(name)[0];
				if(c&&c.innerText){
					value = c.innerText;
				}
			}else if(item.isAttribute){
				if(item.type&&item.type=='select'){
					var values = item.selectValues;
					if(values){
						for(var k=0;k<values.length;k++){
							if(!values[k].value){
								continue;
							}
							var temp = nodes[i].getAttribute(values[k].value);
							if(temp){
								value = values[k].value;
								if(item.valueFrom){
									newNode.setValue(item.valueFrom,temp);
								}
								break;
							}
						}
					}
					
				}
			}else if(item.isValue){
				continue;
			}
			newNode.setValue(name,value);
		}
		newNode.hiddenProperties();
		JBPM.DataBase.Nodes.add(newNode);
	}
	var ts = process.getElementsByTagName("transition");
	for(var i=0;i<ts.length;i++){
		var fromNode = ts[i].parentNode;
		var fn = JBPM.DataBase.Nodes.getNodeByName(fromNode.getAttribute("name"))
		var toname = ts[i].getAttribute("to");
		var gValue = ts[i].getAttribute("g");
		if(gValue==null){
			gValue="0,0"
		}
		var temp = gValue.split(":");
		var mps = [];
		var labelRelativePoint = {x:0,y:0};
		if(temp.length>0){
			if(temp.length==1){
				
			}
			if(temp.length==2){
				var temp1 = temp[0].split(";")
				for(var j=0;j<temp1.length;j++){
					var ps = temp1[j].split(",");
					var point = {};
					point.x = ps[0];
					point.y = ps[1];
					mps.push(point);
				}
				var temp2 = temp[1].split(",");
				labelRelativePoint.x = temp2[0];
				labelRelativePoint.y = temp2[1];
			}
		}
		var tn = JBPM.DataBase.Nodes.getNodeByName(toname);
		var fp = null,lp=null;
		if(mps.length!=0){
			fp = JBPM.Util.getXpoint(fn.HTMLObj,mps[0]);
			lp = JBPM.Util.getXpoint(tn.HTMLObj,mps[mps.length-1]);
		}else{
			var points = JBPM.Util.getXpoints(fn.HTMLObj,tn.HTMLObj);
			fp = points.startPoint;
			lp = points.endPoint;
		}
		var nr = new JBPM.DataBase.NodeRelation({
			startNodeId: fn.id,
			endNodeId: tn.id,
			startPoint:fp,
			endPoint:lp,
			labelText: ts[i].getAttribute("name"),
			labelRelativePoint:labelRelativePoint,
			specialPoints: mps
		});
		nr.createLabel();
		JBPM.DataBase.NodeRelations.push(nr);
	}
	JBPM.pen.getPainter().repaint();
	JBPM.pen.hidden();
	JBPM.pen.getPainter().repaint();
};
JBPM.Util.getOuterHTML = function(obj){
	if(obj.tagName){
		if(JBPM.DocUtil.isIE){
			return obj.outerHTML;
		}else{
			var d = document.createElement("div");
			d.appendChild(obj);
			return d.innerHTML;
		}
	}
	return "";
};
JBPM.Util.formatXML = function(xml){
	
};
JBPM.Util.createXML = function(){
	var head = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	if(JBPM.DataBase.process==null){
		JBPM.DataBase.process = new JBPM.DataBase.Process();
	}
	var root = JBPM.DataBase.process.createXML();
	var nodes =  JBPM.DataBase.Nodes;
	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		var nodeXML = node.createXML();
		var relNodes = JBPM.DataBase.NodeRelations.getEndNodeRelations(node.id);
		for(var j=0;j<relNodes.length;j++){
			var relNode = relNodes[j];
			var relNodeXML = relNode.createXML();
			nodeXML.appendChild(relNodeXML);
		}
		root.appendChild(nodeXML);
	}
	var temp = JBPM.Util.getOuterHTML(root);
	var result = (head+temp).replace(new RegExp("><","g"),'>\r\n<').replace(new RegExp("script-temp","g"),'script');
	return result;
};
JBPM.Util.getXpoints = function(startHTMLObj, endHTMLObj, isLabel){
	var result = {};
	var sw = startHTMLObj.offsetWidth, sh = startHTMLObj.offsetHeight, sl = parseInt(startHTMLObj.offsetLeft), st = parseInt(startHTMLObj.offsetTop);
	
	var downPoint = {};
	downPoint.x = parseInt(startHTMLObj.offsetLeft + startHTMLObj.offsetWidth / 2);
	downPoint.y = parseInt(startHTMLObj.offsetTop + startHTMLObj.offsetHeight / 2);
	
	var ew = endHTMLObj.offsetWidth, eh = endHTMLObj.offsetHeight, el = parseInt(endHTMLObj.offsetLeft), et = parseInt(endHTMLObj.offsetTop);
	var upPoint = {};
	if(isLabel == null){
		upPoint.x = parseInt(endHTMLObj.offsetLeft + endHTMLObj.offsetWidth / 2);
		upPoint.y = parseInt(endHTMLObj.offsetTop + endHTMLObj.offsetHeight / 2);
	}else{
		upPoint.x = parseInt(endHTMLObj.offsetLeft);
		upPoint.y = parseInt(endHTMLObj.offsetTop);
	}
	var x1 = downPoint.x,y1 = downPoint.y,x2 = upPoint.x,y2 = upPoint.y;
	if (x1 == null || y1 == null || x2 == null || y2 == null||(x1==x2&&y1==y2)) {
		JBPM.console.appendInfo(JBPM.Text.paramterFail);
	}
	var k = null;b=null;
	if(x2-x1!=0){
		k = (y2-y1)/(x2-x1);
		b = (x2*y1-x1*y2)/(x2-x1);
	}
	downPoint = getXPoint(st,'y','start')||getXPoint(st+sh,'y','start')||getXPoint(sl,'x','start')||getXPoint(sl+sw,'x','start');
	result.startPoint = downPoint;
	upPoint = getXPoint(et,'y','end')||getXPoint(et+eh,'y','end')||getXPoint(el,'x','end')||getXPoint(el+ew,'x','end');
	result.endPoint = upPoint;
	return result;
	function getXPoint(a,fx,nodeType){
		var xPoint ={};
		if(fx=='y'){
			xPoint.x=k==null?x1:parseInt((a - b) / k);
			xPoint.y=a;
		}
		if(fx=='x'){
			xPoint.x=a;
			xPoint.y=k==0?y1:parseInt(k*a+b);
		}
		if (((xPoint.x - x2) * (xPoint.x - x1) <= 0) && ((xPoint.y - y2) * (xPoint.y - y1) <= 0)) {
			if (nodeType == 'start') {
				if ((xPoint.x - sl) >= 0 && (xPoint.x - (sl + sw)) <= 0 && (xPoint.y - st) >= 0 && (xPoint.y - (st + sh)) <= 0) {
					return xPoint;
				}
			}
			else {
				if ((xPoint.x - el) >= 0 && (xPoint.x - (el + ew)) <= 0 && (xPoint.y - et) >= 0 && (xPoint.y - (et + eh)) <= 0) {
					return xPoint;
				}
			}
		}
		return null;
	}
};
JBPM.Util.getXpoint = function(HTMLObj, point){
	var result = {};
	var sw = HTMLObj.offsetWidth, sh = HTMLObj.offsetHeight, sl = parseInt(HTMLObj.offsetLeft), st = parseInt(HTMLObj.offsetTop);
	var downPoint = {};
	downPoint.x = parseInt(HTMLObj.offsetLeft + HTMLObj.offsetWidth / 2);
	downPoint.y = parseInt(HTMLObj.offsetTop + HTMLObj.offsetHeight / 2);
	var upPoint = point;
	var x1 = downPoint.x,y1 = downPoint.y,x2 = upPoint.x,y2 = upPoint.y;
	if (x1 == null || y1 == null || x2 == null || y2 == null||(x1==x2&&y1==y2)) {
		JBPM.console.appendInfo(JBPM.Text.paramterFail);
	}
	var k = null;b=null;
	if(x2-x1!=0){
		k = (y2-y1)/(x2-x1);
		b = (x2*y1-x1*y2)/(x2-x1);
	}
	downPoint = getXPoint(st,'y')||getXPoint(st+sh,'y')||getXPoint(sl,'x')||getXPoint(sl+sw,'x');
	return downPoint;
	function getXPoint(a,fx){
		var xPoint ={};
		if(fx=='y'){
			xPoint.x=k==null?x1:parseInt((a - b) / k);
			xPoint.y=a;
		}
		if(fx=='x'){
			xPoint.x=a;
			xPoint.y=k==0?y1:parseInt(k*a+b);
		}
		if (((xPoint.x - x2) * (xPoint.x - x1) <= 0) && ((xPoint.y - y2) * (xPoint.y - y1) <= 0)) {
			if ((xPoint.x - sl) >= 0 && (xPoint.x - (sl + sw)) <= 0 && (xPoint.y - st) >= 0 && (xPoint.y - (st + sh)) <= 0) {
				return xPoint;
			}
		}
		return null;
	}
};
JBPM.Util.getDistancePointOnLine=function(spoint,epoint,mpoint){
	if(spoint==null||epoint==null||mpoint==null){
		return -2;
	}
	var k = null;
	var b = null;
	if(spoint.x-epoint.x!=0){
		k = (spoint.y-epoint.y)/(spoint.x-epoint.x);
		b = spoint.y-k*spoint.x;
		var k2 = -1/k;
		var b2 = mpoint.y-k2*mpoint.x;
		var tx = (b2-b)/(k-k2);
		if((tx-spoint.x)*(tx-epoint.x)>0){
			return -1;
		}
		return Math.abs(k*mpoint.x+(-1)*mpoint.y+b)/(Math.sqrt(k*k+1));
	}else{
		return Math.abs(mpoint.x-spoint.x);
	}
};
JBPM.Util.getMiddlePoint=function(sPoint,ePoint){
	if(sPoint==null||ePoint==null){
		return null;
	}
	var point = {};
	point.x = parseInt((parseInt(sPoint.x)+parseInt(ePoint.x))/2);
	point.y = parseInt((parseInt(sPoint.y)+parseInt(ePoint.y))/2);
	return point;
};
JBPM.ToolBox = function(obj){this.init.apply(this,[obj]);};
JBPM.ToolBox.prototype = {
	init:function(obj){
		this.nodeTools = [];
		this.container = document.createElement('div');
		this.left = obj.left;
		this.top = obj.top;
		this.xmlResult = obj.xmlResult;
		if(obj.left==null){
			this.left = 1;
		}
		if(obj.top==null){
			this.top = 1;
		}
		this.container.className="toolbar";
		with(this.container.style){
			left = this.left+'px';
			top = this.top+'px';
			width = 100+'px';
			position = 'absolute';
			zIndex = 3;
			display = 'none';
			backgroundColor = JBPM.CSS.backgroundColor;
		}
		this.movable = obj.movable==false?obj.movable:true;
		var ul =  document.createElement('UL');
		if(this.movable){
			var move = document.createElement('div');
			move.className="tools";
			var imgBtn = document.createElement('img');
			imgBtn.style.cursor = 'pointer';
			imgBtn.src = JBPM.Image.hidden;
			JBPM.DocUtil.addEventHandler(imgBtn,'click', function(){
				if(imgBtn.src.indexOf(JBPM.Image.hidden)>-1){
					imgBtn.src = JBPM.Image.show;
					ul.style.display = 'none';
				}else{
					imgBtn.src = JBPM.Image.hidden;
					ul.style.display = '';
				}
			});
			move.appendChild(imgBtn);
			move.appendChild(document.createTextNode(" Tools"));
			this.container.appendChild(move);
		}
		this.container.appendChild(ul);
		this.tools = [];
		var process = new JBPM.ToolBox.Tool({
			name:'process',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'action'
			},{
				name:'key',
				label:'key'
			},{
				name:'xmlns',
				label:'xmlns',
				defaultValue:JBPM.Text.xmlns
			},{
				name:'version',
				label:'version'
			},{
				name:'description',
				label:'description'
			}]
		});
		var select = new JBPM.ToolBox.Tool({
			name:'select',
			image:JBPM.Image.select,
			clickHandler:function(event){
				JBPM.Util.activeNodeContainer();
			}
		});
		this.tools.push(select);
		this.appendTool(select);
	
		var tool = new JBPM.ToolBox.Tool({
			name:'transition',
			image:JBPM.Image.transition,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:this.labelText
			},{
				name:'timer',
				label:'timer',
				defaultValue:''
			}],
			clickHandler:function(event){
				JBPM.Util.activePenCanvas();
			}
		});
		this.tools.push(tool);
		this.appendTool(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'start',
			image:JBPM.Image.start,
			maxNumber:1,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'start'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'end',
			image:JBPM.Image.end,
			maxNumber:1,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'end'
			},{
				name:'ends',
				label:'ends'
			},{
				name:'state',
				label:'state'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'end-cancel',
			image:JBPM.Image.end_cancel,
			maxNumber:1,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'cancel'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'end-error',
			image:JBPM.Image.end_error,
			maxNumber:1,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'error'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'state',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'state'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'hql',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'hql'
			},{
				name:'var',
				label:'variable name'
			},{
				name:'unique',
				label:'unique'
			},{
				name:'query',
				label:'query',
				isChild:true
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'sql',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'sql'
			},{
				name:'var',
				label:'variable name'
			},{
				name:'unique',
				label:'unique'
			},{
				name:'query',
				label:'query',
				isChild:true
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'jms',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'jms'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'custom',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'custom'
			},{
				name:'class',
				label:'class'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'java',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'java'
			},{
				name:'class',
				label:'class'
			},{
				name:'expr',
				label:'expression'
			},{
				name:'method',
				label:'method'
			},{
				name:'var',
				label:'return variable'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'script',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'script'
			},{
				name:'expr',
				label:'expression'
			},{
				name:'lang',
				label:'language'
			},{
				name:'var',
				label:'variable name'
			},{
				name:'text',
				label:'text',
				isChild:true
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'rule',
			tagName:'rules',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'rule'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'task',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'task'
			},{
				name:'type',
				label:'type',
				type:'select',
				selectValues:[
					{label:'none',value:''},
					{label:'assignee',value:'assignee'},
					{label:'candidate-groups',value:'candidate-groups'},
					{label:'candidate-users',value:'candidate-users'},
					{label:'swimlane',value:'swimlane'}
				],
				defaultValue:'',
				isAttribute:true,
				valueFrom:'expression'
			},{
				name:'expression',
				label:'expression',
				isValue:true,
				attributeFrom:'type'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'sub-process',
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'subProcess'
			},{
				name:'id',
				label:'id'
			},{
				name:'key',
				label:'key'
			},{
				name:'outcome',
				label:'outcome'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'decision|role',
			tagName:'decision',
			image:JBPM.Image.decision,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'exclusive'
			},{
				name:'lang',
				label:'language'
			},{
				name:'expr',
				label:'expression'
			},{
				name:'class',
				label:'handler class'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'fork',
			image:JBPM.Image.fork,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'fork'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'foreach',
			image:JBPM.Image.foreach,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'foreach'
			},{
				name:'var',
				label:'variable'
			},{
				name:'in',
				label:'collection'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		tool = new JBPM.ToolBox.Tool({
			name:'join',
			image:JBPM.Image.join,
			properties:[{
				name:'name',
				label:'name',
				defaultValue:'join'
			}]
		});
		this.tools.push(tool);
		this.appendTool(tool);
		this.nodeTools.push(tool);
		var t = this.xmlResult;
		tool = new JBPM.ToolBox.Tool({
			name:'source',
			image:JBPM.Image.source,
			clickHandler:function(event){
				var xr = document.getElementById(t);
				if(xr==null){
					return;
				}
				var xml = JBPM.Util.createXML();
				if(xr.value!=null){
					xr.value = xml;
				}else{
					if(JBPM.DocUtil.isIE){
						xr.innerText = xml;
					}else{
						xr.appendChild(document.createTextNode(xml));
					}
				}
			}
		});
		this.tools.push(tool);
		this.appendTool(tool);
		JBPM.container.appendChild(this.container);
	},
	appendTool:function(tool){
		var li = tool.createHTML();
		this.container.getElementsByTagName("UL")[0].appendChild(li);
	},
	getWidth:function(){
		return this.container.firstChild.offsetWidth==0?100:this.container.firstChild.offsetWidth;
	},
	activeTool:function(tool){
		for(var i=0;i<this.tools.length;i++){
			var item = this.tools[i];
			if(item==tool){
				item.btn.style.backgroundColor = JBPM.CSS.backgroundColor;
			}else{
				item.btn.style.backgroundColor = '#ffffff';
			}
		}
	},
	initNodeEvents:function(){
		for(var i=0;i<this.nodeTools.length;i++){
			var tool = this.nodeTools[i];
			tool.initAllNodesEvent();
		}
	},
	removeNodeEvents:function(){
		for(var i=0;i<this.nodeTools.length;i++){
			var tool = this.nodeTools[i];
			tool.removeAllNodesEvent();
		}
	}
};
JBPM.Map=function(obj){this.init.apply(this);};
JBPM.Map.prototype = {
	init:function(){
		this.values = [];
	},
	put: function(name, value){
		var check = this._getItem(name);
		if(check==null){
			var obj = {
				name:name,
				value:value
			};
			this.values.push(obj);
		}else{
			check.value = value;
		}
	},
	_getItem:function(name){
		for(var i=0;i<this.values.length;i++){
			var item = this.values[i];
			if(item.name==name){
				return item;
			}
		}
		return null;
	},
	get:function(name){
		for(var i=0;i<this.values.length;i++){
			var item = this.values[i];
			if(item.name==name){
				return item.value;
			}
		}
		return null;
	},
	clear:function(){
		this.values = [];
	},
	remove:function(name){
		for(var i=0;i<this.values.length;i++){
			var item = this.values[i];
			if(item.name==name){
				this.values.splice(i,1);
				return;
			}
		}
	},
	size:function(){
		return this.values.length;
	}
	
};
JBPM.NodePrototypeMap = new JBPM.Map();
JBPM.NodeToolMap = new JBPM.Map();
JBPM.ToolBox.Tool = function(obj){this.init.apply(this,[obj]);};
JBPM.ToolBox.Tool.prototype = {
	init:function(obj){
		this.name = obj.name?obj.name:'tool';
		this.tagName = obj.tagName?obj.tagName:obj.name;
		this.type = obj.type?obj.type:null;
		this.image = obj.image?obj.image:JBPM.Image.normal;
		this.maxNumber = obj.maxNumber?obj.maxNumber:-1;
		this.minNumber = obj.minNumber?obj.minNumber:0;
		this.currentNumber = 0;
		this.count = 0;
		this.isNormal = this.image==JBPM.Image.normal;
		obj.name = this.name+this.count;
		this.properties = obj.properties?obj.properties:null;
		JBPM.NodePrototypeMap.put(this.tagName,this.properties);
		JBPM.NodeToolMap.put(this.tagName,this);
		this._clickHandle = JBPM.DocUtil.BindAsEventListener(this, this.clickHandler);
		this._deleteHandle = JBPM.DocUtil.BindAsEventListener(this, this.removeMoveDiv);
		this._changeBgColorHandlle = JBPM.DocUtil.BindAsEventListener(this,this.activeHandler);
		if(obj.clickHandler){
			this._clickHandle = JBPM.DocUtil.BindAsEventListener(this, obj.clickHandler);
		}
	},
	activeHandler:function(){
		JBPM.toolBox.activeTool(this);
	},
	setCurrentNumber:function(oEvent){
		var obj = JBPM.Util.getEventObj(oEvent);
		obj = JBPM.Util.getParentNode(obj,"div");
		try{
			var id = obj.id.split('_')[1];
			this.currentNumber = id;
		}catch(er){
			throw new Error('is not this kind of node');
		}
	},
	removeMoveDiv:function(event){
		try{
		var obj = JBPM.Util.getEventObj(event);
		var div = JBPM.Util.getParentNode(obj,"div");
		var node = JBPM.DataBase.Nodes.getNodeById(div.id)
		node.removePropertiesTable();
		JBPM.DataBase.NodeRelations.deleteNodeRelations(div.id);
		JBPM.DataBase.Nodes.del(div.id);
		div.innerHTML = "";
		div.parentNode.removeChild(div);
		div =null;
		JBPM.pen.hidden();
		JBPM.pen.getPainter().repaint();
		}catch(e){
			JBPM.console.appendInfo(JBPM.Text.deleteException+e,'error');
		}
	},
	isExistMoveDiv:function(){
		
	},
	createZoomDiv:function(){
		var zoomDiv = this.getMoveDiv().cloneNode(false);
		zoomDiv.removeAttribute("id");
		zoomDiv.style.zIndex=5;
		JBPM.container.appendChild(zoomDiv);
	},
	createMoveDiv:function(obj,e){
		var moveDiv = null;
		if(obj){
			this.count++;
			moveDiv = document.createElement("DIV");
			moveDiv.name=obj.name;
			moveDiv.id=this.name+'_'+this.count;
			var tempImg = document.createElement("img");
			tempImg.src = this.image;
			if(!this.isNormal){
				with(moveDiv.style){
					width = tempImg.width+'px';
					height = tempImg.height+'px';
				}
				if(JBPM.DocUtil.isIE){
					tempImg.id = this.name+'Img_'+this.count;
					moveDiv.appendChild(tempImg);
				}else{
					moveDiv.style.background = 'url('+this.image+')';
				}
				moveDiv.appendChild(this.createDeleteBtn());
			}else{
				moveDiv.className="normal_node";
				var ul = document.createElement("UL");
				var left_li = document.createElement("LI");
				left_li.className="left_li";
				ul.appendChild(left_li);
				var center_li = document.createElement("LI");
				center_li.className="center_li";
				center_li.innerHTML = "<span>"+moveDiv.name+"</span>";
				ul.appendChild(center_li);
				var right_li = document.createElement("LI");
				right_li.className="right_li";
				ul.appendChild(right_li);
				moveDiv.appendChild(ul);
				moveDiv.appendChild(this.createDeleteBtn());
			}
			with (moveDiv.style) {
				position = 'absolute';
				cursor='move';
				zIndex =4;
			}
			if (e) {
				JBPM.container.appendChild(moveDiv);
			}else{
				JBPM.FlowArea.appendChild(moveDiv);
			}
			moveDiv.style.width = moveDiv.offsetWidth+"px";
			//if(JBPM.DocUtil.getIEVersion()>=9){
				moveDiv.style.width = moveDiv.offsetWidth+1+"px";
			//}
			if(e){
				moveDiv.style.left = parseInt(JBPM.getX(e)-moveDiv.offsetWidth/2)+'px';
				moveDiv.style.top = parseInt(JBPM.getY(e)-moveDiv.offsetHeight/2)+'px';
			}else{
				moveDiv.style.left = obj.left+'px';
				moveDiv.style.top = obj.top+'px';
			}
			this.currentNumber = this.count;
			this.initEvent(moveDiv);
		}
		return moveDiv;
	},
	getMoveDiv:function(){
		var existNodes = this.getExistNodes();
		if(existNodes.length==0){
			return null;
		}else{
			for(var i=0;i<existNodes.length;i++){
				var id = existNodes[i].id;
				if(this.currentNumber==id.split('_')[1]){
					return existNodes[i].HTMLObj;
				}
			}
			return null;
		}
	},
	getExistNodes:function(){
		var exitnodes = JBPM.DataBase.Nodes.getNodesByType(this.tagName);
		return exitnodes;
	},
	changeBtnBgColor:function(){
		this.btn.style.backgroundColor = JBPM.CSS.backgroundColor;
	},
	clickHandler:function(oEvent){
		if(this.downPoint==null){this.downPoint={};}
		var e = oEvent||window.event;
		this.downPoint.x = JBPM.getX(e);
		this.downPoint.y = JBPM.getY(e);
		var tempNode = {};
		var moveDiv = null;
		var existNodes = this.getExistNodes();
		if(this.maxNumber==-1||this.maxNumber>existNodes.length){
			var obj={};
			obj.name = this.name+(this.count+1);
			moveDiv = this.createMoveDiv(obj,e);
			JBPM.Util.activeNodeContainer();
			var _properties = JBPM.Util.cloneArray(this.properties);
			var newNode = new JBPM.DataBase.Node({
				HTMLObj:moveDiv,
				isNormal:this.image==JBPM.Image.normal,
				properties:_properties,
				type:this.tagName
			});
			var nameValue = newNode.getValue("name")+(this.count);
			newNode.setValue('name',nameValue);
			newNode.showProperties();
			JBPM.DataBase.Nodes.add(newNode);
		}
		else{
			this.currentNumber = -1;
			JBPM.console.appendInfo(JBPM.Text.nodeOvermuch,'error');
		}
	},
	createDeleteBtn:function(){
		var img = document.createElement("img");
		with(img.style){
			width='10px';
			height='10px';
			position='absolute';
			right='0px';
			top='0px';
			fontSize="0";
			cursor='pointer';
			float='right';
			visibility='hidden';
		}
		img.src = JBPM.Image.deleteBtn;
		img.title = 'delete';
		JBPM.DocUtil.addEventHandler(img, "click", this._deleteHandle);
		return img;
	},
	createHTML:function(){
		this.li = document.createElement('LI');
		JBPM.DocUtil.addEventHandler(this.li, "mousedown", this._changeBgColorHandlle);
		this.btn = document.createElement('BUTTON');
		JBPM.DocUtil.addEventHandler(this.btn, "mousedown", this._clickHandle);
		if(this.image){
			this.imageObj = document.createElement('IMG');
			this.imageObj.src = this.image;
			this.btn.appendChild(this.imageObj);
		}
		this.span = document.createElement('SPAN');
		if(!JBPM.DocUtil.isIE){
			this.span.style.letterSpacing = "-1px";
		}
		this.span.innerHTML = this.name;
		this.btn.appendChild(this.span);
		this.li.appendChild(this.btn);
		return this.li;
	},
	changeName:function(event){
		var e = event||window.event;
		this.setCurrentNumber(e);
		var md = this.getMoveDiv();
	},
	startMove:function(event){
		var e = event||window.event;
		this.setCurrentNumber(e);
		if(this.downPoint==null) this.downPoint = {};
		this.downPoint.x = JBPM.getX(e);
		this.downPoint.y = JBPM.getY(e);
		var md = this.getMoveDiv();
		if(md==null){
			return;
		}
		JBPM.Util.setInitPosition(md);
		if (this.tempDiv&&this.tempDiv.parentNode) {
			this.tempDiv.innerHTML = "";
			this.tempDiv.parentNode.removeChild(this.tempDiv);
			this.tempDiv = null;
		}
		this.tempDiv = md.cloneNode(true);
		this.tempDiv.id = null;
		if(JBPM.DocUtil.isIE){
			this.tempDiv.style.width = md.offsetWidth+2+"px";
		}
		this.tempDiv.style.border = 'black 1px dotted';
		md.parentNode.insertBefore(this.tempDiv,md);
		e.cancelBubble=true;
		if (JBPM.DocUtil.isIE) {
			md.setCapture();
		}
		if(JBPM.DocUtil.isFF){
			
		}
		md.style.zIndex=5;
		JBPM.DataBase.Nodes.getNodeById(md.id).showProperties();
	},
	moving:function(event){
		var e = event||window.event;
		if(this.downPoint==null){
			return;
		}
		var e = event||window.event;
		var upPoint={};
		upPoint.x = JBPM.getX(e);
		upPoint.y = JBPM.getY(e);
		var offsetX = upPoint.x-this.downPoint.x;
		var offsetY = upPoint.y-this.downPoint.y;
		var md = this.getMoveDiv();
		if(md==null){
			JBPM.console.appendInfo(JBPM.Text.nodeFail);
			return;
		}
		with(md.style){
			var l = JBPM.Util.getInitLeft(md)+offsetX;
			if(l<0){
				l=0;
			}
			if(l+md.offsetWidth>JBPM.FlowArea.offsetWidth){
				l=JBPM.FlowArea.offsetWidth-md.offsetWidth;
			}
			left = l+'px';
			var t = JBPM.Util.getInitTop(md)+offsetY;
			if(t<0){
				t=0;
			}
			if(t+md.offsetHeight>JBPM.FlowArea.offsetHeight){
				t=JBPM.FlowArea.offsetHeight-md.offsetHeight;
			}
			top = t+'px';
		}
		JBPM.pen.clearLine();
		JBPM.pen.show();
		var startNodeRelations = JBPM.DataBase.NodeRelations.getStartNodeRelations(md.id);
		var endNodeRelations = JBPM.DataBase.NodeRelations.getEndNodeRelations(md.id);
		if(startNodeRelations&&endNodeRelations){
			for(var i=0;i<startNodeRelations.length;i++){
				var sr = startNodeRelations[i];
				if (JBPM.pen.animat) {
					if (sr.isStraightLine()) {
						var newPoint = JBPM.Util.getXpoints(sr.getStartNode().HTMLObj, md);
						JBPM.pen.drawArrow(newPoint.startPoint, newPoint.endPoint);
					}
					else {
						var tp = sr.getEndSpecialPointObj().getPosition();
						JBPM.pen.drawArrow(tp, JBPM.Util.getXpoint(md, tp));
					}
				}
				sr.hiddenPoints();
				var pObj = sr.resetEndMiddlePointPosition();
			}
			for(var i=0;i<endNodeRelations.length;i++){
				var er = endNodeRelations[i];
				if (JBPM.pen.animat) {
					if (er.isStraightLine()) {
						var newPoint = JBPM.Util.getXpoints(md, er.getEndNode().HTMLObj);
						JBPM.pen.drawArrow(newPoint.startPoint, newPoint.endPoint);
					}
					else {
						var tp = er.getStartSpecialPointObj().getPosition();
						JBPM.pen.drawLine(tp, JBPM.Util.getXpoint(md, tp));
					}
				}
				er.hiddenPoints();
				var pObj = er.resetStartMiddlePointPosition();
			}
		}
	},
	endMove:function(event){
		if(this.downPoint==null){
			return;
		}
		var e = event||window.event;
		var upPoint={};
		upPoint.x = JBPM.getX(e);
		upPoint.y = JBPM.getY(e);
		this.downPoint = null;
		var md = this.getMoveDiv();
		if(md!=null){
			md.style.zIndex=4;
			if(md.parentNode==JBPM.container){
				md.style.left = parseInt(md.style.left)-JBPM.Util.getInitLeft(JBPM.FlowArea)+"px";
				md.style.top = parseInt(md.style.top)-JBPM.Util.getInitTop(JBPM.FlowArea)+"px";
				md.firstChild.style.display = "block";
				JBPM.FlowArea.appendChild(md);
				JBPM.Util.resetInitPosition(md);
			}
			JBPM.Util.resetInitPosition(md);
		}
		if (JBPM.DocUtil.isIE&&md) {
			md.releaseCapture();
		}
		if (JBPM.DocUtil.isFF) {
			
		}
		if (this.tempDiv) {
			this.tempDiv.innerHTML = "";
			this.tempDiv.parentNode.removeChild(this.tempDiv);
			this.tempDiv = null;
		}
		JBPM.pen.hidden();
		JBPM.pen.getPainter().repaint();
	},
	showProperties:function(){
		
	},
	showDeleteBtn:function(event){
		var obj = JBPM.Util.getEventObj(event);
		var div = JBPM.Util.getParentNode(obj,"div");
		var imgs = div.getElementsByTagName("img");
		if(imgs.length==0){
			return;
		}
		imgs[imgs.length-1].style.visibility = "visible";
	},
	hiddenDeleteBtn:function(event){
		var obj = JBPM.Util.getEventObj(event);
		var div = JBPM.Util.getParentNode(obj,"div");
		var imgs = div.getElementsByTagName("img");
		if(imgs.length==0){
			return;
		}
		imgs[imgs.length-1].style.visibility = "hidden";
	},
	initEvent:function(moveDiv){
		this._startHandle = JBPM.DocUtil.BindAsEventListener(this, this.startMove);
		this._moveHandler = JBPM.DocUtil.BindAsEventListener(this, this.moving);
		this._endHandler = JBPM.DocUtil.BindAsEventListener(this, this.endMove);	
		this._overHandler = JBPM.DocUtil.BindAsEventListener(this, this.showDeleteBtn);
		this._outHandler = 	JBPM.DocUtil.BindAsEventListener(this, this.hiddenDeleteBtn);
		if(moveDiv==null){
			moveDiv = this.getMoveDiv();
		}
		JBPM.DocUtil.addEventHandler(moveDiv, "mousedown",this._startHandle);
		JBPM.DocUtil.addEventHandler(moveDiv, "mouseover",this._overHandler);
		JBPM.DocUtil.addEventHandler(moveDiv, "mouseout",this._outHandler);
		JBPM.DocUtil.addEventHandler(document, "mousemove",this._moveHandler);
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.addEventHandler(moveDiv, "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.addEventHandler(document, "mouseup",this._endHandler);
		}
	},
	removeEvent:function(){
		JBPM.DocUtil.removeEventHandler(this.getMoveDiv(), "mousedown", this._startHandle);
		JBPM.DocUtil.removeEventHandler(document, "mousemove",this._moveHandler);
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.removeEventHandler(this.getMoveDiv(), "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.removeEventHandler(document, "mouseup",this._endHandler);
		}
	},
	initAllNodesEvent:function(){
		var existNodes = this.getExistNodes();
		for(var i=0;i<existNodes.length;i++){
			existNodes[i].HTMLObj.style.zIndex = 4;
		}
	},
	removeAllNodesEvent:function(){
		var existNodes = this.getExistNodes();
		for (var i = 0; i < existNodes.length; i++) {
			existNodes[i].HTMLObj.style.zIndex = 2;
		}
	}
};
JBPM.Point = function(obj){this.init.apply(this,[obj]);};
JBPM.Point.prototype = {
	init:function(obj){
		this.lastPoint=obj.lastPoint?obj.lastPoint:null;
		this.nextPoint=obj.nextPoint?obj.nextPoint:null;
		this.HTMLObj = obj.HTMLObj?obj.HTMLObj:null;
		this.middlePointWidth = obj.middlePointWidth?obj.middlePointWidth:4;
		this.relation = obj.relation?obj.relation:null;
		this.point = obj.point?obj.point:{};
		this.isSpecialPoint = obj.isSpecialPoint?obj.isSpecialPoint:false;
	},
	getOffset:function(){
		if(this.isSpecialPoint){
			return Math.ceil(this.middlePointWidth/2)+1;
		}else{
			return Math.ceil(this.middlePointWidth/2);
		}
	},
	isStartPoint:function(){
		if(this.lastPoint==null){
			return true;
		}
		return false;
	},
	isEndPoint:function(){
		if(this.nextPoint==null){
			return true;
		}
		return false;
	},
	initEvent:function(){
		this._startHandle = JBPM.DocUtil.BindAsEventListener(this, this.startMove);
		this._moveHandler = JBPM.DocUtil.BindAsEventListener(this, this.moving);
		this._endHandler = JBPM.DocUtil.BindAsEventListener(this, this.endMove);	
		JBPM.DocUtil.addEventHandler(this.HTMLObj, "mousedown",this._startHandle);
		JBPM.DocUtil.addEventHandler(document, "mousemove",this._moveHandler);
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.addEventHandler(this.HTMLObj, "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.addEventHandler(document, "mouseup",this._endHandler);
		}
	},
	removeEvent:function(){
		JBPM.DocUtil.removeEventHandler(this.HTMLObj, "mousedown", this._startHandle);
		JBPM.DocUtil.removeEventHandler(document, "mousemove", this._moveHandler);
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.removeEventHandler(this.HTMLObj, "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.removeEventHandler(document, "mouseup", this._endHandler);
		}
	},
	createPointByPosition:function(point,width){
		this.HTMLObj = document.createElement("div");
		this.HTMLObj.className = "point";
		this.HTMLObj.id = "";
		var w = width?width:this.middlePointWidth;
		with(this.HTMLObj.style){
			border = "#ffffff 1px double ";
			backgroundColor = "#000000";
			width = w+"px";
			height = w+"px";
			left = point.x-this.getOffset()+"px";
			top = point.y-this.getOffset()+"px";
			display = "none";
			zIndex=5;
		}
		this.HTMLObj.innerHTML = '&nbsp;';
		this.initEvent(this.HTMLObj);
		JBPM.FlowArea.appendChild(this.HTMLObj);
		return this.HTMLObj;
	},
	getStartPoint:function(){
		var sp = null;
		if(!this.isSpecialPoint){
			if(this.isStartPoint()){
				if(this.isEndPoint()){
					var temp = JBPM.Util.getXpoints(this.relation.startNode.HTMLObj,this.relation.endNode.HTMLObj);
					sp = temp.startPoint;
				}else{
					sp = JBPM.Util.getXpoint(this.relation.startNode.HTMLObj,this.nextPoint.getPosition());
				}
			}else{
				sp = this.lastPoint.getPosition();
			}
		}else{
			sp = this.getLastSpecialPoint();
		}
		return sp;
	},
	getEndPoint:function(){
		var ep = null;
		if (!this.isSpecialPoint) {
			if (this.isEndPoint()) {
				if (this.isStartPoint()) {
					var temp = JBPM.Util.getXpoints(this.relation.startNode.HTMLObj, this.relation.endNode.HTMLObj);
					ep = temp.endPoint;
				}
				else {
					ep = JBPM.Util.getXpoint(this.relation.endNode.HTMLObj, this.lastPoint.getPosition());
				}
			}
			else {
				ep = this.nextPoint.getPosition();
			}
		}else{
			ep = this.getNextSpecialPoint();
		}
		return ep;
	},
	createPoint:function(width){
		this.HTMLObj = document.createElement("div");
		this.HTMLObj.className = "point";
		this.HTMLObj.id = "";
		var w = width?width:this.middlePointWidth;
		var sp = this.getStartPoint();
		var ep = this.getEndPoint();
		var point = JBPM.Util.getMiddlePoint(sp,ep);
		if(point==null){
			JBPM.console.appendInfo(JBPM.Text.midPointFail);
		}
		return this.createPointByPosition(point,width);
	},
	getPosition:function(){
		var point = {};
		if(this.HTMLObj!=null){
			point.x = parseInt(this.HTMLObj.style.left)+this.getOffset();
			point.y = parseInt(this.HTMLObj.style.top)+this.getOffset();
		}
		return point;
	},
	initMiddlePoint:function(){
		this.relation.points.push(this);
		var obj = this.createMiddlePoint();
		return obj;
	},
	initSpecialPoint:function(){
		this.relation.points.push(this);
	   	var obj = this.createSpecialPoint();
		return obj;
	},
	createMiddlePoint:function(){
		return this.createPoint(this.middlePointWidth-2);
	},
	createSpecialPoint:function(){
		var result = this.createPointByPosition(this.point);
	   	this.isSpecialPoint = true;
		return result;
	},
	getLastSpecialPoint:function(){
		if(!this.isSpecialPoint){
			return null;
		}
		if(this.lastPoint.isStartPoint()){
			return JBPM.Util.getXpoint(this.relation.startNode.HTMLObj,this.getPosition());
		}else{
			return this.lastPoint.lastPoint.getPosition();
		}
	},
	getNextSpecialPoint:function(){
		if(!this.isSpecialPoint){
			return null;
		}
		if(this.nextPoint.isEndPoint()){
			return JBPM.Util.getXpoint(this.relation.endNode.HTMLObj,this.getPosition());
		}else{
			return this.nextPoint.nextPoint.getPosition();
		}
	},
	getStartMovePoint:function(){
		if(!this.isStartPoint()){
			return this.lastPoint.getPosition();
		}else{
			var temp = JBPM.Util.getXpoint(this.relation.startNode.HTMLObj,this.getPosition());
			this.relation.startPoint = temp;
			return temp;
		}
	},
	getEndMovePoint:function(){
		if(!this.isEndPoint()){
			return this.nextPoint.getPosition();
		}else{
			var temp = JBPM.Util.getXpoint(this.relation.endNode.HTMLObj,this.getPosition());
			this.relation.endPoint = temp;
			return temp;
		}
	},
	showSideMiddlePoints:function(){
		if(this.lastPoint!=null){
			this.lastPoint.HTMLObj.style.display = '';
		}
		if(this.nextPoint!=null){
			this.nextPoint.HTMLObj.style.display = '';
		}
	},
	hiddenSideMiddlePoints:function(){
		if(this.lastPoint!=null){
			this.lastPoint.HTMLObj.style.display = 'none';
		}
		if(this.nextPoint!=null){
			this.nextPoint.HTMLObj.style.display = 'none';
		}	
	},
	isNeedArraw:function(){
		if(this.nextPoint==null||this.nextPoint.isEndPoint()){
			return true;
		}
		return false;
	},
	startMove:function(event){
		var e = event||window.event;
		if(this.downPoint==null) this.downPoint = {};
		this.downPoint.x = JBPM.getX(e);
		this.downPoint.y = JBPM.getY(e);
		JBPM.Util.setInitPosition(this.HTMLObj);
		if (this.tempDiv&&this.tempDiv.parentNode) {
			this.tempDiv.innerHTML = "";
			this.tempDiv.parentNode.removeChild(this.tempDiv);
			this.tempDiv = null;
		}
		this.tempDiv = this.HTMLObj.cloneNode(true);
		this.tempDiv.id = null;
		this.tempDiv.style.border = 'none';
		this.tempDiv.style.backgroundColor = 'black';
		JBPM.FlowArea.insertBefore(this.tempDiv,this.HTMLObj);
		if (JBPM.DocUtil.isIE) {
			this.HTMLObj.setCapture();
		}
		if(JBPM.DocUtil.isFF){
			
		}
		if(this.isSpecialPoint){
			this.hiddenSideMiddlePoints();
		}
	},
	moving:function(event){
		this.isMiddle =false;
		var e = event||window.event;
		if(this.downPoint==null){
			return;
		}
		var upPoint={};
		upPoint.x = JBPM.getX(e);
		upPoint.y = JBPM.getY(e);
		
		var offsetX = upPoint.x-this.downPoint.x;
		var offsetY = upPoint.y-this.downPoint.y;
		
		if(this.HTMLObj==null){
			JBPM.console.appendInfo(JBPM.Text.pointFail);
			return;
		}
		var s = this.getStartPoint();
		var e = this.getEndPoint();
		var tuppoint = {};
		tuppoint.x = parseInt(upPoint.x)-JBPM.FlowArea.getLeft();
		tuppoint.y = parseInt(upPoint.y)-JBPM.FlowArea.getTop();
		var d = JBPM.Util.getDistancePointOnLine(s,e,tuppoint);
		if (d > 0 && d <10) {
			var mp = JBPM.Util.getMiddlePoint(s,e);
			var w = this.middlePointWidth-2;
			with (this.HTMLObj.style) {
				left = parseInt(mp.x)-Math.ceil(w/2) + "px";
				top = parseInt(mp.y)-Math.ceil(w/2) + "px";
				width =  w+ "px";
				height = w + "px";
			}
			this.isMiddle =true;
			if(s&&e){
				JBPM.pen.clearLine();
				JBPM.pen.show();
				if(this.isNeedArraw()){
					JBPM.pen.drawArrow(s,e);
				}else{
					JBPM.pen.drawLine(s,e);
				}
			}
		}else {
			with (this.HTMLObj.style) {
				var l = JBPM.Util.getInitLeft(this.HTMLObj) + offsetX;
				if (l < 0) {
					l = 0;
				}
				if (l + this.HTMLObj.offsetWidth > JBPM.FlowArea.offsetWidth) {
					l = JBPM.FlowArea.offsetWidth - this.HTMLObj.offsetWidth;
				}
				left = l + 'px';
				var t = JBPM.Util.getInitTop(this.HTMLObj) + offsetY;
				if (t < 0) {
					t = 0;
				}
				if (t + this.HTMLObj.offsetHeight > JBPM.FlowArea.offsetHeight) {
					t = JBPM.FlowArea.offsetHeight - this.HTMLObj.offsetHeight;
				}
				top = t + 'px';
				width = this.middlePointWidth + "px";
				height = this.middlePointWidth + "px";
			}
			if(!this.isSpecialPoint){
				s = this.getStartMovePoint();
			    e = this.getEndMovePoint();
			}
			this.isMiddle =false;
			if(s&&e&&upPoint){
				upPoint.x = parseInt(upPoint.x)-JBPM.FlowArea.getLeft();
				upPoint.y = parseInt(upPoint.y)-JBPM.FlowArea.getTop();
				JBPM.pen.clearLine();
				JBPM.pen.show();
				JBPM.pen.drawLine(s,upPoint);
				if(this.isNeedArraw()){
					JBPM.pen.drawArrow(upPoint,e);
				}else{
					JBPM.pen.drawLine(upPoint,e);
				}
			}
		}
	},
	endMove:function(event){
		if(this.downPoint==null){
			return;
		}
		var e = event||window.event;
		var upPoint={};
		upPoint.x = JBPM.getX(e);
		upPoint.y = JBPM.getY(e);
		this.downPoint = null;
		var md = this.HTMLObj;
		if(md!=null){
			JBPM.Util.resetInitPosition(md);
		}
		if (JBPM.DocUtil.isIE&&md) {
			md.releaseCapture();
		}
		if (this.tempDiv) {
			this.tempDiv.innerHTML = "";
			this.tempDiv.parentNode.removeChild(this.tempDiv);
			this.tempDiv = null;
		}
		if (!this.isMiddle) {
			if (!this.isSpecialPoint) {
				this.toSpecialPoint();
			}
			else {
				this.resetSidePoints();
			}
		}else{
			if(this.isSpecialPoint){
				this.toMiddlePoint();
			}
		}
		if(this.isSpecialPoint){
			this.showSideMiddlePoints();
		}
		JBPM.pen.hidden();
		JBPM.pen.getPainter().repaint();
	},
	toMiddlePoint:function(){
		if(!this.isSpecialPoint){
			return;
		}
		this.isSpecialPoint = false;
		this.relation.removePoint(this.lastPoint);
		this.relation.removePoint(this.nextPoint);
		this.lastPoint = null;
		this.nextPoint = null;
		this.relation.relativePoints();
	},
	toSpecialPoint:function(){
		if(this.isSpecialPoint){
			return;
		}
		this.isSpecialPoint = true;
		var lmpoint = new JBPM.Point({
			lastPoint:this.lastPoint,
			nextPoint:this,
			relation:this.relation
		});
		lmpoint.createMiddlePoint();
		var rmpoint = new JBPM.Point({
			lastPoint:this,
			nextPoint:this.nextPoint,
			relation:this.relation
		});
		rmpoint.createMiddlePoint();
		this.lastPoint = lmpoint;
		this.nextPoint = rmpoint;
		this.relation.insertPoints(this,lmpoint,rmpoint);
		this.relation.relativePoints();
	},
	resetSidePoints:function(){
		var s = this.getLastSpecialPoint();
		var e = this.getNextSpecialPoint();
		this.lastPoint.setPosition(JBPM.Util.getMiddlePoint(s,this.getPosition()));
		this.nextPoint.setPosition(JBPM.Util.getMiddlePoint(e,this.getPosition()));
	},
	setPosition:function(point){
		this.HTMLObj.style.left = parseInt(point.x)-this.getOffset()+"px";
		this.HTMLObj.style.top = parseInt(point.y)-this.getOffset()+"px";
		JBPM.Util.resetInitPosition(this.HTMLObj);
	}
};

JBPM.DataBase={};
JBPM.DataBase.process = null;
JBPM.DataBase.Base = function(obj){this.init.apply(this,[obj]);};
JBPM.DataBase.Base.prototype ={
	oninit:function(){},
	init:function(obj){
		this.type = null;
		this.properties = null;
		this.propertiesTable = null;
		this.xmlNode = null;
		if(obj!=null){
			this.oninit(obj);
			if(this.type){
				this.xmlNode = document.createElement(this.type);
			}
		}
	},
	setValue:function(name,value){
		for (var i = 0; i < this.properties.length; i++) {
			var temp = this.properties[i];
			if(temp.name==name){
				temp.defaultValue = value;
				return;
			}
		}
	},
	getValue:function(name){
		for (var i = 0; i < this.properties.length; i++) {
			var temp = this.properties[i];
			if(temp.name==name){
				return temp.defaultValue;
			}
		}
		return null;
	},
	showProperties:function(){
		if(this.propertiesTable == null){
			if (this.createPropertiesTable() == null) {
				JBPM.console.appendInfo(JBPM.Text.propertiesTableFail);
			}
			if (this.propertiesTable == null) {
				return;
			}
		}
		var div = JBPM.propertiesContainer.lastChild;
		var tables = div.childNodes;
		for(var i=0;i<tables.length;i++){
			var temptable = tables[i];
			if(temptable.id!=this.propertiesTable.id){
				temptable.style.display = 'none';
			}else{
				this.propertiesTable.style.display = '';
			}
		}
	},
	hiddenProperties:function(){
		if(this.propertiesTable == null){
			if (this.createPropertiesTable() == null) {
				JBPM.console.appendInfo(JBPM.Text.propertiesTableFail);
			}
			if (this.propertiesTable == null) {
				return;
			}
		}
		var div = JBPM.propertiesContainer.lastChild;
		var tables = div.childNodes;
		for(var i=0;i<tables.length;i++){
			var temptable = tables[i];
			if(temptable.id==this.propertiesTable.id){
				temptable.style.display = 'none';
			}
		}
	},
	removePropertiesTable:function(){
		JBPM.propertiesContainer.removeTable(this.propertiesTable);
	},
	createPropertiesTable:function(){
		this.propertiesTable = null;
		if(this.properties){
			this.propertiesTable = document.createElement('table');
			this.propertiesTable.className = 'propertiesTable';
			var tbody = document.createElement('tbody');
			this.propertiesTable.id = 'propertiesTable_'+Math.random();
			for(var i=0;i<this.properties.length;i++){
				var tr = document.createElement('tr');
				var td = document.createElement('td');
				td.width='90%'
				var temp = this.properties[i];
				var name = temp.name?temp.name:'name';
				var label = temp.label?temp.label:name;
				td.innerHTML = label;
				tr.appendChild(td);
				var td1 = document.createElement('td');
				var defaultValue = temp.defaultValue?temp.defaultValue:'';
				this._blurHandler = JBPM.DocUtil.BindAsEventListener(this, this.changeProperty);	
				var type = temp.type;
				if(type=='select'&&temp.selectValues){
					var select = document.createElement("select");
					select.name = name;
					for(var j=0;j<temp.selectValues.length;j++){
						var option = document.createElement("option");
						option.value = temp.selectValues[j].value;
						if(temp.selectValues[j].value==defaultValue){
							option.selected = true;
						}
						option.innerHTML = temp.selectValues[j].label;
						select.appendChild(option);
					}
					
					JBPM.DocUtil.addEventHandler(select, "change",this._blurHandler);
					td1.appendChild(select);
				}else{
					var input = document.createElement("input");
					input.type = 'text';
					input.name = name;
					input.value = defaultValue;
					JBPM.DocUtil.addEventHandler(input, "keyup",this._blurHandler);
					td1.appendChild(input);
				}
				tr.appendChild(td1);
				tbody.appendChild(tr);
			}
			this.propertiesTable.appendChild(tbody);
			JBPM.propertiesContainer.appendTable(this.propertiesTable);
		}
		return this.propertiesTable;
	},
	changeProperty:function(event){
		var obj = JBPM.Util.getEventObj(event);
		if(obj!=null){
			this.setValue(obj.name,obj.value);
		}
	},
	oncreateXML:function(){},
	createXML:function(){
		var type = this.type.toLowerCase()=="script"?"script-temp":this.type;
		this.xmlNode = document.createElement(type);
		for (var i = 0; i < this.properties.length; i++) {
			var temp = this.properties[i];
			var name = temp.name?temp.name:'name';
			if(temp.defaultValue){
				if(temp.isChild){
					var childNode = document.createElement(name);
					childNode.innerHTML = temp.defaultValue;
					this.xmlNode.appendChild(childNode);
				}else if(temp.isAttribute&&temp.valueFrom){
					var v = this.getValue(temp.valueFrom)
					if(temp.defaultValue!=''&&v){
						this.xmlNode.setAttribute(temp.defaultValue,v);
					}
				}else if(temp.isValue){
					continue;
				}else{
					this.xmlNode.setAttribute(name,temp.defaultValue);
				}
			}
		}
		this.oncreateXML();
		return this.xmlNode;
	}
};
JBPM.DataBase.Process=function(){this.init.apply(this,[{}]);};
JBPM.DataBase.Process.prototype = (new JBPM.DataBase.Base).extend({
	oninit: function(obj){
		this.type = "process";
		this.properties = [{
			name:'name',
			label:'name',
			defaultValue:'action'
		},{
			name:'key',
			label:'key'
		},{
			name:'xmlns',
			label:'xmlns',
			defaultValue:JBPM.Text.xmlns
		},{
			name:'version',
			label:'version'
		},{
			name:'description',
			label:'description'
		}];
	}
});
JBPM.DataBase.Node=function(obj){this.init.apply(this,[obj]);};
JBPM.DataBase.Node.prototype = (new JBPM.DataBase.Base).extend({
	oninit:function(obj){
		if(obj!=null){
			this.HTMLObj = obj.HTMLObj;
			this.id = this.HTMLObj.id;
			this.isUsed = false;
			this.type = obj.type;
			this.properties = obj.properties;
			this.isNormal = obj.isNormal;
		}
	},
	changeProperty:function(event){
		var obj = JBPM.Util.getEventObj(event);
		if(obj!=null){
			this.setValue(obj.name,obj.value);
			if(obj.name=='name'&&this.isNormal){
				var span = this.HTMLObj.getElementsByTagName("span")[0];
				span.innerHTML = obj.value;
				JBPM.Util.resetMoveDiv(this.HTMLObj);
				JBPM.Util.resetInitPosition(this.HTMLObj);
				var startNodeRelations = JBPM.DataBase.NodeRelations.getStartNodeRelations(this.HTMLObj.id);
				var endNodeRelations = JBPM.DataBase.NodeRelations.getEndNodeRelations(this.HTMLObj.id);
				if(startNodeRelations&&endNodeRelations){
					for(var i=0;i<startNodeRelations.length;i++){
						var sr = startNodeRelations[i];
						sr.resetEndMiddlePointPosition();
					}
					for(var i=0;i<endNodeRelations.length;i++){
						var er = endNodeRelations[i];
						er.resetStartMiddlePointPosition();
					}
				}
			}
		}
	},
	oncreateXML:function(){
		var gValue = this.HTMLObj.offsetLeft+","+this.HTMLObj.offsetTop+","+this.HTMLObj.offsetWidth+","+this.HTMLObj.offsetHeight;
		this.xmlNode.setAttribute('g',gValue);
		return this.xmlNode;
	}
});  

JBPM.DataBase.Nodes=[];
JBPM.DataBase.Nodes.getNodeById=function(id){
	for(var i=0;i<JBPM.DataBase.Nodes.length;i++){
		var item = JBPM.DataBase.Nodes[i];
		if(item.id==id){
			return item;
		}
	}
	return null;
};
JBPM.DataBase.Nodes.getNodeHTMLObjById=function(id){
	var temp  = JBPM.DataBase.Nodes.getNodeById(id);
	if(temp!=null){
		return temp.HTMLObj;
	}
	return null;
};
JBPM.DataBase.Nodes.getNodesByType=function(type){
	var result = [];
	for(var i=0;i<JBPM.DataBase.Nodes.length;i++){
		var item = JBPM.DataBase.Nodes[i];
		if(item.type==type){
			result.push(item);
		}
	}
	return result;
};
JBPM.DataBase.Nodes.getNodeByName=function(name){
	for(var i=0;i<JBPM.DataBase.Nodes.length;i++){
		var item = JBPM.DataBase.Nodes[i];
		if(item.getValue("name")==name){
			return item;
		}
	}
	return null;
};
JBPM.DataBase.Nodes.getNotUsedNodes=function(){
	var result = [];
	for(var i=0;i<JBPM.DataBase.Nodes.length;i++){
		var item = JBPM.DataBase.Nodes[i];
		if(!item.isUsed){
			result.push(item);
		}
	}
	return result;
};
JBPM.DataBase.Nodes.usedNodeById=function(id){
	var result = JBPM.DataBase.Nodes.getNodeById(id);
	if(result!=null){
		result.isUsed = true;
	}
};
JBPM.DataBase.Nodes.add=function(obj){
	if (obj instanceof JBPM.DataBase.Node) {
		var result = JBPM.DataBase.Nodes.getNodeById(obj.id);
		if(result==null){
			JBPM.DataBase.Nodes.push(obj);
		}else{
			JBPM.console.appendInfo(obj.id+" is exist.")
		}
	}
};
JBPM.DataBase.Nodes.del=function(obj){
	for (var i = 0; i < JBPM.DataBase.Nodes.length; i++) {
		var item = JBPM.DataBase.Nodes[i];
		var flag = false;
		if (obj instanceof JBPM.DataBase.Node) {
			flag = (item.HTMLObj == obj.HTMLObj);
		}else if(typeof(obj)=='string'){
			flag = (item.id == obj);
		}
		if (flag) {
			JBPM.DataBase.Nodes.splice(i, 1);
			return;
		}
	}
};

JBPM.DataBase.NodeRelation=function(obj){this.init.apply(this,[obj]);};
JBPM.DataBase.NodeRelation.prototype = (new JBPM.DataBase.Base).extend({
	oninit:function(obj){
		this.startNodeId = obj.startNodeId;
		this.endNodeId = obj.endNodeId;
		this.labelText = obj.labelText;
		this.startPoint = obj.startPoint;
		this.endPoint = obj.endPoint;
		this.time = null;
		this.type = "transition";
		this.properties = JBPM.Util.cloneArray(JBPM.NodeToolMap.get(this.type).properties);
		this.setValue("name",this.labelText);
		this._deleteHandle = JBPM.DocUtil.BindAsEventListener(this, this.deleteRelation);
		this.startNode = this.getStartNode();
		this.endNode = this.getEndNode();
		this.labelRelativePoint=obj.labelRelativePoint?obj.labelRelativePoint:{x:0,y:0};
		this.initSpecialPoints=obj.specialPoints?obj.specialPoints:[];
		this.points = obj.points?obj.points:[];
	},
	resetStartMiddlePointPosition:function(){
		if(this.points.length>0){
			var s = this.points[0].getStartPoint();
			var e = this.points[0].getEndPoint();
			var m = JBPM.Util.getMiddlePoint(s,e);
			if(m==null){
				return null;
			}
			this.points[0].setPosition(m);
			return this.points[0].HTMLObj;
		}
		return null;
	},
	resetEndMiddlePointPosition:function(){
		if(this.points.length>0){
			var s = this.points[this.points.length-1].getStartPoint();
			var e = this.points[this.points.length-1].getEndPoint();
			var m = JBPM.Util.getMiddlePoint(s,e);
			if(m==null){
				return null;
			}
			this.points[this.points.length-1].setPosition(m);
			return this.points[this.points.length-1].HTMLObj;
		}
		return null;
	},
	getSpecialPoints:function(){
		var result = [];
		for(var i=0;i<this.points.length;i++){
			if(this.points[i].isSpecialPoint){
				result.push(this.points[i].getPosition());
			}
		}
		return result;
	},
	getSpecialPointObjs:function(){
		var result = [];
		for(var i=0;i<this.points.length;i++){
			if(this.points[i].isSpecialPoint){
				result.push(this.points[i]);
			}
		}
		return result;
	},
	getMiddlePoints:function(){
		var result = [];
		for(var i=0;i<this.points.length;i++){
			if(!this.points[i].isSpecialPoint){
				result.push(this.points[i].getPosition());
			}
		}
		return result;
	},
	getMiddlePointObjs:function(){
		var result = [];
		for(var i=0;i<this.points.length;i++){
			if(!this.points[i].isSpecialPoint){
				result.push(this.points[i]);
			}
		}
		return result;
	},
	getSideMiddlePoints:function(specialPoint){
		var result = [];
		if(!specialPoint.isSpecialPoint){
			return null;
		}
		var l = null,r=null;
		
		for(var i=0;i<this.points.length;i++){
			if(!this.points[i].isSpecialPoint){
				continue;
			}
			if(i!=0) l = this.points[i-1];
			if((i+1)!=this.points.length) r= this.points[i+1];
			if(this.points[i]==specialPoint){
				result.push(l);
				result.push(r);
			}
		}
		return result;
	},
	insertPoints:function(spoint,mlpoint,mrpoint){
		for(var i=0;i<this.points.length;i++){
			if(this.points[i]==spoint){
				this.points.splice(i,0,mlpoint);
				this.points.splice(i+2,0,mrpoint);
				return;
			}
		}
	},
	removePoint:function(point){
		for(var i=0;i<this.points.length;i++){
			if(this.points[i]==point){
				return this.points.splice(i,1);
			}
		}
	},
	removeSpecialPoint:function(point){
		if(!point.isSpecialPoint){
			return null;
		}
		var t = null;
		for (var i = 0; i < this.points.length; i++) {
			t = this.points[i];
			if(this.points[i]==point){
				this.points.splice(i-1,3);
				return t;
			}
		}
	},
	clearPoints:function(){
		for (var i = 0; i < this.points.length; i++) {
			this.points[i].HTMLObj.parentNode.removeChild(this.points[i].HTMLObj);
		}
		this.points=[];
	},
	getCenterPoint:function(){
		var sps = this.getSpecialPoints();
		if(sps.length==0){
			var temp = JBPM.Util.getXpoints(this.startNode.HTMLObj,this.endNode.HTMLObj);
			return JBPM.Util.getMiddlePoint(temp.startPoint,temp.endPoint);
		}else{
			if(sps.length%2==0){
				var temp1 = sps[sps.length/2];
				var temp2 = sps[sps.length/2-1];
				return JBPM.Util.getMiddlePoint(temp1,temp2);
			}else{
				return sps[Math.floor(sps.length/2)];
			}
		}
	},
	isCenterPoint:function(point){
		var sps = this.getSpecialPointObjs();
		for(var i=0;i<sps.length;i++){
			if(sps[i]==point){
				return true;
			}
		}
		return false;
	},
	getLinePoints:function(){
		var points = [];
		var sps = this.getSpecialPoints();
		if( sps.length>0){
			var startPoint = JBPM.Util.getXpoint(this.startNode.HTMLObj,sps[0]);
			points.push(startPoint);
			points = points.concat(sps);
			var endPoint = JBPM.Util.getXpoint(this.endNode.HTMLObj,sps[sps.length-1]);
			points.push(endPoint);
		}else{
			var sePoint = JBPM.Util.getXpoints(this.startNode.HTMLObj,this.endNode.HTMLObj);
			points.push(sePoint.startPoint);
			points.push(sePoint.endPoint);
		}
		return points;
	},
	isLabelNeedReset:function(){
		var sps = this.getSpecialPoints();
		if(sps.length%2==0){
			return true;
		}else{
			return false;
		}
	},
	getEndSpecialPointObj:function(){
		var sps = this.getSpecialPointObjs();
		if(sps.length!=0){
			return sps[sps.length-1];
		}else{
			return null;
		}
	},
	getEndMiddlePointObj:function(){
		var sps = this.getMiddlePointObjs();
		if(sps.length!=0){
			return sps[sps.length-1];
		}else{
			return null;
		}
	},
	getStartSpecialPointObj:function(){
		var sps = this.getSpecialPointObjs();
		if(sps.length!=0){
			return sps[0];
		}else{
			return null;
		}
	},
	getStartMiddlePointObj:function(){
		var sps = this.getMiddlePointObjs();
		if(sps.length!=0){
			return sps[0];
		}else{
			return null;
		}
	},
	isStraightLine:function(){
		var sps = this.getSpecialPoints();
		if(sps.length!=0){
			return false;
		}else{
			return true;
		}
	},
	getPointStr:function(){
		var result = "";
		var sps = this.getSpecialPoints();
		for(var i=0;i<sps.length;i++){
			var point = sps[i];
			result += (point.x+","+point.y+";");
		}
		if(result!=""){
			result = result.substr(0,result.length-1);
			result+=":";
		}
		result += (this.labelRelativePoint.x+","+this.labelRelativePoint.y);
		return result;
	},
	removeRelation:function(){
		this.removePropertiesTable();
		this.removeLabel();
		this.clearPoints();
	},
	deleteRelation:function(event){
		JBPM.DataBase.NodeRelations.del(this);
		JBPM.pen.hidden();
		JBPM.pen.getPainter().repaint();
	},
	getStartNode:function(){
		return JBPM.DataBase.Nodes.getNodeById(this.startNodeId);
	},
	getEndNode:function(){
		return JBPM.DataBase.Nodes.getNodeById(this.endNodeId);
	},
	showDeleteBtn:function(event){
		var obj = JBPM.Util.getEventObj(event);
		var div = JBPM.Util.getParentNode(obj,"div");
		var imgs = div.getElementsByTagName("img");
		if(imgs.length==0){
			return;
		}
		imgs[imgs.length-1].style.visibility = "visible";
	},
	hiddenDeleteBtn:function(event){
		var obj = JBPM.Util.getEventObj(event);
		var div = JBPM.Util.getParentNode(obj,"div");
		var imgs = div.getElementsByTagName("img");
		if(imgs.length==0){
			return;
		}
		imgs[imgs.length-1].style.visibility = "hidden";
	},
	initEvent:function(moveLabel){
		this._startHandle = JBPM.DocUtil.BindAsEventListener(this, this.startMove);
		this._moveHandler = JBPM.DocUtil.BindAsEventListener(this, this.moving);
		this._endHandler = JBPM.DocUtil.BindAsEventListener(this, this.endMove);	
		this._overHandler = JBPM.DocUtil.BindAsEventListener(this, this.showDeleteBtn);
		this._outHandler = 	JBPM.DocUtil.BindAsEventListener(this, this.hiddenDeleteBtn);
		if(moveLabel==null){
			moveLabel = this.label;
		}
		JBPM.DocUtil.addEventHandler(moveLabel, "mousedown",this._startHandle);
		JBPM.DocUtil.addEventHandler(moveLabel, "mouseover",this._overHandler);
		JBPM.DocUtil.addEventHandler(moveLabel, "mouseout",this._outHandler);
		JBPM.DocUtil.addEventHandler(document, "mousemove",this._moveHandler);
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.addEventHandler(this.label, "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.addEventHandler(document, "mouseup",this._endHandler);
		}
	},
	startMove:function(event){
		var e = event||window.event;
		var eObj = JBPM.Util.getEventObj(event)
		if(eObj.tagName.toLowerCase()=='img'){
			this.deleteRelation(event);
			return;
		}
		if(this.downPoint==null) this.downPoint = {};
		this.downPoint.x = JBPM.getX(e);
		this.downPoint.y = JBPM.getY(e);
		var md = this.label;
		if(md==null){
			return;
		}
		JBPM.Util.setInitPosition(md);
		if (this.tempLabel&&this.tempLabel.parentNode) {
			this.tempLabel.innerHTML = "";
			this.tempLabel.parentNode.removeChild(this.tempLabel);
			this.tempLabel = null;
		}
		this.tempLabel = md.cloneNode(true);
		this.tempLabel.id = null;
		this.tempLabel.style.border = 'black 1px dotted';
		this.tempLabel.style.backgroundColor = JBPM.CSS.backgroundColor;
		md.parentNode.insertBefore(this.tempLabel,md);
		if (JBPM.DocUtil.isIE) {
			md.setCapture();
		}
		if(JBPM.DocUtil.isFF){
			
		}
		md.style.zIndex=5;
		this.showProperties();
	},
	moving:function(event){
		var e = event||window.event;
		if(this.downPoint==null){
			return;
		}
		var e = event||window.event;
		this.upPoint={};
		this.upPoint.x = JBPM.getX(e);
		this.upPoint.y = JBPM.getY(e);
		var offsetX = this.upPoint.x-this.downPoint.x;
		var offsetY = this.upPoint.y-this.downPoint.y;
		
		var md = this.label;
		if(md==null){
			JBPM.console.appendInfo(JBPM.Text.labelFail);
			return;
		}
		with(md.style){
			var l = JBPM.Util.getInitLeft(md)+offsetX;
			if(l<0){
				l=0;
			}
			if(l+md.offsetWidth>JBPM.FlowArea.offsetWidth){
				l=JBPM.FlowArea.offsetWidth-md.offsetWidth;
			}
			this.upPoint.x=l;
			left = l+'px';
			var t = JBPM.Util.getInitTop(md)+offsetY;
			if(t<0){
				t=0;
			}
			if(t+md.offsetHeight>JBPM.FlowArea.offsetHeight){
				t=JBPM.FlowArea.offsetHeight-md.offsetHeight;
			}
			this.upPoint.y=t;
			top = t+'px';
		}
		JBPM.pen.clearLine();
		JBPM.pen.show();
	},
	endMove:function(event){
		if(this.downPoint==null){
			return;
		}
		var e = event||window.event;
		this.downPoint = null;
		this.upPoint={};
		this.upPoint.x = JBPM.getX(e);
		this.upPoint.y = JBPM.getY(e);
		if (JBPM.DocUtil.isIE&&this.label) {
			this.label.releaseCapture();
		}
		if (JBPM.DocUtil.isFF) {
			
		}
		if(this.label!=null){
			JBPM.Util.resetInitPosition(this.label);
		}
		if (this.tempLabel) {
			this.tempLabel.innerHTML = "";
			this.tempLabel.parentNode.removeChild(this.tempLabel);
			this.tempLabel = null;
		}
		if(this.upPoint==null){
			return;
		}
		this.label.style.zIndex=4;
		var mp = this.getCenterPoint();
		
		this.labelRelativePoint = {x:parseInt(this.label.style.left)-mp.x,y:parseInt(this.label.style.top)-mp.y};
		JBPM.pen.hidden();
	},
	removeEvent:function(){
		JBPM.DocUtil.removeEventHandler(this.label, "mousedown", this._startHandle);
		JBPM.DocUtil.removeEventHandler(document, "mousemove", this._moveHandler);
		if(JBPM.DocUtil.isIE){
			JBPM.DocUtil.removeEventHandler(this.label, "mouseup", this._endHandler);
		}else{
			JBPM.DocUtil.removeEventHandler(document, "mouseup", this._endHandler);
		}
	},
	getLabel:function(){
		return this.label;
	},
	showPoints:function(){
		var sps=this.points;
		if(sps.length==0){
			JBPM.console.appendInfo("points:"+0);
			return;
		}
		for (var i = 0; i < sps.length; i++) {
			sps[i].HTMLObj.style.display = "";
		}
	},
	hiddenPoints:function(){
		var sps=this.points;
		for (var i = 0; i < sps.length; i++) {
			sps[i].HTMLObj.style.display = "none";
		}
	},
	isPointOnRelation:function(point){
		var sps=this.getLinePoints();
		if(sps.length<2){
			return false;
		}
		for(var i=1;i<sps.length;i++){
			var t = JBPM.Util.getDistancePointOnLine(sps[i-1],sps[i],point);
			if(t>0&&t<5){
				return true;
			}
		}
		return false;
	},
	createLabel:function(){
		this.label = document.createElement("div");
		var lp = this.getCenterPoint();
		with(this.label.style){
			border = JBPM.CSS.backgroundColor+" 1px dashed ";
			paddingRight = "10px";
			paddingLeft = "3px";
			paddingTop = "3px";			
			position = 'absolute';
			cursor = 'move';
			width = 'auto';
			height = 'auto';
			fontSize = '12px';
			left = parseInt(lp.x)+parseInt(this.labelRelativePoint.x)+'px';
			top = parseInt(lp.y)+parseInt(this.labelRelativePoint.y)+'px';
			whiteSpace="nowrap";
			zIndex = 2;
		}
		this.label.innerHTML = this.labelText;
		this.label.appendChild(this.createDeleteBtn());
		this.initEvent(this.label);
		this.createInitPoint();
	},
	createDeleteBtn:function(){
		var img = document.createElement("img");
		with(img.style){
			width='10px';
			height='10px';
			position='absolute';
			right='0px';
			top='0px';
			fontSize="0";
			cursor='pointer';
			float="left";
			visibility='hidden';
		}
		img.src = JBPM.Image.deleteBtn;
		img.title = 'delete';
		JBPM.DocUtil.addEventHandler(img, "click", this._deleteHandle);
		return img;
	},
	removeLabel:function(){
		this.label.innerHTML = "";
		this.label.parentNode.removeChild(this.label);
		this.label = null;
	},
	showLabel:function(){
		if(this.label==null){
			this.createLabel();
		}else{
			var lp = this.getCenterPoint();
			if(lp!=null&&lp.x!=null&&lp.y!=null){
				with(this.label.style){
					left = parseInt(lp.x)+parseInt(this.labelRelativePoint.x)+'px';
					top = parseInt(lp.y)+parseInt(this.labelRelativePoint.y)+'px';
				}
			}
			JBPM.Util.resetInitPosition(this.label);
		}
		JBPM.FlowArea.appendChild(this.label);
	},
	createInitPoint:function(){
		if(this.initSpecialPoints.length==0){
			var mpoint = new JBPM.Point({
				startPoint:this.startPoint,
				endPoint:this.endPoint,
				isStartPoint:true,
				isEndPoint:true,
				lastPoint:null,
				nextPoint:null,
				relation:this
			});
			this.points.push(mpoint);
		}else{
			var sp = this.startPoint;
			var ep = this.endPoint;
			for(var i=0;i<this.initSpecialPoints.length;i++){
				var mpoint = new JBPM.Point({
					startPoint:i==0?this.startPoint:this.initSpecialPoints[i-1],
					endPoint:this.initSpecialPoints[i],
					isStartPoint:i==0?true:false,
					isEndPoint:false,
					relation:this
				});
				this.points.push(mpoint);
				var spoint = new JBPM.Point({
					startPoint:i==0?this.startPoint:this.initSpecialPoints[i-1],
					endPoint:i==(this.initSpecialPoints.length-1)?this.endPoint:this.initSpecialPoints[i+1],
					isStartPoint:i==0?true:false,
					isSpecialPoint:true,
					isEndPoint:i==(this.initSpecialPoints.length-1)?true:false,
					point:this.initSpecialPoints[i],
					relation:this
				});
				this.points.push(spoint);
				if(i+1==this.initSpecialPoints.length){
					var lastmpoint = new JBPM.Point({
						startPoint:this.initSpecialPoints[i],
						endPoint:this.endPoint,
						isStartPoint:false,
						isEndPoint:true,
						relation:this
					});
					this.points.push(lastmpoint);
				}
			}
			this.relativePoints();
		}
		var sps = this.getSpecialPointObjs();
		for(var i=0;i<sps.length;i++){
			sps[i].createSpecialPoint();
		}
		var mps = this.getMiddlePointObjs();
		for(var i=0;i<mps.length;i++){
			mps[i].createMiddlePoint();
		}
	},
	relativePoints:function(){
		var last = null;
		for (var i = 0; i < this.points.length; i++) {
			this.points[i].lastPoint =  last;
			if(i+1!=this.points.length){
				this.points[i].nextPoint =  this.points[i+1];
				last = this.points[i];
			}else{
				this.points[i].nextPoint =  null;
			}
			
		}
	},
	changeProperty:function(event){
		var obj = JBPM.Util.getEventObj(event);
		if(obj!=null){
			this.setValue(obj.name,obj.value);
			if (obj.name == 'name') {
				this.label.firstChild.data = obj.value;
				JBPM.Util.resetMoveLabel(this.label);
				JBPM.Util.resetInitPosition(this.label);
				JBPM.pen.getPainter().repaint();
			}
		}
	},
	oncreateXML:function(){
		this.xmlNode.setAttribute('g',this.getPointStr());
		var to = this.getEndNode().getValue('name');
		if(to){
			this.xmlNode.setAttribute('to',to);
		}
		return this.xmlNode;
	}
});
JBPM.DataBase.NodeRelations = [];
JBPM.DataBase.NodeRelations.isExist = function(rela){
	for (var i = 0; i < JBPM.DataBase.NodeRelations.length; i++) {
		var ral = JBPM.DataBase.NodeRelations[i];
		if(ral.endNodeId == rela.endNodeId&&ral.startNodeId == rela.startNodeId){
			return true;
		}
	}
	return false;
};
JBPM.DataBase.NodeRelations.getStartNodes = function(obj){
	var result = [];
	for(var i=0;i<JBPM.DataBase.NodeRelations.length;i++){
		var ral = JBPM.DataBase.NodeRelations[i];
		if(ral.endNodeId == obj){
			result.push(JBPM.DataBase.Nodes.getNodeById(ral.startNodeId));
		}
	}
	return result;
};
JBPM.DataBase.NodeRelations.getEndNodes = function(obj){
	var result = [];
	for(var i=0;i<JBPM.DataBase.NodeRelations.length;i++){
		var ral = JBPM.DataBase.NodeRelations[i];
		if(ral.startNodeId == obj){
			result.push(JBPM.DataBase.Nodes.getNodeById(ral.endNodeId));
		}
	}
	return result;
};
JBPM.DataBase.NodeRelations.getStartNodeRelations = function(obj){
	var result = [];
	for(var i=0;i<JBPM.DataBase.NodeRelations.length;i++){
		var ral = JBPM.DataBase.NodeRelations[i];
		if(ral.endNodeId == obj){
			result.push(ral);
		}
	}
	return result;
};
JBPM.DataBase.NodeRelations.getEndNodeRelations = function(obj){
	var result = [];
	for(var i=0;i<JBPM.DataBase.NodeRelations.length;i++){
		var ral = JBPM.DataBase.NodeRelations[i];
		if(ral.startNodeId == obj){
			result.push(ral);
		}
	}
	return result;
};
JBPM.DataBase.NodeRelations.deleteNodeRelations = function(obj){
	var s = JBPM.DataBase.NodeRelations.getStartNodeRelations(obj);
	for(var i=0;i<s.length;i++){
		JBPM.DataBase.NodeRelations.del(s[i]);
	}
	s = JBPM.DataBase.NodeRelations.getEndNodeRelations(obj);
	for(var i=0;i<s.length;i++){
		JBPM.DataBase.NodeRelations.del(s[i]);
	}
};
JBPM.DataBase.NodeRelations.del=function(obj){
	for (var i = 0; i < JBPM.DataBase.NodeRelations.length; i++) {
		var item = JBPM.DataBase.NodeRelations[i];
		var flag = false;
		if (obj instanceof JBPM.DataBase.NodeRelation) {
			flag = (item == obj);
		}else if(typeof(obj)=='string'){
			
		}
		if (flag) {
			item.removeRelation();
			JBPM.DataBase.NodeRelations.splice(i, 1);
			return;
		}
	}
};

JBPM.Image = {};
JBPM.Image.relative_path = 'images/';
JBPM.Image.canvas_bg 	= JBPM.Image.relative_path+'bg.gif';
JBPM.Image.normal		= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.start 		= JBPM.Image.relative_path+'start.gif';
JBPM.Image.decision 	= JBPM.Image.relative_path+'decision-rule.gif';
JBPM.Image.rule 		= JBPM.Image.relative_path+'decision-rule.gif';
JBPM.Image.end 			= JBPM.Image.relative_path+'end.gif';
JBPM.Image.end_cancel 	= JBPM.Image.relative_path+'end-cancel.gif';
JBPM.Image.end_error 	= JBPM.Image.relative_path+'end-error.gif';
JBPM.Image.fork 		= JBPM.Image.relative_path+'fork-foreach-join.gif';
JBPM.Image.foreach 		= JBPM.Image.relative_path+'fork-foreach-join.gif';
JBPM.Image.join 		= JBPM.Image.relative_path+'fork-foreach-join.gif';
JBPM.Image.select 		= JBPM.Image.relative_path+'select.gif';
JBPM.Image.transition 	= JBPM.Image.relative_path+'transition.gif';
JBPM.Image.transparent 	= JBPM.Image.relative_path+'transparent.gif';
JBPM.Image.sql 			= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.hql 			= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.jms 			= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.state 		= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.custom 		= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.java 		= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.script 		= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.task 		= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.sub_process 	= JBPM.Image.relative_path+'normal.gif';
JBPM.Image.deleteBtn   	= JBPM.Image.relative_path+'delete.gif';
JBPM.Image.source 	 	= JBPM.Image.relative_path+'source.gif';
JBPM.Image.hidden		= JBPM.Image.relative_path+'hidden.gif';
JBPM.Image.show			= JBPM.Image.relative_path+'show.gif';
JBPM.Image.corner		= JBPM.Image.relative_path+'corner.gif';
JBPM.CSS={};
JBPM.CSS.backgroundColor="#D4D0C8";
JBPM.CSS.borderColor	="black";
JBPM.Text={};
JBPM.Text.title 		= "JBPM4 web designer";
JBPM.Text.about			= JBPM.Text.title+" <br> Version 1.4rel ";
JBPM.Text.xmlns			= "http://jbpm.org/4.4/jpdl";
JBPM.Text.help			= "http://www.antout.com";
JBPM.Text.version 		= JBPM.Text.title+" V1.4rel";
JBPM.Text.helpBtn		="Help";
JBPM.Text.aboutBtn		="About";
JBPM.Text.modeLabel		="Working Mode";
JBPM.Text.selectMode	="Selecting|Draging";
JBPM.Text.transitionMode="Transition";
JBPM.Text.priorityLabel ="Priority";
JBPM.Text.selectEffect	="Effect";
JBPM.Text.selectSpeed	="Speed";
JBPM.Text.moreInfo		="More ";
JBPM.Text.canvasFail	="Fetch canvas failed!";
JBPM.Text.paramterFail	="Parameters do not match the function declaration, Or the coordinate of point did not change!";
JBPM.Text.startNode		="Start node should be the node of flow chart!";
JBPM.Text.endNode		="End node should be the node of flow chart!";
JBPM.Text.relationExist	="The node connection already exists!";
JBPM.Text.paramterInvalid="Parameter invalid!";
JBPM.Text.loadImageFail ="Loading image resources failed, please check your network. This may affect your current design!";
JBPM.Text.deleteException ="Delete exception!"; 
JBPM.Text.nodeOvermuch 	="Create this kind of node overmuch!";
JBPM.Text.nodeFail 		="Fetch moveable node failed!";
JBPM.Text.pointFail 	="Fetch moveable point failed!";
JBPM.Text.midPointFail 	="Create midpoint failed!";
JBPM.Text.propertiesTableFail ="Create properties-table failed!"
JBPM.Text.labelFail 	="Fetch relation-label failed!";