package utils;

import jp.saken.utils.API;
import view.Works;

typedef ParamMap  = Map<String,String>;
typedef DataArray = Array<Dynamic>;

class Data {
	
	private static inline var API_NAME:String = 'webResults2';
	
	/* =======================================================================
	Public - Load
	========================================================================== */
	public static function load(params:ParamMap = null):Void {
		
		if (params == null) {
			params = ['date'=>Std.string(Date.now().getFullYear())];
		}
		
		API.getJSON(API_NAME,params,function(data:DataArray):Void {
			Works.setHTML(getSplitedData(data));
		});
		
	}
	
	/* =======================================================================
	Public - Load
	========================================================================== */
	private static function getSplitedData(data:DataArray):Map<Int,DataArray> {
		
		var map:Map<Int,DataArray> = new Map();
		
		for (i in 0...data.length) {
			
			var info :Dynamic   = data[i];
			var date :Int       = info.date;
			var array:DataArray = map[date];
			
			if (array == null) array = [];
			array.push(info);
			
			map[date] = array;
			
		}
		
		return map;
		
	}

}