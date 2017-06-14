package view;

import js.jquery.JQuery;
import js.jquery.Event;

class Header {
	
	private static var _jParent:JQuery;
	
	/* =======================================================================
	Public - Init
	========================================================================== */
	public static function init():Void {
		
		_jParent = new JQuery('#header').on('click',onClick);
		
	}
	
	/* =======================================================================
	On Click
	========================================================================== */
	private static function onClick(event:Event):Void {
		
		var jTarget:JQuery = new JQuery(event.target);
		
		if (jTarget.hasClass('title')) {
			Searchbox.reset();
		}
		
	}

}