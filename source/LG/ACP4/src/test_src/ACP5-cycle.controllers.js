"use strict";
angular.module("acmanagerApp").controller("HistoryCycleCtrl", ["$rootScope", "$scope", "$timeout", "$state", "$interval", "ROLE", "CONFIG", "CP", "Space", "WAPI", "x2js", "UIService", "$filter", "XmlApi", "$log", "User", function ($rootScope, $scope, $timeout, $state, $interval, ROLE, CONFIG, CP, Space, WAPI, x2js, UIService, $filter, XmlApi, $log, User) {
    $scope.systems = $rootScope.systems,
        UIService.newGlobalProgress({
            text: $filter("translate")("DUPLICATE.100")
        }),
        $scope.radioViewState = "tableview",
        $scope.navTap = "odu",
        $scope.tapSetting = 0,
        $scope.navODUTreeData = [],
        $scope.navCHILLERTreeData = [],
        $scope.chiller_tap_selector = [];
    var oduTreeController, chillerTreeController;
    $scope.is_smart_lcd = $rootScope.isSmartLCD;
    var interval = $interval(function () {
        1 == $rootScope.systemLoaded && ("MASTER" == $rootScope.systems.lgap_type ? ($scope.navTap = "odu",
                $scope.navTabChangeAction(0),
                $(".tab_odu").addClass("active"),
                $(".case_odu").addClass("active")) : ($scope.navTap = "chiller",
                $scope.navTabChangeAction(1),
                $(".tab_chiller").addClass("active"),
                $(".case_chiller").addClass("active")),
            UIService.stopAllGlobalProgress(),
            $interval.cancel(interval))
    }, 1e3);
    $scope.navODUInitAction = function () {
            oduTreeController = this
        },
        $scope.navCHILLERInitAction = function () {
            chillerTreeController = this
        };
    var loadODUTreeData = function () {
            var cpTree = CP.getAllCPTree(ROLE.ADMIN);
            if (cpTree && cpTree.length > 0) {
                var tempTree = angular.copy(cpTree[0].nodes);
                _.each(tempTree, function (value) {
                        value.nodes = [];
                        var children = CP.findChildren(value.id, ROLE.ADMIN);
                        _.map(children, function (cp) {
                                cp.type_id == CONFIG.CP_TYPE_ID.ODU && cp.detail_id == CONFIG.CP_DETAIL_ID.ODU.ODU && value.nodes.push({
                                    id: cp.id,
                                    parent_id: -1 === cp.parent_id ? null : cp.parent_id,
                                    title: cp.name,
                                    dmodel: null == cp.cp_attr.dmodel ? "none" : cp.cp_attr.dmodel.lp_value,
                                    detail_id: cp.detail_id,
                                    type_id: cp.type_id,
                                    port_type: null == cp.cp_attr.type ? "none" : cp.cp_attr.type.lp_value
                                })
                            }),
                            value.id = -1
                    }),
                    angular.copy(tempTree, $scope.navODUTreeData);
                var depthOneFristNode;
                $timeout(function () {
                    "" == $state.params.param ? (UT.nestedEach($scope.navODUTreeData, "nodes", function (node, pr, depth) {
                            depthOneFristNode || 1 != depth || (depthOneFristNode = node)
                        }),
                        oduTreeController.selectByNode(depthOneFristNode)) : (UT.nestedEach($scope.navODUTreeData, "nodes", function (node, pr, depth) {
                            $state.params.param == node.title && (depthOneFristNode = node)
                        }),
                        oduTreeController.selectByNode(depthOneFristNode),
                        $state.params.param = "")
                }, 100)
            }
            cpTree = null,
                tempTree = null
        },
        loadChillerTreeData = function () {
            var cpTree = CP.getAllCPTree(ROLE.ADMIN);
            if (cpTree && cpTree.length > 0) {
                var tempTree = angular.copy(cpTree[0].nodes);
                _.each(tempTree, function (value) {
                        value.nodes = [];
                        var children = CP.findChildren(value.id, ROLE.ADMIN);
                        _.map(children, function (cp) {
                                if (cp.type_id == CONFIG.CP_TYPE_ID.ODU && cp.detail_id == CONFIG.CP_DETAIL_ID.ODU.VIRTURE_CHILLER) {
                                    var chillerChildren = CP.findChildren(cp.id, ROLE.ADMIN);
                                    _.map(chillerChildren, function (cp) {
                                        value.nodes.push({
                                            id: cp.id,
                                            parent_id: -1 === cp.parent_id ? null : cp.parent_id,
                                            title: cp.name,
                                            dmodel: null == cp.cp_attr.dmodel ? "none" : cp.cp_attr.dmodel.lp_value,
                                            detail_id: cp.detail_id,
                                            type_id: cp.type_id,
                                            port_type: null == cp.cp_attr.type ? "none" : cp.cp_attr.type.lp_value
                                        })
                                    })
                                }
                            }),
                            value.id = -1
                    }),
                    angular.copy(tempTree, $scope.navCHILLERTreeData);
                var depthOneFristNode;
                UT.nestedEach($scope.navCHILLERTreeData, "nodes", function (node, pr, depth) {
                        depthOneFristNode || 1 != depth || (depthOneFristNode = node)
                    }),
                    void 0 != depthOneFristNode && (depthOneFristNode.selected = !0)
            }
            cpTree = null,
                tempTree = null
        };
    ! function () {
        loadODUTreeData()
    }(),
    $scope.navTabChangeAction = function (index) {
        var findSelectedItem;
        switch (index) {
            case 0:
                0 != $scope.navODUTreeData.length ? UT.nestedEach($scope.navODUTreeData, "nodes", function (node) {
                    node.selected && (findSelectedItem = node)
                }) : loadODUTreeData();
                break;
            case 1:
                0 != $scope.navCHILLERTreeData.length ? UT.nestedEach($scope.navCHILLERTreeData, "nodes", function (node) {
                    node.selected && (findSelectedItem = node)
                }) : (loadChillerTreeData(),
                    UT.nestedEach($scope.navCHILLERTreeData, "nodes", function (node) {
                        node.selected && (findSelectedItem = node)
                    }))
        }
        findSelectedItem ? $scope.navSelectAction(findSelectedItem) : ($scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "default.html",
            angular.isDefined(timeoutOwner) && ($timeout.cancel(timeoutOwner),
                timeoutOwner = void 0),
            $scope.selectCp = null,
            $scope.selectedCp = null,
            $scope.selectOdu = null)
    };
    var timeoutOwner, startRefresh = function (nodeData) {
            angular.isDefined(timeoutOwner) && ($timeout.cancel(timeoutOwner),
                    timeoutOwner = void 0),
                angular.isUndefined(timeoutOwner) && (timeoutOwner = $timeout(function () {
                    loadDataByOdu_Chiller(nodeData, "refresh")
                }, 1e4))
        },
        curNodeData = null;
    $scope.navSelectAction = function (nodeData) {
        $log.debug("navSelectAction :: ", nodeData),
            void 0 != nodeData && (loadDataByOdu_Chiller(nodeData, "selection"),
                curNodeData = nodeData)
    };
    var loadDataByOdu_Chiller = function (nodeData, calltype) {
            var params = {
                cp_id: nodeData.id,
                wait_time: 20
            };
            WAPI.callWAPI("nai", "get_cycle_data", params).then(function (data) {
                var json = x2js.xml_str2json(data);
                if (null == json)
                    startRefresh(nodeData);
                else {
                    if ($scope.selectCp = angular.copy(json.lgapxml.response),
                        "odu" == $scope.navTap)
                        void 0 != $scope.selectCp.odu_cycle_info && ($scope.selectOdu = angular.copy(nodeData),
                            $scope.selectCp.odu_cycle_info.title = nodeData.title,
                            "selection" == calltype && ($scope.tapSetting = 0,
                                $scope.selectTap(0)),
                            $scope.selectCp.odu_cycle_info.idus = [],
                            void 0 != $scope.selectCp.odu_cycle_info.idu && (void 0 == $scope.selectCp.odu_cycle_info.idu.length ? $scope.selectCp.odu_cycle_info.idus.push($scope.selectCp.odu_cycle_info.idu) : _.each($scope.selectCp.odu_cycle_info.idu, function (idu) {
                                $scope.selectCp.odu_cycle_info.idus.push(idu)
                            })));
                    else if ("chiller" == $scope.navTap) {
                        if ($scope.selectCp.title = nodeData.title,
                            void 0 != $scope.selectCp.chiller_detail_info) {
                            var copyPoint = $scope.selectCp.chiller_detail_info.point,
                                newPoint = [],
                                airMultiv = ["00001", "10002", "10004", "10006", "10105", "10107"],
                                airSCL2 = ["00001", "10002", "10004", "10006", "10107", "10108", "10105", "10106", "10211", "10212", "10209", "10210", "10315", "10316", "10313", "10314", "10419", "10420", "10417", "10418"],
                                waterSCL = ["00001", "10004", "10003", "10002", "10001", "10006", "10005", "10105", "10209", "10313", "10417", "10106", "10210", "10314", "10418", "10109", "10109", "10213", "10110", "10214", "10111", "10215", "10107", "10211", "10108", "10212", "10111", "10215", "10112", "10216", "10313", "10314", "10315", "10316", "10317", "10318", "10319", "10320", "10417", "10418", "10419", "10420", "10421", "10422", "10423", "10424"],
                                airSCR = ["10001", "10011", "10013", "10014", "10058", "10057", "10084", "10085", "10086", "10087"],
                                waterSCR = ["10001", "10011", "10013", "10014", "10058", "10057", "10095", "10094"],
                                turbo = ["10001", "10013", "10014", "10064", "10062", "10063", "10061"],
                                turboMAG = ["10001", "10013", "10014", "10064", "10062", "10063", "10061", "30234"],
                                turboAIR2 = ["10001", "10013", "10014", "10064", "10062", "10063", "10061", "10029", "10031", "10030", "10032"],
                                turboAIR3 = ["10001", "10013", "10014", "10064", "10062", "10063", "10061", "10029", "10031", "10030", "10032"],
                                turboMODULAR2 = ["10001", "10013", "10014", "10064", "10062", "10063", "10061"],
                                absorb = ["10001", "10013", "10014", "10063", "10061", "10064", "10062", "10093"],
                                absorbSTEAM = ["10001", "10013", "10014", "10063", "10061", "10064", "10062", "10093"],
                                absorbHWATER = ["10001", "10013", "10014", "10063", "10061", "10064", "10062", "10093"],
                                absorbLWATER = ["10001", "10013", "10014", "10063", "10061", "10064", "10062", "10093"],
                                operMode = ["40002"];
                            _.each(copyPoint, function (value, key) {
                                    switch (nodeData.detail_id) {
                                        case CONFIG.CP_DETAIL_ID.CHILLER.TURBO:
                                            "magnetic" == $scope.selectCp.chiller_detail_info._detailType ? changePointData(turboMAG, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.TURBO) : "air2" == $scope.selectCp.chiller_detail_info._detailType ? changePointData(turboAIR2, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.TURBO) : "air3" == $scope.selectCp.chiller_detail_info._detailType ? changePointData(turboAIR3, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.TURBO) : "modular2" == $scope.selectCp.chiller_detail_info._detailType ? changePointData(turboMODULAR2, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.TURBO) : changePointData(turbo, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.TURBO);
                                            break;
                                        case CONFIG.CP_DETAIL_ID.CHILLER.ABSORB:
                                            2 == $scope.selectCp.chiller_detail_info.point[40049] ? changePointData(absorbSTEAM, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.ABSORB) : 3 == $scope.selectCp.chiller_detail_info.point[40049] || 5 == $scope.selectCp.chiller_detail_info.point[40049] ? changePointData(absorbHWATER, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.ABSORB) : 6 == $scope.selectCp.chiller_detail_info.point[40049] ? changePointData(absorbLWATER, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.ABSORB) : changePointData(absorb, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.ABSORB);
                                            break;
                                        case CONFIG.CP_DETAIL_ID.CHILLER.SCREW:
                                            "air" == $scope.selectCp.chiller_detail_info._detailType ? changePointData(airSCR, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.SCREW) : "water" == $scope.selectCp.chiller_detail_info._detailType && changePointData(waterSCR, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.SCREW);
                                            break;
                                        case CONFIG.CP_DETAIL_ID.CHILLER.WATER_SCL:
                                            changePointData(waterSCL, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.WATER_SCL);
                                            break;
                                        case CONFIG.CP_DETAIL_ID.CHILLER.AIR_SCL:
                                            angular.isDefined($scope.selectCp.chiller_detail_info) && "air2" == $scope.selectCp.chiller_detail_info._detailType && changePointData(airSCL2, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.AIR_SCL);
                                            break;
                                        case CONFIG.CP_DETAIL_ID.CHILLER.AIR_MULTIV:
                                            angular.isDefined($scope.selectCp.chiller_detail_info) && changePointData(airMultiv, operMode, newPoint, value, CONFIG.CP_DETAIL_ID.CHILLER.AIR_MULTIV)
                                    }
                                }),
                                nodeData.detail_id == CONFIG.CP_DETAIL_ID.CHILLER.TURBO && changeOperMode(newPoint, $scope.selectCp.chiller_detail_info._detailType),
                                $scope.selectCp.chiller_detail_info.point = newPoint
                        }
                        "selection" == calltype && $scope.selectTap(0)
                    }
                    cycleContentTemplateByTypeId(nodeData.type_id, nodeData.detail_id),
                        startRefresh(nodeData)
                }
            }, function (err) {
                startRefresh(nodeData)
            })
        },
        changeOperMode = function (valueArray, detailType) {
            var mode = valueArray[40002],
                submode = null;
            submode = "air2" == detailType || "air3" == detailType ? valueArray[40041] : valueArray[40040],
                valueArray[40002] = 0 == submode ? "COOL" : 1 == mode && 1 == submode ? "ICE" : 1 == mode && 2 == submode ? "HEAT" : 0 != mode || 1 != submode && 2 != submode ? "-" : "COOL"
        },
        changePointData = function (typeArray, modeArray, valueArray, value, detail_id, gasArray) {
            var exist = _.find(typeArray, function (key) {
                    return key == value._register
                }),
                existMode = _.find(modeArray, function (key) {
                    return key == value._register
                });
            if (void 0 != gasArray)
                var existValve = _.find(gasArray, function (key) {
                    return key == value._register
                });
            if (exist)
                valueArray[value._register] = 1 == value._value ? "ON" : "OFF";
            else if (existMode)
                switch (detail_id) {
                    case CONFIG.CP_DETAIL_ID.CHILLER.TURBO:
                        valueArray[value._register] = parseFloat(value._value);
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.ABSORB:
                        0 == value._value ? valueArray[value._register] = "COOL" : 1 == value._value && (valueArray[value._register] = "HEAT");
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.SCREW:
                        0 == value._value ? valueArray[value._register] = "COOL" : 1 == value._value && (valueArray[value._register] = "ICE");
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.WATER_SCL:
                    case CONFIG.CP_DETAIL_ID.CHILLER.AIR_SCL:
                    case CONFIG.CP_DETAIL_ID.CHILLER.AIR_MULTIV:
                        0 == value._value ? valueArray[value._register] = "COOL" : 4 == value._value ? valueArray[value._register] = "HEAT" : 1 == value._value && (valueArray[value._register] = "HEAT");
                        break;
                    default:
                        valueArray[value._register] = "NONE"
                }
            else
                valueArray[value._register] = existValve ? 1 == value._value ? "OPENSTATUS" : "CLOSESTATUS" : parseFloat(value._value)
        };
    $scope.navWillSelectAction = function (nodeData, node, depth) {
            return !(0 == depth)
        },
        $scope.showCheckboxCallback = function (data, depth) {
            return !1
        };
    var cycleContentTemplateByTypeId = function (typeId, detailId) {
        switch (typeId) {
            case CONFIG.CP_TYPE_ID.ODU:
                $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "odu.html";
                break;
            case CONFIG.CP_TYPE_ID.CHILLER:
                switch (detailId) {
                    case CONFIG.CP_DETAIL_ID.CHILLER.AIR_MULTIV:
                        $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_scroll_air_multiv.html";
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.AIR_SCL:
                        angular.isDefined($scope.selectCp.chiller_detail_info) && "air2" == $scope.selectCp.chiller_detail_info._detailType ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_scroll_air2.html" : $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_scroll_air.html";
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.WATER_SCL:
                        $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_scroll_water.html";
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.TURBO:
                        "magnetic" == $scope.selectCp.chiller_detail_info._detailType ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_turbo_mag.html" : "air2" == $scope.selectCp.chiller_detail_info._detailType ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_turbo_air2.html" : "air3" == $scope.selectCp.chiller_detail_info._detailType ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_turbo_air3.html" : "modular2" == $scope.selectCp.chiller_detail_info._detailType ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_turbo_modular2.html" : $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_turbo.html";
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.SCREW:
                        "air" == $scope.selectCp.chiller_detail_info._detailType ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_screw_air.html" : "water" == $scope.selectCp.chiller_detail_info._detailType ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_screw_water.html" : $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "default.html";
                        break;
                    case CONFIG.CP_DETAIL_ID.CHILLER.ABSORB:
                        2 == $scope.selectCp.chiller_detail_info.point[40049] ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_absorb_steam.html" : 3 == $scope.selectCp.chiller_detail_info.point[40049] || 4 == $scope.selectCp.chiller_detail_info.point[40049] || 5 == $scope.selectCp.chiller_detail_info.point[40049] ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_absorb_hwater.html" : 6 == $scope.selectCp.chiller_detail_info.point[40049] ? $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_absorb_lwater.html" : $scope.cycleContentTemplate = CONFIG.TEMPLATE_ROOT.CYCLE_CONTENT + "chiller_absorb.html"
                }
        }
    };
    $scope.mode = 0;
    var modeWatch = $scope.$watch("mode", function (newValue) {
        $scope.radioViewState = "tableview"
    });
    $scope.selectTap = function (selectedTap) {
            if ("odu" == $scope.navTap)
                angular.isObject($scope.selectCp) && ($log.debug("####$scope.selectCp=====>", $scope.selectCp),
                    void 0 !== $scope.selectCp.odu_cycle_info.odu_cycle_data && (0 == $scope.selectCp.odu_cycle_info._slave_unit ? ($scope.selectedCp = $scope.selectCp.odu_cycle_info.odu_cycle_data,
                        $scope.tapSetting = 0) : ($scope.selectedCp = $scope.selectCp.odu_cycle_info.odu_cycle_data[selectedTap],
                        $scope.tapSetting = selectedTap)));
            else if ("chiller" == $scope.navTap) {
                for (var i = 0; i < 5; i++)
                    $scope.chiller_tap_selector[i] = !1;
                $scope.chiller_tap_selector[selectedTap] = !0
            }
        },
        $scope.selectNavTap = function (selectNavTap) {
            $scope.navTap = selectNavTap
        },
        $scope.rangeCount = function (cycle_num) {
            return _.range(0, parseInt(cycle_num) + 1)
        },
        $scope.cycleHelper = function (idu) {
            var helper = {},
                hasChild = CP.findChildren($scope.selectOdu.id, ROLE.ADMIN),
                findIdu = _.find(hasChild, function (childIdu) {
                    if (childIdu.type_id == CONFIG.CP_TYPE_ID.IDU)
                        return idu._addr == childIdu.cp_attr.addr.lp_value
                });
            return void 0 != findIdu && (helper = findIdu,
                    findIdu.contain_space_id.length > 0 && (helper.space_name = Space.getSpace(findIdu.contain_space_id[0], ROLE.ADMIN).name)),
                helper
        },
        $scope.resetModal = function () {
            $("main").dispatchEvent("shouldcloseaside"),
                $("#resetModal").dispatchEvent("shouldopen")
        },
        $scope.resetOduPower = function () {
            if (null != curNodeData) {
                var x2js = new X2JS({
                        attributePrefix: "$"
                    }),
                    body = {
                        odu_pwr_info: {
                            $odu_id: $scope.selectCp.odu_cycle_info._odu_id
                        }
                    };
                $log.debug(x2js.json2xml_str(body));
                var param_info = {
                    request_type: "DEL_ODU_PWR",
                    receiver: CP.getCPById(curNodeData.parent_id, User.getRole()).name,
                    sender: "ACM",
                    body: x2js.json2xml_str(body)
                };
                XmlApi.callWAPIforRequest(param_info).then(function (result) {
                        $log.debug("result ==>", result),
                            "OK" == UT_XML.getResponseResult(result, "DEL_ODU_PWR") ? $("#resetOk").dispatchEvent("shouldopen") : $("#resetNg").dispatchEvent("shouldopen")
                    }),
                    x2js = null,
                    body = null,
                    param_info = null
            }
        },
        $scope.totalCalc = function (high, low) {
            return parseInt((high << 16 | low) / 60)
        },
        $scope.ltdCalc = function (inputTemp, outputTemp) {
            return Math.abs(inputTemp - outputTemp)
        };
    var willStateExitFunc = $scope.$on("acmanager.willStateExit", function () {
        angular.isDefined(timeoutOwner) && ($timeout.cancel(timeoutOwner),
            timeoutOwner = void 0)
    });
    $scope.$on("$destroy", function () {
        modeWatch(),
            willStateExitFunc(),
            oduTreeController = null,
            chillerTreeController = null
    })
}]);