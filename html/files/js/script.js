(function () { "use strict";
var DateTools = function() { };
DateTools.__name__ = true;
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "C":
		return StringTools.lpad(Std.string(Std["int"](d.getFullYear() / 100)),"0",2);
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "e":
		return Std.string(d.getDate());
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) return "PM"; else return "AM";
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "s":
		return Std.string(Std["int"](d.getTime() / 1000));
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "t":
		return "\t";
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "u":
		var t = d.getDay();
		if(t == 0) return "7"; else if(t == null) return "null"; else return "" + t;
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	case "Y":
		return Std.string(d.getFullYear());
	default:
		throw "Date.format %" + e + "- not implemented yet.";
	}
};
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.addSub(f,p,np - p);
		r.add(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.addSub(f,p,f.length - p);
	return r.b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	new js.JQuery("document").ready(function(event) {
		view.Searchbox.init();
		view.Works.init();
		view.Editbox.init();
		ui.Keyboard.init();
	});
};
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var haxe = {};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = true;
haxe.Http.prototype = {
	setParameter: function(param,value) {
		this.params = Lambda.filter(this.params,function(p) {
			return p.param != param;
		});
		this.params.push({ param : param, value : value});
		return this;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			if(i == null) s.b += "null"; else s.b += "" + i;
			s.b += " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
};
var jp = {};
jp.saken = {};
jp.saken.utils = {};
jp.saken.utils.API = function() { };
jp.saken.utils.API.__name__ = true;
jp.saken.utils.API.getJSON = function(name,params,onLoaded) {
	jp.saken.utils.API.getString(name,params,function(data) {
		onLoaded(JSON.parse(data));
	});
};
jp.saken.utils.API.getString = function(name,params,onLoaded) {
	var http = new haxe.Http("/api/" + name + "/");
	http.onData = function(data) {
		onLoaded(data);
	};
	var $it0 = params.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		http.setParameter(key,params.get(key));
	}
	http.request(true);
};
jp.saken.utils.API.getIP = function(onLoaded) {
	jp.saken.utils.API.getString("handy",(function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("key","ip");
		$r = _g;
		return $r;
	}(this)),onLoaded);
};
var js = {};
jp.saken.utils.Dom = function() { };
jp.saken.utils.Dom.__name__ = true;
jp.saken.utils.File = function() { };
jp.saken.utils.File.__name__ = true;
jp.saken.utils.File.downloadDirect = function(folder,filename) {
	var jAnchor = new js.JQuery("<a>");
	jAnchor.prop("download",filename);
	jAnchor.prop("href",folder + filename);
	jAnchor.prop("target","_blank");
	jp.saken.utils.Dom.jBody.append(jAnchor);
	jAnchor.get(0).click();
	jAnchor.remove();
};
jp.saken.utils.File.readAsDataURL = function(onLoaded) {
	var file = event.target.files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(event) {
		onLoaded(event.target.result);
	};
	fileReader.readAsDataURL(file);
};
jp.saken.utils.Handy = function() { };
jp.saken.utils.Handy.__name__ = true;
jp.saken.utils.Handy.alert = function(value) {
	jp.saken.utils.Dom.window.alert(value);
};
jp.saken.utils.Handy.confirm = function(text,ok,cancel) {
	if(jp.saken.utils.Dom.window.confirm(text)) ok(); else if(cancel != null) cancel();
};
jp.saken.utils.Handy.getPastDate = function(date,num) {
	if(num == null) num = 30;
	var second = HxOverrides.strDate(date).getTime() - num * 86400000;
	var date1;
	var d = new Date();
	d.setTime(second);
	date1 = d;
	var m = jp.saken.utils.Handy.getFilledNumber(date1.getMonth() + 1,2);
	var d1 = jp.saken.utils.Handy.getFilledNumber(date1.getDate(),2);
	return date1.getFullYear() + "-" + m + "-" + d1;
};
jp.saken.utils.Handy.getFilledNumber = function(num,digits) {
	if(digits == null) digits = 3;
	var result = num + "";
	var blankLength = digits - jp.saken.utils.Handy.getDigits(num);
	var _g = 0;
	while(_g < blankLength) {
		var i = _g++;
		result = "0" + result;
	}
	return result;
};
jp.saken.utils.Handy.getDigits = function(val) {
	return (val + "").length;
};
jp.saken.utils.Handy.getFormattedPrice = function(price) {
	var string;
	if(price == null) string = "null"; else string = "" + price;
	var length = string.length;
	var result = "";
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		if(i > 0 && (length - i) % 3 == 0) result += ",";
		result += string.charAt(i);
	}
	return "￥" + result + "-";
};
jp.saken.utils.Handy.getLinkedHTML = function(text,target) {
	if(target == null) target = "_blank";
	if(new EReg("http","").match(text)) text = new EReg("((http|https)://[0-9a-z-/._?=&%\\[\\]~^:]+)","gi").replace(text,"<a href=\"$1\" target=\"" + target + "\">$1</a>");
	return text;
};
jp.saken.utils.Handy.getBreakedHTML = function(text) {
	if(new EReg("\n","").match(text)) text = new EReg("\r?\n","g").replace(text,"<br>");
	return text;
};
jp.saken.utils.Handy.getAdjustedHTML = function(text) {
	return jp.saken.utils.Handy.getLinkedHTML(jp.saken.utils.Handy.getBreakedHTML(text));
};
jp.saken.utils.Handy.getLines = function(text) {
	return jp.saken.utils.Handy.getNumberOfCharacter(text,"\n") + 1;
};
jp.saken.utils.Handy.getNumberOfCharacter = function(text,character) {
	return text.split(character).length - 1;
};
jp.saken.utils.Handy.getLimitText = function(text,count) {
	if(count == null) count = 10;
	if(text.length > count) text = HxOverrides.substr(text,0,count) + "...";
	return text;
};
jp.saken.utils.Handy.getReplacedSC = function(text) {
	text = StringTools.replace(text,"'","&#039;");
	text = StringTools.replace(text,"\\","&#47;");
	return text;
};
jp.saken.utils.Handy.getSlicedArray = function(array,num) {
	if(num == null) num = 1000;
	var results = [];
	var _g1 = 0;
	var _g = Math.ceil(array.length / num);
	while(_g1 < _g) {
		var i = _g1++;
		var j = i * num;
		results.push(array.slice(j,j + num));
	}
	return results;
};
jp.saken.utils.Handy.shuffleArray = function(array) {
	var copy = array.slice();
	var results = [];
	var length = copy.length;
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		var index = Math.floor(Math.random() * length);
		results.push(copy[index]);
		copy.splice(index,1);
	}
	return results;
};
jp.saken.utils.Handy.getMap = function(array) {
	var map = new haxe.ds.IntMap();
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var info = array[i];
		var id = info.id;
		Reflect.deleteField(info,"id");
		var fields = Reflect.fields(info);
		var value;
		if(fields.length > 1) value = info; else value = Reflect.getProperty(info,fields[0]);
		var v = value;
		map.set(id,v);
		v;
	}
	return map;
};
jp.saken.utils.Handy.getIsImageSource = function(string) {
	return new EReg("data:image","").match(string);
};
jp.saken.utils.Loader = function() { };
jp.saken.utils.Loader.__name__ = true;
jp.saken.utils.Loader.loadImage = function(src,onLoaded) {
	var image = new Image();
	image.src = src;
	image.onload = function(event) {
		var splits = src.split(";base64,");
		var type = splits[0].split("data:image/")[1];
		var jImage = new js.JQuery(image);
		if(type == "jpeg") type = "jpg";
		jImage.data("type",type);
		jImage.data("base64",splits[1]);
		onLoaded(jImage);
	};
};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Browser = function() { };
js.Browser.__name__ = true;
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
var ui = {};
ui.Keyboard = function() { };
ui.Keyboard.__name__ = true;
ui.Keyboard.init = function() {
	jp.saken.utils.Dom.jWindow.on("keydown",ui.Keyboard.onKeydown);
};
ui.Keyboard.onKeydown = function(event) {
	var keyCode = event.keyCode;
	if(event.ctrlKey) {
		if(keyCode == 69) view.Editbox.toggle();
	}
};
var utils = {};
utils.Data = function() { };
utils.Data.__name__ = true;
utils.Data.load = function(keyword,from,to) {
	var params;
	var _g = new haxe.ds.StringMap();
	_g.set("from",from);
	_g.set("to",to);
	params = _g;
	if(keyword.length > 0) {
		params.set("client",keyword);
		keyword;
	}
	jp.saken.utils.API.getJSON("webResults2",params,function(data) {
		if(data.length == 0) {
			params.remove("client");
			params.set("keyword",keyword);
			keyword;
			jp.saken.utils.API.getJSON("webResults2",params,utils.Data.onLoaded);
			return;
		}
		utils.Data.onLoaded(data);
	});
};
utils.Data.insert = function(params,onLoaded) {
	params.set("mode","insert");
	"insert";
	utils.Data.set(params,onLoaded);
};
utils.Data.update = function(id,params,onLoaded) {
	var v;
	if(id == null) v = "null"; else v = "" + id;
	params.set("id",v);
	v;
	params.set("mode","update");
	"update";
	utils.Data.set(params,onLoaded);
};
utils.Data.loadOne = function(id,onLoaded) {
	jp.saken.utils.API.getJSON("webResults2",(function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("id",id == null?"null":"" + id);
		$r = _g;
		return $r;
	}(this)),function(data) {
		onLoaded(data[0]);
	});
};
utils.Data.onLoaded = function(data) {
	if(data.length > 0) view.Works.setHTML(utils.Data.getSplitedData(data)); else view.Works.setEmptyHTML();
	utils.Data.traceMembersCost(data);
};
utils.Data.set = function(params,onLoaded) {
	jp.saken.utils.API.getString("webResults2",params,function(data) {
		onLoaded();
	});
};
utils.Data.getSplitedData = function(data) {
	var map = new haxe.ds.IntMap();
	var _g1 = 0;
	var _g = data.length;
	while(_g1 < _g) {
		var i = _g1++;
		var info = data[i];
		var date = info.date;
		var array = map.get(date);
		if(array == null) array = [];
		array.push(info);
		map.set(date,array);
		array;
	}
	return map;
};
utils.Data.traceMembersCost = function(data) {
	jp.saken.utils.API.getIP(function(ip) {
		if(ip != "192.168.0.39") return;
		var map = new haxe.ds.StringMap();
		var _g1 = 0;
		var _g = data.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ratioList = data[i].price_ratio_list;
			if(ratioList == null) continue;
			var ratios = ratioList.split(",");
			var _g3 = 0;
			var _g2 = ratios.length;
			while(_g3 < _g2) {
				var j = _g3++;
				var splits = ratios[j].split("=");
				var member = splits[0];
				var cost = Std.parseInt(splits[1]);
				var total = map.get(member);
				if(total == null) total = 0;
				total += cost;
				map.set(member,total);
				total;
			}
		}
		console.log(map.toString());
	});
};
var view = {};
view.Editbox = function() { };
view.Editbox.__name__ = true;
view.Editbox.init = function() {
	view.Editbox._jParent = new js.JQuery("#editbox");
	view.Editbox._jMainArea = new js.JQuery("#all").add(new js.JQuery("#header"));
	view.Editbox._jCover = view.Editbox._jParent.find(".cover");
	view.Editbox._jColumns = view.Editbox._jParent.find("[data-column]");
	view.Editbox._jPreview = view.Editbox._jParent.find(".image").find(".preview");
	view.Editbox._width = view.Editbox._jParent.width();
	view.Editbox._isOpened = false;
	view.Editbox._jParent.on("change",view.Editbox.onChange);
	view.Editbox._jParent.on("click",view.Editbox.onClick);
	view.Editbox.setRatio();
	view.Editbox.setSales();
	view.Editbox.setHasAuth();
};
view.Editbox.toggle = function() {
	if(!view.Editbox._hasAuth) return;
	view.Editbox._currentID = null;
	if(view.Editbox._isOpened) view.Editbox.close(); else view.Editbox.open();
};
view.Editbox.edit = function(id) {
	if(!view.Editbox._hasAuth) {
		jp.saken.utils.Handy.alert("無効な操作です。");
		return;
	}
	view.Editbox._currentID = id;
	view.Editbox.open();
	utils.Data.loadOne(id,view.Editbox.setData);
};
view.Editbox.close = function() {
	if(!view.Editbox._isOpened) return;
	view.Editbox._isOpened = false;
	view.Editbox.move(0);
};
view.Editbox.setDefault = function() {
	view.Editbox._jColumns.prop("value","");
	view.Editbox._jColumns.filter("[type=\"radio\"]").prop("checked",true);
	view.Editbox._jColumns.filter("select").each(function() {
		var jTarget = $(this);
		jTarget.prop("value",jTarget.find("option").first().prop("value"));
	});
	view.Editbox._jParent.find(".ratio-input").prop("value",0).trigger("change");
	view.Editbox._jParent.find("#editbox-date").prop("value",DateTools.format(new Date(),"%Y-%m"));
	view.Editbox._jPreview.empty();
};
view.Editbox.setData = function(data) {
	var setDate = function(jTarget,value) {
		var date = view.Html.getFormattedDate(value,"-");
		jTarget.prop("value",date);
	};
	var setRadio = function(jTarget1,isOn) {
		if(!isOn) return;
		jTarget1.prop("checked",false);
		jTarget1.nextAll("input").prop("checked",true);
	};
	var setImage = function(jTarget2,value1) {
		if(!jp.saken.utils.Handy.getIsImageSource(value1)) return;
		jTarget2.html("<img src=\"" + value1 + "\">");
	};
	var setRatio = function(jParent,data1) {
		if(data1 == null) return;
		var ratios = data1.split(",");
		var _g1 = 0;
		var _g = ratios.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ratio = ratios[i];
			var splits = ratio.split("=");
			var id = splits[0];
			var value2 = splits[1];
			jParent.find(".ratio-input[data-id=\"" + id + "\"]").prop("value",value2);
		}
		jParent.find(".ratio-input").trigger("change");
	};
	view.Editbox._jColumns.each(function() {
		var jTarget3 = $(this);
		var column = jTarget3.data("column");
		var value3 = Reflect.getProperty(data,column);
		switch(column) {
		case "date":
			setDate(jTarget3,Std.parseInt(value3));
			break;
		case "is_help":case "is_public":
			setRadio(jTarget3,value3 == "1");
			break;
		case "image":
			setImage(view.Editbox._jPreview,value3);
			break;
		default:
			jTarget3.prop("value",value3);
		}
	});
	setRatio(view.Editbox._jParent.find(".ratio"),data.ratio_list);
};
view.Editbox.open = function() {
	if(view.Editbox._isOpened) return;
	view.Editbox._isOpened = true;
	view.Editbox.move(view.Editbox._width);
	view.Editbox.setDefault();
};
view.Editbox.move = function(x) {
	view.Editbox._jMainArea.stop().animate({ left : x},200);
};
view.Editbox.onChange = function(event) {
	var jTarget = new js.JQuery(event.target);
	if(jTarget.hasClass("ratio-input")) {
		var jParent = jTarget.parents(".ratio");
		var total = 0;
		jParent.find("input[type=\"number\"]").each(function() {
			total += Std.parseInt($(this).prop("value"));
		});
		jParent.find(".total").text(total == null?"null":"" + total);
	} else if(jTarget.hasClass("image-input")) jp.saken.utils.File.readAsDataURL(view.Editbox.loadImage);
};
view.Editbox.loadImage = function(src) {
	jp.saken.utils.Loader.loadImage(src,function(jImage) {
		view.Editbox._jPreview.empty().append(jImage);
	});
};
view.Editbox.onClick = function(event) {
	var jTarget = new js.JQuery(event.target);
	if(jTarget["is"]("[type=\"submit\"]")) {
		view.Editbox.submit();
		return false;
	} else if(jTarget.hasClass("delete-image")) view.Editbox.deleteImage();
};
view.Editbox.submit = function() {
	var jRequired = view.Editbox._jParent.find("input[required]");
	var _g1 = 0;
	var _g = jRequired.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(jRequired.eq(i).prop("value").length == 0) return;
	}
	view.Editbox._jCover.show();
	if(view.Editbox._currentID == null) utils.Data.insert(view.Editbox.getParams(),view.Editbox.onUpdated); else utils.Data.update(view.Editbox._currentID,view.Editbox.getParams(),view.Editbox.onUpdated);
};
view.Editbox.deleteImage = function() {
	view.Editbox._jPreview.empty();
	view.Editbox._jColumns.filter("[data-column=\"image\"]").prop("value","");
};
view.Editbox.onUpdated = function() {
	var timer = new haxe.Timer(1000);
	timer.run = function() {
		timer.stop();
		view.Editbox.setDefault();
		view.Editbox._jCover.hide();
		if(view.Editbox._currentID != null) {
			view.Editbox._currentID = null;
			view.Editbox.close();
		}
		view.Searchbox.reload();
	};
};
view.Editbox.getParams = function() {
	var params = new haxe.ds.StringMap();
	view.Editbox._jColumns.each(function() {
		var jTarget = $(this);
		var key = jTarget.data("column");
		var value = jTarget.prop("value");
		if(jTarget["is"]("[type=\"radio\"]")) if(jTarget["is"](":checked")) value = "0"; else value = "1";
		if(key == "date") value = StringTools.replace(value,"-","");
		params.set(key,value);
		value;
	});
	var v = view.Editbox.getRatioList();
	params.set("ratio_list",v);
	v;
	var v1 = view.Editbox.getImageSRC();
	params.set("image",v1);
	v1;
	return params;
};
view.Editbox.getRatioList = function() {
	var array = [];
	view.Editbox._jParent.find(".ratio").find(".member").each(function() {
		var jTarget = $(this);
		var id = jTarget.data("id");
		var value = jTarget.find("input").prop("value");
		if(value == "0") return;
		array.push(id + "=" + value);
	});
	return array.join(",");
};
view.Editbox.getImageSRC = function() {
	var src = view.Editbox._jPreview.find("img").prop("src");
	if(src == null || !jp.saken.utils.Handy.getIsImageSource(src)) src = "";
	return src;
};
view.Editbox.setRatio = function() {
	jp.saken.utils.API.getJSON("members",(function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("team","web");
		$r = _g;
		return $r;
	}(this)),function(data) {
		var html = "";
		var _g2 = 0;
		var _g1 = data.length;
		while(_g2 < _g1) {
			var i = _g2++;
			var info = data[i];
			var id = info.id;
			var inputID = "editbox-ratio-" + id;
			html += "\n\t\t\t\t<dd class=\"member\" data-id=\"" + id + "\">\n\t\t\t\t\t<label for=\"" + inputID + "\">" + info.name.split(" ")[0] + "</label>\n\t\t\t\t\t<input type=\"number\" min=\"0\" max=\"100\" value=\"0\" class=\"ratio-input\" id=\"" + inputID + "\" data-id=\"" + id + "\">\n\t\t\t\t</dd>";
		}
		view.Editbox._jParent.find(".ratio").append(html + "<dd class=\"total\">0</dd>");
	});
};
view.Editbox.setSales = function() {
	jp.saken.utils.API.getJSON("members",(function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("section","sales");
		$r = _g;
		return $r;
	}(this)),function(data) {
		var html = "";
		var _g2 = 0;
		var _g1 = data.length;
		while(_g2 < _g1) {
			var i = _g2++;
			var info = data[i];
			html += "<option value=\"" + Std.string(info.id) + "\">" + Std.string(info.name) + "</option>";
		}
		view.Editbox._jParent.find(".sales").find("select").html(html);
	});
};
view.Editbox.setHasAuth = function() {
	jp.saken.utils.API.getString("members",(function($this) {
		var $r;
		var _g = new haxe.ds.StringMap();
		_g.set("auth","web");
		$r = _g;
		return $r;
	}(this)),function(data) {
		view.Editbox._hasAuth = data == "true";
	});
};
view.Html = function() { };
view.Html.__name__ = true;
view.Html.get = function(map) {
	view.Html._totalCost = 0;
	var html = "<table>";
	var $it0 = map.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		html += view.Html.getMonthlyWorks(key,map.get(key));
	}
	return html + "</table>";
};
view.Html.getFormattedDate = function(date,separator) {
	if(separator == null) separator = ".";
	var string;
	if(date == null) string = "null"; else string = "" + date;
	return HxOverrides.substr(string,0,4) + separator + HxOverrides.substr(string,4,2);
};
view.Html.getMonthlyWorks = function(key,array) {
	var monthlyCost = 0;
	var html = "\n\t\t<tr class=\"date\">\n\t\t\t<th colspan=\"" + 7 + "\">" + view.Html.getFormattedDate(key) + "</th>\n\t\t</tr>";
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var info = array[i];
		html += view.Html.getWork(info);
		monthlyCost += info.cost;
	}
	view.Html._totalCost += monthlyCost;
	html += "\n\t\t<tr class=\"monthly-cost\">\n\t\t\t<td class=\"cost\" colspan=\"" + 7 + "\">月計：" + jp.saken.utils.Handy.getFormattedPrice(monthlyCost) + "</td>\n\t\t</tr>\n\t\t<tr class=\"total-cost\">\n\t\t\t<td class=\"cost\" colspan=\"" + 7 + "\">累計：" + jp.saken.utils.Handy.getFormattedPrice(view.Html._totalCost) + "</td>\n\t\t</tr>\n\t\t<tr class=\"blank\"><td colspan=\"" + 7 + "\"></td></tr>";
	return html;
};
view.Html.getWork = function(info) {
	var keys = ["number","client","name","members","sales","cost"];
	var html = "<tr class=\"work\" data-id=\"" + Std.string(info.id) + "\">";
	var _g1 = 0;
	var _g = keys.length;
	while(_g1 < _g) {
		var i = _g1++;
		html += view.Html.getTD(info,keys[i]);
	}
	html += "<td class=\"edit\"><button type=\"button\" class=\"edit-button\">✎</button></td>";
	return html + "</tr>";
};
view.Html.getTD = function(info,key) {
	var content = "";
	if(key == "members") {
		var ratioList = info.price_ratio_list;
		if(ratioList != null) content = view.Html.getMembers(ratioList.split(","));
	} else {
		var value = Std.string(Reflect.getProperty(info,key));
		if(value == "null") value = "";
		switch(key) {
		case "cost":
			content = jp.saken.utils.Handy.getFormattedPrice(Std.parseInt(value));
			break;
		case "name":
			var url = info.url;
			var name = value;
			var prop = "";
			if(url.length > 0) prop = " href=\"" + url + "\" class=\"link\" target=\"_blank\"";
			content = "<a" + prop + ">" + name + "</a>";
			break;
		default:
			if(value.length > 0) content = value; else content = "-";
		}
	}
	return "<td class=\"" + key + "\">" + content + "</td>";
};
view.Html.getMembers = function(ratios) {
	ratios.sort(function(a,b) {
		return Std.parseInt(b.split("=")[1]) - Std.parseInt(a.split("=")[1]);
	});
	var members = [];
	var _g1 = 0;
	var _g = ratios.length;
	while(_g1 < _g) {
		var i = _g1++;
		members.push(ratios[i].split("=")[0]);
	}
	return members.join(",");
};
view.Searchbox = function() { };
view.Searchbox.__name__ = true;
view.Searchbox.init = function() {
	view.Searchbox._jParent = new js.JQuery("#searchbox");
	view.Searchbox._jKeyword = view.Searchbox._jParent.find(".keyword").find("input");
	view.Searchbox._jFrom = view.Searchbox._jParent.find(".from").find("input");
	view.Searchbox._jTo = view.Searchbox._jParent.find(".to").find("input");
	view.Searchbox._jSubmit = view.Searchbox._jParent.find(".submit").find("button");
	view.Searchbox.setYear(new Date().getFullYear());
	view.Searchbox._jSubmit.on("click",view.Searchbox.submit).trigger("click");
};
view.Searchbox.reload = function() {
	view.Searchbox._jSubmit.trigger("click");
};
view.Searchbox.setYear = function(year) {
	view.Searchbox._jFrom.prop("value",view.Searchbox.getFormattedDate(year,1));
	view.Searchbox._jTo.prop("value",view.Searchbox.getFormattedDate(year,12));
};
view.Searchbox.submit = function(event) {
	var keyword = view.Searchbox._jKeyword.prop("value");
	var from = view.Searchbox.getDateNumber(view.Searchbox._jFrom.prop("value"));
	var to = view.Searchbox.getDateNumber(view.Searchbox._jTo.prop("value"));
	utils.Data.load(keyword,from,to);
	return false;
};
view.Searchbox.getDateNumber = function(date) {
	return StringTools.replace(date,"-","");
};
view.Searchbox.getFormattedDate = function(year,month) {
	return year + "-" + jp.saken.utils.Handy.getFilledNumber(month,2);
};
view.Works = function() { };
view.Works.__name__ = true;
view.Works.init = function() {
	view.Works._jParent = new js.JQuery("#works");
	view.Works._jParent.on("click",view.Works.onClick);
};
view.Works.setHTML = function(map) {
	view.Works._jParent.html(view.Html.get(map));
};
view.Works.setEmptyHTML = function() {
	view.Works._jParent.html("<tr><th>検索結果：0件<th></tr>");
};
view.Works.onClick = function(event) {
	var jTarget = new js.JQuery(event.target);
	if(jTarget.hasClass("edit-button")) {
		view.Editbox.edit(jTarget.parents(".work").data("id"));
		return;
	}
	view.Editbox.close();
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
var q = window.jQuery;
js.JQuery = q;
jp.saken.utils.API.PATH = "/api/";
jp.saken.utils.Dom.document = window.document;
jp.saken.utils.Dom.window = window;
jp.saken.utils.Dom.jWindow = new js.JQuery(jp.saken.utils.Dom.window);
jp.saken.utils.Dom.body = jp.saken.utils.Dom.document.body;
jp.saken.utils.Dom.jBody = new js.JQuery(jp.saken.utils.Dom.body);
jp.saken.utils.Dom.userAgent = jp.saken.utils.Dom.window.navigator.userAgent;
utils.Data.API_NAME = "webResults2";
utils.Data.MY_IP = "192.168.0.39";
view.Html.COLUMN_LENGTH = 7;
Main.main();
})();
