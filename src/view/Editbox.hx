package view;

import haxe.Timer;
import js.html.Element;
import js.jquery.JQuery;
import js.jquery.Event;
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
	
	private static var _width    :Float;
	private static var _isOpened :Bool;
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
		_jParent.on('click',onClick);
		
		setRatio();
		setSales();
		
	}
	
		/* =======================================================================
		Public - Toggle
		========================================================================== */
		public static function toggle():Void {
			
			_currentID = null;
			
			if (_isOpened) close();
			else open();

		}
		
		/* =======================================================================
		Public - Edit
		========================================================================== */
		public static function edit(id:Int):Void {
			
			_currentID = id;
			open();
			
			Data.loadOne(id,setData);

		}
		
		/* =======================================================================
		Public - Close
		========================================================================== */
		public static function close():Void {

			if (!_isOpened) return;

			_isOpened = false;
			move(0);

		}
		
	/* =======================================================================
	Set Default
	========================================================================== */
	private static function setDefault():Void {
		
		_jColumns.prop('value','');
		_jColumns.filter('[type="radio"]').prop('checked',true);
		
		_jColumns.filter('select').each(function(index:Int,element:Element):Void {
			
			var jTarget:JQuery = new JQuery(element);
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
		
		function setImage(jTarget:JQuery,value:String):Void {
			
			if (!Handy.getIsImageSource(value)) return;
			jTarget.html('<img src="' + value + '">');
			
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
		
		_jColumns.each(function(index:Int,element:Element):Void {
			
			var jTarget:JQuery = new JQuery(element);
			var column :String = jTarget.data('column');
			var value  :String = Reflect.getProperty(data,column);
			
			switch (column) {
				
				case 'date'                : setDate(jTarget,Std.parseInt(value));
				case 'is_help','is_public' : setRadio(jTarget,value == '1');
				case 'image'               : setImage(_jPreview,value);
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
	Move
	========================================================================== */
	private static function move(x:Float):Void {
		
		_jMainArea.stop().animate({ left:x }, 200);

	}
	
	/* =======================================================================
	On Change
	========================================================================== */
	private static function onChange(event:Event):Void {
		
		var jTarget:JQuery = new JQuery(event.target);
		
		if (jTarget.hasClass('ratio-input')) {
			
			var jParent:JQuery = jTarget.parents('.ratio');
			var total  :Int    = 0;
			
			jParent.find('input[type="number"]').each(function(index:Int,element:Element):Void {
				total += Std.parseInt(new JQuery(element).prop('value'));
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
	On Click
	========================================================================== */
	private static function onClick(event:Event):Void {
		
		var jTarget:JQuery = new JQuery(event.target);
		
		if (jTarget.is('[type="submit"]')) {
			
			submit();
			return untyped false;
			
		} else if (jTarget.hasClass('delete-image')) {
			
			deleteImage();
			
		}

	}
	
	/* =======================================================================
	Submit
	========================================================================== */
	private static function submit():Void {
		
		var jRequired:JQuery = _jParent.find('input[required]');
		
		for (i in 0...jRequired.length) {
			
			if (jRequired.eq(i).prop('value').length == 0) {
				return;
			}
			
		}
		
		_jCover.show();
		
		if (_currentID == null) Data.insert(getParams(),onUpdated);
		else Data.update(_currentID,getParams(),onUpdated);

	}
	
	/* =======================================================================
	Delete Image
	========================================================================== */
	private static function deleteImage():Void {
		
		_jPreview.empty();
		_jColumns.filter('[data-column="image"]').prop('value','');

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
		
		_jColumns.each(function(index:Int,element:Element):Void {
			
			var jTarget:JQuery = new JQuery(element);
			var key    :String = jTarget.data('column');
			var value  :String = jTarget.prop('value');
			
			if (jTarget.is('[type="radio"]')) {
				value = jTarget.is(':checked') ? '0' : '1';
			}
			
			if (key == 'date') {
				value = StringTools.replace(value,'-','');
			}
			
			params[key] = value;
			
		});
		
		params['ratio_list'] = getRatioList();
		params['image'] = getImageSRC();
		
		return params;
		
	}
	
	/* =======================================================================
	Get Ratio List
	========================================================================== */
	private static function getRatioList():String {
		
		var array:Array<String> = [];
		
		_jParent.find('.ratio').find('.member').each(function(index:Int,element:Element):Void {
			
			var jTarget:JQuery = new JQuery(element);
			var id     :String = jTarget.data('id');
			var value  :String = jTarget.find('input').prop('value');
			
			if (value == '0') return;
			
			array.push(id + '=' + value);
			
		});
		
		return array.join(',');
		
	}
	
	/* =======================================================================
	Get Image SRC
	========================================================================== */
	private static function getImageSRC():String {
		
		var src:String = _jPreview.find('img').prop('src');
		
		if (src == null || !Handy.getIsImageSource(src)) {
			src = '';
		}
		
		return src;
		
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

}