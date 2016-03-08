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
			
			_jParent.html(Html.get(map));

		}
		
		/* =======================================================================
		Public - Set Empty HTML
		========================================================================== */
		public static function setEmptyHTML():Void {
			
			_jParent.html('<tr><th>検索結果：0件<th></tr>');

		}

}