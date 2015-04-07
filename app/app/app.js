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
            controller: 'NewMealCtrl'
        }).when('/myearnings', {
            templateUrl: './myEarnings.html',
            controller: 'MyEarningsCtrl'
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
    .controller('MyEarningsCtrl', function ($scope, $rootScope, MealService,MyEarningsService) {
        var vm = this;
        vm.myEarnings = {
            tipTotal: 0,
            mealCount: 0,
            avgTipPerMeal: 0
        };
        vm.oldEarningsValue={}
        vm.reset = function () {
            $rootScope.$broadcast('reset', {});
        };
        var data = MealService.get();
        var oldData=MyEarningsService.get();
        vm.myEarnings.tipTotal = (oldData.tipTotal || 0) + data.tip;
        vm.myEarnings.mealCount = (oldData.mealCount || 0) + 1;
        vm.myEarnings.avgTipPerMeal = vm.myEarnings.tipTotal / vm.myEarnings.mealCount;
        MyEarningsService.set(vm.myEarnings);
        $scope.$on('reset', function (event, data) {
            vm.myEarnings = data;
        });
    }).service('MealService', function () {
        var mealData = {};

        function setMealData(data) {
            mealData = data;
        };
        function getMealData() {
            return mealData;
        };

        return {
            set: setMealData,
            get: getMealData
        }
    }).service('MyEarningsService',function(){
        var earningsData={};

        function setEarningsData(data){
            earningsData=data;
        };
        function getEarningsData(){
            return earningsData;
        };
        return {
            set: setEarningsData,
            get: getEarningsData
        }

    });