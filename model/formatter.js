sap.ui.define([], function() {
	"use strict";
	return {
		AufnrFloat: function(oAufnr) {
			return parseFloat(oAufnr);
		},  
		EqfnrFloat: function(oEqfnr) {
			return (oEqfnr);
		}, 
		IngrpFloat: function(oIngrp) {
			return (oIngrp);
		},
		VornrFloat: function(oVornr) {
			return (oVornr);
		}, 
		BdmngFloat: function(oAufnr) {
			return parseFloat(oAufnr);
		}, 
		ItemNumberFloat: function(oItemNumber) {
			return parseFloat(oItemNumber);
		}
	};
});