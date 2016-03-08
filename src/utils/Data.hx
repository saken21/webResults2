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
	public static function load(keyword:String,from:String,to:String):Void {
		
		var params:ParamMap = ['from'=>from,'to'=>to];
		
		if (keyword.length > 0) {
			params['client'] = keyword;
		}
		
		API.getJSON(API_NAME,params,function(data:DataArray):Void {
			
			if (data.length == 0) {
				
				params.remove('client');
				params['keyword'] = keyword;
				
				API.getJSON(API_NAME,params,onLoaded);
				
				return;
				
			}
			
			onLoaded(data);
		
		});
		
	}
	
	/* =======================================================================
	On Loaded
	========================================================================== */
	private static function onLoaded(data:DataArray):Void {
		
		if (data.length > 0) Works.setHTML(getSplitedData(data));
		else Works.setEmptyHTML();
		
	}
	
	/* =======================================================================
	Get Splited Data
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