
var Vue = require("component_modules/vue.js");

Vue.filter('shortName', function (suid) {
	var self = this;
    var name = "";
	switch(suid){
		case self.suid.sxzls:{
			name = "市区供水";
		}break;
		case self.suid.sxps:{
			name = "市区排水";
		}break;
	}
	return name;
})


