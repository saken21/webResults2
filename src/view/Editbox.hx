package view;

import haxe.Timer;
import js.JQuery;
import jp.saken.utils.Handy;
import jp.saken.utils.API;
import jp.saken.utils.File;
import jp.saken.utils.Loader;
import utils.Data;

class Editbox {
	
	private static var _jParent  :JQuery;
	private static var _jMainArea:JQuery;
	private static var _jCover   :JQuery;
	private static var _jColumns :JQuery;
	private static var _jPreview :JQuery;
	
	private static var _width    :Int;
	private static var _isOpened :Bool;
	private static var _hasAuth  :Bool;
	private static var _currentID:Int;
	
	/* =======================================================================
	Public - Init
	========================================================================== */
	public static function init():Void {
		
		_jParent   = new JQuery('#editbox');
		_jMainArea = new JQuery('#all').add(new JQuery('#header'));
		_jCover    = _jParent.find('.cover');
		_jColumns  = _jParent.find('[data-column]');
		_jPreview  = _jParent.find('.image').find('.preview');
		
		_width     = _jParent.width();
		_isOpened  = false;
		
		_jParent.on('change',onChange);
		_jParent.find('.submit').find('button').on('click',submit);
		
		setRatio();
		setSales();
		setHasAuth();
		
	}
	
		/* =======================================================================
		Public - Toggle
		========================================================================== */
		public static function toggle():Void {
			
			if (!_hasAuth) return;
			
			_currentID = null;
			
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
			
			_currentID = id;
			open();
			
			Data.loadOne(id,setData);

		}
		
	/* =======================================================================
	Set Default
	========================================================================== */
	private static function setDefault():Void {
		
		_jColumns.prop('value','');
		_jColumns.filter('[type="radio"]').prop('checked',true);
		
		_jColumns.filter('select').each(function():Void {
			
			var jTarget:JQuery = JQuery.cur;
			jTarget.prop('value',jTarget.find('option').first().prop('value'));
			
		});
		
		_jParent.find('.ratio-input').prop('value',0).trigger('change');
		_jParent.find('#editbox-date').prop('value',DateTools.format(Date.now(),"%Y-%m"));
		
		_jPreview.empty();

	}
	
	/* =======================================================================
	Set Data
	========================================================================== */
	private static function setData(data:Dynamic):Void {
		
		function setDate(jTarget:JQuery,value:Int):Void {
			
			var date:String = Html.getFormattedDate(value,'-');
			jTarget.prop('value',date);
			
		}
		
		function setRadio(jTarget:JQuery,isOn:Bool):Void {
			
			if (!isOn) return;
			
			jTarget.prop('checked',false);
			jTarget.nextAll('input').prop('checked',true);
			
		}
		
		function setRatio(jParent:JQuery,data:String):Void {
			
			if (data == null) return;

			var ratios:Array<String> = data.split(',');

			for (i in 0...ratios.length) {

				var ratio:String = ratios[i];
				var splits:Array<String> = ratio.split('=');

				var id   :String = splits[0];
				var value:String = splits[1];

				jParent.find('.ratio-input[data-id="' + id + '"]').prop('value',value);

			}

			jParent.find('.ratio-input').trigger('change');
			
		}
		
		_jColumns.each(function():Void {
			
			var jTarget:JQuery = JQuery.cur;
			var column :String = jTarget.data('column');
			var value  :String = Reflect.getProperty(data,column);
			
			switch (column) {
				
				case 'date'                : setDate(jTarget,Std.parseInt(value));
				case 'is_help','is_public' : setRadio(jTarget,value == '1');
				case 'image'               : _jPreview.html('<img src="' + value + '">');
				default                    : jTarget.prop('value',value);
				
			}
			
		});
		
		setRatio(_jParent.find('.ratio'),data.ratio_list);

	}
	
