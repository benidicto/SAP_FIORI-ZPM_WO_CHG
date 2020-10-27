sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"ZPM_WO/model/formatter"
], function(BaseController, MessageBox, History, MessageToast, formatter) {
	"use strict";

	return BaseController.extend("ZPM_WO.controller.Page2", {
		formatter: formatter,

		onInit: function() {
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.handleRouteMatched, this);
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		handleRouteMatched: function(oEvent) {
			var oParameters = oEvent.getParameters();
			if (oParameters.name !== "Page2") {
				return;
			}

			this.Aufnr = oParameters.arguments.Aufnr;
			this.Vornr = oParameters.arguments.Vornr;

			var sEntityPath = "/HEADORDER_AUFNRSet(Aufnr='" + this.Aufnr + "')";

			this.getView().setBusy(true);

			//Bind Entity
			this.bindView(sEntityPath);
			this.bindView2nd(this.Aufnr, this.Vornr, sEntityPath);
		},

		bindView: function(sEntityPath) {
			var oView = this.getView();
			var oModel = oView.getModel;
			oView.byId("idHDRSystemStatus").bindElement(sEntityPath);
			oView.byId("idHDRObjectPage").bindElement(sEntityPath);

			oView.byId("idHDRObjectPage").getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				if (!oModel) {
					MessageBox.show("Error Attach Data", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error"
					});
				} else {
					this.getView().setBusy(false);
				}
			}, this));
			// sap.ui.core.BusyIndicator.hide();
		},

		bindView2nd: function(oAufnr, oVornr) {
			// Create an object of filters
			this._mFilters = [new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, oAufnr),
				new sap.ui.model.Filter("Vornr", sap.ui.model.FilterOperator.EQ, oVornr)
			];

			var oTableComponent = this.getView().byId("idTableComponent");
			var oFilter = new sap.ui.model.Filter({
				filters: this._mFilters,
				and: true
			});
			//Filter Data
			oTableComponent.getBinding("items").filter([oFilter]);

			//set Count
			oTableComponent.getModel().read("/DETCOMP_ORDERSet/$count", {
				success: jQuery.proxy(function(oCount) {
					this.getView().byId("idTitleComponentTable").setText("Items " + "( " + oCount + " )");
				}, this),
				filters: this._mFilters
			});

			oTableComponent.setBusy(false);

		},

		_onPressRefreshTable: function() {
			this.getView().byId("idTableComponent").getBinding("items").refresh();
			this.getView().byId("idTableComponent").getModel().resetChanges();
			MessageToast.show("Items Refreshed");
			
			// console.log(this.getView().byId("idTableComponent").getBinding("items"));
			
		},

		_handleNullInput: function(oEvent) {
			var oInputReqQty = oEvent.getSource().getValue();
			var rowContextPath = oEvent.getSource().getBindingContext().getPath();
			var oTableComponent = this.getView().byId("idTableComponent").getModel();
			oTableComponent.setProperty(rowContextPath + "/Bdmng", oInputReqQty);
			oTableComponent.setProperty(rowContextPath + "/Update", "X");

			if (oInputReqQty === "" || parseInt(oInputReqQty) <= 0) {
				oEvent.getSource().setValue("0");
			} else {
				return;
			}
		},

		_onPressDecrease: function(oEvent) {
			var oInputReqQtyItems = oEvent.getSource().getParent().getItems()[1].getItems()[0];
			var oInputReqQtyValue = oInputReqQtyItems.getValue();
			//Test
			var rowContextPath = oEvent.getSource().getBindingContext().getPath();
			var oTableComponent = this.getView().byId("idTableComponent").getModel();

			var oInputReqQtyValueDec = parseInt(oInputReqQtyValue) - 1;

			if (oInputReqQtyValue >= 1) {
				var oInputReqQtyValueDecChar = (oInputReqQtyValueDec + "");
				oTableComponent.setProperty(rowContextPath + "/Bdmng", oInputReqQtyValueDecChar);
				oTableComponent.setProperty(rowContextPath + "/Update", "X");
			} else {
				oTableComponent.setProperty(rowContextPath + "/Bdmng", "0");
				oTableComponent.setProperty(rowContextPath + "/Update", "X");
			}
		},
		_onPressIncrease: function(oEvent) {
			var oInputReqQtyItems = oEvent.getSource().getParent().getItems()[1].getItems()[0];
			var oInputReqQtyValue = oInputReqQtyItems.getValue();
			//Test
			var rowContextPath = oEvent.getSource().getBindingContext().getPath();
			var oTableComponent = this.getView().byId("idTableComponent").getModel();

			var oInputReqQtyValueInc = parseInt(oInputReqQtyValue) + 1;

			if (oInputReqQtyValue <= 998) {
				var oInputReqQtyValueIncChar = (oInputReqQtyValueInc + "");
				oTableComponent.setProperty(rowContextPath + "/Bdmng", oInputReqQtyValueIncChar);
				oTableComponent.setProperty(rowContextPath + "/Update", "X");
			} else {
				oTableComponent.setProperty(rowContextPath + "/Bdmng", "999");
				oTableComponent.setProperty(rowContextPath + "/Update", "X");
			}
		},

		_onButtonSave: function() {
			var oView = this.getView(),
				oModel = oView.getModel();
				
						var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			var oComponentTable = oView.byId("idTableComponent");

			var countComponent = oView.byId("idTableComponent").getItems().length,
				oComponentItems = oView.byId("idTableComponent").getItems();

			var batchGroupId = "myBatchGroupId";



			//WARNING BOX  
			MessageBox.show("Are you sure want to Save ?", {
				icon: MessageBox.Icon.QUESTION,
				title: "Save",
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				onClose: function(oAction) {
					console.log(oAction);
					if (oAction === "OK") {
						if (countComponent === 0) {
							MessageToast.show("No Requirement Quantity Defined");
						} else {
							oComponentTable.setBusy(true);
							//Loop through the items, updating each  
							var row;
							var itemObject;
							var context;
							for (var i = 0; i < countComponent; i++) {
								row = oComponentItems[i];
								context = row.getBindingContext();
								itemObject = context.getObject();

								//Then execute the v2 model's Update function  
								oModel.update(context.sPath, itemObject, {
									batchGroupId: batchGroupId
								});
							}

							// collect all value request and submit them
							// Deprecated as of version 1.32. use #setDeferredGroups instead
							oModel.setDeferredBatchGroups([batchGroupId]);
							// oModel.setDeferredGroups(["myGroupComponent"]);

							oModel.submitChanges({
								batchGroupId: batchGroupId,
								success: function(oData, sResponse) {
									oComponentTable.setBusy(false);
									oComponentTable.getModel().refresh(true);
									MessageToast.show("Requirement Quantity has been Updated");
									//Set Model to Normal Changes
									oModel.setChangeBatchGroups({
										"*": {
											batchGroupId: "changes"
										}
									});
									oModel.setDeferredBatchGroups(["changes"]);
									
									//set Refresh
									oComponentTable.getModel().resetChanges();
									
										MessageBox.show("Update Success", {
										icon: MessageBox.Icon.SUCCESS,
										title: "Success",
										actions: [MessageBox.Action.OK],
										onClose: function(oAction) {
											if (oAction === "OK") {
												if (sPreviousHash !== undefined) {
													window.history.go(-1);
												} else {
													this.getRouter().navTo("Page1");
												}
											}
										}
									});

								},
								error: function(oError) {
									oComponentTable.setBusy(false);
									oComponentTable.getModel().refresh(true);
									//    show message box and get error message from OData service    
									var oJsonResponse = (JSON.parse(oError.response.body));
									var oErrorText = oJsonResponse.error.message.value;
									
									MessageBox.show(oErrorText, {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error"
									});
									//Set Model to Normal Changes
									oModel.setChangeBatchGroups({
										"*": {
											batchGroupId: "changes"
										}
									});
									oModel.setDeferredBatchGroups(["changes"]);
									// oModel.refresh(true);
									
										//set Refresh
									oComponentTable.getModel().resetChanges();

								}
							});
						}
					} else {
						return;
					}

				}
			});
		},

		_onNavButtonPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Page1");
			}
		}
	});
}, /* bExport= */ true);