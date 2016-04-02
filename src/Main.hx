/**
* ================================================================================
*
* WebResults2 ver 2.00.03
*
* Author : KENTA SAKATA
* Since  : 2016/03/05
* Update : 2016/04/02
*
* Licensed under the MIT License
* Copyright (c) Kenta Sakata
* http://saken.jp/
*
* ================================================================================
*
**/
package;

import js.JQuery;
import view.Header;
import view.Searchbox;
import view.Works;
import view.Editbox;
import ui.Keyboard;
import utils.Data;

class Main {
	
	public static function main():Void {
		
		new JQuery('document').ready(function(event:JqEvent):Void {
			
			Searchbox.init();
			Header.init();
			
			Editbox.init();
			Works.init();
			
			Keyboard.init();
			
		});
		
	}

}