	/* =======================================================================
	Open
	========================================================================== */
	private static function open():Void {
		
		if (_isOpened) return;
		
		_isOpened = true;
		move(_width);
		
		setDefault();

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
	On Change
	========================================================================== */
	private static function onChange(event:JqEvent):Void {
		
		var jTarget:JQuery = new JQuery(event.target);
		
		if (jTarget.hasClass('ratio-input')) {
			
			var jParent:JQuery = jTarget.parents('.ratio');
			var total  :Int    = 0;
			
			jParent.find('input[type="number"]').each(function():Void {
				total += Std.parseInt(JQuery.cur.prop('value'));
			});
			
			jParent.find('.total').text(Std.string(total));
			
		} else if (jTarget.hasClass('image-input')) {
			
			File.readAsDataURL(loadImage);
			
		}

	}
	
	/* =======================================================================
	Load Image
	========================================================================== */
	private static function loadImage(src:String):Void {
		
		Loader.loadImage(src,function(jImage:JQuery):Void {
			_jPreview.empty().append(jImage);
		});
		
	}
	
	/* =======================================================================
	Submit
	========================================================================== */
	private static function submit(event:JqEvent):Void {
		
		var jRequired:JQuery = _jParent.find('input[required]');
		
		for (i in 0...jRequired.length) {
			
			if (jRequired.eq(i).prop('value').length == 0) {
				return;
			}
			
		}
		
		_jCover.show();
		
		if (_currentID == null) Data.insert(getParams(),onUpdated);
		else Data.update(_currentID,getParams(),onUpdated);
		
		return untyped false;

	}
	
	/* =======================================================================
	On Updated
	========================================================================== */
	private static function onUpdated():Void {
		
		var timer:Timer = new Timer(1000);
		
		timer.run = function():Void {
			
			timer.stop();
			setDefault();
			
			_jCover.hide();
			
			if (_currentID != null) {
				
				_currentID = null;
				close();
				
			}
			
			Searchbox.reload();
			
		};
		
	}
	
	/* =======================================================================
	Get Params
	========================================================================== */
	private static function getParams():ParamMap {
		
		var params:ParamMap = new Map();
		
		_jColumns.each(function():Void {
			
			var jTarget:JQuery = JQuery.cur;
			var key    :String = jTarget.data('column');
			var value  :String = jTarget.prop('value');
			
			if (jTarget.is('[type="radio"]')) {
				value = jTarget.is(':checked') ? '0' : '1';
			}
			
			if (value.length == 0) return;
			if (key == 'date') value = StringTools.replace(value,'-','');
			
			params[key] = value;
			
		});
		
		params['ratio_list'] = getRatioList();
		
		var imageSRC:String = _jPreview.find('img').prop('src');
		if (imageSRC != null) params['image'] = imageSRC;
		
		return params;
		
	}
	
	/* =======================================================================
	Get Ratio List
	========================================================================== */
	private static function getRatioList():String {
		
		var array:Array<String> = [];
		
		_jParent.find('.ratio').find('.member').each(function():Void {
			
			var jTarget:JQuery = JQuery.cur;
			var id     :String = jTarget.data('id');
			var value  :String = jTarget.find('input').prop('value');
			
			if (value == '0') return;
			
			array.push(id + '=' + value);
			
		});
		
		return array.join(',');
		
	}
	
	/* =======================================================================
	Set Ratio
	========================================================================== */
	private static function setRatio():Void {
		
		API.getJSON('members',['team'=>'web'],function(data:Array<Dynamic>):Void {
			
			var html:String = '';
			
			for (i in 0...data.length) {
				
				var info   :Dynamic = data[i];
				var id     :Int     = info.id;
				var inputID:String  = 'editbox-ratio-' + id;
				
				html += '
				<dd class="member" data-id="' + id + '">
					<label for="' + inputID + '">' + info.name.split(' ')[0] + '</label>
					<input type="number" min="0" max="100" value="0" class="ratio-input" id="' + inputID + '" data-id="' + id + '">
				</dd>';
				
			}
			
			_jParent.find('.ratio').append(html + '<dd class="total">0</dd>');
			
		});

	}
	
	/* =======================================================================
	Set Sales
	========================================================================== */
	private static function setSales():Void {
		
		API.getJSON('members',['section'=>'sales'],function(data:Array<Dynamic>):Void {
			
			var html:String = '';
			
			for (i in 0...data.length) {
				
				var info:Dynamic = data[i];
				html += '<option value="' + info.id + '">' + info.name + '</option>';
				
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