/**
* ================================================================================
*
* WebResults2 ver 2.00.04
*
* Author : KENTA SAKATA
* Since  : 2016/03/05
* Update : 2016/12/02
*
* Licensed under the MIT License
* Copyright (c) Kenta Sakata
* http://saken.jp/
*
* ================================================================================
*
**/
package;

import js.jquery.JQuery;
import js.jquery.Event;
import view.Header;
import view.Searchbox;
import view.Works;
import view.Editbox;
import ui.Keyboard;
import utils.Data;

class Main {
	
	public static function main():Void {
		
		new JQuery('document').ready(function(event:Event):Void {
			
			Searchbox.init();
			Header.init();
			
			Editbox.init();
			Works.init();
			
			Keyboard.init();
			
		});
		
	}

}