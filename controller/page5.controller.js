sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"ZPM_WO/model/formatter",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, MessageBox, History, MessageToast, formatter, Fragment, Filter, FilterOperator) {
	"use strict";
	return BaseController.extend("ZPM_WO.controller.page5", {
		formatter: formatter,
		onInit: function() {
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.handleRouteMatched, this);
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		handleRouteMatched: function(oEvent) {
			var oParameters = oEvent.getParameters();
			if (oParameters.name !== "Page5") {
				return;
			}
			this.Aufnr = oParameters.arguments.Aufnr;
			this.Vornr = oParameters.arguments.Vornr;
			//Bind Entity
			this.getwohdr(this.Aufnr);
			this.getwoopr(this.Aufnr, this.Vornr);
			this.getwocom(this.Aufnr, this.Vornr);
		},
		_onNavButtonPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Page1");
			}
		},
		setinitialtable: function(oAufnr) {
			var oView = this.getView(),
				oModel = oView.getModel();

			var oComponentTable = oView.byId("IdTableComponent");
			oComponentTable.setVisible(false);
			var oComponentTable = oView.byId("IdTableComponentFinal");
			oComponentTable.setVisible(true);

			var oComponentTable = oView.byId("IdTableComponent");
			var countComponent = oView.byId("IdTableComponent").getItems().length,
				oComponentItems = oView.byId("IdTableComponent").getItems();

			var oTabComp = [];

			var row;
			var itemObject;
			var context;
			for (var i = 0; i < countComponent; i++) {
				row = oComponentItems[i];
				context = row.getBindingContext();
				itemObject = context.getObject();
				oTabComp.push({
					DeleteInd: itemObject.DeleteInd,
					Material: itemObject.Material,
					MatlDesc: itemObject.MatlDesc,
					RequirementQuantity: itemObject.RequirementQuantity,
					RequirementQuantityUnit: itemObject.RequirementQuantityUnit,
					ItemNumber: itemObject.ItemNumber,
					Plant: itemObject.Plant,
					StgeLoc: itemObject.StgeLoc,
					Batch: itemObject.Batch,
					ItemCat: itemObject.ItemCat
				});
			}

			var tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData({
				modelData: oTabComp
			});

			var tableControl = new sap.ui.table.Table();

			var tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData({
				TableComp: oTabComp
			});
			tableControl.setModel(tableModel);
			tableControl.bindRows("/TableComp");

			var oView = this.getView();
			var oComponentTable = oView.byId("IdTableComponentFinal");
			oComponentTable.setModel(tableModel);

			var oComponentTable = oView.byId("IdTableComponent");
			var countComponent = oView.byId("IdTableComponent").getItems().length,
				oComponentItems = oView.byId("IdTableComponent").getItems();

			for (var i = 0; i < countComponent; i++) {
				if (oComponentItems[i].getSelected() === true) {
					var seltable = this.getView().byId("IdTableComponentFinal");
					var selitems = seltable.getItems();
					selitems[i].setSelected(true);
				}
			}

			return tableControl;
		},

		_onInputValueHelpRequestMatnr: function() {
			if (!this._oDialogMatnrSH) {
				this._oDialogMatnrSH = sap.ui.xmlfragment("ZPM_WO.Fragment.MatnrSearchHelp", this);
				this.getView().addDependent(this._oDialogMatnrSH);
			}
			this._oDialogMatnrSH.open();

			var oWerks = this.getView().byId("Comp_Plant").getValue();

			var oSelectReason = sap.ui.getCore().byId("idSelectMatnr");
			//Define Filter
			var oFilter = new sap.ui.model.Filter({
				filters: [new sap.ui.model.Filter("Werks", FilterOperator.EQ, oWerks)],
				and: true
			});
			//Filter Items
			oSelectReason.getBinding("items").filter([oFilter]);
		},
		_onSelectMatnr: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("Comp_Material").setValue(oSelectedItem.getTitle()); //Set Header title after selection 
				this.getView().byId("Comp_Material_Text").setText(oSelectedItem.getDescription()); //Set Header title after selection 
				this.getView().byId("Comp_Meins").setText(oSelectedItem.getInfo()); //Set Header title after selection  
			}
		},
		_onSelectMatnrLiveChange: function(oEvent) {
			var aFilter = [];
			var oWerks = this.getView().byId("Comp_Plant").getValue();
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Matnr", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("Werks", FilterOperator.EQ, oWerks));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectMatnr");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		_onInputValueHelpRequestWerks: function() {
			if (!this._oDialogWerksSH) {
				this._oDialogWerksSH = sap.ui.xmlfragment("ZPM_WO.Fragment.WerksSearchHelp", this);
				this.getView().addDependent(this._oDialogWerksSH);
			}
			this._oDialogWerksSH.open();
		},
		_onSelectWerks: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("Comp_Plant").setValue(oSelectedItem.getTitle()); //Set Header title after selection 
				this.getView().byId("Comp_Plant_Text").setText(oSelectedItem.getDescription()); //Set Header title after selection  
			}
		},
		_onSelectWerksLiveChange: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Werks", FilterOperator.Contains, sQuery));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectWerks");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		_onInputValueHelpRequestLgort: function() {
			if (!this._oDialogLgortSH) {
				this._oDialogLgortSH = sap.ui.xmlfragment("ZPM_WO.Fragment.LgortSearchHelp", this);
				this.getView().addDependent(this._oDialogLgortSH);
			}
			this._oDialogLgortSH.open();

			var oWerks = this.getView().byId("Comp_Plant").getValue();

			var oSelectReason = sap.ui.getCore().byId("idSelectLgort");
			//Define Filter
			var oFilter = new sap.ui.model.Filter({
				filters: [new sap.ui.model.Filter("Werks", FilterOperator.EQ, oWerks)],
				and: true
			});
			//Filter Items
			oSelectReason.getBinding("items").filter([oFilter]);
		},
		_onSelectLgort: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("Comp_Item_Storage_location").setValue(oSelectedItem.getTitle()); //Set Header title after selection 
				this.getView().byId("Comp_Item_Storage_location_Text").setText(oSelectedItem.getDescription()); //Set Header title after selection  
			}
		},
		_onSelectLgortLiveChange: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Lgort", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("Werks", FilterOperator.EQ, this.getView().byId("Comp_Plant").getValue()));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectLgort");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		_onInputValueHelpRequestCharg: function() {
			if (!this._oDialogChargSH) {
				this._oDialogChargSH = sap.ui.xmlfragment("ZPM_WO.Fragment.ChargSearchHelp", this);
				this.getView().addDependent(this._oDialogChargSH);
			}
			this._oDialogChargSH.open();

			var oWerks = this.getView().byId("Comp_Plant").getValue();

			var oSelectReason = sap.ui.getCore().byId("idSelectCharg");
			//Define Filter
			var oFilter = new sap.ui.model.Filter({
				filters: [new sap.ui.model.Filter("Werks", FilterOperator.EQ, oWerks)],
				and: true
			});
			//Filter Items
			oSelectReason.getBinding("items").filter([oFilter]);
		},
		_onSelectCharg: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("Comp_Item_Batch").setValue(oSelectedItem.getTitle()); //Set Header title after selection  
			}
		},
		_onSelectChargLiveChange: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Charg", FilterOperator.Contains, sQuery));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectCharg");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		getwohdr: function(oAufnr) {
			var oTableComponent = this.getView().byId("IdTableHeader");
			// Create an object of filters
			this._mFilters = [new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, oAufnr)];
			var oFilter = new sap.ui.model.Filter({
				filters: this._mFilters,
				and: true
			});
			//Filter Data  
			oTableComponent.getBinding("items").filter([oFilter]);
			oTableComponent.setBusy(false);
		},
		getwoopr: function(oAufnr, oVornr) {
			var oTableComponent = this.getView().byId("IdTableOperation");
			// Create an object of filters
			this._mFilters = [
				new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, oAufnr),
				new sap.ui.model.Filter("Activity", sap.ui.model.FilterOperator.EQ, oVornr)
			];
			var oFilter = new sap.ui.model.Filter({
				filters: this._mFilters,
				and: true
			});
			//Filter Data  
			oTableComponent.getBinding("items").filter([oFilter]);
			oTableComponent.setBusy(false);
		},
		getwocom: function(oAufnr, oVornr) {
			var oTableComponent = this.getView().byId("IdTableComponent");
			// Create an object of filters
			this._mFilters = [
				new sap.ui.model.Filter("Orderid", sap.ui.model.FilterOperator.EQ, oAufnr),
				new sap.ui.model.Filter("Activity", sap.ui.model.FilterOperator.EQ, oVornr)
			];
			var oFilter = new sap.ui.model.Filter({
				filters: this._mFilters,
				and: true
			});
			//Filter Data  
			oTableComponent.getBinding("items").filter([oFilter]);
			oTableComponent.getModel().resetChanges();
			oTableComponent.setBusy(false);

			var oView = this.getView();
			var oComponentTable = oView.byId("IdTableComponent");
			oComponentTable.setVisible(true);
			var oComponentTable = oView.byId("IdTableComponentFinal");
			oComponentTable.setVisible(false);
			var oComponentTable = oView.byId("Toolbar_Comp");
			oComponentTable.setVisible(true);
			var oComponentTable = oView.byId("Toolbar_Add_Comp");
			oComponentTable.setVisible(false);
			var oComponentTable = oView.byId("Layout_Add_Comp");
			oComponentTable.setVisible(false);

			var oTabComp = [];

			var tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData({
				modelData: oTabComp
			});

			var tableControl = new sap.ui.table.Table();

			var tableControl = new sap.ui.table.Table({
				selectionMode: sap.ui.table.SelectionMode.Single,
				selectionBehavior: sap.ui.table.SelectionBehavior.Row
			});

			var tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData({
				TableComp: oTabComp
			});
			tableControl.setModel(tableModel);
			tableControl.bindRows("/TableComp");

			var oView = this.getView();
			var oComponentTable = oView.byId("IdTableComponentFinal");
			oComponentTable.setModel(tableModel);

			return tableControl;
		},
		Add_Comp_Submit: function(oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel();

			if (this.getView().byId("Comp_Material").getValue() === "") {
				MessageToast.show("Please select material");
			} else if (this.getView().byId("Comp_Qty").getValue() === "") {
				MessageToast.show("Please fill qty");
			} else if (this.getView().byId("Comp_Plant").getValue() === "") {
				MessageToast.show("Please select plant");
			} else if (this.getView().byId("Comp_Item_Category").getValue() === "") {
				MessageToast.show("Please select item category");
			} else {
				var oComponentTable = oView.byId("IdTableComponentFinal");
				oComponentTable.setVisible(true);

				var oComponentTable = oView.byId("IdTableComponentFinal");
				var countComponent = oView.byId("IdTableComponentFinal").getItems().length,
					oComponentItems = oView.byId("IdTableComponentFinal").getItems();

				var mode = "ADD";

				var oTabComp = [];

				var row;
				var itemObject;
				var context;
				for (var i = 0; i < countComponent; i++) {
					row = oComponentItems[i];
					context = row.getBindingContext();
					itemObject = context.getObject();

					if (itemObject.ItemNumber === this.getView().byId("Comp_Item_Number").getText()) {
						mode = "CHANGE";
						oTabComp.push({
							DeleteInd: "",
							Material: this.getView().byId("Comp_Material").getValue(),
							MatlDesc: this.getView().byId("Comp_Material_Text").getText(),
							RequirementQuantity: this.getView().byId("Comp_Qty").getValue(),
							RequirementQuantityUnit: this.getView().byId("Comp_Meins").getText(),
							ItemNumber: this.getView().byId("Comp_Item_Number").getText(),
							Plant: this.getView().byId("Comp_Plant").getValue(),
							StgeLoc: this.getView().byId("Comp_Item_Storage_location").getValue(),
							Batch: this.getView().byId("Comp_Item_Batch").getValue(),
							ItemCat: this.getView().byId("Comp_Item_Category").getValue().toUpperCase()
						});
					} else if (itemObject.ItemNumber !== this.getView().byId("Comp_Item_Number").getText()) {
						oTabComp.push({
							DeleteInd: itemObject.DeleteInd,
							Material: itemObject.Material,
							MatlDesc: itemObject.MatlDesc,
							RequirementQuantity: itemObject.RequirementQuantity,
							RequirementQuantityUnit: itemObject.RequirementQuantityUnit,
							ItemNumber: itemObject.ItemNumber,
							Plant: itemObject.Plant,
							StgeLoc: itemObject.StgeLoc,
							Batch: itemObject.Batch,
							ItemCat: itemObject.ItemCat
						});
					}
				}
				if (mode === "ADD") {
					oTabComp.push({
						DeleteInd: "",
						Material: this.getView().byId("Comp_Material").getValue(),
						MatlDesc: this.getView().byId("Comp_Material_Text").getText(),
						RequirementQuantity: this.getView().byId("Comp_Qty").getValue(),
						RequirementQuantityUnit: this.getView().byId("Comp_Meins").getText(),
						ItemNumber: this.getView().byId("Comp_Item_Number").getText(),
						Plant: this.getView().byId("Comp_Plant").getValue(),
						StgeLoc: this.getView().byId("Comp_Item_Storage_location").getValue(),
						Batch: this.getView().byId("Comp_Item_Batch").getValue(),
						ItemCat: this.getView().byId("Comp_Item_Category").getValue().toUpperCase()
					});
				}

				var tableModel = new sap.ui.model.json.JSONModel();
				tableModel.setData({
					modelData: oTabComp
				});

				var tableControl = new sap.ui.table.Table();

				var tableModel = new sap.ui.model.json.JSONModel();
				tableModel.setData({
					TableComp: oTabComp
				});
				tableControl.setModel(tableModel);
				tableControl.bindRows("/TableComp");

				var oView = this.getView();
				var oComponentTable = oView.byId("IdTableComponentFinal");
				oComponentTable.setModel(tableModel);

				var oView = this.getView();
				var oComponentTable = oView.byId("IdTableComponent");
				oComponentTable.setVisible(false);
				var oComponentTable = oView.byId("IdTableComponentFinal");
				oComponentTable.setVisible(true);
				var oComponentTable = oView.byId("Toolbar_Comp");
				oComponentTable.setVisible(true);
				var oComponentTable = oView.byId("Toolbar_Add_Comp");
				oComponentTable.setVisible(false);
				var oComponentTable = oView.byId("Layout_Add_Comp");
				oComponentTable.setVisible(false);

				//	oModel.refresh();
				MessageToast.show("Component will be added / changed after SAVE");

				return tableControl;
			}
		},
		Add_Comp_Cancel: function(oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel();

			var oView = this.getView();
			var oComponentTable = oView.byId("IdTableComponent");
			oComponentTable.setVisible(false);
			var oComponentTable = oView.byId("IdTableComponentFinal");
			oComponentTable.setVisible(true);
			var oComponentTable = oView.byId("Toolbar_Comp");
			oComponentTable.setVisible(true);
			var oComponentTable = oView.byId("Toolbar_Add_Comp");
			oComponentTable.setVisible(false);
			var oComponentTable = oView.byId("Layout_Add_Comp");
			oComponentTable.setVisible(false);

			//	oModel.refresh();
			MessageToast.show("Cancel");
		},
		CompDelete: function(oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel();
			var oComponentTable = oView.byId("IdTableComponentFinal");
			var countComponent = oView.byId("IdTableComponentFinal").getItems().length,
				oComponentItems = oView.byId("IdTableComponentFinal").getItems();

			if (countComponent === 0) {
				this.setinitialtable(this.Aufnr);
			}

			var oComponentTable = oView.byId("IdTableComponentFinal");
			var countComponent = oView.byId("IdTableComponentFinal").getSelectedItems().length,
				oComponentItems = oView.byId("IdTableComponentFinal").getSelectedItems();

			var tableControl = new sap.ui.table.Table();

			var row;
			var itemObject;
			var context;
			for (var i = 0; i < countComponent; i++) {
				row = oComponentItems[i];
				context = row.getBindingContext();
				itemObject = context.getObject();
				var oTableRemark = this.getView().byId("IdTableComponentFinal").getModel();
				if (itemObject.DeleteInd === "") {
					oTableRemark.setProperty(context + "/DeleteInd", "X");
				} else if (itemObject.DeleteInd === "X") {
					oTableRemark.setProperty(context + "/DeleteInd", "");
				}
			} 
			
			//	oModel.refresh();
			MessageToast.show("Selected component will be delete after SAVE");
		},
		CompAdd: function(oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel();

			var oComponentTable = oView.byId("IdTableComponentFinal");
			var countComponent = oView.byId("IdTableComponentFinal").getItems().length,
				oComponentItems = oView.byId("IdTableComponentFinal").getItems();

			if (countComponent === 0) {
				this.setinitialtable(this.Aufnr);
			}

			var oComponentTable = oView.byId("IdTableComponent");
			oComponentTable.setVisible(false);
			var oComponentTable = oView.byId("Toolbar_Comp");
			oComponentTable.setVisible(false);
			var oComponentTable = oView.byId("Toolbar_Add_Comp");
			oComponentTable.setVisible(true);
			var oComponentTable = oView.byId("Layout_Add_Comp");
			oComponentTable.setVisible(true);

			var oComponentTable = oView.byId("IdTableComponent");
			var countComponent = oView.byId("IdTableComponent").getItems().length,
				oComponentItems = oView.byId("IdTableComponent").getItems();
			var oMaxItemNumber;
			if (countComponent === 0) {
				oMaxItemNumber = '0000';
			} else if (countComponent !== 0) {
				var row;
				var itemObject;
				var context;
				row = oComponentItems[0];
				context = row.getBindingContext();
				itemObject = context.getObject();
				oMaxItemNumber = itemObject.MaxItemNumber;
			}

			var oComponentTable = oView.byId("IdTableComponentFinal");
			var countComponent = oView.byId("IdTableComponentFinal").getItems().length,
				oComponentItems = oView.byId("IdTableComponentFinal").getItems();
			var oItemNumber;
			if (countComponent === 0) {
				oItemNumber = parseInt(oMaxItemNumber) + 10;

				if (oItemNumber < 10) {
					oItemNumber = '000' + oItemNumber;
				} else if (oItemNumber < 100) {
					oItemNumber = '00' + oItemNumber;
				} else if (oItemNumber < 1000) {
					oItemNumber = '0' + oItemNumber;
				}
			} else if (countComponent !== 0) {
				var row;
				var itemObject;
				var context;
				for (var i = 0; i < countComponent; i++) {
					row = oComponentItems[i];
					context = row.getBindingContext();
					itemObject = context.getObject();
					var oTableRemark = this.getView().byId("IdTableComponentFinal").getModel();
					if (itemObject.ItemNumber !== "") {
						if (oMaxItemNumber >= itemObject.ItemNumber) {
							oItemNumber = parseInt(oMaxItemNumber) + 10;
						} else if (oMaxItemNumber < itemObject.ItemNumber) {
							oItemNumber = parseInt(itemObject.ItemNumber) + 10;
						}

						if (oItemNumber < 10) {
							oItemNumber = '000' + oItemNumber;
						} else if (oItemNumber < 100) {
							oItemNumber = '00' + oItemNumber;
						} else if (oItemNumber < 1000) {
							oItemNumber = '0' + oItemNumber;
						}
					}
				}
			}

			this.getView().byId("Comp_Item_Number").setText(oItemNumber);
			this.getView().byId("Comp_Material").setValue("");
			this.getView().byId("Comp_Material_Text").setText("");
			this.getView().byId("Comp_Qty").setValue("");
			this.getView().byId("Comp_Meins").setText("");
			this.getView().byId("Comp_Plant").setValue("");
			this.getView().byId("Comp_Item_Storage_location").setValue("");
			this.getView().byId("Comp_Item_Batch").setValue("");
			this.getView().byId("Comp_Item_Category").setValue("");
		},
		CompEdit: function(oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel();

			var oComponentTable = oView.byId("IdTableComponentFinal");
			var countComponent = oView.byId("IdTableComponentFinal").getItems().length,
				oComponentItems = oView.byId("IdTableComponentFinal").getItems();

			if (countComponent === 0) {
				this.setinitialtable(this.Aufnr);
			}

			var oComponentTable = oView.byId("IdTableComponentFinal");
			var countComponent = oView.byId("IdTableComponentFinal").getSelectedItems().length,
				oComponentItems = oView.byId("IdTableComponentFinal").getSelectedItems();

			if (countComponent === 0) {
				MessageToast.show("Please select row");
			} else if (countComponent > 1) {
				MessageToast.show("Please select 1 row only");
			} else if (countComponent === 1) {
				var oView = this.getView(),
					oModel = oView.getModel();

				var oComponentTable = oView.byId("IdTableComponent");
				oComponentTable.setVisible(false);
				var oComponentTable = oView.byId("Toolbar_Comp");
				oComponentTable.setVisible(false);
				var oComponentTable = oView.byId("Toolbar_Add_Comp");
				oComponentTable.setVisible(true);
				var oComponentTable = oView.byId("Layout_Add_Comp");
				oComponentTable.setVisible(true);

				var oComponentTable = oView.byId("IdTableComponentFinal");
				var countComponent = oView.byId("IdTableComponentFinal").getSelectedItems().length,
					oComponentItems = oView.byId("IdTableComponentFinal").getSelectedItems();
				var oItemNumber;
				if (countComponent === 0) {
					oItemNumber = '0010';
				} else if (countComponent !== 0) {
					var row;
					var itemObject;
					var context;
					for (var i = 0; i < countComponent; i++) {
						row = oComponentItems[i];
						context = row.getBindingContext();
						itemObject = context.getObject();

						this.getView().byId("Comp_Item_Number").setText(itemObject.ItemNumber);
						this.getView().byId("Comp_Material").setValue(itemObject.Material);
						this.getView().byId("Comp_Material_Text").setText(itemObject.MatlDesc);
						this.getView().byId("Comp_Qty").setValue(itemObject.RequirementQuantity);
						this.getView().byId("Comp_Meins").setText(itemObject.RequirementQuantityUnit);
						this.getView().byId("Comp_Plant").setValue(itemObject.Plant);
						this.getView().byId("Comp_Item_Storage_location").setValue(itemObject.StgeLoc);
						this.getView().byId("Comp_Item_Batch").setValue(itemObject.Batch);
						this.getView().byId("Comp_Item_Category").setValue(itemObject.ItemCat);
					}
				}
			}
		},
		CompSave: function(oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel();

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			var oComponentTable = oView.byId("IdTableHeader");
			var countComponent = oView.byId("IdTableHeader").getItems().length,
				oComponentItems = oView.byId("IdTableHeader").getItems();
			var row;
			var itemObject;
			var context;
			for (var i = 0; i < countComponent; i++) {
				row = oComponentItems[i];
				context = row.getBindingContext();
				itemObject = context.getObject();
				var oAufnr = itemObject.Aufnr;
			}

			var oComponentTable = oView.byId("IdTableOperation");
			var countComponent = oView.byId("IdTableOperation").getItems().length,
				oComponentItems = oView.byId("IdTableOperation").getItems();
			var row;
			var itemObject;
			var context;
			for (var i = 0; i < countComponent; i++) {
				row = oComponentItems[i];
				context = row.getBindingContext();
				itemObject = context.getObject();
				var oVornr = itemObject.Activity;
			}

			var oComponentTable = oView.byId("IdTableComponentFinal");
			var countComponent = oView.byId("IdTableComponentFinal").getItems().length,
				oComponentItems = oView.byId("IdTableComponentFinal").getItems();

			MessageBox.show("Are you sure want to Save ?", {
				icon: MessageBox.Icon.QUESTION,
				title: "Save",
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				onClose: function(oAction) {
					console.log(oAction);
					if (oAction === "OK") {
						if (countComponent === 0) {
							MessageToast.show("No data change");
						} else {
							oView.setBusy(true);

							var row;
							var itemObject;
							var context;
							var oMessage;
							for (var i = 0; i < countComponent; i++) {
								row = oComponentItems[i];
								context = row.getBindingContext();
								itemObject = context.getObject();

								oMessage = "";
								if (i === 0) {
									oMessage = "FIRST";
								}
								if ((i + 1) === countComponent) {
									oMessage = "LAST";
								}

								oModel.create("/wo_comp_crtSet", {
									"Orderid": oAufnr,
									"ItemNumber": itemObject.ItemNumber,
									"Material": itemObject.Material,
									"RequirementQuantity": itemObject.RequirementQuantity,
									"Plant": itemObject.Plant,
									"StgeLoc": itemObject.StgeLoc,
									"Batch": itemObject.Batch,
									"ItemCat": itemObject.ItemCat,
									"Activity": oVornr,
									"DeleteInd": itemObject.DeleteInd,
									"ReservNo": itemObject.ReservNo,
									"ResItem": itemObject.ResItem,
									"Message": oMessage
								}, {
									success: function(oData, oResponse) {
										// Success 
										console.log(oResponse);
										if (oData.Message[0] === "E") {
											oView.setBusy(false);
											MessageBox.show(oData.Message, {
												icon: MessageBox.Icon.ERROR,
												title: "Error",
												actions: [MessageBox.Action.OK],
												onClose: function(oAction) {
													if (oAction === "OK") {
														if (sPreviousHash !== undefined) {
															//	window.history.go(-1);
														} else {
															//	this.getRouter().navTo("Page1");
														}
													}
												}
											});
										}
										if (oData.Message[0] === "S") {
											MessageBox.show("Data Saved", {
												icon: MessageBox.Icon.SUCCESS,
												title: "Success",
												actions: [MessageBox.Action.OK],
												onClose: function(oAction) {
													if (oAction === "OK") {
														oView.setBusy(false);
														if (sPreviousHash !== undefined) {
															window.history.go(-1);
														} else {
															this.getRouter().navTo("Page1");
														}
													}
												}
											});
										}
									},
									error: function(oError) {
										// Error
										oView.setBusy(false);
										console.log(oError);
									}
								});
							}

							//	oView.setBusy(false); 
						}
					} else {
						return;
					}

				}
			});

		}
	});
});