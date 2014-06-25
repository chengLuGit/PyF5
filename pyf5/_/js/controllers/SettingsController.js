// Generated by CoffeeScript 1.7.1
(function() {
  var libs;

  libs = ['angular', '../app', 'services/api'];

  define(libs, function(angular, app) {
    var SettingsController;
    SettingsController = function($log, $rootScope, $scope, api, $location) {
      $scope.project = null;
      $scope.f5Port = $location.port;
      $rootScope.$watch('projects', function(projects) {
        var project, _i, _len;
        for (_i = 0, _len = projects.length; _i < _len; _i++) {
          project = projects[_i];
          if (project.active) {
            return $scope.project = project;
          }
        }
        return $scope.project = null;
      });
      $scope.model = {
        delayOption: null
      };
      $scope.delayOptions = [
        {
          name: '延迟 1 秒',
          value: 1
        }, {
          name: '延迟 2 秒',
          value: 2
        }, {
          name: '延迟 3 秒',
          value: 3
        }, {
          name: '延迟 5 秒',
          value: 5
        }, {
          name: '延迟 7 秒',
          value: 7
        }, {
          name: '延迟 10 秒',
          value: 10
        }, {
          name: '延迟 15 秒',
          value: 15
        }
      ];
      $scope.hoveringMode = null;
      $scope.setHoveringMode = function(mode) {
        return $scope.hoveringMode = mode;
      };
      $scope.promptHostPort = function() {
        var address, host, match, port, _;
        address = prompt('请输入目标服务器名和端口，如服务器在本机可只输入端口\n（例 "127.0.0.1:8080" 或 "8080")');
        match = /([^:]+:)?(\d+)/.exec(address);
        if (!match) {
          return;
        }
        _ = match[0], host = match[1], port = match[2];
        if (host) {
          host = host.replace(':', '');
        }
        if (host == null) {
          host = '127.0.0.1';
        }
        $scope.project.host = host;
        $scope.project.port = parseInt(port);
        api.project.update($scope.project.path, $scope.project);
        return true;
      };
      $scope.switchMode = function(mode) {
        if (mode === $scope.model.mode) {
          return;
        }
        if (mode === 'dynamic') {
          if (!$scope.project.host) {
            if ($scope.promptHostPort()) {
              $scope.project.mode = mode;
            }
          } else {
            $scope.project.mode = mode;
          }
          return api.project.update($scope.project.path, $scope.project);
        } else {
          $scope.project.mode = mode;
          return api.project.update($scope.project.path, $scope.project);
        }
      };
      return $scope.$watch('model.delayOption', function(newValue) {
        return console.log('model.delayOption', newValue);
      });
    };
    return app.controller('SettingsController', SettingsController);
  });

}).call(this);
