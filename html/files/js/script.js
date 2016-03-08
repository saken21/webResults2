(function () { "use strict";
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
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
Main.main = function() {
	new js.JQuery("document").ready(function(event) {
		view.Form.init();
		view.Works.init();
	});
};
var IMap = function() { };
var Reflect = function() { };
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
var Std = function() { };
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringTools = function() { };
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
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
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
};
var jp = {};
jp.saken = {};
jp.saken.utils = {};
jp.saken.utils.API = function() { };
jp.saken.utils.API.getJSON = function(name,params,onLoaded) {
	var http = new haxe.Http("/api/" + name + "/");
	http.onData = function(data) {
		onLoaded(JSON.parse(data));
	};
	var $it0 = params.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		http.setParameter(key,params.get(key));
	}
	http.request(true);
};
var js = {};
jp.saken.utils.Dom = function() { };
jp.saken.utils.Handy = function() { };
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
js.Browser = function() { };
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
var utils = {};
utils.Data = function() { };
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
utils.Data.onLoaded = function(data) {
	if(data.length > 0) view.Works.setHTML(utils.Data.getSplitedData(data)); else view.Works.setEmptyHTML();
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
var view = {};
view.Form = function() { };
view.Form.init = function() {
	view.Form._jParent = new js.JQuery("#form");
	view.Form._jKeyword = view.Form._jParent.find(".keyword").find("input");
	view.Form._jFrom = view.Form._jParent.find(".from").find("input");
	view.Form._jTo = view.Form._jParent.find(".to").find("input");
	view.Form._jSubmit = view.Form._jParent.find(".submit").find("button");
	view.Form.setYear(new Date().getFullYear());
	view.Form._jSubmit.on("click",view.Form.submit).trigger("click");
};
view.Form.setYear = function(year) {
	view.Form._jFrom.prop("value",view.Form.getFormattedDate(year,1));
	view.Form._jTo.prop("value",view.Form.getFormattedDate(year,12));
};
view.Form.submit = function(event) {
	var keyword = view.Form._jKeyword.prop("value");
	var from = view.Form.getDateNumber(view.Form._jFrom.prop("value"));
	var to = view.Form.getDateNumber(view.Form._jTo.prop("value"));
	utils.Data.load(keyword,from,to);
	return false;
};
view.Form.getDateNumber = function(date) {
	return StringTools.replace(date,"-","");
};
view.Form.getFormattedDate = function(year,month) {
	return year + "-" + jp.saken.utils.Handy.getFilledNumber(month,2);
};
view.Html = function() { };
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
view.Html.getMonthlyWorks = function(key,array) {
	var monthlyCost = 0;
	var html = "\n\t\t<tr class=\"date\">\n\t\t\t<th colspan=\"" + 6 + "\">" + view.Html.getFormattedDate(key) + "</th>\n\t\t</tr>";
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var info = array[i];
		html += view.Html.getWork(info);
		monthlyCost += info.cost;
	}
	view.Html._totalCost += monthlyCost;
	html += "\n\t\t<tr class=\"monthly-cost\">\n\t\t\t<td class=\"cost\" colspan=\"" + 6 + "\">月計：" + view.Html.getFormattedPrice(monthlyCost) + "</td>\n\t\t</tr>\n\t\t<tr class=\"total-cost\">\n\t\t\t<td class=\"cost\" colspan=\"" + 6 + "\">累計：" + view.Html.getFormattedPrice(view.Html._totalCost) + "</td>\n\t\t</tr>\n\t\t<tr class=\"blank\"><td colspan=\"" + 6 + "\"></td></tr>";
	return html;
};
view.Html.getWork = function(info) {
	var keys = ["number","client","name","members","sales","cost"];
	var html = "<tr class=\"work\">";
	var _g1 = 0;
	var _g = keys.length;
	while(_g1 < _g) {
		var i = _g1++;
		html += view.Html.getTD(info,keys[i]);
	}
	return html + "</tr>";
};
view.Html.getTD = function(info,key) {
	var content = "";
	if(key == "members") content = view.Html.getMembers(info.ratio_list.split(",")); else {
		var value = Reflect.getProperty(info,key);
		switch(key) {
		case "cost":
			content = view.Html.getFormattedPrice(Std.parseInt(value));
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
view.Html.getFormattedDate = function(date) {
	var string;
	if(date == null) string = "null"; else string = "" + date;
	return HxOverrides.substr(string,0,4) + "." + HxOverrides.substr(string,4,2);
};
view.Html.getFormattedPrice = function(price) {
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
view.Works = function() { };
view.Works.init = function() {
	view.Works._jParent = new js.JQuery("#works");
};
view.Works.setHTML = function(map) {
	view.Works._jParent.html(view.Html.get(map));
};
view.Works.setEmptyHTML = function() {
	view.Works._jParent.html("<tr><th>検索結果：0件<th></tr>");
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
view.Html.COLUMN_LENGTH = 6;
Main.main();
})();
