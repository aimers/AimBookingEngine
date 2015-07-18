
exa.reuse.validateResponse = function(response) {
	return typeof response === "object";
};

exa.reuse.getParam = function(qs) {
	qs = qs.split("+").join(" ");
	var params = {}, tokens,
	re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
};
