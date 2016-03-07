package view;

import js.JQuery;
import utils.Data;

class Works {
	
	private static var _jParent:JQuery;
	
	/* =======================================================================
	Public - Init
	========================================================================== */
	public static function init():Void {
		
		_jParent = new JQuery('#works');
		
	}
	
		/* =======================================================================
		Public - Set HTML
		========================================================================== */
		public static function setHTML(map:Map<Int,DataArray>):Void {

			var html:String = '<table>';

			for (key in map.keys()) {

				html += '
				<tr class="date">
					<th colspan="6">' + getFormattedDate(key) + '</th>
				</tr>';
				
				var array:DataArray = map[key];
				
				for (i in 0...array.length) {
					html += getWorkHTML(array[i]);
				}
				
				html += '
				<tr class="month-total">
					<td colspan="6">月合計：</td>
				</tr>';

			}

			_jParent.html(html + '</table>');

		}
	
	/* =======================================================================
	Get Work HTML
	========================================================================== */
	public static function getWorkHTML(info:Dynamic):String {
		
		var keys:Array<String> = ['number','client','name','members','sales','cost'];
		
		var html:String = '<tr class="work">';
		
		for (i in 0...keys.length) {
			
			var key    :String = keys[i];
			var content:String = '';
			
			if (key == 'members') content = getMembers(info.ratio_list.split(','));
			else content = Reflect.getProperty(info,key);
			
			html += '<td class="' + key + '">' + content + '</td>';
			
		}
		
		return html + '</tr>';
		
	}
	
	/* =======================================================================
	Get Members
	========================================================================== */
	public static function getMembers(ratios:Array<String>):String {
		
		ratios.sort(function(a:String,b:String):Int {
			return Std.parseInt(b.split('=')[1]) - Std.parseInt(a.split('=')[1]);
		});
		
		var members:Array<String> = [];
		
		for (i in 0...ratios.length) {
			members.push(ratios[i].split('=')[0]);
		}
		
		return members.join(',');
		
	}
		
	/* =======================================================================
	Get Formatted Date
	========================================================================== */
	public static function getFormattedDate(date:Int):String {
		
		var string:String = Std.string(date);
		return string.substr(0,4) + '.' + string.substr(4,2);
		
	}

}