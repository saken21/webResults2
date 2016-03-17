package view;

import js.JQuery;
import jp.saken.utils.Handy;
import jp.saken.utils.API;
import utils.Data;

class Editbox {
	
	private static var _jParent  :JQuery;
	private static var _jMainArea:JQuery;
	private static var _width    :Int;
	private static var _isOpened :Bool;
	private static var _hasAuth  :Bool;
	
	/* =======================================================================
	Public - Init
	========================================================================== */
	public static function init():Void {
		
		_jParent   = new JQuery('#editbox');
		_jMainArea = new JQuery('#all').add(new JQuery('#header'));
		_width     = _jParent.width();
		_isOpened  = false;
		
		setSales();
		setHasAuth();
		
	}
	
		/* =======================================================================
		Public - Toggle
		========================================================================== */
		public static function toggle():Void {
			
			if (!_hasAuth) return;
			
			if (_isOpened) close();
			else open();

		}
		
		/* =======================================================================
		Public - Edit
		========================================================================== */
		public static function edit(id:Int):Void {
			
			if (!_hasAuth) {
				
				Handy.alert('無効な操作です。');
				return;
				
			}
			
			open();

		}
	
	/* =======================================================================
	Open
	========================================================================== */
	private static function open():Void {
		
		if (_isOpened) return;
		
		_isOpened = true;
		move(_width);

	}
	
	/* =======================================================================
	Close
	========================================================================== */
	private static function close():Void {
		
		if (!_isOpened) return;
		
		_isOpened = false;
		move(0);

	}
	
	/* =======================================================================
	Move
	========================================================================== */
	private static function move(x:Int):Void {
		
		_jMainArea.stop().animate({ left:x }, 200);

	}
	
	/* =======================================================================
	Set Sales
	========================================================================== */
	private static function setSales():Void {
		
		API.getJSON('members',['section'=>'sales'],function(data:Array<Dynamic>):Void {
			
			var map:Map<Int,Dynamic> = Handy.getMap(data);
			var html:String = '';
			
			for (key in map.keys()) {
				
				html += '<option value="' + key + '">' + map[key] + '</option>';
				
			}
			
			_jParent.find('.sales').find('select').html(html);
			
		});

	}
	
	/* =======================================================================
	Set Has Auth
	========================================================================== */
	private static function setHasAuth():Void {
		
		API.getString('members',['auth'=>'web'],function(data:String):Void {
			_hasAuth = (data == 'true');
		});

	}

}