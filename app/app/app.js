/**
 * Created by Sagar on 06/04/2015.
 */
angular.module('WaitstaffApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: './home.html',
            controller: 'HomeCtrl'
        }).when('/newmeal', {
            templateUrl: './newMeal.html',
            controller: 'NewMealCtrl as ctrl'
        }).when('/myearnings', {
            templateUrl: './myEarnings.html',
            controller: 'MyEarningsCtrl as ctrl'
        })
    })
    .controller('HomeCtrl', function ($scope) {

    })
    .controller('NewMealCtrl', function ($scope, $rootScope, MealService) {
        var vm = this;
        vm.mealDetail = {
            mealPrice: 0,
            taxRate: 0,
            tipPercentage: 0
        };
        vm.customerCharge = {
            subTotal: 0,
            tip: 0,
            total: 0
        };
        vm.submit = function () {
            $rootScope.$broadcast('updateCustomerCharges', vm.mealDetail);
        };
        vm.cancel = function () {
            vm.mealDetail = {};
        };
        $scope.$on('updateCustomerCharges', function (event, data) {
            vm.customerCharge.subTotal = data.mealPrice + ((data.taxRate * data.mealPrice) / 100);
            vm.customerCharge.tip = ((data.tipPercentage * data.mealPrice) / 100);
            vm.customerCharge.total = vm.customerCharge.subTotal + vm.customerCharge.tip;

            //  $rootScope.$broadcast('updateMyEarnings', vm.customerCharge);
            MealService.set(vm.customerCharge);
        });
        $scope.$on('reset', function (event, data) {
            vm.mealDetail = data;
            vm.customerCharge = [];
        });
    })
    .controller('MyEarningsCtrl', function ($scope, $rootScope, MealService) {
        var vm = this;
        vm.myEarnings = {
            tipTotal: 0,
            mealCount: 0,
            avgTipPerMeal: 0
        };
        vm.reset = function () {
            $rootScope.$broadcast('reset', {});
        };


        //vm.myEarnings.tipTotal = MealService.get().reduce(function (prev, current) {
        //    return +(current[1].tip) + prev.tip;
        //}, 0);//(oldData.tipTotal || 0) + data.tip;
        vm.myEarnings.tipTotal = MealService.getTotalTip();
        vm.myEarnings.mealCount = MealService.get().length;
        vm.myEarnings.avgTipPerMeal = MealService.getTotalTip() / vm.myEarnings.mealCount;
        $scope.$on('reset', function (event, data) {
            vm.myEarnings = data;
        });
    }).service('MealService', function () {
        var mealData = [];
        var totalTip = 0;

        function setMealData(data) {
            mealData.push(data);
            totalTip = totalTip + data.tip;
        };
        function getMealData() {
            return mealData;
        };
        function getTotal() {
            return totalTip;
        };

        return {
            set: setMealData,
            get: getMealData,
            getTotalTip: getTotal
        }
    });
