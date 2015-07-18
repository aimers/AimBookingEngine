evidencePackage = {};
evidencePackage.global = {};
evidencePackage.global.config={};
evidencePackage.global.config.applicationMode = false;

evidencePackage.global.config.development = {
		base : "",
		endPoints: {
			vendorDataList :"assets/data/vendorsData.json",
			vendorDataDetail :"assets/data/vendorDetailData.json",
			vendorCatList :"assets/data/vendorCatList.json",
		}
};

evidencePackage.global.config.production = {
		base: "",
		endPoints: {
			vendorDataList :"assets/data/vendorsData.json",
			vendorDataDetail :"assets/data/vendorDetailData.json",
			vendorCatList :"assets/data/vendorCatList.json",
		}
};

evidencePackage.global.config.endPoint = function() {
	var obj = {};
	var mode = evidencePackage.global.config.applicationMode ? "production" : "development";
	for(var index in evidencePackage.global.config[mode]["endPoints"]) {
		obj[index] = evidencePackage.global.config[mode]["base"] + evidencePackage.global.config[mode]["endPoints"][index];
	}
	return obj;
}();

