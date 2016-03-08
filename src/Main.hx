/**
* ================================================================================
*
* WebResults2 ver 2.00.00
*
* Author : KENTA SAKATA
* Since  : 2016/03/05
* Update : 2016/03/08
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
import view.Form;
import view.Works;
import utils.Data;

class Main {
	
	public static function main():Void {
		
		new JQuery('document').ready(function(event:JqEvent):Void {
			
			Form.init();
			Works.init();
			
		});
		
	}

}