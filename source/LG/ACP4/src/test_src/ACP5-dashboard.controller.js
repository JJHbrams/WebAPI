"use strict";
angular.module("acmanagerApp").controller("DashboardCtrl", ["$scope", "$rootScope", "Dashboard", "$log", "$interval", "$timeout", "CONFIG", "UIService", "$filter", function($scope, $rootScope, Dashboard, $log, $interval, $timeout, CONFIG, UIService, $filter) {
  UIService.newGlobalProgress({
    text: $filter("translate")("DUPLICATE.100")
  }), $scope.finedust_standard_country = $rootScope.systems.finedust_standard_country;
  var timeout = "",
    interval = $interval(function() {
      1 == $rootScope.systemLoaded && ($scope.tabs = Dashboard.getTabs(), 1 == $scope.tabs.length ? $scope.tabs[0].selected = !0 : 1 == $scope.tabs[0].selected && 1 == $scope.tabs[1].selected && ($scope.tabs[1].selected = !1), Dashboard.loadWidgetConfig().then(function() {
        Dashboard.getDashBoardData(), Dashboard.startRefreshCurrentOperationStatus(), Dashboard.startRefreshContinuousOperationMachine(), UIService.stopAllGlobalProgress()
      }), timeout = $timeout(function() {
        Dashboard.refreshWidgetDataById(CONFIG.DEFAULT_WIDGET_ID.CURRENT_RUN_STATE)
      }, 1e4), $interval.cancel(interval))
    }, 1e3);
  $scope.addTab = function() {
    Dashboard.addTab()
  }, $scope.$on("$destroy", function() {
    $log.debug("Dashboard $destroy..."), $timeout.cancel(timeout), Dashboard.stopAllTimer()
  })
}]);
