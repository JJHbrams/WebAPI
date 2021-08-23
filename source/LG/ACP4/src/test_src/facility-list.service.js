"use strict";
angular.module("acmanagerApp").factory("FacilityList", ["$rootScope", "$filter", "$timeout", "$cookies", "User", "Space", "CP", "CONFIG", function($rootScope, $filter, $timeout, $cookies, User, Space, CP, CONFIG) {
    var onoff = {
        ON: 2,
        OFF: 1
    }
      , idumode = {
        COOL: 5,
        HEAT: 4,
        FAN: 3,
        DRY: 2,
        AUTO: 1
    }
      , idufanspeed = {
        LOW: 5,
        MED: 4,
        HIGH: 3,
        SUPHIGH: 2,
        AUTO: 1
    }
      , ventmode = {
        NORMAL: 3,
        HEAT: 2,
        AUTO: 1
    }
      , ventfanspeed = {
        LOW: 5,
        MED: 4,
        HIGH: 3,
        SUPHIGH: 2,
        AUTO: 1
    }
      , ventacmode = {
        COOL: 5,
        HEAT: 4,
        AUTO: 1
    }
      , awhpmode = {
        COOL: 5,
        HEAT: 4,
        AUTO: 1
    }
      , ahumode = {
        COOL: 6,
        HEAT: 5,
        FAN: 4,
        DRY: 3,
        POWSAV: 2,
        REHEAT: 1
    }
      , ahufanctrl = {
        ARI: 3,
        TEMP: 2,
        PRESS: 1
    }
      , ahufanspeed = {
        LOW: 3,
        MED: 2,
        HIGH: 1
    }
      , chillermode = {
        COOL: 5,
        HEAT: 4,
        ICE: 1
    }
      , aircaremode = {
        CLEAN: 4,
        SILENT: 3,
        AUTO: 2,
        RAPID: 1
    }
      , aircarefanspeed = {
        LLOW: 6,
        LOW: 5,
        MED: 4,
        HIGH: 3,
        RAPID: 2,
        AUTO: 1
    }
      , columnArray = [];
    columnArray.idulist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr.oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.oper.lp_value|translate}}</span>'
        },
        mode: {
            $$$key$$$: "mode",
            field: "cp_attr.mode.lp_value",
            title: $filter("translate")("DUPLICATE.35"),
            width: 200,
            template: '<badge class="badge-{{facs[#= index#].cp_attr.mode.lp_value|lowercase}}">{{"HISTORY_CONTROL.IDU._MODE." + facs[#= index#].cp_attr.mode.lp_value|translate}}</badge>',
            sortable: {
                compare: function(a, b, descending) {
                    return idumode[a.cp_attr.mode.lp_value] - idumode[b.cp_attr.mode.lp_value]
                }
            }
        },
        air_clean: {
            $$$key$$$: "air_clean",
            field: "cp_attr.air_clean.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.AIR_CLEAN"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.dustsensor_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.IDU._AIR_CLEAN." + facs[#= index#].cp_attr.air_clean.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.dustsensor_avail.lp_value
                      , second = "ON" == b.cp_attr.dustsensor_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.air_clean.lp_value] - onoff[b.cp_attr.air_clean.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        roomtemp: {
            $$$key$$$: "roomtemp",
            field: "cp_attr.roomtemp.lp_value",
            title: $filter("translate")("DUPLICATE.33"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.roomtemp.lp_value | convertDot:true}} {{::gTempUnit}}"
        },
        settemp: {
            $$$key$$$: "settemp",
            field: "cp_attr.settemp.lp_value",
            title: $filter("translate")("DUPLICATE.34"),
            width: 200,
            template: "<var ng-show=\"!(facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)\">{{facs[#= index#].cp_attr.settemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? parseFloat(a.cp_attr.settemp.lp_value) - parseFloat(b.cp_attr.settemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        fanspeed: {
            $$$key$$$: "fanspeed",
            field: "cp_attr.fanspeed.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.FANSPEED"),
            width: 200,
            template: '{{"VALUETYPES.FANSPEED." + facs[#= index#].cp_attr.fanspeed.lp_value|translate}}',
            sortable: {
                compare: function(a, b, descending) {
                    return idufanspeed[a.cp_attr.fanspeed.lp_value] - idufanspeed[b.cp_attr.fanspeed.lp_value]
                }
            }
        },
        swing: {
            $$$key$$$: "swing",
            field: "cp_attr.swing.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SWING"),
            width: 200,
            hidden: !0,
            template: '{{"VALUETYPES.SWING." + facs[#= index#].cp_attr.swing.lp_value|translate}}'
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        fine_dust_status: {
            $$$key$$$: "fine_dust_status",
            field: "cp_attr.fine_dust.status",
            title: $filter("translate")("HISTORY_CONTROL.IDU.FINE_DUST"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.dustsensor_avail.lp_value == \'ON\'"/>{{facs[#= index#].cp_attr.fine_dust.lp_value}} μg/㎥ ({{"HISTORY_CONTROL._FINE_DUST_STATUS." + finedust_standard_country + "." + facs[#= index#].cp_attr.fine_dust.status|translate}})</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.dustsensor_avail.lp_value
                      , second = "ON" == b.cp_attr.dustsensor_avail.lp_value;
                    return first && second ? parseFloat(a.cp_attr.fine_dust.lp_value) - parseFloat(b.cp_attr.fine_dust.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        ultrafine_dust_status: {
            $$$key$$$: "ultrafine_dust_status",
            field: "cp_attr.ultrafine_dust.status",
            title: $filter("translate")("HISTORY_CONTROL.IDU.ULTRAFINE_DUST"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.dustsensor_avail.lp_value == \'ON\'"/>{{facs[#= index#].cp_attr.ultrafine_dust.lp_value}} μg/㎥ ({{"HISTORY_CONTROL._FINE_DUST_STATUS." + finedust_standard_country + "." + facs[#= index#].cp_attr.ultrafine_dust.status|translate}})</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.dustsensor_avail.lp_value
                      , second = "ON" == b.cp_attr.dustsensor_avail.lp_value;
                    return first && second ? parseFloat(a.cp_attr.ultrafine_dust.lp_value) - parseFloat(b.cp_attr.ultrafine_dust.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        superultrafine_dust_status: {
            $$$key$$$: "superultrafine_dust_status",
            field: "cp_attr.superultrafine_dust.status",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SUPERULTRAFINE_DUST"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.dustsensor_avail.lp_value == \'ON\'"/>{{facs[#= index#].cp_attr.superultrafine_dust.lp_value}} μg/㎥ ({{"HISTORY_CONTROL._FINE_DUST_STATUS." + finedust_standard_country + "." + facs[#= index#].cp_attr.superultrafine_dust.status|translate}})</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.dustsensor_avail.lp_value
                      , second = "ON" == b.cp_attr.dustsensor_avail.lp_value;
                    return first && second ? parseFloat(a.cp_attr.superultrafine_dust.lp_value) - parseFloat(b.cp_attr.superultrafine_dust.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        settemp_llim: {
            $$$key$$$: "settemp_llim",
            field: "cp_attr.settemp_llim.lp_value",
            title: $filter("translate")("CONTROL.FACILITY-ASIDE.IDU.4"),
            width: 200,
            template: "<var ng-show=\"!(facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)\"/>{{facs[#= index#].cp_attr.settemp_llim.lp_value | convertDot:true}} {{::gTempUnit}} / {{facs[#= index#].cp_attr.settemp_ulim.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? parseFloat(a.cp_attr.settemp_llim.lp_value) - parseFloat(b.cp_attr.settemp_llim.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        lock: {
            $$$key$$$: "lock",
            field: "cp_attr.lock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.LOCK"),
            width: 200,
            template: '{{"HISTORY_CONTROL.IDU._LOCK." + facs[#= index#].cp_attr.lock.lp_value|translate}}'
        },
        mode_lock: {
            $$$key$$$: "mode_lock",
            field: "cp_attr.mode_lock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.MODE_LOCK"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.IDU._MODE_LOCK." + facs[#= index#].cp_attr.mode_lock.lp_value|translate}}'
        },
        fan_lock: {
            $$$key$$$: "fan_lock",
            field: "cp_attr.fan_lock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.FAN_LOCK"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.IDU._FAN_LOCK." + facs[#= index#].cp_attr.fan_lock.lp_value|translate}}'
        },
        settemp_lock: {
            $$$key$$$: "settemp_lock",
            field: "cp_attr.settemp_lock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SETTEMP_LOCK"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.IDU._SETTEMP_LOCK." + facs[#= index#].cp_attr.settemp_lock.lp_value|translate}}'
        },
        sense_body_powsav: {
            $$$key$$$: "sense_body_powsav",
            field: "cp_attr.sense_body_powsav.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SENSE_BODY_POWSAV"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.sense_body_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.IDU._SENSE_BODY_POWSAV." + facs[#= index#].cp_attr.sense_body_powsav.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.sense_body_avail.lp_value
                      , second = "ON" == b.cp_attr.sense_body_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.sense_body_powsav.lp_value] - onoff[b.cp_attr.sense_body_powsav.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        sense_body_time: {
            $$$key$$$: "sense_body_time",
            field: "cp_attr.sense_body_time.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SENSE_BODY_TIME"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.sense_body_avail.lp_value == 'ON'\"/>{{facs[#= index#].cp_attr.sense_body_time.lp_value}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.sense_body_avail.lp_value
                      , second = "ON" == b.cp_attr.sense_body_avail.lp_value;
                    return first && second ? parseInt(a.cp_attr.sense_body_time.lp_value) - parseInt(b.cp_attr.sense_body_time.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        sense_body_ecooper: {
            $$$key$$$: "sense_body_ecooper",
            field: "cp_attr.sense_body_ecooper.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SENSE_BODY_ECOOPER"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.sense_body_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.IDU._SENSE_BODY_ECOOPER." + facs[#= index#].cp_attr.sense_body_ecooper.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.sense_body_avail.lp_value
                      , second = "ON" == b.cp_attr.sense_body_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.sense_body_ecooper.lp_value] - onoff[b.cp_attr.sense_body_ecooper.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        sense_body_fan_indirect: {
            $$$key$$$: "sense_body_fan_indirect",
            field: "cp_attr.sense_body_fan_indirect.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SENSE_BODY_FAN_INDIRECT"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.sense_body_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.IDU._SENSE_BODY_FAN_INDIRECT." + facs[#= index#].cp_attr.sense_body_fan_indirect.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.sense_body_avail.lp_value
                      , second = "ON" == b.cp_attr.sense_body_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.sense_body_fan_indirect.lp_value] - onoff[b.cp_attr.sense_body_fan_indirect.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        sense_body_fan_direct: {
            $$$key$$$: "sense_body_fan_direct",
            field: "cp_attr.sense_body_fan_direct.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SENSE_BODY_FAN_DIRECT"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.sense_body_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.IDU._SENSE_BODY_FAN_DIRECT." + facs[#= index#].cp_attr.sense_body_fan_direct.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.sense_body_avail.lp_value
                      , second = "ON" == b.cp_attr.sense_body_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.sense_body_fan_direct.lp_value] - onoff[b.cp_attr.sense_body_fan_direct.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        comfort: {
            $$$key$$$: "comfort",
            field: "cp_attr.comfort.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.COMFORT"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.comfort_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.IDU._COMFORT." + facs[#= index#].cp_attr.comfort.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.comfort_avail.lp_value
                      , second = "ON" == b.cp_attr.comfort_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.comfort.lp_value] - onoff[b.cp_attr.comfort.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        comfort_step: {
            $$$key$$$: "comfort_step",
            field: "cp_attr.comfort_step.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.COMFORT_STEP"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.comfort_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.IDU._COMFORT_STEP." + facs[#= index#].cp_attr.comfort_step.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.comfort_avail.lp_value
                      , second = "ON" == b.cp_attr.comfort_avail.lp_value;
                    return first && second ? parseInt(a.cp_attr.comfort_step.lp_value) - parseInt(b.cp_attr.comfort_step.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        humidity: {
            $$$key$$$: "humidity",
            field: "cp_attr.humidity.lp_value",
            title: $filter("translate")("TREND.AI.MODE.HUMID"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.humidity.lp_value != 0"/>{{facs[#= index#].cp_attr.humidity.lp_value}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "0" != a.cp_attr.humidity.lp_value
                      , second = "0" != b.cp_attr.humidity.lp_value;
                    return first && second ? parseFloat(a.cp_attr.humidity.lp_value) - parseFloat(b.cp_attr.humidity.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        comfort_type: {
            $$$key$$$: "comfort_type",
            field: "cp_attr.comfort_type.lp_value",
            title: $filter("translate")("ADDITION.HTML.116"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.humidity.lp_value != \'0\'"/><var ng-if="facs[#= index#].cp_attr.comfort_type.lp_value < 10">{{"ADDITION.HTML.105"|translate}}</var><var ng-if="facs[#= index#].cp_attr.comfort_type.lp_value >= 10 && facs[#= index#].cp_attr.comfort_type.lp_value < 25">{{"DUPLICATE.10"|translate}}</var><var ng-if="facs[#= index#].cp_attr.comfort_type.lp_value >= 25">{{"ADDITION.HTML.106"|translate}}</var></var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.humidity.lp_value
                      , second = "ON" == b.cp_attr.humidity.lp_value;
                    return first && second ? parseInt(a.cp_attr.comfort_type.lp_value) - parseInt(b.cp_attr.comfort_type.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        aco_oper: {
            $$$key$$$: "aco_oper",
            field: "cp_attr.aco_oper.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.ACO_OPER"),
            width: 200,
            hidden: !0,
            template: '<var ng-show="!(facs[#= index#].cp_attr.twoset_automode.lp_value == \'ON\' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)"/>{{"HISTORY_CONTROL.IDU._ACO_OPER." + facs[#= index#].cp_attr.aco_oper.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? onoff[a.cp_attr.aco_oper.lp_value] - onoff[b.cp_attr.aco_oper.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        aco_lower: {
            $$$key$$$: "aco_lower",
            field: "cp_attr.aco_lower.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.ACO_LOWER"),
            width: 200,
            hidden: !0,
            template: "<var ng-show=\"!(facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)\"/>{{facs[#= index#].cp_attr.aco_lower.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? parseFloat(a.cp_attr.aco_lower.lp_value) - parseFloat(b.cp_attr.aco_lower.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        aco_upper: {
            $$$key$$$: "aco_upper",
            field: "cp_attr.aco_upper.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.ACO_UPPER"),
            width: 200,
            hidden: !0,
            template: "<var ng-show=\"!(facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)\"/>{{facs[#= index#].cp_attr.aco_upper.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? parseFloat(a.cp_attr.aco_upper.lp_value) - parseFloat(b.cp_attr.aco_upper.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        aco_fanspeed: {
            $$$key$$$: "aco_fanspeed",
            field: "cp_attr.aco_fanspeed.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.ACO_FANSPEED"),
            width: 200,
            hidden: !0,
            template: '<var ng-show="!(facs[#= index#].cp_attr.twoset_automode.lp_value == \'ON\' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)"/>{{"VALUETYPES.FANSPEED." + facs[#= index#].cp_attr.aco_fanspeed.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? idufanspeed[a.cp_attr.aco_fanspeed.lp_value] - idufanspeed[b.cp_attr.aco_fanspeed.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        setback_oper: {
            $$$key$$$: "setback_oper",
            field: "cp_attr.setback_oper.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.SETBACK_OPER"),
            width: 200,
            hidden: !0,
            template: '<var ng-show="!(facs[#= index#].cp_attr.twoset_automode.lp_value == \'ON\' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)"/>{{"HISTORY_CONTROL.IDU._SETBACK_OPER." + facs[#= index#].cp_attr.setback_oper.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? onoff[a.cp_attr.setback_oper.lp_value] - onoff[b.cp_attr.setback_oper.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        setback_upper: {
            $$$key$$$: "setback_upper",
            field: "cp_attr.setback_upper.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.ACO_TEMP_START"),
            width: 200,
            hidden: !0,
            template: "<var ng-show=\"!(facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true)\"/>{{facs[#= index#].cp_attr.setback_upper.lp_value | convertDot:true}} {{::gTempUnit}} / {{facs[#= index#].cp_attr.setback_lower.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value)
                      , second = !("ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value);
                    return first && second ? parseFloat(a.cp_attr.setback_upper.lp_value) - parseFloat(b.cp_attr.setback_upper.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        occupied: {
            $$$key$$$: "occupied",
            field: "cp_attr.occupied.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.OCCUPIED"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.twoset_automode.lp_value == \'ON\' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true">{{"HISTORY_CONTROL.IDU._OCCUPIED." + facs[#= index#].cp_attr.occupied.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value
                      , second = "ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value;
                    return first && second ? onoff[a.cp_attr.occupied.lp_value] - onoff[b.cp_attr.occupied.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        cool_settemp: {
            $$$key$$$: "cool_settemp",
            field: "cp_attr.cool_settemp.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.COOL_SETTEMP"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true\">{{facs[#= index#].cp_attr.cool_settemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value
                      , second = "ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value;
                    return first && second ? parseFloat(a.cp_attr.cool_settemp.lp_value) - parseFloat(b.cp_attr.cool_settemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        heat_settemp: {
            $$$key$$$: "heat_settemp",
            field: "cp_attr.heat_settemp.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.HEAT_SETTEMP"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true\">{{facs[#= index#].cp_attr.heat_settemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value
                      , second = "ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value;
                    return first && second ? parseFloat(a.cp_attr.heat_settemp.lp_value) - parseFloat(b.cp_attr.heat_settemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        cool_lower_lim: {
            $$$key$$$: "cool_lower_lim",
            field: "cp_attr.cool_lower_lim.lp_value",
            title: $filter("translate")("ADDITION.HTML.255"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true\">{{facs[#= index#].cp_attr.cool_lower_lim.lp_value | convertDot:true}} {{::gTempUnit}} / {{facs[#= index#].cp_attr.cool_upper_lim.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value
                      , second = "ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value;
                    return first && second ? parseFloat(a.cp_attr.cool_lower_lim.lp_value) - parseFloat(b.cp_attr.cool_lower_lim.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        heat_lower_lim: {
            $$$key$$$: "heat_lower_lim",
            field: "cp_attr.heat_lower_lim.lp_value",
            title: $filter("translate")("ADDITION.HTML.256"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.twoset_automode.lp_value == 'ON' && facs[#= index#].cp_attr.ui_twoset_mode.lp_value == true\">{{facs[#= index#].cp_attr.heat_lower_lim.lp_value | convertDot:true}} {{::gTempUnit}} / {{facs[#= index#].cp_attr.heat_upper_lim.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.twoset_automode.lp_value && 1 == a.cp_attr.ui_twoset_mode.lp_value
                      , second = "ON" == b.cp_attr.twoset_automode.lp_value && 1 == b.cp_attr.ui_twoset_mode.lp_value;
                    return first && second ? parseFloat(a.cp_attr.heat_lower_lim.lp_value) - parseFloat(b.cp_attr.heat_lower_lim.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            hidden: !0,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        peak_enable: {
            $$$key$$$: "peak_enable",
            field: "cp_attr.peak_enable.lp_value",
            title: $filter("translate")("PEAK_CONTROL"),
            width: 200,
            hidden: !0,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.peak_enable.lp_value|translate}}'
        },
        filter: {
            $$$key$$$: "filter",
            field: "cp_attr.filter.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.FILTER"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.IDU._FILTER." + facs[#= index#].cp_attr.filter.lp_value|translate}}'
        },
        oil: {
            $$$key$$$: "oil",
            field: "cp_attr.oil.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.OIL"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.IDU._OIL." + facs[#= index#].cp_attr.oil.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            hidden: !0,
            width: 200
        },
        parent_addr: {
            $$$key$$$: "parent_addr",
            field: "cp_attr.parent_addr.lp_value",
            title: $filter("translate")("DUPLICATE.88"),
            hidden: !0,
            width: 200
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            hidden: !0,
            width: 200
        }
    },
    columnArray.ventlist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr.oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.oper.lp_value|translate}}</span>'
        },
        mode: {
            $$$key$$$: "mode",
            field: "cp_attr.mode.lp_value",
            title: $filter("translate")("DUPLICATE.35"),
            width: 200,
            template: '<badge class="badge-{{facs[#= index#].cp_attr.mode.lp_value|lowercase}} vent-mode">{{"HISTORY_CONTROL.VENT._MODE." + facs[#= index#].cp_attr.mode.lp_value|translate}}</badge>',
            sortable: {
                compare: function(a, b, descending) {
                    return ventmode[a.cp_attr.mode.lp_value] - ventmode[b.cp_attr.mode.lp_value]
                }
            }
        },
        roomtemp: {
            $$$key$$$: "roomtemp",
            field: "cp_attr.roomtemp.lp_value",
            title: $filter("translate")("DUPLICATE.33"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.roomtemp.lp_value | convertDot:true}} {{::gTempUnit}}"
        },
        settemp: {
            $$$key$$$: "settemp",
            field: "cp_attr.settemp.lp_value",
            title: $filter("translate")("DUPLICATE.34"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'vent_dx'\">{{facs[#= index#].cp_attr.settemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.settemp.lp_value) - parseFloat(b.cp_attr.settemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        fanspeed: {
            $$$key$$$: "fanspeed",
            field: "cp_attr.fanspeed.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.FANSPEED"),
            width: 200,
            template: '{{"VALUETYPES.FANSPEED." + facs[#= index#].cp_attr.fanspeed.lp_value|translate}}',
            sortable: {
                compare: function(a, b, descending) {
                    return ventfanspeed[a.cp_attr.fanspeed.lp_value] - ventfanspeed[b.cp_attr.fanspeed.lp_value]
                }
            }
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        co2: {
            $$$key$$$: "co2",
            field: "cp_attr.co2.lp_value",
            title: $filter("translate")("ADDITION.HTML.281"),
            width: 200,
            template: '{{"HISTORY_CONTROL.VENT._CO2." + facs[#= index#].cp_attr.co2.lp_value|translate}}',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "0" !== a.cp_attr.co2.lp_value
                      , second = "0" !== b.cp_attr.co2.lp_value;
                    return first && second ? parseInt(a.cp_attr.co2.lp_value) - parseInt(b.cp_attr.co2.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        co2value: {
            $$$key$$$: "co2value",
            field: "cp_attr.co2value.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.VENT.CO2VALUE"),
            width: 200,
            template: "<var ng-if=\"(facs[#= index#].cp_attr.dmodel.lp_value == 'vent_normal'|| facs[#= index#].cp_attr.dmodel.lp_value == 'vent_dx'|| facs[#= index#].cp_attr.dmodel.lp_value == 'vent_floor')&& (facs[#= index#].cp_attr.cmd7_avail && facs[#= index#].cp_attr.cmd7_avail.lp_value == 'ON')\">{{facs[#= index#].cp_attr.co2value.lp_value}} {{\"VALUEUTYPES.PPM\"|translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "0" !== a.cp_attr.co2value.lp_value
                      , second = "0" !== b.cp_attr.co2value.lp_value;
                    return first && second ? parseInt(a.cp_attr.co2value.lp_value) - parseInt(b.cp_attr.co2value.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        ac_oper: {
            $$$key$$$: "ac_oper",
            field: "cp_attr.ac_oper.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.AC_OPER"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.ac_oper.lp_value|lowercase}}" ng-if="facs[#= index#].cp_attr.dmodel.lp_value == \'vent_dx\'">{{facs[#= index#].cp_attr.ac_oper.lp_value|translate}}</span>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? onoff[a.cp_attr.ac_oper.lp_value] - onoff[b.cp_attr.ac_oper.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        ac_mode: {
            $$$key$$$: "ac_mode",
            field: "cp_attr.ac_mode.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.AC_MODE"),
            width: 200,
            template: '<badge class="badge-{{facs[#= index#].cp_attr.ac_mode.lp_value|lowercase}}" ng-if="facs[#= index#].cp_attr.dmodel.lp_value == \'vent_dx\'">{{"HISTORY_CONTROL.VENT._AC_MODE." + facs[#= index#].cp_attr.ac_mode.lp_value|translate}}</badge>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? ventacmode[a.cp_attr.ac_mode.lp_value] - ventacmode[b.cp_attr.ac_mode.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        settemp_llim: {
            $$$key$$$: "settemp_llim",
            field: "cp_attr.settemp_llim.lp_value",
            title: $filter("translate")("CONTROL.FACILITY-ASIDE.IDU.4"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'vent_dx'\">{{facs[#= index#].cp_attr.settemp_llim.lp_value | convertDot:true}} {{::gTempUnit}} / {{facs[#= index#].cp_attr.settemp_ulim.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.settemp_llim.lp_value) - parseFloat(b.cp_attr.settemp_llim.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        func: {
            $$$key$$$: "func",
            field: "cp_attr.func.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.FUNCTION"),
            width: 200,
            template: '{{"HISTORY_CONTROL.VENT._FUNCTION." + facs[#= index#].cp_attr.func.lp_value|translate}}'
        },
        heater: {
            $$$key$$$: "heater",
            field: "cp_attr.heater.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.HEATER"),
            width: 200,
            template: '{{"HISTORY_CONTROL.VENT._HEATER." + facs[#= index#].cp_attr.heater.lp_value|translate}}'
        },
        humidity: {
            $$$key$$$: "humidity",
            field: "cp_attr.humidity.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.HUMIDITY"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.dmodel.lp_value == \'vent_dx\'">{{"HISTORY_CONTROL.VENT._HUMIDITY." + facs[#= index#].cp_attr.humidity.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? onoff[a.cp_attr.humidity.lp_value] - onoff[b.cp_attr.humidity.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        ntfc_oper: {
            $$$key$$$: "ntfc_oper",
            field: "cp_attr.ntfc_oper.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.NTFC_OPER"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.ntfc_avail.lp_value == \'ON\'">{{"HISTORY_CONTROL.VENT._NTFC_OPER." + facs[#= index#].cp_attr.ntfc_oper.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.ntfc_avail.lp_value
                      , second = "ON" == b.cp_attr.ntfc_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.ntfc_oper.lp_value] - onoff[b.cp_attr.ntfc_oper.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        lock: {
            $$$key$$$: "lock",
            field: "cp_attr.lock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.LOCK"),
            width: 200,
            template: '{{"HISTORY_CONTROL.VENT._LOCK." + facs[#= index#].cp_attr.lock.lp_value|translate}}'
        },
        modelock: {
            $$$key$$$: "modelock",
            field: "cp_attr.modelock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.MODELOCK"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'vent_dx' && systems.lgap_type == 'MASTER'\">{{\"HISTORY_CONTROL.VENT._MODELOCK.\" + facs[#= index#].cp_attr.modelock.lp_value|translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? onoff[a.cp_attr.modelock.lp_value] - onoff[b.cp_attr.modelock.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        fanlock: {
            $$$key$$$: "fanlock",
            field: "cp_attr.fanlock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.FANLOCK"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'vent_dx' && systems.lgap_type == 'MASTER'\">{{\"HISTORY_CONTROL.VENT._FANLOCK.\" + facs[#= index#].cp_attr.fanlock.lp_value|translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? onoff[a.cp_attr.fanlock.lp_value] - onoff[b.cp_attr.fanlock.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        settemplock: {
            $$$key$$$: "settemplock",
            field: "cp_attr.settemplock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.SETTEMPLOCK"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'vent_dx' && systems.lgap_type == 'MASTER'\">{{\"HISTORY_CONTROL.VENT._SETTEMPLOCK.\" + facs[#= index#].cp_attr.settemplock.lp_value|translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "vent_dx" == a.cp_attr.dmodel.lp_value
                      , second = "vent_dx" == b.cp_attr.dmodel.lp_value;
                    return first && second ? onoff[a.cp_attr.settemplock.lp_value] - onoff[b.cp_attr.settemplock.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        ntfclock: {
            $$$key$$$: "ntfclock",
            field: "cp_attr.ntfclock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.NTFCLOCK"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.ntfc_avail.lp_value == \'ON\'">{{"HISTORY_CONTROL.VENT._NTFCLOCK." + facs[#= index#].cp_attr.ntfclock.lp_value|translate}}</var>',
            hidden: !0,
            sortable: {
                compare: function(a, b, descending) {
                    var first = "ON" == a.cp_attr.ntfc_avail.lp_value
                      , second = "ON" == b.cp_attr.ntfc_avail.lp_value;
                    return first && second ? onoff[a.cp_attr.ntfclock.lp_value] - onoff[b.cp_attr.ntfclock.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        filter_status: {
            $$$key$$$: "filter_status",
            field: "cp_attr.filter_status.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.FILTER_STATUS"),
            width: 200,
            template: '{{"HISTORY_CONTROL.VENT._FILTER_STATUS." + facs[#= index#].cp_attr.filter_status.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.awhplist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        win_temp: {
            $$$key$$$: "win_temp",
            field: "cp_attr.win_temp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AWHP.WIN_TEMP"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.win_temp.lp_value | convertDot:true}} {{::gTempUnit}}"
        },
        wout_temp: {
            $$$key$$$: "wout_temp",
            field: "cp_attr.wout_temp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AWHP.WOUT_TEMP"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.wout_temp.lp_value | convertDot:true}} {{::gTempUnit}}"
        },
        room_temp: {
            $$$key$$$: "room_temp",
            field: "cp_attr.room_temp.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.IDU.ROOMTEMP"),
            width: 200,
            hidden: !0,
            template: "{{facs[#= index#].cp_attr.room_temp.lp_value | convertDot:true}} {{::gTempUnit}}"
        },
        wt_temp: {
            $$$key$$$: "wt_temp",
            field: "cp_attr.wt_temp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AWHP.HOTW_TEMP"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.wt_temp.lp_value | convertDot:true}} {{::gTempUnit}}"
        },
        solar_temp: {
            $$$key$$$: "solar_temp",
            field: "cp_attr.solar_temp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AWHP.SOLOR_TEMP"),
            width: 200,
            hidden: !0,
            template: "{{facs[#= index#].cp_attr.solar_temp.lp_value | convertDot:true}} {{::gTempUnit}}"
        },
        hotw_oper: {
            $$$key$$$: "hotw_oper",
            field: "cp_attr.hotw_oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AWHP.HOTW"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.ui_isHotwater.lp_value == true"><span class="run-label run-{{facs[#= index#].cp_attr.hotw_oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.hotw_oper.lp_value|translate}}</span></var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = 1 == a.cp_attr.ui_isHotwater.lp_value
                      , second = 1 == b.cp_attr.ui_isHotwater.lp_value;
                    return first && second ? onoff[a.cp_attr.hotw_oper.lp_value] - onoff[b.cp_attr.hotw_oper.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        wt_settemp: {
            $$$key$$$: "wt_settemp",
            field: "cp_attr.wt_settemp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AWHP.HOTW_SET_TEMP"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.ui_isHotwater.lp_value == true">{{facs[#= index#].cp_attr.wt_settemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = 1 == a.cp_attr.ui_isHotwater.lp_value
                      , second = 1 == b.cp_attr.ui_isHotwater.lp_value;
                    return first && second ? parseFloat(a.cp_attr.wt_settemp.lp_value) - parseFloat(b.cp_attr.wt_settemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr.oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.ui_isInoutwater.lp_value == true"><span class="run-label run-{{facs[#= index#].cp_attr.oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.oper.lp_value|translate}}</span></var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = 1 == a.cp_attr.ui_isInoutwater.lp_value
                      , second = 1 == b.cp_attr.ui_isInoutwater.lp_value;
                    return first && second ? onoff[a.cp_attr.oper.lp_value] - onoff[b.cp_attr.oper.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        mode: {
            $$$key$$$: "mode",
            field: "cp_attr.mode.lp_value",
            title: $filter("translate")("DUPLICATE.35"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.ui_isInoutwater.lp_value == true"><badge class="badge-{{facs[#= index#].cp_attr.mode.lp_value|lowercase}}">{{"HISTORY_CONTROL.AWHP._MODE." + facs[#= index#].cp_attr.mode.lp_value|translate}}</badge></var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = 1 == a.cp_attr.ui_isInoutwater.lp_value
                      , second = 1 == b.cp_attr.ui_isInoutwater.lp_value;
                    return first && second ? awhpmode[a.cp_attr.mode.lp_value] - awhpmode[b.cp_attr.mode.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        settemp: {
            $$$key$$$: "settemp",
            field: "cp_attr.settemp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AWHP.SET_TEMP"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.ui_isInoutwater.lp_value == true">{{facs[#= index#].cp_attr.settemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = 1 == a.cp_attr.ui_isInoutwater.lp_value
                      , second = 1 == b.cp_attr.ui_isInoutwater.lp_value;
                    return first && second ? parseFloat(a.cp_attr.settemp.lp_value) - parseFloat(b.cp_attr.settemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            hidden: !0,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        lock: {
            $$$key$$$: "lock",
            field: "cp_attr.lock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AWHP.LOCK"),
            width: 200,
            template: '{{"HISTORY_CONTROL.AWHP._LOCK." + facs[#= index#].cp_attr.lock.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.ahulist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr.oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.oper.lp_value|translate}}</span>'
        },
        mode: {
            $$$key$$$: "mode",
            field: "cp_attr.mode.lp_value",
            title: $filter("translate")("DUPLICATE.35"),
            width: 200,
            template: "<badge class=\"badge-{{facs[#= index#].cp_attr.mode.lp_value == 'OFF' ? '' : facs[#= index#].cp_attr.mode.lp_value | lowercase}}\">{{\"HISTORY_CONTROL.AHU._MODE.\" + facs[#= index#].cp_attr.mode.lp_value|translate}}</badge>",
            sortable: {
                compare: function(a, b, descending) {
                    return ahumode[a.cp_attr.mode.lp_value] - ahumode[b.cp_attr.mode.lp_value]
                }
            }
        },
        oadamper: {
            $$$key$$$: "oadamper",
            field: "cp_attr.oadamper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.OADAMPER"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{facs[#= index#].cp_attr.oadamper.lp_value}}°</var>'
        },
        mixdamper: {
            $$$key$$$: "mixdamper",
            field: "cp_attr.mixdamper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.MIXDAMPER"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{facs[#= index#].cp_attr.mixdamper.lp_value}}°</var>'
        },
        eadamper: {
            $$$key$$$: "eadamper",
            field: "cp_attr.eadamper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.EADAMPER"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{facs[#= index#].cp_attr.eadamper.lp_value}}°</var>'
        },
        supplytemp: {
            $$$key$$$: "supplytemp",
            field: "cp_attr.supplytemp.lp_value",
            title: $filter("translate")("TREND.AHU.SUPPLY_TEMP"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value || facs[#= index#].cp_attr.isCommkit.lp_value || facs[#= index#].cp_attr.isLGDOAS.lp_value">{{facs[#= index#].cp_attr.supplytemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>'
        },
        venttemp: {
            $$$key$$$: "venttemp",
            field: "cp_attr.venttemp.lp_value",
            title: $filter("translate")("TREND.AHU.VENT_TEMP"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.type.lp_value == 'NORMAL' || facs[#= index#].cp_attr.type.lp_value == 'MODULAR_HEATRECOVERY'\">{{facs[#= index#].cp_attr.venttemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "NORMAL" == a.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == a.cp_attr.type.lp_value
                      , second = "NORMAL" == b.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == b.cp_attr.type.lp_value;
                    return first && second ? parseFloat(a.cp_attr.venttemp.lp_value) - parseFloat(b.cp_attr.venttemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        settemp: {
            $$$key$$$: "settemp",
            field: "cp_attr.settemp.lp_value",
            title: $filter("translate")("DUPLICATE.34"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value || facs[#= index#].cp_attr.isCommkit.lp_value || facs[#= index#].cp_attr.isLGDOAS.lp_value">{{facs[#= index#].cp_attr.settemp.lp_value | convertDot:true}} {{::gTempUnit}}</var>'
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        supplyfansp: {
            $$$key$$$: "supplyfansp",
            field: "cp_attr.supplyfansp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.SUPPLYFANSP"),
            width: 250,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.type.lp_value == 'MODULAR_FRESHAIR' || facs[#= index#].cp_attr.type.lp_value == 'MODULAR_HEATRECOVERY'\">{{facs[#= index#].cp_attr.supplyfansp.lp_value}} Pa</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "MODULAR_FRESHAIR" == a.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == a.cp_attr.type.lp_value
                      , second = "MODULAR_FRESHAIR" == b.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == b.cp_attr.type.lp_value;
                    return first && second ? parseFloat(a.cp_attr.supplyfansp.lp_value) - parseFloat(b.cp_attr.supplyfansp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        fanctrl: {
            $$$key$$$: "fanctrl",
            field: "cp_attr.fanctrl.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AHU.FANCONTROL"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.type.lp_value == 'MODULAR_FRESHAIR' || facs[#= index#].cp_attr.type.lp_value == 'MODULAR_HEATRECOVERY'\">{{\"HISTORY_CONTROL.AHU._FANCONTROL.\" + facs[#= index#].cp_attr.fanctrl.lp_value|translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "MODULAR_FRESHAIR" == a.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == a.cp_attr.type.lp_value
                      , second = "MODULAR_FRESHAIR" == b.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == b.cp_attr.type.lp_value;
                    return first && second ? ahufanctrl[a.cp_attr.fanctrl.lp_value] - ahufanctrl[b.cp_attr.fanctrl.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        fanspeed: {
            $$$key$$$: "fanspeed",
            field: "cp_attr.fanspeed.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AHU.FANSPEED"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.type.lp_value == 'MODULAR_FRESHAIR' || facs[#= index#].cp_attr.type.lp_value == 'MODULAR_HEATRECOVERY' || facs[#= index#].cp_attr.type.lp_value == 'COMMKIT_SA'\">{{\"HISTORY_CONTROL.AHU._FANSPEED.\" + facs[#= index#].cp_attr.fanspeed.lp_value|translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "MODULAR_FRESHAIR" == a.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == a.cp_attr.type.lp_value || "COMMKIT_SA" == a.cp_attr.type.lp_value
                      , second = "MODULAR_FRESHAIR" == b.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == b.cp_attr.type.lp_value || "COMMKIT_SA" == a.cp_attr.type.lp_value;
                    return first && second ? ahufanspeed[a.cp_attr.fanspeed.lp_value] - ahufanspeed[b.cp_attr.fanspeed.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        autovent: {
            $$$key$$$: "autovent",
            field: "cp_attr.autovent.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AHU.AUTO_VENT"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{"HISTORY_CONTROL.AHU._AUTO_VENT." + facs[#= index#].cp_attr.autovent.lp_value|translate}}</var>'
        },
        co2set: {
            $$$key$$$: "co2set",
            field: "cp_attr.co2set.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.CO2SET"),
            width: 200,
            hidden: !0,
            template: "<var ng-if=\"facs[#= index#].cp_attr.type.lp_value == 'MODULAR_FRESHAIR' || facs[#= index#].cp_attr.type.lp_value == 'MODULAR_HEATRECOVERY'\">{{facs[#= index#].cp_attr.co2set.lp_value}} ppm</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "MODULAR_FRESHAIR" == a.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == a.cp_attr.type.lp_value
                      , second = "MODULAR_FRESHAIR" == b.cp_attr.type.lp_value || "MODULAR_HEATRECOVERY" == b.cp_attr.type.lp_value;
                    return first && second ? parseFloat(a.cp_attr.co2set.lp_value) - parseFloat(b.cp_attr.co2set.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        humidity: {
            $$$key$$$: "humidity",
            field: "cp_attr.humidity.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AHU.HUMIDITY"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{"HISTORY_CONTROL.AHU._HUMIDITY." + facs[#= index#].cp_attr.humidity.lp_value|translate}}</var>'
        },
        sethumidity: {
            $$$key$$$: "sethumidity",
            field: "cp_attr.sethumidity.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.SETHUMIDITY"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{facs[#= index#].cp_attr.sethumidity.lp_value}} %</var>'
        },
        co2value: {
            $$$key$$$: "co2value",
            field: "cp_attr.co2value.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.CO2VALUE"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{facs[#= index#].cp_attr.co2value.lp_value}} ppm</var>'
        },
        outerhumidity: {
            $$$key$$$: "outerhumidity",
            field: "cp_attr.outerhumidity.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.OUTERHUMIDITY"),
            width: 200,
            hidden: !0,
            template: "{{facs[#= index#].cp_attr.outerhumidity.lp_value}} %"
        },
        supplyhumidity: {
            $$$key$$$: "supplyhumidity",
            field: "cp_attr.supplyhumidity.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.AHU.SUPPLYHUMIDITY"),
            width: 200,
            hidden: !0,
            template: '<var ng-if="facs[#= index#].cp_attr.isLGAP.lp_value || facs[#= index#].cp_attr.isModular.lp_value">{{facs[#= index#].cp_attr.supplyhumidity.lp_value}} %</var>'
        },
        lock: {
            $$$key$$$: "lock",
            field: "cp_attr.lock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.VENT.LOCK"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.type.lp_value == 'NORMAL' || facs[#= index#].cp_attr.type.lp_value == 'FRESHAIR_NORMAL'\">{{\"HISTORY_CONTROL.VENT._LOCK.\" + facs[#= index#].cp_attr.lock.lp_value|translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "NORMAL" == a.cp_attr.type.lp_value || "FRESHAIR_NORMAL" == a.cp_attr.type.lp_value
                      , second = "NORMAL" == b.cp_attr.type.lp_value || "FRESHAIR_NORMAL" == b.cp_attr.type.lp_value;
                    return first && second ? onoff[a.cp_attr.lock.lp_value] - onoff[b.cp_attr.lock.lp_value] : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            hidden: !0,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.chillerlist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr.oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.oper.lp_value|translate}}</span>'
        },
        mode: {
            $$$key$$$: "mode",
            field: "cp_attr.mode.lp_value",
            title: $filter("translate")("DUPLICATE.35"),
            width: 200,
            template: '<badge class="badge-{{facs[#= index#].cp_attr.mode.lp_value|lowercase}}">{{"HISTORY_CONTROL.CHILLER._MODE." + facs[#= index#].cp_attr.mode.lp_value|translate}}</badge>',
            sortable: {
                compare: function(a, b, descending) {
                    return chillermode[a.cp_attr.mode.lp_value] - chillermode[b.cp_attr.mode.lp_value]
                }
            }
        },
        cwater_entering_temp: {
            $$$key$$$: "cwater_entering_temp",
            field: "cp_attr.cwater_entering_temp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.CWATER_ENTERING_TEMP"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.cwater_entering_temp.lp_value | convertDot:false}} ℃"
        },
        cwater_leaving_temp: {
            $$$key$$$: "cwater_leaving_temp",
            field: "cp_attr.cwater_leaving_temp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.CWATER_LEAVING_TEMP"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.cwater_leaving_temp.lp_value | convertDot:false}} ℃"
        },
        set_cool_wtemp: {
            $$$key$$$: "set_cool_wtemp",
            field: "cp_attr.set_cool_wtemp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.SETCOOLWATERTEMP"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.set_cool_wtemp.lp_value | convertDot:false}} ℃"
        },
        set_hot_wtemp: {
            $$$key$$$: "set_hot_wtemp",
            field: "cp_attr.set_hot_wtemp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.SETHOTWATERTEMP"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_air' || facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_water' || facs[#= index#].cp_attr.dmodel.lp_value == 'chi_absorb'\" >{{facs[#= index#].cp_attr.set_hot_wtemp.lp_value | convertDot:false}} ℃</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_scr_air" == a.cp_attr.dmodel.lp_value || "chi_scr_water" == a.cp_attr.dmodel.lp_value || "chi_absorb" == a.cp_attr.dmodel.lp_value
                      , second = "chi_scr_air" == b.cp_attr.dmodel.lp_value || "chi_scr_water" == b.cp_attr.dmodel.lp_value || "chi_absorb" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.set_hot_wtemp.lp_value) - parseFloat(b.cp_attr.set_hot_wtemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        set_ice_wtemp: {
            $$$key$$$: "set_ice_wtemp",
            field: "cp_attr.set_ice_wtemp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.SETICEWATERTEMP"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_screw'\" >{{facs[#= index#].cp_attr.set_ice_wtemp.lp_value | convertDot:false}} ℃</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_screw" == a.cp_attr.dmodel.lp_value
                      , second = "chi_screw" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.set_ice_wtemp.lp_value) - parseFloat(b.cp_attr.set_ice_wtemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        set_ih_wtemp: {
            $$$key$$$: "set_ih_wtemp",
            field: "cp_attr.set_ih_wtemp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.SETICEHOTWATERTEMP"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_turbo'\" >{{facs[#= index#].cp_attr.set_ih_wtemp.lp_value | convertDot:false}} ℃</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_turbo" == a.cp_attr.dmodel.lp_value
                      , second = "chi_turbo" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.set_ih_wtemp.lp_value) - parseFloat(b.cp_attr.set_ih_wtemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        set_demand_limit: {
            $$$key$$$: "set_demand_limit",
            field: "cp_attr.set_demand_limit.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.SETDEMANDLIMIT"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_air' || facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_water'\">{{facs[#= index#].cp_attr.set_demand_limit.lp_value}} %</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_scr_air" == a.cp_attr.dmodel.lp_value || "chi_scr_water" == a.cp_attr.dmodel.lp_value
                      , second = "chi_scr_air" == b.cp_attr.dmodel.lp_value || "chi_scr_water" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.set_demand_limit.lp_value) - parseFloat(b.cp_attr.set_demand_limit.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        set_motor_limit: {
            $$$key$$$: "set_motor_limit",
            field: "cp_attr.set_motor_limit.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.SETMOTORLIMIT"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_turbo' || facs[#= index#].cp_attr.dmodel.lp_value == 'chi_screw'\">{{facs[#= index#].cp_attr.set_motor_limit.lp_value}} %</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_turbo" == a.cp_attr.dmodel.lp_value || "chi_screw" == a.cp_attr.dmodel.lp_value
                      , second = "chi_turbo" == b.cp_attr.dmodel.lp_value || "chi_screw" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.set_motor_limit.lp_value) - parseFloat(b.cp_attr.set_motor_limit.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        ctrl_valve_limit: {
            $$$key$$$: "ctrl_valve_limit",
            field: "cp_attr.ctrl_valve_limit.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.CONTROLVALVELIMIT"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_absorb'\">{{facs[#= index#].cp_attr.ctrl_valve_limit.lp_value}} %</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_absorb" == a.cp_attr.dmodel.lp_value
                      , second = "chi_absorb" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.ctrl_valve_limit.lp_value) - parseFloat(b.cp_attr.ctrl_valve_limit.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        outtemp: {
            $$$key$$$: "outtemp",
            field: "cp_attr.outtemp.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.OUTER_TEMP"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_air' || facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_water' || facs[#= index#].cp_attr.dmodel.lp_value == 'chi_multiv'\">{{facs[#= index#].cp_attr.outtemp.lp_value | convertDot:false}} ℃</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_scr_air" == a.cp_attr.dmodel.lp_value || "chi_scr_water" == a.cp_attr.dmodel.lp_value || "chi_multiv" == a.cp_attr.dmodel.lp_value
                      , second = "chi_scr_air" == b.cp_attr.dmodel.lp_value || "chi_scr_water" == b.cp_attr.dmodel.lp_value || "chi_multiv" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.outtemp.lp_value) - parseFloat(b.cp_attr.outtemp.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        tot_running_cur_A: {
            $$$key$$$: "tot_running_cur_A",
            field: "cp_attr.tot_running_cur_A.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.WHOLEELECTRIC"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_water'\">{{facs[#= index#].cp_attr.tot_running_cur_A.lp_value}} A</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_scr_water" == a.cp_attr.dmodel.lp_value
                      , second = "chi_scr_water" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.tot_running_cur_A.lp_value) - parseFloat(b.cp_attr.tot_running_cur_A.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        left2start_time_sec: {
            $$$key$$$: "left2start_time_sec",
            field: "cp_attr.left2start_time_sec.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.CHILLER.MWAIT_TIME"),
            width: 200,
            template: "<var ng-if=\"facs[#= index#].cp_attr.dmodel.lp_value == 'chi_scr_water'\">{{facs[#= index#].cp_attr.left2start_time_sec.lp_value}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = "chi_scr_water" == a.cp_attr.dmodel.lp_value
                      , second = "chi_scr_water" == b.cp_attr.dmodel.lp_value;
                    return first && second ? parseFloat(a.cp_attr.left2start_time_sec.lp_value) - parseFloat(b.cp_attr.left2start_time_sec.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.dokitlist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr.oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.oper.lp_value|translate}}</span>'
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.dilist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        state: {
            $$$key$$$: "state",
            field: "cp_attr.state.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.state.lp_value|lowercase}}">{{facs[#= index#].cp_attr.state.lp_value|translate}}</span>'
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.dolist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        state: {
            $$$key$$$: "state",
            field: "cp_attr.state.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.state.lp_value|lowercase}}">{{facs[#= index#].cp_attr.state.lp_value|translate}}</span>'
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.portlist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr",
            title: $filter("translate")("CONTROL.FACILITY.16") + "(" + $filter("translate")("CP_TYPE_ID.DI") + "/" + $filter("translate")("CP_TYPE_ID.DO") + ")",
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.io_type.lp_value == \'bi\'"><var ng-if="facs[#= index#].cp_attr.value.lp_value * 1 >= 1"><span class="run-label run-on">{{"VALUETYPES.DOK_USAGE." + facs[#= index#].cp_attr.usage.lp_value + "_VALUE.ON"|uppercase|translate}}</span></var><var ng-if="facs[#= index#].cp_attr.value.lp_value * 1 <= 0"><span class="run-label run-off">{{"VALUETYPES.DOK_USAGE." + facs[#= index#].cp_attr.usage.lp_value + "_VALUE.OFF"|uppercase|translate}}</span></var></var>',
            sortable: {
                compare: function(a, b, descending) {
                    return "bi" == a.cp_attr.io_type.lp_value && "bi" == b.cp_attr.io_type.lp_value ? parseInt(a.cp_attr.value.lp_value) - parseInt(b.cp_attr.value.lp_value) : "bi" == a.cp_attr.io_type.lp_value && "bi" !== b.cp_attr.io_type.lp_value ? descending ? 1 : -1 : "bi" !== a.cp_attr.io_type.lp_value && "bi" == b.cp_attr.io_type.lp_value ? descending ? -1 : 1 : -1
                }
            }
        },
        value: {
            $$$key$$$: "value",
            field: "cp_attr.value.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16") + "(" + $filter("translate")("CP_TYPE_ID.UI") + "/" + $filter("translate")("CP_TYPE_ID.AO") + ")",
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.io_type.lp_value !== \'bi\'">{{facs[#= index#].cp_attr.value.lp_value}}<var ng-if="facs[#= index#].cp_attr.utype.lp_value !== \'D\'"> </var>{{"VALUEUTYPES." + facs[#= index#].cp_attr.utype.lp_value|translate}}</var>',
            sortable: {
                compare: function(a, b, descending) {
                    return "bi" !== a.cp_attr.io_type.lp_value && "bi" !== b.cp_attr.io_type.lp_value ? parseFloat(a.cp_attr.value.lp_value) - parseFloat(b.cp_attr.value.lp_value) : "bi" == a.cp_attr.io_type.lp_value && "bi" !== b.cp_attr.io_type.lp_value ? descending ? -1 : 1 : "bi" !== a.cp_attr.io_type.lp_value && "bi" == b.cp_attr.io_type.lp_value && descending ? 1 : -1
                }
            }
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.odulist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        opermode: {
            $$$key$$$: "opermode",
            field: "cp_attr.opermode.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.ODU.OPERMODE"),
            width: 200,
            template: '{{"HISTORY_CONTROL.ODU._OPERMODE." + facs[#= index#].cp_attr.opermode.lp_value | translate}}'
        },
        target_pressure_step: {
            $$$key$$$: "target_pressure_step",
            field: "cp_attr.target_pressure_step.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.ODU.TARGET_PRESSURE_STEP"),
            width: 200,
            template: '{{"HISTORY_CONTROL.ODU._TARGET_PRESSURE_STEP." + facs[#= index#].cp_attr.target_pressure_step.lp_value | translate}}'
        },
        slc_step: {
            $$$key$$$: "slc_step",
            field: "cp_attr.slc_step.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.ODU.SLC_STEP"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.slc_step_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.ODU._SLC_STEP." + facs[#= index#].cp_attr.slc_step.lp_value|translate}}</var>'
        },
        night_silent_mode: {
            $$$key$$$: "night_silent_mode",
            field: "cp_attr.night_silent_mode.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.ODU.NIGHT_SILENT_MODE"),
            width: 200,
            template: '{{"HISTORY_CONTROL.ODU._NIGHT_SILENT_MODE." + facs[#= index#].cp_attr.night_silent_mode.lp_value|translate}}'
        },
        defrost_step: {
            $$$key$$$: "defrost_step",
            field: "cp_attr.defrost_step.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.ODU.DEFROST_STEP"),
            width: 200,
            template: '{{"HISTORY_CONTROL.ODU._DEFROST_STEP." + facs[#= index#].cp_attr.defrost_step.lp_value|translate}}'
        },
        refrige_sound_decrease: {
            $$$key$$$: "refrige_sound_decrease",
            field: "cp_attr.refrige_sound_decrease.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.ODU.REFRIGE_SOUND_DECREASE"),
            width: 200,
            template: '<var ng-if="facs[#= index#].cp_attr.refrige_sound_decrease_avail.lp_value == \'ON\'"/>{{"HISTORY_CONTROL.ODU._REFRIGE_SOUND_DECREASE." + facs[#= index#].cp_attr.refrige_sound_decrease.lp_value|translate}}</var>'
        },
        pre_mode: {
            $$$key$$$: "pre_mode",
            field: "cp_attr.pre_mode.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.ODU.PRE_MODE"),
            width: 200,
            template: '<var/>{{"HISTORY_CONTROL.ODU._PRE_MODE." + facs[#= index#].cp_attr.pre_mode.lp_value|translate}}</var>'
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    },
    columnArray.airlist = {
        checkbox: {
            $$$key$$$: "checkbox",
            headerTemplate: '<checkbox ng-model="facs.checkall" ng-click="facilityListCheckAllByCategory(facs,facs.checkall)" style="margin-left:5px" readOnly></checkbox>',
            template: '<checkbox ng-click="selectItem(facs[#= index#])" ng-model="facs[#= index#].selected"></checkbox>',
            width: 50,
            locked: !0
        },
        name: {
            $$$key$$$: "name",
            field: "cp_attr.name.lp_value",
            title: $filter("translate")("DUPLICATE.30"),
            width: 200,
            locked: !0
        },
        oper: {
            $$$key$$$: "oper",
            field: "cp_attr.oper.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.16"),
            width: 200,
            template: '<span class="run-label run-{{facs[#= index#].cp_attr.oper.lp_value|lowercase}}">{{facs[#= index#].cp_attr.oper.lp_value|translate}}</span>'
        },
        mode: {
            $$$key$$$: "mode",
            field: "cp_attr.mode.lp_value",
            title: $filter("translate")("DUPLICATE.35"),
            width: 200,
            template: '{{"HISTORY_CONTROL.AIRCARE._MODE." + facs[#= index#].cp_attr.mode.lp_value|translate}}',
            sortable: {
                compare: function(a, b, descending) {
                    return aircaremode[a.cp_attr.mode.lp_value] - aircaremode[b.cp_attr.mode.lp_value]
                }
            }
        },
        cleanliness: {
            $$$key$$$: "cleanliness",
            field: "cp_attr.cleanliness.status",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.CLEANLINESS"),
            width: 200,
            template: "<var ng-hide=\"(facs[#= index#].cp_attr.air_sensor.lp_value == 'ACTIVE_ON' && facs[#= index#].cp_attr.oper.lp_value == 'OFF') || facs[#= index#].cp_attr.fine_dust.lp_value == 0 || facs[#= index#].cp_attr.ultrafine_dust.lp_value == 0 || facs[#= index#].cp_attr.superultrafine_dust.lp_value == 0\">{{\"HISTORY_CONTROL.AIRCARE._CLEANLINESS.\" + facs[#= index#].cp_attr.cleanliness.status | translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ACTIVE_ON" == a.cp_attr.air_sensor.lp_value && "OFF" == a.cp_attr.oper.lp_value)
                      , second = !("ACTIVE_ON" == b.cp_attr.air_sensor.lp_value && "OFF" == b.cp_attr.oper.lp_value);
                    return first && second ? parseFloat(a.cp_attr.cleanliness.status) - parseFloat(b.cp_attr.cleanliness.status) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        fine_dust_status: {
            $$$key$$$: "fine_dust_status",
            field: "cp_attr.fine_dust.status",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.FINE_DUST"),
            width: 200,
            template: '<var ng-hide="(facs[#= index#].cp_attr.air_sensor.lp_value == \'ACTIVE_ON\' && facs[#= index#].cp_attr.oper.lp_value == \'OFF\') || facs[#= index#].cp_attr.fine_dust.lp_value == 0">{{facs[#= index#].cp_attr.fine_dust.lp_value}} μg/㎥ ({{"HISTORY_CONTROL._FINE_DUST_STATUS." + finedust_standard_country + "." + facs[#= index#].cp_attr.fine_dust.status | translate}})</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ACTIVE_ON" == a.cp_attr.air_sensor.lp_value && "OFF" == a.cp_attr.oper.lp_value)
                      , second = !("ACTIVE_ON" == b.cp_attr.air_sensor.lp_value && "OFF" == b.cp_attr.oper.lp_value);
                    return first && second ? parseFloat(a.cp_attr.fine_dust.lp_value) - parseFloat(b.cp_attr.fine_dust.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        ultrafine_dust_status: {
            $$$key$$$: "ultrafine_dust_status",
            field: "cp_attr.ultrafine_dust.status",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.ULTRAFINE_DUST"),
            width: 200,
            template: '<var ng-hide="(facs[#= index#].cp_attr.air_sensor.lp_value == \'ACTIVE_ON\' && facs[#= index#].cp_attr.oper.lp_value == \'OFF\') || facs[#= index#].cp_attr.ultrafine_dust.lp_value == 0">{{facs[#= index#].cp_attr.ultrafine_dust.lp_value}} μg/㎥ ({{"HISTORY_CONTROL._FINE_DUST_STATUS." + finedust_standard_country + "." + facs[#= index#].cp_attr.ultrafine_dust.status | translate}})</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ACTIVE_ON" == a.cp_attr.air_sensor.lp_value && "OFF" == a.cp_attr.oper.lp_value)
                      , second = !("ACTIVE_ON" == b.cp_attr.air_sensor.lp_value && "OFF" == b.cp_attr.oper.lp_value);
                    return first && second ? parseFloat(a.cp_attr.ultrafine_dust.lp_value) - parseFloat(b.cp_attr.ultrafine_dust.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        superultrafine_dust_status: {
            $$$key$$$: "superultrafine_dust_status",
            field: "cp_attr.superultrafine_dust.status",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.SUPERULTRAFINE_DUST"),
            width: 200,
            template: '<var ng-hide="(facs[#= index#].cp_attr.air_sensor.lp_value == \'ACTIVE_ON\' && facs[#= index#].cp_attr.oper.lp_value == \'OFF\') || facs[#= index#].cp_attr.superultrafine_dust.lp_value == 0">{{facs[#= index#].cp_attr.superultrafine_dust.lp_value}} μg/㎥ ({{"HISTORY_CONTROL._FINE_DUST_STATUS." + finedust_standard_country + "." + facs[#= index#].cp_attr.superultrafine_dust.status | translate}})</var>',
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ACTIVE_ON" == a.cp_attr.air_sensor.lp_value && "OFF" == a.cp_attr.oper.lp_value)
                      , second = !("ACTIVE_ON" == b.cp_attr.air_sensor.lp_value && "OFF" == b.cp_attr.oper.lp_value);
                    return first && second ? parseFloat(a.cp_attr.superultrafine_dust.lp_value) - parseFloat(b.cp_attr.superultrafine_dust.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        real_fanspeed: {
            $$$key$$$: "real_fanspeed",
            field: "cp_attr.real_fanspeed.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.REAL_FANSPEED"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.AIRCARE._REAL_FANSPEED." + facs[#= index#].cp_attr.real_fanspeed.lp_value|translate}}',
            sortable: {
                compare: function(a, b, descending) {
                    return aircarefanspeed[a.cp_attr.real_fanspeed.lp_value] - aircarefanspeed[b.cp_attr.real_fanspeed.lp_value]
                }
            }
        },
        fanspeed: {
            $$$key$$$: "fanspeed",
            field: "cp_attr.fanspeed.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.FANSPEED"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.AIRCARE._FANSPEED." + facs[#= index#].cp_attr.fanspeed.lp_value|translate}}',
            sortable: {
                compare: function(a, b, descending) {
                    return aircarefanspeed[a.cp_attr.fanspeed.lp_value] - aircarefanspeed[b.cp_attr.fanspeed.lp_value]
                }
            }
        },
        operlock: {
            $$$key$$$: "operlock",
            field: "cp_attr.operlock.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.OPERLOCK"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.AIRCARE._OPERLOCK." + facs[#= index#].cp_attr.operlock.lp_value|translate}}'
        },
        air_sensor: {
            $$$key$$$: "air_sensor",
            field: "cp_attr.air_sensor.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.AIR_SENSOR"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.AIRCARE._AIR_SENSOR." + facs[#= index#].cp_attr.air_sensor.lp_value|translate}}'
        },
        filter: {
            $$$key$$$: "filter",
            field: "cp_attr.filter.lp_value",
            title: $filter("translate")("ADDITION.HTML.332"),
            width: 200,
            hidden: !0,
            template: '{{"HISTORY_CONTROL.AIRCARE._FILTER." + facs[#= index#].cp_attr.filter.lp_value|translate}}'
        },
        smell_status: {
            $$$key$$$: "smell_status",
            field: "cp_attr.smell_status.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.SMELL_STATUS"),
            width: 200,
            template: "<var ng-hide=\"(facs[#= index#].cp_attr.air_sensor.lp_value == 'ACTIVE_ON' && facs[#= index#].cp_attr.oper.lp_value == 'OFF') || facs[#= index#].cp_attr.smell_status.lp_value == 0\">{{ \"HISTORY_CONTROL.AIRCARE._SMELL_STATUS.\" + facs[#= index#].cp_attr.smell_status.lp_value | translate}}</var>",
            sortable: {
                compare: function(a, b, descending) {
                    var first = !("ACTIVE_ON" == a.cp_attr.air_sensor.lp_value && "OFF" == a.cp_attr.oper.lp_value)
                      , second = !("ACTIVE_ON" == b.cp_attr.air_sensor.lp_value && "OFF" == b.cp_attr.oper.lp_value);
                    return first && second ? parseFloat(a.cp_attr.smell_status.lp_value) - parseFloat(b.cp_attr.smell_status.lp_value) : first && !second ? descending ? 1 : -1 : !first && second ? descending ? -1 : 1 : -1
                }
            }
        },
        filter_remain: {
            $$$key$$$: "filter_remain",
            field: "cp_attr.filter_remain.lp_value",
            title: $filter("translate")("HISTORY_CONTROL.AIRCARE.FILTER_REMAIN"),
            width: 200,
            hidden: !0,
            template: "{{facs[#= index#].cp_attr.filter_remain.lp_value}} %"
        },
        error: {
            $$$key$$$: "error",
            field: "cp_attr.error.lp_value",
            title: $filter("translate")("DUPLICATE.87"),
            width: 200,
            template: "{{facs[#= index#].cp_attr.error.lp_value}}"
        },
        schedule: {
            $$$key$$$: "schedule",
            field: "cp_attr.schedule.lp_value",
            title: $filter("translate")("DUPLICATE.74"),
            width: 200,
            hidden: !0,
            template: '{{"VALUETYPES.SET." + facs[#= index#].cp_attr.schedule.lp_value|translate}}'
        },
        parent_acpAddr: {
            $$$key$$$: "parent_acpAddr",
            field: "cp_attr.parent_acpAddr.lp_value",
            title: $filter("translate")("ADDITION.HTML.125"),
            width: 200,
            hidden: !0
        },
        hex_addr: {
            $$$key$$$: "hex_addr",
            field: "cp_attr.hex_addr.lp_value",
            title: $filter("translate")("CONTROL.FACILITY.15"),
            width: 200,
            hidden: !0
        }
    };
    var getColumnFromCookie = function(name) {
        var columns = []
          , idulist = $cookies.get(name);
        if (void 0 !== idulist) {
            var order = idulist.split("|");
            _.each(order, function(o) {
                if ("" !== o) {
                    var data = o.split("&");
                    columnArray[name][data[0]].locked = "true" == data[1],
                    columnArray[name][data[0]].hidden = "true" == data[2],
                    columns.push(columnArray[name][data[0]]),
                    columnArray[name][data[0]].added = !0
                }
            }),
            _.each(columnArray[name], function(o) {
                void 0 != o.added && 1 == o.added || (columns.push(o),
                o.added = !0)
            })
        } else
            _.each(columnArray[name], function(o) {
                columns.push(o)
            });
        return columns
    }
      , saveColumnInfoIntoCookie = function(columnInfo, cookie_name) {
        $timeout(function(columns) {
            var orderString = "";
            _.each(columns, function(o) {
                orderString += o.$$$key$$$,
                1 == o.locked ? orderString += "&true" : orderString += "&false",
                1 == o.hidden ? orderString += "&true" : orderString += "&false",
                orderString += "|"
            }),
            $cookies.put(cookie_name, orderString)
        }, 500, !0, columnInfo)
    };
    return {
        getGridOptions: function(cookie_name) {
            var columns = getColumnFromCookie(cookie_name);
            return {
                sortable: !0,
                reorderable: !0,
                resizeable: !0,
                columnMenu: {
                    messages: {
                        sortAscending: $filter("translate")("ADDITION.HTML.326"),
                        sortDescending: $filter("translate")("ADDITION.HTML.327"),
                        columns: $filter("translate")("ADDITION.HTML.328"),
                        lock: $filter("translate")("ADDITION.HTML.329"),
                        unlock: $filter("translate")("ADDITION.HTML.330")
                    },
                    columns: !0,
                    sortable: !0,
                    filterable: !0
                },
                sort: function(e) {
                    this.dataSource.read()
                },
                columnReorder: function(e) {
                    saveColumnInfoIntoCookie(this.columns, cookie_name)
                },
                columnHide: function(e) {
                    saveColumnInfoIntoCookie(this.columns, cookie_name)
                },
                columnShow: function(e) {
                    saveColumnInfoIntoCookie(this.columns, cookie_name)
                },
                columnLock: function(e) {
                    saveColumnInfoIntoCookie(this.columns, cookie_name)
                },
                columnUnlock: function(e) {
                    saveColumnInfoIntoCookie(this.columns, cookie_name)
                },
                columns: columns
            }
        }
    }
}
]);
