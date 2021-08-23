"use strict";
angular.module("acmanagerApp").controller("ControlFacilityCtrl", ["$rootScope", "$scope", "$http", "$timeout", "$interval", "$element", "$q", "$state", "$translate", "$filter", "$cookies", "DP", "Space", "CP", "Facility", "FacilityList", "Schedule", "CONFIG", "CHILLER", "CpInfo", "WAPI", "x2js", "ValueType", "Setting", "GoMapAgent", "UIService", "User", "ControlHistory", "CONTROL_TYPE", "Temperature", "$log", "System", "$compile", 
function($rootScope, $scope, $http, $timeout, $interval, $element, $q, $state, $translate, $filter, $cookies, DP, Space, CP, Facility, FacilityList, Schedule, CONFIG, CHILLER, CpInfo, WAPI, x2js, ValueType, Setting, GoMapAgent, UIService, User, ControlHistory, CONTROL_TYPE, Temperature, $log, System, $compile) {
  UIService.newGlobalProgress({
    text: $filter("translate")("DUPLICATE.100")
  });
  var navSpaceTreeController, naCpTreeController, goMapViewController;
  $scope.doas_tap_selector = [], $scope.doas_tap_selector[0] = !0;
  var recalculateErrorInterval, domMain = $("main"),
    domBody = $("body");
  $scope.pageCount = 12;
  var $mstCont = $("div.master-content");
  $scope.location = location, $scope.isSmartLCD = $rootScope.isSmartLCD, $scope.finedust_standard_country = $rootScope.systems.finedust_standard_country;
  ! function() {
    $scope.listViewOptions = [], $scope.globals = $rootScope.globals, $scope.systemUnitStep = $rootScope.systemUnitStep, $scope.gTempUnit = $rootScope.gTempUnit, $scope.valuetypes = ValueType.getValueTypesKV(), $scope.lower_limit = $rootScope.systems.lower_limit, $scope.language = $rootScope.systems.language, "ru" == $scope.language || "pl" == $scope.language || "tr" == $scope.language ? $scope.modetext = "{'font-size': '10px'}" : "de" == $scope.language && ($scope.modetext = "{'font-size': '12px'}"), $scope.use_floorplan = $rootScope.systems.use_floorplan, $scope.managerProduct_type = $rootScope.systems.product_type, $scope.browserInfo = $rootScope.browserInfo, $scope.CONFIG = CONFIG, $scope.navTabindex = 0, $scope.currentRunState = {
      run: 0,
      stop: 0,
      error: 0
    }, $scope.currentRunStateStacked = [0, 0, 0], $scope.facilities = [], $scope.groupedDatas = [], $scope.selectedItems = [], $scope.selectedItemsbackup = [], $scope.categoryFacilities = [], $scope.showFilter = !1, $scope.filterLabel = $translate.instant("CONTROL.FACILITY.CONTROLLER.JS.4"), $scope.filters = [], $scope.multiSelectStatus = !1, $scope.fanwaycontrolall = 0, $scope.valuetypes = ValueType.getValueTypesKV(), $scope.mapeditTemplateUrl = CONFIG.TEMPLATE_ROOT.FACILITY_ASIDE + "mapedit.html", $scope.ahuViewImg = !1, $scope.filterGroup = [
      [{
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.ODU,
        name: $filter("translate")("DUPLICATE.216"),
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.IDU,
        name: $filter("translate")("DUPLICATE.170"),
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.VENT,
        name: $filter("translate")("DUPLICATE.209"),
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.AIRCARE,
        name: $filter("translate")("DEVICE_NAME.AIRCARE"),
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.AWHP,
        name: $filter("translate")("DUPLICATE.210"),
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.AHU,
        name: "AHU",
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.CHILLER,
        name: $filter("translate")("CONTROL.FACILITY.CONTROLLER.JS.0"),
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.DOKIT,
        name: $filter("translate")("DEVICE_NAME.DOKIT"),
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.DI,
        name: "DI",
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.DO,
        name: "DO",
        count: 0,
        checked: !1
      }, {
        type: "cp_type",
        key: "type_id",
        value: CONFIG.CP_TYPE_ID.UIO_PORT,
        name: "EXP. I/O",
        count: 0,
        checked: !1
      }],
      [{
        type: "lp_value",
        key: "oper",
        value: "ON",
        name: $filter("translate")("DUPLICATE.11"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "oper",
        value: "OFF",
        name: $filter("translate")("DUPLICATE.12"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "hotw_oper",
        value: "ON",
        name: $filter("translate")("CONTROL.FACILITY.AWHP.HOTW") + " " + $filter("translate")("CONTROL.FACILITY.AWHP._HOTW.ON"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "hotw_oper",
        value: "OFF",
        name: $filter("translate")("CONTROL.FACILITY.AWHP.HOTW") + " " + $filter("translate")("CONTROL.FACILITY.AWHP._HOTW.OFF"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "schedule",
        value: "ON",
        name: $filter("translate")("DUPLICATE.74"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "peak_enable",
        value: "ON",
        name: "ACS_5" == $scope.managerProduct_type ? $filter("translate")("PEAK_CONTROL") : $filter("translate")("ADDITION.JS.20"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "error",
        value: "1",
        name: $filter("translate")("DUPLICATE.69"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "filter",
        value: "ON",
        name: $filter("translate")("DUPLICATE.211"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "lock",
        value: "ON",
        name: $filter("translate")("DUPLICATE.73"),
        count: 0,
        checked: !1
      }, {
        type: "lp_value",
        key: "oil",
        value: "ON",
        name: $filter("translate")("CONTROL.FACILITY.CONTROLLER.JS.3"),
        count: 0,
        checked: !1
      }]
    ], $scope.navSpaceTreeData = [], $scope.navCpTreeData = [], $scope.navSpaceSelected = [], $scope.selectedCP = {}, $scope.currentBreadcrumb = [], $scope.currentBreadcrumbMultiple = !1, $scope.selectedSpaceTree = !0, $scope.showFolder = !0, $scope.showcase = "iconlg", $scope.showcaseClass = "showcase-iconlg", $scope.showcaseSelect = "iconlg", $scope.sortSelect = $cookies.get("sorttype"), void 0 == $scope.sortSelect && ($scope.sortSelect = "N", $cookies.put("sorttype", $scope.sortSelect)), $scope.navShowCheckboxCallback, $scope.allowNavTreeMultiselect = !1, $scope.currentAsideTabNumber = 0, $scope.toolbarLabel = $filter("translate")("DUPLICATE.212"), $scope.goSpaceTreeData = [], $scope.goCpTreeData = [], $scope.goMapOriginData = null, $scope.goMapLocalData = null, $scope.goMapEmpty = !0, $scope.goMapExist = !1, $scope.goMapEditMode = !1, $scope.goTextEditable = !1, $scope.isSelectedGoObject = !1, $scope.goProvideLinkSpace = {
      hyperlink: -1,
      links: []
    }, $scope.ngfGoFile, $scope.ngfGoFileBackup, $scope.goSpaceTreeData = [], $scope.goCpTreeData = [], recalculateErrorInterval = void 0
  }(),
  function() {
    recalculateErrorInterval = setInterval(function() {
      switch ("list" == $scope.showcaseSelect ? $scope.currentRunState = Facility.refreshCurrentRunCount($scope.facilities) : $scope.currentRunState = Facility.refreshCurrentRunCount($scope.groupedDatas), $scope.currentRunStateStacked = [$scope.currentRunState.run, $scope.currentRunState.stop, $scope.currentRunState.error], $scope.navTabindex) {
        case CONFIG.FACILITY.DEVICE_CONTROL.MODE.SPACE:
          Space.calculateError(User.getRole());
          break;
        case CONFIG.FACILITY.DEVICE_CONTROL.MODE.CP:
          CP.calculateError(User.getRole())
      }
    }, 5e3)
  }(), $scope.DomLoaded = !1;
  var interval = $interval(function() {
    1 == $rootScope.systemLoaded && ($scope.DomLoaded = !0, $scope.tabChange(0), UIService.stopAllGlobalProgress(), $interval.cancel(interval))
  }, 1e3);
  $scope.isAvailAOValue = !0, $scope.editAOData = function(item) {
    var check = UT.checkFloatValue(item.value_view, $scope.language, item.vmin, item.vmax);
    1 == check.result ? (item.value = check.value, $scope.isAvailAOValue = !0) : $scope.isAvailAOValue = !1
  };
  var refreshFilter = function() {
      var filterCheckedCount = 0;
      $scope.filters = [], _.each($scope.filterGroup, function(group) {
        _.each(group, function(filter) {
          filter.checked && ($scope.filters.push(filter), filterCheckedCount++)
        })
      }), filterCheckedCount < 1 ? ($scope.filterLabel = $filter("translate")("CONTROL.FACILITY.CONTROLLER.JS.4"), $scope.showFilter = !1) : ($scope.filterLabel = filterCheckedCount + $filter("translate")("DUPLICATE.213"), $scope.showFilter = !0)
    },
    refreshFacilityCtrl = function() {
      if (0 != $scope.DomLoaded) {
        if ($log.debug("==================>"), $log.debug("★★ refreshFacilityCtrl:", $scope.showcaseSelect), refreshFilter(), "list" == $scope.showcaseSelect) $(".facilities").hide(), $timeout(function() {
          getListViewItems(), $(".facilities").show()
        }, 100);
        else switch ($scope.groupedDatas = [], $scope.navTabindex) {
          case CONFIG.FACILITY.DEVICE_CONTROL.MODE.SPACE:
            $scope.selectedSpaceTree = !0;
            var checkedSpace = [];
            _.uniq(_.flatten(_.map(UT.nestedFilter($scope.navSpaceTreeData, "nodes", function(node, pr) {
              return 1 == node.checked && checkedSpace.push(node), 1 == pr || 1 == node.checked
            }), function(node) {
              return [node.id].concat(Space.getNestedChildrenById(node.id, User.getRole()).children)
            }))), _.each(checkedSpace, function(spaceNode) {
              var groupdata = [];
              groupdata.name = _.map(getBreadcrumbTextInfoByNode(spaceNode, $scope.navSpaceTreeData, "space"), function(info) {
                return info.name
              }).join(" > "), groupdata.folders = Facility.getFolderBySpace({
                space: [spaceNode.id],
                filters: $scope.filters
              }), UT.sortAlphaNum(groupdata.folders), groupdata.facs = Facility.getFacilityBySpace({
                selected: [spaceNode.id],
                filters: $scope.filters,
                sort: $scope.sortSelect
              }), groupdata.currentPage = 0, groupdata.pagingFacs = getPagingData(groupdata.facs, groupdata.currentPage, $scope.pageCount), groupdata.totalPage = Math.ceil(groupdata.facs.length / $scope.pageCount), $scope.groupedDatas.push(groupdata), groupdata = null
            }), checkedSpace = null, $scope.navSpaceSelected = updateBreadcrumb($scope.navSpaceTreeData, "space");
            break;
          case CONFIG.FACILITY.DEVICE_CONTROL.MODE.CP:
            $scope.selectedSpaceTree = !1;
            var checkedCp = [];
            _.uniq(_.flatten(_.map(UT.nestedFilter($scope.navCpTreeData, "nodes", function(node, pr) {
              return 1 == node.checked && checkedCp.push(node), 1 == pr || 1 == node.checked
            }), function(node) {
              return "SPACE" == node.type ? [node.id].concat(CP.getNestedChildrenById(node.id, User.getRole()).children) : []
            }))), _.each(checkedCp, function(cpNode) {
              var groupdata = [];
              groupdata.name = _.map(getBreadcrumbTextInfoByNode(cpNode, $scope.navCpTreeData, "cp"), function(info) {
                return info.name
              }).join(" > "), groupdata.facs = Facility.getFacilityByCP({
                selected: [cpNode.id].concat(CP.getNestedChildrenById(cpNode.id, User.getRole()).children),
                filters: $scope.filters,
                sort: $scope.sortSelect
              }), groupdata.currentPage = 0, groupdata.pagingFacs = getPagingData(groupdata.facs, groupdata.currentPage, $scope.pageCount), groupdata.totalPage = Math.ceil(groupdata.facs.length / $scope.pageCount), $scope.groupedDatas.push(groupdata), groupdata = null
            }), $scope.navSpaceSelected = updateBreadcrumb($scope.navCpTreeData, "cp"), checkedCp = null
        }
        "list" == $scope.showcaseSelect ? $scope.currentRunState = Facility.refreshCurrentRunCount($scope.facilities) : $scope.currentRunState = Facility.refreshCurrentRunCount($scope.groupedDatas), $scope.currentRunStateStacked = [$scope.currentRunState.run, $scope.currentRunState.stop, $scope.currentRunState.error], $log.debug("<==================")
      }
    },
    getPagingData = function(data, currPage, pageCount) {
      return data.slice(currPage * pageCount, (currPage + 1) * pageCount)
    };
  $scope.getNextPage = function() {
    var target = $scope.groupedDatas[0];
    target && !$scope.allowNavTreeMultiselect && "list" !== $scope.showcaseSelect && target.currentPage < target.totalPage && (target.currentPage += 1, target.pagingFacs = target.pagingFacs.concat(getPagingData(target.facs, target.currentPage, $scope.pageCount)))
  }, $scope.navSpaceTreeInitAction = function() {
    navSpaceTreeController = this
  }, $scope.navSpaceTreeCheckAction = function(node, flag) {
    UIService.newGlobalProgress({
      text: $filter("translate")("PROGRESS.LOADING")
    });
    var treeModel = this.getModel();
    $log.debug("navSpaceTreeCheckAction @@", node + "  flag ", flag), 0 == flag && UT.nestedEach(node, "nodes", function(node) {
      node.checked = flag
    }), $timeout(function() {
      $scope.navSpaceSelected = updateBreadcrumb(treeModel, "space"), refreshFacilityCtrl(), UIService.stopAllGlobalProgress()
    })
  }, $scope.navCpTreeInitAction = function() {
    $log.debug("navCpTreeInitAction"), naCpTreeController = this
  }, $scope.navCpTreeShowCheckbox = function(node, depth) {
    return 0 != depth && depth < 3
  }, $scope.navCpTreeCheckAction = function(node, flag) {
    var treeModel = this.getModel();
    0 == flag && UT.nestedEach(node, "nodes", function(node) {
      node.checked = flag
    }), updateBreadcrumb(treeModel, "cp"), refreshFacilityCtrl()
  }, $scope.navCpTreeDropdownAction = function(node, open) {
    if (open && void 0 === node.nodes) {
      var childNodes = CP.findChildrenTree(node.id, User.getRole());
      _.each(childNodes, function(node) {
        node.hasChild = CP.hasChild(node.id, User.getRole())
      }), node.nodes = childNodes
    }
  }, $scope.navShowCheckboxCallback = function() {
    return !1
  };
  var deselectCardItem = function() {
    1 == $scope.multiSelectStatus && $scope.toggleSelectMode(), domMain.addClass("open-master-column-nav"), domMain.removeClass("open-master-column-aside"), _.each($scope.selectedItems, function(d) {
      "floor" === $scope.showcaseSelect && $("g.card[id=" + d.id + "]").removeAttr("selected"), d.selected = !1
    }), $scope.selectedItems = [], $scope.selectedItemsbackup = [], $scope.selectedCP = null, $scope.asideType = "none", resetToolbarLabel()
  };
  $scope.navSelectAction = function(node) {
    UIService.newGlobalProgress({
      text: $filter("translate")("PROGRESS.LOADING")
    }), deselectCardItem();
    var treeModel = this.ngModel;
    $scope.deselectAllItemAction(), void 0 != goMapViewController && goMapViewController.deselectAllItemAction(), $mstCont.scrollTop(0), node.checked = !0, node.selected = !0, $timeout(function() {
      $scope.navSpaceSelected = updateBreadcrumb(treeModel, "space"), refreshFacilityCtrl(), "floor" == $scope.showcaseSelect && ($scope.goMapLocalData = angular.copy(Space.getGoDataById($scope.navSpaceSelected[0].id)), setupGoMapView($scope.goMapLocalData.space_id)), UIService.stopAllGlobalProgress()
    })
  }, $scope.navTreeTitleCallback = function(node) {
    var cp = CP.getCPById(node.id, User.getRole());
    if (void 0 != cp) return cp.type_id == CONFIG.CP_TYPE_ID.AC_MANAGER ? cp.cp_attr.name.lp_value : CpInfo.isVirtureCp(cp) ? $filter("translate")(CpInfo.cpPathByCp(cp)) : cp.cp_attr.name.lp_value
  }, $scope.makeCPTree = function() {
    0 == $scope.navCpTreeData.length && ($log.debug("makeCPTree"), $scope.navCpTreeData = CP.getAllCPTree(User.getRole()), $scope.navCpTreeData.length > 0 && UT.nestedEach($scope.navCpTreeData, "nodes", function(node) {
      node.err = !0, node.checked = !1, node.selected = !1
    })), refreshFacilityCtrl(), CP.calculateError(User.getRole())
  }, $scope.makeSpaceTree = function() {
    if (0 == $scope.navSpaceTreeData.length && ($log.debug("makeSpaceTree"), $scope.navSpaceTreeData = Space.getSpaceTree(User.getRole()), $scope.navSpaceTreeData.length > 0))
      if (angular.isDefined($scope.navSpaceTreeData[1].nodes) && $scope.navSpaceTreeData[1].nodes.length > 0) {
        if (shouldSelectSpaceTreeById($scope.navSpaceTreeData[1].nodes[0].id), navSpaceTreeController) {
          etcGroup = navSpaceTreeController.getNodeByFilter(function(node) {
            return 1 == node.id
          })[0];
          navSpaceTreeController.toggleDropdownByNode(etcGroup, !1)
        }
      } else if (angular.isDefined($scope.navSpaceTreeData[0].nodes) && $scope.navSpaceTreeData[0].nodes.length > 0 && (shouldSelectSpaceTreeById($scope.navSpaceTreeData[0].nodes[0].id), navSpaceTreeController)) {
      var etcGroup = navSpaceTreeController.getNodeByFilter(function(node) {
        return 1 == node.id
      })[0];
      navSpaceTreeController.toggleDropdownByNode(etcGroup, !1)
    }
    refreshFacilityCtrl(), Space.calculateError(User.getRole())
  }, $scope.reLoadAllTreeData = function() {
    $scope.navCpTreeData = [], $scope.navSpaceTreeData = [], $scope.navCpTreeData = CP.getAllCPTree(User.getRole()), $scope.navSpaceTreeData = Space.getSpaceTree(User.getRole()), navSpaceTreeController && UT.nestedEach($scope.navSpaceTreeData, "nodes", function(node, pr, depth) {
      $scope.navSpaceSelected[0].id == node.id && $timeout(function() {
        navSpaceTreeController.selectByNode(node)
      }, 500)
    })
  }, $scope.tabChange = function(index) {
    0 != $scope.DomLoaded && (deselectCardItem(), $mstCont.scrollTop(0), $log.debug("tabChange index: ", index), index ? $scope.makeCPTree() : $scope.makeSpaceTree())
  }, $scope.filterSubmit = function(filterGroup) {
    $scope.filterGroup = filterGroup, refreshFacilityCtrl()
  }, $scope.removeFilter = function(filter) {
    filter.checked = !1, refreshFacilityCtrl()
  };
  var fetchControlHistory = function() {
      var items = $scope.selectedItems;
      0 != items.length && ($log.debug("fetchControlHistory"), $(".contents-loading").hasClass("active") || ($(".contents-loading").toggleClass("active", !0), $scope.history = [], $scope.users = [], Setting.getUserSetting().then(function(data) {
        _.map(data, function(users) {
          $scope.users[users.id] = users
        });
        var res = CP.getControlHistory({
          acp_id: $scope.selectedItems[0].acp.cp_attr.addr.lp_value,
          dev_addr: $scope.selectedItems[0].cp_attr.addr.lp_value,
          cp_type: $scope.selectedItems[0].type_id
        });
        res.success(function(data, status, headers, config) {
          data.length > 0 && _.map(data, function(history) {
            if (_.isNaN($scope.users[history.usr_id]) || _.isUndefined($scope.users[history.usr_id]))
              if (0 == history.usr_id) history.usr_id = "by " + $scope.users[1].user_id;
              else if (-1 == history.usr_id) {
              var event_usr = history.event_value.split(";");
              2 == event_usr.length ? (history.event_value = event_usr[0], history.usr_id = "by " + event_usr[1]) : console.warn("TODO:event_value 오류 :: ", history)
            } else -24 == history.usr_id ? history.usr_id = "" : history.usr_id < -1 ? $translate("USER_ID." + history.usr_id).then(function(translation) {
              -23 == history.usr_id ? history.usr_id = translation : history.usr_id = "by " + translation
            }) : history.usr_id = $filter("translate")("CONTROL.FACILITY.CONTROLLER.JS.5");
            else history.usr_id = "by " + $scope.users[history.usr_id].user_id;
            2048 == history.event_type || 2049 == history.event_type ? ($translate("EVENT_TYPE_KEY.1").then(function(translation) {
              history.event_type = translation
            }), history.event_value > 300 && history.event_value < 556 && items[0].type_id == CONFIG.CP_TYPE_ID.AWHP ? history.event_value = "BC_" + (history.event_value - 300) : 0 == history.event_value ? history.event_value = $filter("translate")("DUPLICATE.24") : history.event_value = "CH_" + history.event_value) : history.event_type >= 2 && history.event_type <= 9 ? $translate("EVENT_TYPE_KEY.2").then(function(translation) {
              history.event_type = translation
            }) : 2050 == history.event_type ? ($translate("EVENT_TYPE_KEY.3").then(function(translation) {
              history.event_type = translation
            }), history.event_value = "-") : ($translate("EVENT_TYPE_KEY.4").then(function(translation) {
              history.event_type = translation
            }), $translate("EVENT_TYPE." + history.event_type).then(function(translation) {
              history.event_value = translation
            }));
            var trans_cp_type = "";
            if (items[0].type_id == CONFIG.CP_TYPE_ID.VENT ? trans_cp_type = "VENT" : items[0].type_id == CONFIG.CP_TYPE_ID.UIO_PORT ? "ao" == items[0].cp_attr.type.lp_value ? trans_cp_type = "PORT_AO" : "do" == items[0].cp_attr.type.lp_value ? trans_cp_type = "PORT_DO" : "di" == items[0].cp_attr.type.lp_value ? trans_cp_type = "PORT_DI" : "ui" == items[0].cp_attr.type.lp_value && (trans_cp_type = "PORT_UI") : trans_cp_type = items[0].type_id == CONFIG.CP_TYPE_ID.IDU ? "IDU" : items[0].type_id == CONFIG.CP_TYPE_ID.ODU ? "ODU" : items[0].type_id == CONFIG.CP_TYPE_ID.AHU ? "AHU" : items[0].type_id == CONFIG.CP_TYPE_ID.CHILLER ? "CHILLER" : items[0].type_id == CONFIG.CP_TYPE_ID.AWHP ? "AWHP" : items[0].type_id == CONFIG.CP_TYPE_ID.DI ? "DI" : items[0].type_id == CONFIG.CP_TYPE_ID.DO ? "DO" : items[0].type_id == CONFIG.CP_TYPE_ID.DOKIT ? "DOKIT" : items[0].type_id == CONFIG.CP_TYPE_ID.AIRCARE ? "AIRCARE" : "-", history.event_type >= 2 && history.event_type <= 9 && null != history.event_value) {
              var valueAtrr = history.event_name,
                valueRange = history.event_value;
              $translate("HISTORY_CONTROL." + trans_cp_type + "." + valueAtrr.toUpperCase()).then(function(translation) {
                history.event_value = translation + ": ", 1 == isNaN(parseInt(valueRange)) || /slc_step|defrost_step|target_pressure_step|comfort_step|refrige_sound_decrease/.test(valueAtrr) ? $translate("HISTORY_CONTROL." + trans_cp_type + "._" + valueAtrr.toUpperCase() + "." + valueRange.toUpperCase()).then(function(translation) {
                  history.event_value += translation
                }) : /finedust_status|ultrafine_dust_status|superultrafine_dust_status/.test(valueAtrr) ? $translate("HISTORY_CONTROL._FINE_DUST_STATUS." + $rootScope.systems.finedust_standard_country.toUpperCase() + "." + valueRange.toUpperCase()).then(function(translation) {
                  helper.event_value += translation
                }) : /setcoolwatertemp|sethotwatertemp|seticehotwatertemp|seticewatertemp/.test(valueAtrr) ? history.event_value += $filter("convertDot")(valueRange, !1) + " ℃" : valueAtrr.indexOf("temp") >= 0 || /cool_upper_lim|cool_lower_lim|heat_upper_lim|heat_lower_lim|aco_upper|aco_lower|setback_upper|setback_lower/.test(valueAtrr) ? angular.isDefined($scope.selectedItems[0].cp_attr.isDOAS) && $scope.selectedItems[0].cp_attr.isDOAS.lp_value ? history.event_value += $filter("convertDot")(valueRange, !1) + " ℉" : history.event_value += $filter("convertDot")(valueRange, !0) + $rootScope.gTempUnit : history.event_value += $filter("convertDot")(valueRange)
              })
            }
          }), $scope.history = data, $(".contents-loading").toggleClass("active", !1), data = null, items = null
        }), res.error(function(data, status, headers, config) {
          $log.debug(data), $(".contents-loading").toggleClass("active", !1)
        })
      })))
    },
    fetchSchedule = function() {
      var cpIds = _.pluck($scope.selectedItems, "id");
      $scope.schedule = [], Schedule.getTodayScheduleForFacility(User.getId(), cpIds).then(function(data) {
        $scope.schedule = data
      })
    },
    didSelectedCpItem = function() {
      $scope.selectedItems.length ? (domMain.dispatchEvent("shouldopenaside"), 1 == $scope.currentAsideTabNumber && (fetchSchedule(), fetchControlHistory())) : ("floor" !== $scope.showcase && domMain.dispatchEvent("shouldcloseaside"), $scope.currentAsideTabNumber = 0)
    };
  $scope.clickControlPanel = function() {
    $scope.currentAsideTabNumber = 0
  }, $scope.clickDeviceInformationPanel = function() {
    1 == $scope.selectedItems.length && (fetchSchedule(), fetchControlHistory()), $scope.currentAsideTabNumber = 1
  }, $scope.getSortListViewItems = function() {
    $cookies.put("sorttype", $scope.sortSelect), $log.debug("$scope.getSortListViewItems.."), refreshFacilityCtrl()
  }, $scope.getShowCaseViewItems = function() {
    $scope.showcase = $scope.showcaseSelect, $scope.showcaseClass = "showcase-" + $scope.showcaseSelect, $scope.pageCount = "iconsm" == $scope.showcaseSelect ? 21 : 12, refreshFacilityCtrl(), "floor" == $scope.showcaseSelect && (deselectCardItem(), void 0 != goMapViewController && goMapViewController.deselectAllItemAction(), didSelectedCpItem(), $scope.goMapLocalData = angular.copy(Space.getGoDataById($scope.navSpaceSelected[0].id)), setupGoMapView($scope.goMapLocalData.space_id), domMain.dispatchEvent("shouldcloseaside")), hideAhuView()
  };
  var getListViewItems = function() {
      var loadedData = [];
      switch ($scope.facilities = [], $scope.categoryFacilities = {}, console.time("getListViewItems"), $scope.navTabindex) {
        case CONFIG.FACILITY.DEVICE_CONTROL.MODE.SPACE:
          $scope.selectedSpaceTree = !0;
          checkedIds = _.uniq(_.flatten(_.map(UT.nestedFilter($scope.navSpaceTreeData, "nodes", function(node, pr) {
            return 1 == pr || 1 == node.checked
          }), function(node) {
            return [node.id].concat(Space.getNestedChildrenById(node.id, User.getRole()).children)
          })));
          loadedData.facs = Facility.getFacilityBySpace({
            selected: checkedIds,
            filters: $scope.filters,
            sort: $scope.sortSelect
          }), $scope.navSpaceSelected = updateBreadcrumb($scope.navSpaceTreeData, "space");
          break;
        case CONFIG.FACILITY.DEVICE_CONTROL.MODE.CP:
          $scope.selectedSpaceTree = !1;
          var checkedIds = _.uniq(_.flatten(_.map(UT.nestedFilter($scope.navCpTreeData, "nodes", function(node, pr) {
            return 1 == pr || 1 == node.checked
          }), function(node) {
            return [node.id].concat(CP.getNestedChildrenById(node.id, User.getRole()).children)
          })));
          loadedData.facs = Facility.getFacilityByCP({
            selected: checkedIds,
            filters: $scope.filters,
            sort: $scope.sortSelect
          }), $scope.navSpaceSelected = updateBreadcrumb($scope.navCpTreeData, "cp")
      }
      _.each(loadedData.facs, function(fac) {
        var parentTemp = {};
        parentTemp.parent = CP.getCPById(fac.parent_id, User.getRole()), parentTemp.acp = CP.getCPById(parentTemp.parent.parent_id, User.getRole()), fac.cp_attr.parent_addr = {
          attr_code: "parent_addr",
          lp_value: parentTemp.parent.cp_attr.hasOwnProperty("addr") ? UT.decTohex(parseInt(parentTemp.parent.cp_attr.addr.lp_value)) : ""
        }, void 0 != parentTemp.acp && (fac.cp_attr.parent_acpAddr = {
          attr_code: "parent_acpAddr",
          lp_value: parentTemp.acp.cp_attr.hasOwnProperty("addr") ? UT.decTohex(parseInt(parentTemp.acp.cp_attr.addr.lp_value)) : ""
        }, fac.cp_attr.parent_acp = {
          attr_code: "parent_acp",
          lp_value: parentTemp.acp.cp_attr.name.lp_value
        }), fac.cp_attr.hex_addr = {
          attr_code: "hex_addr",
          lp_value: UT.decTohex(parseInt(fac.cp_attr.addr.lp_value))
        }, fac.type_id == CONFIG.CP_TYPE_ID.IDU && angular.isDefined(fac.cp_attr.humidity) && "0" != fac.cp_attr.humidity.lp_value && (fac.cp_attr.comfort_type = {
          attr_code: "comfort_type",
          lp_value: UT.comfortCal(fac.cp_attr.roomtemp.lp_value, fac.cp_attr.humidity.lp_value, $rootScope.systems.comfort_season)
        });
        var fac_type_id = fac.type_id;
        if (!$scope.categoryFacilities.hasOwnProperty(fac.type_id)) {
          switch ($scope.categoryFacilities[fac.type_id] = [], fac.type_id) {
            case CONFIG.CP_TYPE_ID.IDU:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.IDU] = FacilityList.getGridOptions("idulist");
              break;
            case CONFIG.CP_TYPE_ID.VENT:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.VENT] = FacilityList.getGridOptions("ventlist");
              break;
            case CONFIG.CP_TYPE_ID.AWHP:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.AWHP] = FacilityList.getGridOptions("awhplist");
              break;
            case CONFIG.CP_TYPE_ID.AHU:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.AHU] = FacilityList.getGridOptions("ahulist");
              break;
            case CONFIG.CP_TYPE_ID.CHILLER:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.CHILLER] = FacilityList.getGridOptions("chillerlist");
              break;
            case CONFIG.CP_TYPE_ID.DOKIT:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.DOKIT] = FacilityList.getGridOptions("dokitlist");
              break;
            case CONFIG.CP_TYPE_ID.DI:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.DI] = FacilityList.getGridOptions("dilist");
              break;
            case CONFIG.CP_TYPE_ID.DO:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.DO] = FacilityList.getGridOptions("dolist");
              break;
            case CONFIG.CP_TYPE_ID.UIO_PORT:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.UIO_PORT] = FacilityList.getGridOptions("portlist");
              break;
            case CONFIG.CP_TYPE_ID.ODU:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.ODU] = FacilityList.getGridOptions("odulist");
              break;
            case CONFIG.CP_TYPE_ID.AIRCARE:
              $scope.listViewOptions[CONFIG.CP_TYPE_ID.AIRCARE] = FacilityList.getGridOptions("airlist")
          }
          $scope.categoryFacilities[fac_type_id].checkall = !1
        }
        fac.type_id != CONFIG.CP_TYPE_ID.EXPANSION_IO && $scope.categoryFacilities[fac.type_id].push(fac), fac.index = $scope.categoryFacilities[fac.type_id].length - 1
      }), console.timeEnd("getListViewItems"), $scope.facilities.push(loadedData), loadedData = null
    },
    getBreadcrumbTextInfoByNode = function(selNode, treeData, alias) {
      var breadcrumbInfo = [];
      return UT.reverseNestedEach(treeData, "nodes", function(node, cr) {
        if (UT.hasValue(cr, !0) || node == selNode) {
          if (0 == $scope.navTabindex) 1 == node.id ? node.title = $filter("translate")("ADDITION.HTML.77") : 2 == node.id && (node.title = $filter("translate")("ADDITION.HTML.78")), breadcrumbInfo.push({
            id: node.id,
            name: node.title,
            alias: alias
          });
          else if (1 == $scope.navTabindex) {
            var cp = CP.getCPById(node.id, User.getRole()),
              title = CpInfo.isVirtureCp(cp) ? $filter("translate")(CpInfo.cpPathByCp(cp)) : node.title;
            breadcrumbInfo.push({
              id: node.id,
              name: title,
              alias: alias
            })
          }
          return !0
        }
      }), breadcrumbInfo.reverse(), breadcrumbInfo
    },
    updateBreadcrumb = function(treeData, alias) {
      var selectedNode = UT.nestedFilter(treeData, "nodes", function(node) {
          return 1 == node.checked
        }),
        selectedIds = _.map(selectedNode, function(node) {
          return node.id
        });
      if (1 == selectedIds.length) {
        var selNode = selectedNode[0];
        $scope.currentBreadcrumb = getBreadcrumbTextInfoByNode(selNode, treeData, alias), $scope.currentBreadcrumbMultiple = !0
      } else selectedIds.length > 1 ? ($scope.currentBreadcrumb = _.map(selectedNode, function(node) {
        return {
          id: node.id,
          name: node.title,
          alias: alias
        }
      }), $scope.currentBreadcrumbMultiple = !1) : $scope.currentBreadcrumb = [];
      return selectedNode
    },
    shouldSelectSpaceTreeById = function(id) {
      var treeModel = $scope.navSpaceTreeData;
      UT.nestedEach(treeModel, "nodes", function(node, pr) {
        node.id == id ? (node.selected = !0, node.checked = !0) : (node.selected = !1, node.checked = !1)
      }), updateBreadcrumb(treeModel, "space")
    },
    shouldSelectCpTreeById = function(id) {
      var treeModel = $scope.navCpTreeData;
      UT.nestedEach(treeModel, "nodes", function(node, pr) {
        node.id == id ? (node.selected = !0, node.checked = !0) : (node.selected = !1, node.checked = !1)
      }), updateBreadcrumb(treeModel, "cp"), refreshFacilityCtrl()
    };
  $scope.selectBreadcrumbItem = function(item) {
    switch ($scope.ahuViewImg = !1, $log.debug("selectBreadcrumbItem: ", item), deselectCardItem(), item.alias) {
      case "space":
        shouldSelectSpaceTreeById(item.id);
        break;
      case "cp":
        shouldSelectCpTreeById(item.id)
    }
    refreshFacilityCtrl(), $scope.selectedItems = [], $scope.selectedItemsbackup = [], didSelectedCpItem()
  };
  var _selectedCPMake = function(items) {
      var attrForm = {};
      return _.each(items, function(item) {
        _.each(item.cp_attr, function(attribute) {
          var key = attribute.attr_code,
            value = attribute.lp_value;
          if (attrForm.hasOwnProperty(key)) {
            if (null == attrForm[key]) return;
            attrForm[key] != value && ("settemp_llim" == key || "settemp_ulim" == key ? (attrForm.settemp_llim = void 0, attrForm.settemp_ulim = void 0) : "aco_lower" == key || "aco_upper" == key ? (attrForm.aco_lower = void 0, attrForm.aco_upper = void 0) : "cool_lower_lim" == key || "cool_upper_lim" == key ? (attrForm.cool_lower_lim = void 0, attrForm.cool_upper_lim = void 0) : "heat_lower_lim" == key || "heat_upper_lim" == key ? (attrForm.heat_lower_lim = void 0, attrForm.heat_upper_lim = void 0) : attrForm[key] = null)
          } else attrForm[key] = "addr" == key ? UT.decTohex(parseInt(value), 2) : value
        })
      }), attrForm.settemp_llim > attrForm.settemp_ulim && (attrForm.settemp_ulim = attrForm.settemp_llim), attrForm.aco_lower > attrForm.aco_upper && (attrForm.aco_upper = attrForm.aco_lower), (parseFloat(attrForm.settemp_llim) < 16 || parseFloat(attrForm.settemp_llim) > 30) && (attrForm.settemp_llim = "16.0"), (parseFloat(attrForm.settemp_ulim) < 16 || parseFloat(attrForm.settemp_ulim) > 30) && (attrForm.settemp_ulim = "30.0"), (parseFloat(attrForm.aco_lower) < $rootScope.systems.lower_limit || parseFloat(attrForm.aco_lower) > 30) && (attrForm.aco_lower = $rootScope.systems.lower_limit), (parseFloat(attrForm.aco_upper) < $rootScope.systems.lower_limit || parseFloat(attrForm.aco_upper) > 30) && (attrForm.aco_upper = "30.0"), parseFloat(attrForm.outdoor_temp2) < parseFloat(attrForm.outdoor_temp1) && (attrForm.outdoor_temp2 = attrForm.outdoor_temp1), attrForm
    },
    resetToolbarLabel = function() {
      $scope.toolbarLabel = $filter("translate")("DUPLICATE.212")
    };
  $scope.asideType = "none", $scope.asideLoadList = [];
  var changeSelectedItems = function() {
    var items = $scope.selectedItems;
    if (items.length) {
      var firstTypeId = items[0].type_id,
        matchAllType = _.all(items, function(item) {
          return item.type_id == firstTypeId
        });
      if ($log.debug("matchAllType : ", matchAllType), 1 == items.length) $scope.toolbarLabel = items[0].name;
      else {
        var selectedItemsCounts = {};
        _.each(items, function(item) {
          selectedItemsCounts.hasOwnProperty(item.type_id) || (selectedItemsCounts[item.type_id] = 0), selectedItemsCounts[item.type_id]++
        }), $scope.toolbarLabel = _.map(selectedItemsCounts, function(length, typeid) {
          return $filter("translate")("DEVICE_NAME." + CpInfo.cpAliasByCpTypeId(~~typeid)) + "(" + length + ")"
        }).join(", ")
      }
      if (matchAllType) switch ($scope.asideType = firstTypeId, firstTypeId) {
        case CONFIG.CP_TYPE_ID.IDU:
          $scope.selectedCP = _selectedCPMake(items);
          var isExistNotTwoset = _.filter(items, function(item) {
            return 0 == item.cp_attr.ui_twoset_mode.lp_value
          });
          $scope.selectedItems.length > 0 && (isExistNotTwoset.length > 0 ? $scope.selectedCP.ui_twoset_mode = !1 : $scope.selectedCP.ui_twoset_mode = !0);
          var fdirAll = Number($scope.selectedCP.fdir1) + Number($scope.selectedCP.fdir2) + Number($scope.selectedCP.fdir3) + Number($scope.selectedCP.fdir4);
          $scope.selectedCP.fanDirAll = fdirAll % 4 == 0 ? $scope.selectedCP.fdir1 : null, $scope.selectedCP.fanDirAllf = !1;
          var firstIduMode = items[0].cp_attr.mode.lp_value;
          if (0 == _.all(items, function(item) {
              return item.cp_attr.mode.lp_value == firstIduMode
            }) && $scope.selectedItems.length > 1) {
            var isExistAutoMode = _.map(_.filter(items, function(item) {
              return "AUTO" == item.cp_attr.mode.lp_value
            }), function(item) {
              return item
            });
            if ("UAE" == $rootScope.policy) {
              var isExistCoolMode = _.map(_.filter(items, function(item) {
                return "COOL" == item.cp_attr.mode.lp_value
              }), function(item) {
                return item
              });
              !(isExistOtherMode = _.map(_.filter(items, function(item) {
                return !!/HEAT|DRY|FAN/.test(item.cp_attr.mode.lp_value)
              }), function(item) {
                return item
              })).length > 0 && (isExistAutoMode.length > 0 || isExistCoolMode.length > 0) ? $scope.selectedCP.lower_limit = "20" : $scope.selectedCP.lower_limit = $rootScope.systems.lower_limit
            } else isExistAutoMode.length > 0 ? $scope.selectedCP.lower_limit = "18" : $scope.selectedCP.lower_limit = $rootScope.systems.lower_limit
          } else $scope.selectedCP.lower_limit = $rootScope.systems.lower_limit;
          $scope.cool_upper_lim_backup = $scope.selectedCP.cool_upper_lim, $scope.cool_lower_lim_backup = $scope.selectedCP.cool_lower_lim;
          break;
        case CONFIG.CP_TYPE_ID.ODU:
          $scope.selectedCP = _selectedCPMake(items);
          break;
        case CONFIG.CP_TYPE_ID.VENT:
          $scope.selectedCP = _selectedCPMake(items);
          var firstACMode = items[0].cp_attr.ac_mode.lp_value;
          if (0 == _.all(items, function(item) {
              return item.cp_attr.ac_mode.lp_value == firstACMode
            }) && $scope.selectedItems.length > 1)
            if ("UAE" == $rootScope.policy) {
              var isExistCoolAutoMode = _.map(_.filter(items, function(item) {
                  return !!("vent_dx" == item.cp_attr.dmodel & ("COOL" == item.cp_attr.ac_mode.lp_value || "AUTO" == item.cp_attr.ac_mode.lp_value))
                }), function(item) {
                  return item
                }),
                isExistOtherMode = _.map(_.filter(items, function(item) {
                  return !!/HEAT|NONE/.test(item.cp_attr.mode.lp_value)
                }), function(item) {
                  return item
                });
              !isExistOtherMode.length > 0 && isExistCoolAutoMode.length > 0 ? $scope.selectedCP.lower_limit = "20" : $scope.selectedCP.lower_limit = $rootScope.systems.lower_limit
            } else(isExistAutoMode = _.map(_.filter(items, function(item) {
              return !!("vent_dx" == item.cp_attr.dmodel & ("AUTO" == item.cp_attr.ac_mode.lp_value || "NONE" == item.cp_attr.ac_mode.lp_value))
            }), function(item) {
              return item
            })).length > 0 ? $scope.selectedCP.lower_limit = "18" : $scope.selectedCP.lower_limit = $rootScope.systems.lower_limit;
          else $scope.selectedCP.lower_limit = $rootScope.systems.lower_limit;
          if (void 0 != $scope.selectedCP.func) {
            switch ($scope.selectedCP.func) {
              case "QUICK":
                $scope.selectedCP.func_ui_1 = "ON", $scope.selectedCP.func_ui_2 = "OFF";
                break;
              case "POWSAV":
                $scope.selectedCP.func_ui_1 = "OFF", $scope.selectedCP.func_ui_2 = "ON";
                break;
              case "NONE":
                $scope.selectedCP.func_ui_1 = "OFF", $scope.selectedCP.func_ui_2 = "OFF"
            }
            "OFF" == $scope.selectedCP.ac_oper && ($scope.selectedCP.ac_mode = "NONE")
          }
          break;
        case CONFIG.CP_TYPE_ID.AHU:
          $scope.selectedCP = _selectedCPMake(items);
          break;
        case CONFIG.CP_TYPE_ID.AWHP:
          $scope.selectedCP = _selectedCPMake(items), UT.setAwhpTempLimit($scope.selectedCP, $rootScope.systems.lower_limit);
          break;
        case CONFIG.CP_TYPE_ID.CHILLER:
          $scope.selectedCP = _selectedCPMake(items), 0 == _.all(items, function(item) {
            return item.cp_attr.dmodel.lp_value == items[0].cp_attr.dmodel.lp_value
          }) && ($scope.asideType = "different");
          break;
        case CONFIG.CP_TYPE_ID.DOKIT:
        case CONFIG.CP_TYPE_ID.DI:
        case CONFIG.CP_TYPE_ID.DO:
          $scope.selectedCP = _selectedCPMake(items);
          break;
        case CONFIG.CP_TYPE_ID.EXPANSION_IO:
          $scope.selectedCP = _selectedCPMake(items), $log.debug("EXPANSION_IO: ", $scope.selectedCP);
          break;
        case CONFIG.CP_TYPE_ID.UIO_PORT:
          $scope.selectedCP = _selectedCPMake(items);
          var type = [],
            check_io_type = [];
          _.each($scope.selectedItems, function(cardItem) {
            angular.isUndefined(cardItem.cp_attr.io_type) || (type.push({
              type: cardItem.cp_attr.type.lp_value
            }), check_io_type.push({
              io_type: cardItem.cp_attr.io_type.lp_value
            }))
          }), type = _.groupBy(type, "type"), check_io_type = _.groupBy(check_io_type, "io_type"), 1 == Object.keys(check_io_type).length && 1 == Object.keys(type).length ? ($scope.asideType = CONFIG.CP_TYPE_ID.UIO_PORT, $scope.isAvailAOValue = !0) : check_io_type.hasOwnProperty("bi") || Object.keys(type).length > 1 ? ($scope.asideType = "none", $scope.isAvailAOValue = !1) : ($scope.asideType = CONFIG.CP_TYPE_ID.UIO_PORT, $scope.isAvailAOValue = !0), $scope.selectedCP.value_view = UT.convertDot($scope.selectedCP.value, $scope.language);
          break;
        case CONFIG.CP_TYPE_ID.AIRCARE:
          $scope.selectedCP = _selectedCPMake(items);
          break;
        default:
          $scope.selectedCP = null, $scope.asideType = "different"
      } else 0 == _.any(items, function(node) {
        if (node.type_id == CONFIG.CP_TYPE_ID.UIO_PORT || node.type_id == CONFIG.CP_TYPE_ID.DI || node.type_id == CONFIG.CP_TYPE_ID.DO || node.type_id == CONFIG.CP_TYPE_ID.ODU) return !0
      }) ? ($scope.selectedCP = _selectedCPMake(items), $scope.asideType = "different", null != $scope.selectedCP.settemp_llim && ($scope.selectedCP.settemp_llim = void 0), null != $scope.selectedCP.settemp_ulim && ($scope.selectedCP.settemp_ulim = void 0), null != $scope.selectedCP.aco_lower && ($scope.selectedCP.aco_lower = void 0), null != $scope.selectedCP.aco_upper && ($scope.selectedCP.aco_upper = void 0)) : ($scope.selectedCP = null, $scope.asideType = "none")
    } else $scope.selectedCP = null, $scope.asideType = "none", resetToolbarLabel();
    items.length ? $scope.selectedItemsbackup = angular.copy($scope.selectedItems) : $scope.selectedItemsbackup = [], void 0 == $scope.asideLoadList[$scope.asideType] && ($scope.asideLoadList[$scope.asideType] = !0, "different" != $scope.asideType && "none" != $scope.asideType && $compile($(".facility-standard-toolbar-part-" + $scope.asideType))($scope)), items = null, $log.debug("selectedCP :", $scope.selectedCP), $log.debug("asideTemplateUrl:: ", $scope.asideType)
  };
  $scope.folderSelect = function(item) {
    $log.debug("folderSelect...");
    var treeModel = $scope.navSpaceTreeData;
    $scope.deselectAllItemAction(), UT.nestedEach($scope.navSpaceTreeData, "nodes", function(node, pr) {
      node.checked = node.id == item.id
    }), $scope.navSpaceSelected = updateBreadcrumb(treeModel, "space"), shouldSelectSpaceTreeById(item.id), refreshFacilityCtrl(), treeModel = null
  }, $scope.multiselectToggle = function() {
    $scope.allowNavTreeMultiselect = !$scope.allowNavTreeMultiselect, $scope.allowNavTreeMultiselect ? ($scope.navShowCheckboxCallback = function() {
      return !0
    }, $scope.navSelectAction = null) : ($scope.navShowCheckboxCallback = function() {
      return !1
    }, $scope.navSelectAction = function(node) {
      var treeModel = this.ngModel;
      $scope.deselectAllItemAction(), $mstCont.scrollTop(0), node.checked = !0, node.selected = !0, $scope.navSpaceSelected = updateBreadcrumb(treeModel, "space"), refreshFacilityCtrl()
    })
  }, $scope.toggleSelectMode = function() {
    $scope.multiSelectStatus = !$scope.multiSelectStatus, $scope.multiSelectStatus || (_.each($scope.selectedItems, function(item) {
      "floor" === $scope.showcaseSelect ? $("g.card[id=" + item.id + "]").removeAttr("selected") : item.selected = !1
    }), $scope.selectedItems = [], changeSelectedItems(), "floor" !== $scope.showcaseSelect && domMain.dispatchEvent("shouldcloseaside"))
  }, $scope.selectAllItemAction = function() {
    $scope.multiSelectStatus = !0;
    var selectedGroupedFacs = [];
    _.each($scope.groupedDatas, function(group) {
      _.each(group.facs, function(fac) {
        selectedGroupedFacs.push(fac), fac.selected = !0
      })
    }), $scope.selectedItems = selectedGroupedFacs, didSelectedCpItem(), changeSelectedItems(), selectedGroupedFacs = null
  }, $scope.deselectAllItemWhenMuliselectAction = function() {
    _.each($scope.selectedItems, function(item) {
      item.selected = !1
    }), _.each($scope.categoryFacilities, function(facs) {
      facs.checkall = !1, _.each(facs, function(item) {
        item.selected = !1
      })
    }), $scope.selectedItems = [], changeSelectedItems(), $scope.selectedItemsbackup = [], $scope.multiSelectStatus = !1, didSelectedCpItem(), $scope.goMapEditMode || domMain.addClass("open-master-column-nav"), domMain.removeClass("open-master-column-aside"), hideAhuView(), "list" == $scope.showcaseSelect && $scope.updateKendoGridForListView()
  }, $scope.deselectAllItemAction = function() {
    switch (deselectCardItem(), $scope.navTabindex) {
      case CONFIG.FACILITY.DEVICE_CONTROL.MODE.SPACE:
        UT.nestedEach($scope.navSpaceTreeData, "nodes", function(node) {
          node.selected = !1, node.checked = !1
        });
        break;
      case CONFIG.FACILITY.DEVICE_CONTROL.MODE.CP:
        UT.nestedEach($scope.navCpTreeData, "nodes", function(node) {
          node.selected = !1, node.checked = !1
        })
    }
    1 == $scope.allowNavTreeMultiselect && $scope.multiselectToggle(), didSelectedCpItem()
  }, $scope.completeItemMultiSelectAction = function() {
    didSelectedCpItem()
  }, $scope.facilityListCheckAllByCategory = function(categoryItems, checkall) {
    checkall = !checkall, _.each(categoryItems, function(item) {
      item.selected = checkall
    }), categoryItems.checkall = checkall, $scope.selectedItems = _.filter($scope.facilities[0].facs, function(d) {
      return 1 == d.selected
    }), didSelectedCpItem(), changeSelectedItems(), 0 == checkall && (domMain.addClass("open-master-column-nav"), domMain.removeClass("open-master-column-aside"), $scope.selectedItems = [])
  }, $scope.getDeviceType = function(item) {
    return item.type_id == CONFIG.CP_TYPE_ID.IDU ? "IDU" : item.type_id == CONFIG.CP_TYPE_ID.VENT ? "VENT" : item.type_id == CONFIG.CP_TYPE_ID.AHU ? "AHU" : item.type_id == CONFIG.CP_TYPE_ID.AWHP ? "AWHP" : item.type_id == CONFIG.CP_TYPE_ID.CHILLER ? "CHILLER" : cp.type_id == CONFIG.CP_TYPE_ID.AIRCARE ? "AIRCARE" : "IDU"
  }, $scope.getOperationClass = function(item) {
    var result = [];
    if (item.selected && result.push("selected"), item.cp_attr.error.lp_value > 0)
      if (item.type_id == CONFIG.CP_TYPE_ID.CHILLER) {
        var err = "NONE";
        item.detail_id == CONFIG.CP_DETAIL_ID.CHILLER.TURBO ? err = CHILLER.TURBO.ERROR["CH_" + item.cp_attr.error.lp_value] : item.detail_id == CONFIG.CP_DETAIL_ID.CHILLER.ABSORB ? err = CHILLER.ABSORB.ERROR["CH_" + item.cp_attr.error.lp_value] : item.detail_id == CONFIG.CP_DETAIL_ID.CHILLER.SCREW && (err = CHILLER.SCREW.ERROR["CH_" + item.cp_attr.error.lp_value]), /242|246/.test(item.cp_attr.error.lp_value) ? result.push("has-error") : "Error" == err ? result.push("has-error") : result.push("has-warning")
      } else result.push("has-error");
    return 1 == item.cp_attr.isLoading.lp_value && result.push("has-init-error"), item.type_id == CONFIG.CP_TYPE_ID.IDU ? result.push("device-idu") : item.type_id == CONFIG.CP_TYPE_ID.VENT ? "vent_dx" == item.cp_attr.dmodel.lp_value ? (result.push("device-vent"), result.push("device-dxvent")) : result.push("device-vent") : item.type_id == CONFIG.CP_TYPE_ID.AHU ? result.push("device-ahu") : item.type_id == CONFIG.CP_TYPE_ID.AWHP ? (result.push("device-awhp"), "awhp_wt_ctrl" != item.cp_attr.dmodel.lp_value || "ON" != item.cp_attr.hotw_oper.lp_value && "ON" != item.cp_attr.oper.lp_value ? "awhp_dual_ctrl" == item.cp_attr.dmodel.lp_value && "ON" == item.cp_attr.hotw_oper.lp_value && result.push("awhp-hotwater") : result.push("awhp-hotwater")) : item.type_id == CONFIG.CP_TYPE_ID.DOKIT ? result.push("device-dokit") : item.type_id == CONFIG.CP_TYPE_ID.CHILLER ? result.push("device-chiller") : item.type_id == CONFIG.CP_TYPE_ID.DI ? result.push("device-di") : item.type_id == CONFIG.CP_TYPE_ID.DO ? result.push("device-do") : item.type_id == CONFIG.CP_TYPE_ID.UIO_PORT ? result.push("device-uio") : item.type_id == CONFIG.CP_TYPE_ID.AIRCARE && result.push("device-aircare"), item.type_id == CONFIG.CP_TYPE_ID.AWHP ? "awhp_wt_ctrl" == item.cp_attr.dmodel.lp_value ? "ON" == item.cp_attr.hotw_oper.lp_value ? result.push("mode-run") : result.push("mode-stop") : "awhp_wio_ctrl" == item.cp_attr.dmodel.lp_value ? "ON" == item.cp_attr.oper.lp_value ? result.push("mode-run") : result.push("mode-stop") : "awhp_dual_ctrl" == item.cp_attr.dmodel.lp_value && ("ON" == item.cp_attr.oper.lp_value || "ON" == item.cp_attr.hotw_oper.lp_value ? result.push("mode-run") : result.push("mode-stop")) : item.type_id == CONFIG.CP_TYPE_ID.DI || item.type_id == CONFIG.CP_TYPE_ID.DO ? "SHORT" == item.cp_attr.state.lp_value ? result.push("mode-run") : result.push("mode-stop") : item.type_id == CONFIG.CP_TYPE_ID.UIO_PORT ? "ao" == item.cp_attr.type.lp_value || "ui" == item.cp_attr.type.lp_value && "bi" != item.cp_attr.io_type.lp_value ? result.push("mode-run") : 1 * item.cp_attr.value.lp_value >= 1 ? result.push("mode-run") : result.push("mode-stop") : "ON" == item.cp_attr.oper.lp_value ? item.type_id == CONFIG.CP_TYPE_ID.AIRCARE ? result.push("mode-aircare") : result.push("mode-run") : result.push("mode-stop"), result
  }, $scope.getFinedustClassForCard = function(item) {
    var level = [0, 1, 2, 3, 0, 1, 4, 5],
      classText = ["good", "normal", "bad", "severe", "good2", "normal2", "severe2", "severe3"],
      result = [];
    if ("ON" == item.cp_attr.dustsensor_avail.lp_value) {
      var max = Math.max(level[1 * item.cp_attr.fine_dust.status], level[1 * item.cp_attr.ultrafine_dust.status], level[1 * item.cp_attr.superultrafine_dust.status]);
      level[1 * item.cp_attr.fine_dust.status] == max ? result.push(classText[1 * item.cp_attr.fine_dust.status]) : level[1 * item.cp_attr.ultrafine_dust.status] == max ? result.push(classText[1 * item.cp_attr.ultrafine_dust.status]) : level[1 * item.cp_attr.superultrafine_dust.status] == max && result.push(classText[1 * item.cp_attr.superultrafine_dust.status])
    }
    return result
  }, $scope.getCO2ClassForCard = function(item) {
    var classText = ["good", "normal", "bad", "severe"],
      result = [];
    return "ON" != item.cp_attr.cmd7_avail.lp_value && "ON" != item.cp_attr.cmd4_avail.lp_value || result.push(classText[item.cp_attr.co2.lp_value - 1]), result
  }, $scope.selectItem = function(item) {
    if (domBody.toggleAttr("open-gnb", !1), "list" == $scope.showcaseSelect || "floor" == $scope.showcaseSelect || 1 == $scope.multiSelectStatus) "list" !== $scope.showcaseSelect && (item.selected = !item.selected), 1 == item.selected ? $scope.selectedItems.push(item) : _.remove($scope.selectedItems, function(node) {
      return 0 == node.selected
    }), (parentTemp = {}).parent = CP.getCPById(item.parent_id, User.getRole()), parentTemp.acp = CP.getCPById(parentTemp.parent.parent_id, User.getRole()), parentTemp.space = Space.getSpace(item.contain_space_id[0], User.getRole()), item.cp_attr.parent_name = {
      attr_code: "parent_name",
      lp_value: parentTemp.parent.cp_attr.hasOwnProperty("name") ? parentTemp.parent.cp_attr.name.lp_value : ""
    }, item.cp_attr.parent_power = {
      attr_code: "parent_power",
      lp_value: parentTemp.parent.cp_attr.hasOwnProperty("power") ? parentTemp.parent.cp_attr.power.lp_value : ""
    }, item.cp_attr.parent_addr = {
      attr_code: "parent_addr",
      lp_value: parentTemp.parent.cp_attr.hasOwnProperty("addr") ? parentTemp.parent.cp_attr.addr.lp_value : ""
    }, item.cp_attr.parent_model = {
      attr_code: "parent_model",
      lp_value: parentTemp.parent.cp_attr.hasOwnProperty("model") ? parentTemp.parent.cp_attr.model.lp_value : ""
    }, void 0 != parentTemp.acp && (item.cp_attr.parent_acpAddr = {
      attr_code: "parent_acpAddr",
      lp_value: parentTemp.acp.cp_attr.hasOwnProperty("addr") ? parentTemp.acp.cp_attr.addr.lp_value : ""
    }, item.cp_attr.parent_acp = {
      attr_code: "parent_acp",
      lp_value: parentTemp.acp.cp_attr.name.lp_value
    }), void 0 != parentTemp.space && (item.cp_attr.parent_spaceId = {
      attr_code: "parent_spaceId",
      lp_value: parentTemp.space.id
    }, item.cp_attr.parent_spaceName = {
      attr_code: "parent_spaceName",
      lp_value: parentTemp.space.name
    }), "list" != $scope.showcaseSelect && "floor" != $scope.showcaseSelect || 0 != $scope.selectedItems.length || (domMain.addClass("open-master-column-nav"), domMain.removeClass("open-master-column-aside")), $scope.updateKendoGridForListView();
    else if (0 == $scope.multiSelectStatus) {
      item.selected ? (domMain.addClass("open-master-column-nav"), domMain.removeClass("open-master-column-aside"), _.each($scope.selectedItems, function(d) {
        d.selected = !1
      }), item.selected = !1, $scope.selectedItems = [], $scope.selectedItemsbackup = []) : (_.each($scope.selectedItems, function(d) {
        d.selected = !1
      }), item.selected = !0, $scope.selectedItems = [item]);
      var parentTemp = {};
      parentTemp.parent = CP.getCPById(item.parent_id, User.getRole()), parentTemp.acp = CP.getCPById(parentTemp.parent.parent_id, User.getRole()), parentTemp.space = Space.getSpace(item.contain_space_id[0], User.getRole()), item.cp_attr.parent_name = {
        attr_code: "parent_name",
        lp_value: parentTemp.parent.cp_attr.hasOwnProperty("name") ? parentTemp.parent.cp_attr.name.lp_value : ""
      }, item.cp_attr.parent_power = {
        attr_code: "parent_power",
        lp_value: parentTemp.parent.cp_attr.hasOwnProperty("power") ? parentTemp.parent.cp_attr.power.lp_value : ""
      }, item.cp_attr.parent_addr = {
        attr_code: "parent_addr",
        lp_value: parentTemp.parent.cp_attr.hasOwnProperty("addr") ? parentTemp.parent.cp_attr.addr.lp_value : ""
      }, item.cp_attr.parent_model = {
        attr_code: "parent_model",
        lp_value: parentTemp.parent.cp_attr.hasOwnProperty("model") ? parentTemp.parent.cp_attr.model.lp_value : ""
      }, void 0 != parentTemp.acp && (item.cp_attr.parent_acpAddr = {
        attr_code: "parent_acpAddr",
        lp_value: parentTemp.acp.cp_attr.hasOwnProperty("addr") ? parentTemp.acp.cp_attr.addr.lp_value : ""
      }, item.cp_attr.parent_acp = {
        attr_code: "parent_acp",
        lp_value: parentTemp.acp.cp_attr.name.lp_value
      }), void 0 != parentTemp.space && (item.cp_attr.parent_spaceId = {
        attr_code: "parent_spaceId",
        lp_value: parentTemp.space.id
      }, item.cp_attr.parent_spaceName = {
        attr_code: "parent_spaceName",
        lp_value: parentTemp.space.name
      }), item.type_id == CONFIG.CP_TYPE_ID.IDU && angular.isDefined(item.cp_attr.humidity) && (item.cp_attr.comfort_type = {
        attr_code: "comfort_type",
        lp_value: UT.comfortCal(item.cp_attr.roomtemp.lp_value, item.cp_attr.humidity.lp_value, $rootScope.systems.comfort_season)
      }), parentTemp = null
    }
    0 == $scope.multiSelectStatus && didSelectedCpItem(), changeSelectedItems()
  }, $scope.selectedCPSumbit = function() {
    $("#master-progress-submit").dispatchEvent("shouldopen"), $timeout(function() {
      $("#master-progress-submit").dispatchEvent("shouldclose")
    }, 1e3, !1);
    var items = $scope.selectedItemsbackup,
      updateAttrTargets = [];
    _.each($scope.selectedCP, function(value, key) {
      null != value && _.each(items, function(selectedItem) {
        if (selectedItem.cp_attr.hasOwnProperty(key))
          if ("ui_alarmrelease" == key) "ON" == value && updateAttrTargets.push({
            cpid: selectedItem.id,
            origin: selectedItem.cp_attr.alarmrelease,
            setValue: value
          });
          else if ("addr" != key && "error" != key && "affect" != key && selectedItem.cp_attr[key].lp_value != value) {
          if ("ac_mode" == key && "NONE" == value) return;
          if (/chilled_water_flow_switch|chi_cwater_pump_out|chi_cwater_pump_interlock|chi_cwater_entering_temp|chi_cwater_leaving_temp|outer_temp|tot_running_current_A|left2start_time_sec|accm_run_time_hour_low|accm_run_time_hour_high/.test()) return;
          _.each(items, function(selectedItems) {
            var control_point = selectedItems.cp_attr[key];
            void 0 != control_point && (control_point.lp_value = value, updateAttrTargets.push({
              cpid: selectedItems.id,
              origin: control_point,
              setValue: value
            }))
          })
        }
      })
    }), updateAttrTargets = _.groupBy(updateAttrTargets, "cpid"), $log.debug("updateAttrTargets ", updateAttrTargets);
    var value_list = [];
    if (_.each(updateAttrTargets, function(targets) {
        _.each(targets, function(target) {
          value_list.push({
            id: target.origin.lp_id,
            by_who: User.getId(),
            point_value: target.setValue + ""
          })
        })
      }), value_list.length > 0) {
      $log.debug("value_list :: ", value_list);
      var atomicParam = {
        value_list: value_list
      };
      WAPI.callWAPI("ps", "set_values", atomicParam).then(function(result) {
        $log.debug("set_values", result)
      }, function(err) {
        $log.error("set_values", err)
      })
    }
    updateAttrTargets = null, value_list = null, items = null
  }, $scope.selectedSpaceId = function(spaceId) {
    $scope.showcaseSelect = "floor"
  }, $scope.initGoMapView = function() {
    goMapViewController = this
  }, $scope.goIconCallback = function(node) {
    return CpInfo.iconURLByDummy(node)
  };
  var updateGoTreeListByCpList = function(goObjects) {
      var proc = function(node) {
        node.checked = _.any(goObjects, function(goo) {
          if (goo.cp_id && goo.cp_id == node.cp_id) return !0
        })
      };
      UT.nestedEach($scope.goSpaceTreeData, "nodes", proc), UT.nestedEach($scope.goCpTreeData, "nodes", proc)
    },
    updateGoSelectedBySelectedCpList = function(goObjects) {
      $scope.selectedItems = _.map(goObjects, function(goo) {
        return angular.copy(CP.getCPById(goo.cp_id, User.getRole()))
      }), $scope.isSelectedGoObject = !!$scope.selectedItems.length, didSelectedCpItem()
    };
  $scope.goTreeCheckAction = function(node, check) {
    switch ($log.debug("goTreeCheckAction >>>>>>>>>>>>>", check), node.type) {
      case "CP":
        if (check) $scope.goMapLocalData.cp_list.push({
          cp_id: node.cp_id,
          title: node.title.slice(0, 6),
          x: 300,
          y: 300,
          size_x: 0,
          size_y: 0
        });
        else {
          $scope.goMapLocalData.cp_list;
          $scope.goMapLocalData.cp_list = nd.filterOf($scope.goMapLocalData.cp_list, function(cpitem) {
            return cpitem.cp_id != node.cp_id
          })
        }
        updateGoTreeListByCpList($scope.goMapLocalData.cp_list);
        break;
      case "SPACE":
        console.warn("지원하지 않는 루트")
    }
  }, $scope.goTreeShowCheckbox = function(node) {
    return "CP" == node.type
  }, $scope.goCpSelectAction = function(item, flag) {
    if (1 == $scope.goMapEditMode) updateGoSelectedBySelectedCpList(this.getSelectedCpList());
    else {
      var cp = CP.getCPById(item.cp_id, User.getRole());
      $scope.selectItem(cp)
    }
  }, $scope.closeGoMapCardItem = function() {
    $(".card").removeAttr("selected")
  }, $scope.goTextSelectAction = function(item, flag) {
    var textDataList = this.getSelectedTextList();
    $log.debug("textDataList == > ", textDataList), $scope.goTextEditable = !!textDataList.length, flag ? ($scope.selectedMapItem = item, $scope.goProvideLinkSpace.hyperlink = item.hyperlink, domMain.dispatchEvent("shouldopenaside")) : ($scope.selectedMapItem = "", $scope.goProvideLinkSpace.hyperlink = -1)
  }, $scope.goCpRemoveAction = function(item) {
    updateGoTreeListByCpList(this.getCpList())
  }, $scope.ngfBlobFile = void 0;
  var shouldAfterSetGoMapLocalData = function() {
      $scope.goMapEmpty = !$scope.goMapLocalData.url, $scope.goMapEmpty
    },
    setupGoMapView = function(targetSpaceId) {
      $scope.goMapLocalData = angular.copy(Space.getGoDataById(targetSpaceId)), $scope.goMapOriginData = angular.copy(Space.getGoDataById(targetSpaceId)), $log.debug("setupGoMapView: ", $scope.goMapOriginData), $scope.goMapExist = !$scope.goMapLocalData.url, shouldAfterSetGoMapLocalData(), $scope.goProvideLinkSpace.links = _.filter(Space.getSpaces(User.getRole()), function(spaceDatum) {
        return spaceDatum.map
      }), $scope.goSpaceTreeData = Space.getSpaceWithChildrenById(targetSpaceId, User.getRole()), $scope.goCpTreeData = CP.getCPTreeForFacility(targetSpaceId, User.getRole())[0].nodes, updateGoTreeListByCpList($scope.goMapLocalData.cp_list), $log.debug("$scope.goSpaceTreeData", $scope.goSpaceTreeData), $log.debug("$scope.goCpTreeData", $scope.goCpTreeData)
    };
  $scope.ngfGoFileChange = function(file) {
    $log.debug("ngfGoFileChange:", file), null != file && null != file.$ngfHeight && null != file.$ngfWidth && ($scope.goMapLocalData.url = file.$ngfBlobUrl, $scope.ngfGoFileBackup = $scope.ngfGoFile), shouldAfterSetGoMapLocalData()
  }, $scope.goMapZoom = 1, $scope.goMapZoomAction = function(zoom) {
    $scope.goMapZoom = zoom
  }, $scope.goMapZoomOrigin = function() {
    goMapViewController.zoomOrigin()
  }, $scope.goMapZoomFit = function() {
    goMapViewController.zoomFit()
  }, $scope.activeMapEditMode = function() {
    void 0 != $scope.navSpaceSelected && 0 != $scope.navSpaceSelected.length && ($scope.goMapLocalData = angular.copy(Space.getGoDataById($scope.navSpaceSelected[0].id)), setupGoMapView($scope.goMapLocalData.space_id), $scope.goMapEditMode = !0, _.each($scope.selectedItems, function(item) {
      $("g.card[id=" + item.id + "]").removeAttr("selected"), item.selected = !1
    }), $scope.selectedItems = [], changeSelectedItems(), domMain.dispatchEvent("shouldopenaside"))
  }, $scope.cancleMapEdit = function() {
    void 0 != goMapViewController && goMapViewController.deselectAllItemAction();
    var targetId = $scope.goMapLocalData.space_id;
    $scope.goMapEditMode && domMain.addClass("open-master-column-nav"), $scope.goMapEditMode = !1, $scope.goMapExist = !1, domMain.dispatchEvent("shouldcloseaside"), setupGoMapView(targetId)
  }, $scope.removeMap = function() {
    var targetId = $scope.goMapOriginData.space_id;
    UIService.newGlobalProgress({
      text: $filter("translate")("CONTROL.FACILITY.CONTROLLER.JS.6")
    }), Space.removeGoData($scope.goMapOriginData, function(status, data) {
      if (400 == status) {
        $log.debug("removeMap :: ", data);
        var history = new ControlHistory(User.getId(), CONTROL_TYPE.GOMAP);
        history.setIdOfCP(1), history.atomicSetConfHis(), DP.loadBaseDataForDeivceSetting().then(function() {
          $scope.reLoadAllTreeData(), UIService.stopAllGlobalProgress(), domMain.dispatchEvent("shouldcloseall"), $scope.goMapEditMode && domMain.addClass("open-master-column-nav"), $scope.goMapEditMode = !1, goMapViewController.deselectAllItemAction(), setupGoMapView(targetId)
        }), history = null
      }
      500 == status && (UIService.stopAllGlobalProgress(), domMain.dispatchEvent("shouldcloseall"), $scope.goMapEditMode && domMain.addClass("open-master-column-nav"), $scope.goMapEditMode = !1, $scope.goMapExist = !1, goMapViewController.deselectAllItemAction())
    })
  }, $scope.openRemoveMsg = function() {
    $("#blueprint-delete-modal").dispatchEvent("shouldopen")
  }, $scope.goMapHyperlinkAction = function(hyperlink) {
    $log.debug("goMapHyperlinkAction.."), shouldSelectSpaceTreeById(hyperlink)
  }, $scope.mapUpload = function() {
    UIService.newGlobalProgress({
      text: $filter("translate")("PROGRESS.UPLOAD")
    });
    var prohibited = ["^", "'", ",", '"', "|", "\\"],
      isValid = !0;
    if (_.each($scope.goMapLocalData.text_list, function(text) {
        if (_.each(prohibited, function(char) {
            if (-1 != text.text.indexOf(char)) return isValid = !1, !1
          }), 0 == isValid) return !1
      }), 0 == isValid) return $("#prohibited-text-warning").dispatchEvent("shouldopen"), void UIService.stopAllGlobalProgress();
    var targetId = $scope.goMapLocalData.space_id,
      originData = _.clone($scope.goMapOriginData),
      sendData = _.clone($scope.goMapLocalData);
    sendData.file = $scope.ngfGoFileBackup, _.each(sendData.cp_list, function(cpitem) {
      delete cpitem.cp.cp_attr
    }), Space.updateGoData(originData, sendData, function(status, data) {
      if ($log.debug("mapUpload :: req ", status, data), 400 == status) {
        $log.debug("mapUpload :: ", data);
        var history = new ControlHistory(User.getId(), CONTROL_TYPE.GOMAP);
        history.setIdOfCP(1), history.atomicSetConfHis(), DP.loadBaseDataForDeivceSetting().then(function() {
          $scope.reLoadAllTreeData(), UIService.stopAllGlobalProgress(), domMain.dispatchEvent("shouldcloseall"), $scope.goMapEditMode && domMain.addClass("open-master-column-nav"), $scope.goMapEditMode = !1, goMapViewController.deselectAllItemAction(), setupGoMapView(targetId)
        }), history = null
      }
      500 == status && ($log.error("mapUpload :: ", data), UIService.stopAllGlobalProgress(), domMain.dispatchEvent("shouldcloseall"), $scope.goMapEditMode && domMain.addClass("open-master-column-nav"), $scope.goMapEditMode = !1, $scope.goMapExist = !1, goMapViewController.deselectAllItemAction())
    })
  }, $scope.addTextToMap = function() {
    if ($scope.goMapLocalData.url) {
      void 0 == $scope.goMapLocalData.cp_list && ($scope.goMapLocalData.cp_list = []);
      var max = 0;
      for (var index in $scope.goMapLocalData.text_list) $scope.goMapLocalData.text_list[index].id > max && (max = $scope.goMapLocalData.text_list[index].id);
      $scope.goMapLocalData.text_list.push({
        text: $filter("translate")("CONTROL.FACILITY.CONTROLLER.JS.7"),
        x: 300,
        y: 300,
        size: 14,
        size_x: 0,
        size_y: 0,
        id: max + 1,
        deco: "normal",
        color: "000000",
        bg_color: "transparent"
      })
    }
  }, $scope.currentMapTextDecoration = function(decoration) {
    goMapViewController.setSelectedTextList(function(textDatum) {
      textDatum.deco = decoration
    })
  }, $scope.currentMapTextColor = function(color) {
    goMapViewController.setSelectedTextList(function(textDatum) {
      textDatum.color = color
    })
  }, $scope.currentMapTextBackground = function(color) {
    goMapViewController.setSelectedTextList(function(textDatum) {
      textDatum.bg_color = color
    })
  }, $scope.currentMapTextSizeUp = function() {
    goMapViewController.setSelectedTextList(function(textDatum) {
      textDatum.size = parseInt(textDatum.size, 10) + 2
    })
  }, $scope.currentMapTextSizeDown = function() {
    goMapViewController.setSelectedTextList(function(textDatum) {
      textDatum.size = parseInt(textDatum.size, 10) - 2
    })
  }, $scope.setSort = function(type) {
    goMapViewController.setSort(type)
  }, $scope.openEditTool = function() {
    1 == domMain.hasClass("open-master-column-aside") ? domMain.dispatchEvent("shouldcloseaside") : domMain.dispatchEvent("shouldopenaside")
  }, $scope.ahuViewContent = function() {
    $scope.ahuViewImg ? hideAhuView() : (showAhuView(), $scope.updateKendoGridForListView())
  };
  var showAhuView = function() {
      $scope.ahuViewImg = !0, $(".gnb-toggle-action").prop("disabled", !0), 1 == $scope.selectedItems[0].cp_attr.isLGDOAS.lp_value && loadDataByDOAS($scope.selectedItems[0], "selection")
    },
    hideAhuView = function() {
      $scope.ahuViewImg = !1, $(".gnb-toggle-action").prop("disabled", !1), angular.isDefined(timeoutOwner) && ($timeout.cancel(timeoutOwner), timeoutOwner = void 0)
    };
  $scope.ahuTypeCheck = function() {
    return !($scope.selectedItems.length > 1) && (1 == $scope.selectedItems.length && $scope.selectedItems[0].type_id == CONFIG.CP_TYPE_ID.AHU)
  }, $scope.initAhuView = function() {
    hideAhuView()
  }, $scope.selectTap = function(selectedTap) {
    for (var i = 0; i < 4; i++) $scope.doas_tap_selector[i] = !1;
    $scope.doas_tap_selector[selectedTap] = !0
  };
  var timeoutOwner, startRefresh = function(nodeData) {
      angular.isDefined(timeoutOwner) && ($timeout.cancel(timeoutOwner), timeoutOwner = void 0), angular.isUndefined(timeoutOwner) && (timeoutOwner = $timeout(function() {
        loadDataByDOAS(nodeData, "refresh")
      }, 1e4))
    },
    loadDataByDOAS = function(nodeData, calltype) {
      var params = {
        cp_id: nodeData.id,
        wait_time: 20
      };
      WAPI.callWAPI("nai", "get_cycle_data", params).then(function(data) {
        var json = x2js.xml_str2json(data);
        if (null == json) $scope.selectCp = null, $scope.selectedCp = null, $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "default.html", startRefresh(nodeData);
        else {
          if ($scope.selectCp = angular.copy(json.lgapxml.response), $scope.selectCp.title = nodeData.name, void 0 != $scope.selectCp.doas_detail_info) {
            var copyPoint = $scope.selectCp.doas_detail_info.point,
              newPoint = [],
              splitDOAS10t = ["00001", "00002", "00041", "10001", "10002", "10003", "10012", "10019", "10033", "10064"],
              operMode = ["30011"];
            _.each(copyPoint, function(value) {
              changePointData(splitDOAS10t, operMode, newPoint, value)
            }), $scope.selectCp.doas_detail_info.point = newPoint
          }
          startRefresh(nodeData)
        }
      }, function(err) {
        startRefresh(nodeData)
      })
    },
    changePointData = function(typeArray, modeArray, valueArray, value, gasArray) {
      var exist = _.find(typeArray, function(key) {
          return key == value._register
        }),
        existMode = _.find(modeArray, function(key) {
          return key == value._register
        });
      if (void 0 != gasArray) var existValve = _.find(gasArray, function(key) {
        return key == value._register
      });
      exist ? valueArray[value._register] = 1 == value._value ? "ON" : "OFF" : existMode ? 0 == value._value ? valueArray[value._register] = "OFF" : 1 == value._value ? valueArray[value._register] = "COOL" : 2 == value._value ? valueArray[value._register] = "HEAT" : 3 == value._value && (valueArray[value._register] = "DRY") : valueArray[value._register] = existValve ? 1 == value._value ? "OPENSTATUS" : "CLOSESTATUS" : parseFloat(value._value)
    };
  $scope.updateKendoGridForListView = function() {
    "127.0.0.1:8000" != location.host && "list" == $scope.showcaseSelect && $timeout(function() {
      _.each($scope.categoryFacilities, function(typeid, facs) {
        switch (typeid[0].type_id) {
          case CONFIG.CP_TYPE_ID.IDU:
            $(".kendo-idu").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.VENT:
            $(".kendo-vent").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.AWHP:
            $(".kendo-awhp").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.AHU:
            $(".kendo-ahu").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.CHILLER:
            $(".kendo-chiller").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.DOKIT:
            $(".kendo-dokit").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.DI:
            $(".kendo-di").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.DO:
            $(".kendo-do").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.UIO_PORT:
            $(".kendo-port").data("kendoGrid").refresh();
            break;
          case CONFIG.CP_TYPE_ID.ODU:
            $(".kendo-odu").data("kendoGrid").refresh()
        }
      })
    }, 1e3)
  }, $scope.imageFileUSB = "", $scope.openImageListModal = function() {
    System.getImageFileListUSB().then(function(rs) {
      "USB_UNMOUNT" == rs.result ? $("#usb-unmount-modal").dispatchEvent("shouldopen") : (rs.data.pop(), $scope.imageFileList = rs.data, $scope.imageFileList.length > 0 ? $scope.imageFileUSB = $scope.imageFileList[0] : $scope.imageFileUSB = "", $("#blueprint-image-select-modal").dispatchEvent("shouldopen"))
    })
  }, $scope.saveImageFromUSB = function() {
    $("#master-progress-submit").dispatchEvent("shouldopen"), System.saveImageFromUSB($scope.imageFileUSB).then(function(rs) {
      "USB_UNMOUNT" == rs.result ? $("#usb-unmount-modal").dispatchEvent("shouldopen") : "OK" == rs.result ? ($("#master-progress-submit").dispatchEvent("shouldclose"), $scope.goMapLocalData.url = "/public/tmp" + $scope.imageFileUSB, shouldAfterSetGoMapLocalData()) : $("#master-progress-submit").dispatchEvent("shouldclose")
    }, function(err) {
      $("#master-progress-submit").dispatchEvent("shouldclose")
    })
  };
  var willStateExitFunc = $scope.$on("acmanager.willStateExit", function(event, stop) {
    $log.debug("willStateExit"), _.each($scope.selectedItems, function(item) {
      item.selected = !1
    }), UT.nestedEach($scope.navCpTreeData, "nodes", function(node) {
      node.selected = !1
    }), $scope.selectedItems = [], $scope.selectedItemsbackup = []
  });
  $scope.$on("$destroy", function() {
    angular.isDefined(recalculateErrorInterval) && (clearInterval(recalculateErrorInterval), recalculateErrorInterval = void 0), willStateExitFunc(), $scope.DomLoaded = !1, navSpaceTreeController = null, naCpTreeController = null, goMapViewController = null
  }), $scope.clickQuick = function() {
    $scope.selectedCP.fanspeed = "AUTO", $scope.selectedCP.func = "QUICK", $scope.selectedCP.func_ui_2 = "OFF"
  }, $scope.clickQuickRelease = function() {
    $scope.selectedCP.fanspeed = "HIGH", $scope.selectedCP.func = "NONE"
  }, $scope.clickPOWSAV = function() {
    $scope.selectedCP.fanspeed = "AUTO", $scope.selectedCP.func = "POWSAV", $scope.selectedCP.func_ui_1 = "OFF"
  }, $scope.clickPOWSAVRelease = function() {
    $scope.selectedCP.fanspeed = "HIGH", $scope.selectedCP.func = "NONE"
  }, $scope.clickOccupied = function() {
    void 0 != $scope.selectedCP.last_occ_cool_settemp && void 0 != $scope.selectedCP.last_occ_heat_settemp && ($scope.selectedCP.cool_settemp = $scope.selectedCP.last_occ_cool_settemp, $scope.selectedCP.heat_settemp = $scope.selectedCP.last_occ_heat_settemp)
  }, $scope.clickUnOccupied = function() {
    void 0 != $scope.selectedCP.last_unocc_cool_settemp && void 0 != $scope.selectedCP.last_unocc_heat_settemp && ($scope.selectedCP.cool_settemp = $scope.selectedCP.last_unocc_cool_settemp, $scope.selectedCP.heat_settemp = $scope.selectedCP.last_unocc_heat_settemp)
  }, $scope.clickOFFAuto = function() {
    $scope.selectedCP.func = "NONE", $scope.selectedCP.func_ui_1 = "OFF", $scope.selectedCP.func_ui_2 = "OFF"
  }, $scope.clickAirconModeNotHeat = function() {
    $scope.selectedCP.humidity = "OFF", "NONE" == $scope.selectedCP.ac_mode ? $scope.selectedCP.ac_oper = "OFF" : $scope.selectedCP.ac_oper = "ON", "AUTO" == $scope.selectedCP.ac_mode && $scope.selectedCP.settemp < 18 && ($scope.selectedCP.settemp = "18"), "UAE" == $rootScope.policy && angular.isDefined($scope.selectedCP.ac_mode) && 1 == /COOL|AUTO/.test($scope.selectedCP.ac_mode) && $scope.selectedCP.settemp < 20 && ($scope.selectedCP.settemp = "20")
  }, $scope.clickCool = function(value) {
    $scope.selectedCP.deadband > $scope.selectedCP.cool_settemp - $scope.selectedCP.heat_settemp && ($scope.selectedCP.heat_settemp = $scope.selectedCP.cool_settemp - parseFloat($scope.selectedCP.deadband))
  }, $scope.clickHeat = function(value) {
    $scope.selectedCP.deadband > $scope.selectedCP.cool_settemp - $scope.selectedCP.heat_settemp && ($scope.selectedCP.cool_settemp = $scope.selectedCP.heat_settemp + parseFloat($scope.selectedCP.deadband))
  }, $scope.clickCoolUpperLim = function() {
    $scope.selectedCP.deadband > $scope.selectedCP.cool_upper_lim - $scope.selectedCP.heat_upper_lim && ($scope.selectedCP.heat_upper_lim = $scope.selectedCP.cool_upper_lim - parseFloat($scope.selectedCP.deadband))
  }, $scope.clickHeatUpperLim = function() {
    $scope.selectedCP.deadband > $scope.selectedCP.cool_upper_lim - $scope.selectedCP.heat_upper_lim && ($scope.selectedCP.cool_upper_lim = $scope.selectedCP.heat_upper_lim + parseFloat($scope.selectedCP.deadband))
  }, $scope.clickCoolLowerLim = function() {
    $scope.selectedCP.deadband > $scope.selectedCP.cool_lower_lim - $scope.selectedCP.heat_lower_lim && ($scope.selectedCP.heat_lower_lim = $scope.selectedCP.cool_lower_lim - parseFloat($scope.selectedCP.deadband))
  }, $scope.clickHeatLowerLim = function() {
    $scope.selectedCP.deadband > $scope.selectedCP.cool_lower_lim - $scope.selectedCP.heat_lower_lim && ($scope.selectedCP.cool_lower_lim = $scope.selectedCP.heat_lower_lim + parseFloat($scope.selectedCP.deadband))
  }, $scope.setAhuOADamper = function(value) {
    "ENABLE" == $rootScope.systems.apply_opening_damper && ("COOL" == $scope.selectedCP.mode ? ($scope.selectedCP.cooleadamper = value, $scope.selectedCP.coolmixdamper = 90 - value) : "HEAT" == $scope.selectedCP.mode ? ($scope.selectedCP.heateadamper = value, $scope.selectedCP.heatmixdamper = 90 - value) : "FAN" == $scope.selectedCP.mode && ($scope.selectedCP.faneadamper = value, $scope.selectedCP.fanmixdamper = 90 - value))
  }, $scope.setAhuMixDamper = function(value) {
    "ENABLE" == $rootScope.systems.apply_opening_damper && ("COOL" == $scope.selectedCP.mode ? ($scope.selectedCP.cooloadamper = 90 - value, $scope.selectedCP.cooleadamper = 90 - value) : "HEAT" == $scope.selectedCP.mode ? ($scope.selectedCP.heatoadamper = 90 - value, $scope.selectedCP.heateadamper = 90 - value) : "FAN" == $scope.selectedCP.mode && ($scope.selectedCP.fanoadamper = 90 - value, $scope.selectedCP.faneadamper = 90 - value))
  }, $scope.setAhuEADamper = function(value) {
    "ENABLE" == $rootScope.systems.apply_opening_damper && ("COOL" == $scope.selectedCP.mode ? ($scope.selectedCP.cooloadamper = value, $scope.selectedCP.coolmixdamper = 90 - value) : "HEAT" == $scope.selectedCP.mode ? ($scope.selectedCP.heatoadamper = value, $scope.selectedCP.heatmixdamper = 90 - value) : "FAN" == $scope.selectedCP.mode && ($scope.selectedCP.fanoadamper = value, $scope.selectedCP.fanmixdamper = 90 - value))
  }, $scope.clickAwhpMode = function(item) {
    UT.setAwhpTempLimit(item, $rootScope.systems.lower_limit)
  };
  var prevSettemp = 0;
  $scope.clickIduMode = function() {
    "DRY" == $scope.selectedCP.mode || "FAN" == $scope.selectedCP.mode ? (prevSettemp = $scope.selectedCP.settemp, delete $scope.selectedCP.settemp) : void 0 == $scope.selectedCP.settemp && 0 != prevSettemp && ($scope.selectedCP.settemp = prevSettemp), "AUTO" == $scope.selectedCP.mode && $scope.selectedCP.settemp < 18 && ($scope.selectedCP.settemp = "18"), "UAE" == $rootScope.policy && angular.isDefined($scope.selectedCP.mode) && 1 == /COOL|AUTO/.test($scope.selectedCP.mode) && $scope.selectedCP.settemp < 20 && ($scope.selectedCP.settemp = "20")
  }, $scope.clickDemandLimit = function(item) {
    $scope.selectedCP.set_demand_limit >= 10 && $scope.selectedCP.set_demand_limit < 20 ? $scope.selectedCP.set_demand_limit = 30 : $scope.selectedCP.set_demand_limit >= 20 && $scope.selectedCP.set_demand_limit < 30 && ($scope.selectedCP.set_demand_limit = 0)
  }, $scope.clickScheduleVentQuick = function() {
    void 0 != $scope.selectedCP.func_ui_1 && void 0 != $scope.selectedCP.func_ui_2 && ($scope.selectedCP.func_ui_2 = "OFF", $scope.selectedCP.fanspeed = "AUTO")
  }, $scope.clickScheduleVentPOWSAV = function() {
    void 0 != $scope.selectedCP.func_ui_2 && void 0 != $scope.selectedCP.func_ui_1 && ($scope.selectedCP.func_ui_1 = "OFF", $scope.selectedCP.fanspeed = "AUTO")
  }, $scope.clickScheduleVentFuncOff = function() {
    "OFF" == $scope.selectedCP.func_ui_1 && "OFF" == $scope.selectedCP.func_ui_2 && "AUTO" == $scope.selectedCP.fanspeed && delete $scope.selectedCP.fanspeed
  }, $scope.clickScheduleVentFanspeed = function() {
    1 == /LOW|HIGH|SUPHIGH/.test($scope.selectedCP.fanspeed) && ($scope.selectedCP.func_ui_1 = "OFF", $scope.selectedCP.func_ui_2 = "OFF")
  }, $scope.getValantTypeText = function(item) {
    return item.cp_attr.isVALANT.lp_value ? "_valant" : ""
  }, $scope.clickOutdoorEnable = function() {}, $scope.clickOutdoorAutoAvail = function() {}, $scope.clickOutdoorTemp1 = function(item) {
    $scope.selectedCP.outdoor_temp1 > $scope.selectedCP.outdoor_temp2 && ($scope.selectedCP.outdoor_temp1 = $scope.selectedCP.outdoor_temp2)
  }, $scope.clickOutdoorTemp2 = function(item) {
    $scope.selectedCP.outdoor_temp2 < $scope.selectedCP.outdoor_temp1 && ($scope.selectedCP.outdoor_temp2 = $scope.selectedCP.outdoor_temp1)
  }, $scope.clickOutdoorHeatPumpOff = function() {
    "OFF" == $scope.selectedCP.outdoor_heatpump && "OFF" == $scope.selectedCP.outdoor_heater && ($scope.selectedCP.outdoor_heater = "ON")
  }, $scope.clickOutdoorHeaterOff = function() {
    "OFF" == $scope.selectedCP.outdoor_heater && "OFF" == $scope.selectedCP.outdoor_heatpump && ($scope.selectedCP.outdoor_heatpump = "ON")
  }
}]);
