medApp = {};
medApp.global = {};
medApp.global.config={};
medApp.global.config.applicationMode = false;

medApp.global.config.development = {
		base : "",
		endPoints: {
			vendorDataList :"assets/data/vendorsData.json",
			vendorDataDetail :"assets/data/vendorDetailData.json",
			vendorCatList :"assets/data/vendorCatList.json",
			vendorTileCatList : "assets/data/vendorCatTileList.json"
		}
};

medApp.global.config.production = {
		base: "",
		endPoints: {
			vendorDataList :"assets/data/vendorsData.json",
			vendorDataDetail :"assets/data/vendorDetailData.json",
			vendorCatList :"MasterServlet?AimAction=getVendorCategory&INTENT=1&UID=1",
			vendorTileCatList : "assets/data/vendorCatTileList.json"
		}
};

medApp.global.config.endPoint = function() {
	var obj = {};
	var mode = medApp.global.config.applicationMode ? "production" : "development";
	for(var index in medApp.global.config[mode]["endPoints"]) {
		obj[index] = medApp.global.config[mode]["base"] + medApp.global.config[mode]["endPoints"][index];
	}
	return obj;
}();

