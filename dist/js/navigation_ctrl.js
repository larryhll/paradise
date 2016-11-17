/*! 
* FUNP - v1.0.0 
* © Copyright 2016  Liangli Huang
 */
/**
 * Created by hualiang on 16-10-23.
 */
$(function() {
    var apiPath = "http://localhost:8080/";
    var app = angular.module("app", ["ngRoute"]);
    app.config(function($routeProvider) {
        $routeProvider
            .when("/primary_product", {
                templateUrl : "app/views/product/primary_product.html",
                controller : "primaryProductCtrl"
            })
            .when("/product_list", {
                templateUrl : "app/views/product/product_list.html",
                controller : "productListCtrl"
            })
            .when("/new_ar_product_detail/:productID", {
                templateUrl : "app/views/product/new_ar_product_detail.html",
                controller : "updateARProductDetail"
            })
            .when("/new_ar_product_detail", {
                templateUrl : "app/views/product/new_ar_product_detail.html",
                controller : "newARDetailCtrl"
            })
            .when("/new_video_product_detail", {
                templateUrl : "app/views/product/new_video_product_detail.html",
                controller : "newVideoDetailCtrl"
            })
            .when("/first_level_category", {
                templateUrl : "app/views/category/first_level_category.html",
                controller : "firstLevelCategoryCtrl"
            })
            .when("/second_level_category", {
                templateUrl : "app/views/category/second_level_category.html",
                controller : "secondLevelCategoryCtrl"
            })
            .when("/user_admin", {
                templateUrl : "app/views/user/user_admin.html",
                controller : "userAdminCtrl"
            })
            .when("/log_download", {
                templateUrl : "app/views/log/log_download.html",
                controller : "logDownloadCtrl"
            })
            .otherwise("/primary_product",{
                templateUrl : "app/views/product/primary_product.html",
                controller : "otherUrlCtrl"
            });
    });
    app.controller("primaryProductCtrl", function () {
        console.log("Arrived at primary product page already!!");
    });
    app.controller("productListCtrl", function ($scope, $http){
        $scope.productItems = null;
        $scope.productItems_selected = [];
        $scope.actionSelected = "";

        loading();

        //Get product list data
        console.log("Invoke product list controller, get product list data from remote here!");
        $scope.searchProductListByFilters = function (){
            console.log("Starting to search product items by filters...");
            console.log("Selected product category: " + $("#product_category").val() + " Selected index: " + $("#product_category").prop('selectedIndex'));
            console.log("Selected product type: " + $("#product_type").val() + " Selected index: " + $("#product_type").prop('selectedIndex'));
            console.log("Selected release state: " + $("#release_state").val() + " Selected index: " + $("#release_state").prop('selectedIndex'));
            console.log("Selected recommendation: " + $("#recommendation").val() + " Selected index: " + $("#recommendation").prop('selectedIndex'));

            $scope.productItems = [];

            var searchProductByFilters = {};
            searchProductByFilters.type = $("#product_type").prop('selectedIndex');
            searchProductByFilters.publishState = $("#release_state").prop('selectedIndex');
            searchProductByFilters.productRecommend = $("#recommendation").prop('selectedIndex');
            searchProductByFilters.productCategory = $("#product_category").val();

            $http.post(apiPath + "eden/prods/lists", searchProductByFilters)
                .then(function successCallback(response) {
                    console.log("Get product list by filter successfully.");
                    $scope.productItems = response.data;
                }, function errorCallback(response) {
                    console.log("Failed to get product list by filter");
                });
        };
        $scope.searchProductListByFilters();

        //Initialize selected product item array for actions
        if(typeof $scope.productItems_selected == 'undefined')
            $scope.productItems_selected = [];

        $scope.checkALLYesNo = function (){
            console.log("Check all flag: " + $scope.checkAll);
            var allCheck = $('input[name=mySelectedProduct]');
            allCheck.prop('checked', $scope.checkAll);
            $scope.productItems_selected = [];
            if($scope.checkAll){
                for(item in productItems_temp){
                    $scope.productItems_selected.push(productItems_temp[item]);
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);
        };
        $scope.checkItem = function(userItem){
            console.log("Check item flag: " + userItem.checked);
            if (userItem.checked){
                $scope.productItems_selected.push(userItem);
            }else{
                for(item in $scope.productItems_selected){
                    if($scope.productItems_selected[item].id == userItem.id){
                        $scope.productItems_selected.splice(item, 1);
                    }
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);
            var allCheck = $("#allCheckControl");
            if($scope.productItems_selected.length == 0){
                allCheck.prop('checked', false);
            }else if($scope.productItems_selected.length == productItems_temp.length){
                allCheck.prop('checked', true);
            }
        };

        $scope.resetSearch = function (){
            $scope.productItems = productItems_temp;
        };
        $scope.actionClickModal = function (action){
            console.log("Click buttion: "+action);
            $scope.actionSelected = action;
        };
        $scope.actionConfirm = function (){
            console.log("Confirm action: "+$scope.actionSelected);
        };
    })
    app.controller("updateARProductDetail", function ($routeParams) {
        console.log("Product ID: "+ $routeParams.productID);
    });
    app.controller("newARDetailCtrl", function () {
        console.log("Arrived at new AR product detail page already!!");
    });
    app.controller("newVideoDetailCtrl", function () {
        console.log("Arrived at new video product detail page already!!");
    });
    app.controller("firstLevelCategoryCtrl", function ($scope){
        $scope.firstLevelCategoryItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get first level category list data
        $scope.firstLevelCategoryItems = [];
        $scope.firstLevelCategoryItems[0] = {
            "id": "1",
            "firstCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[1] = {
            "id": "2",
            "firstCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[2] = {
            "id": "3",
            "firstCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[3] = {
            "id": "4",
            "firstCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[4] = {
            "id": "5",
            "firstCategoryName": "语言",
            "modifyDate": new Date()
        };

        //temp first level category items array for search feature
        firstLevelCategoryItems_temp = [];

        $scope.searchByCategory = function (){
            if(firstLevelCategoryItems_temp.length == 0)
                firstLevelCategoryItems_temp = $scope.firstLevelCategoryItems;
            $scope.firstLevelCategoryItems = [];
            var pattern = new RegExp($scope.firstCategorySearch, "i");
            for(item in firstLevelCategoryItems_temp){
                if(pattern.test(firstLevelCategoryItems_temp[item].firstCategoryName)) {
                    $scope.firstLevelCategoryItems.push(firstLevelCategoryItems_temp[item]);
                }
            }
        };

        $scope.deleteItem = function(selectedItem) {
            $scope.selectedFirstLevelCategoryID = selectedItem.id;
            $scope.selectedFirstLevelCategoryItem = selectedItem;
            console.log("Selected id: " + $scope.selectedFirstLevelCategoryID);
        };
    });
    app.controller("secondLevelCategoryCtrl", function ($scope){
        $scope.secondLevelCategoryItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get first level category list data
        $scope.secondLevelCategoryItems = [];
        $scope.secondLevelCategoryItems[0] = {
            "id": "1",
            "firstCategoryName": "语言",
            "secondCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[1] = {
            "id": "2",
            "firstCategoryName": "社会",
            "secondCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[2] = {
            "id": "3",
            "firstCategoryName": "语言",
            "secondCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[3] = {
            "id": "4",
            "firstCategoryName": "社会",
            "secondCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[4] = {
            "id": "5",
            "firstCategoryName": "语言",
            "secondCategoryName": "语言",
            "modifyDate": new Date()
        };

        //temp second level category items array for search feature
        secondLevelCategoryItems_temp = [];

        $scope.searchByCategory = function (){
            console.log("Select first level: "+$scope.firstCategorySelected+" second level: "+$scope.secondCategorySelected);

            if(secondLevelCategoryItems_temp.length == 0)
                secondLevelCategoryItems_temp = $scope.secondLevelCategoryItems;
            $scope.secondLevelCategoryItems = [];

            if (typeof $scope.secondCategorySelected == "undefined")
                $scope.secondCategorySelected = "";
            var patternFirstLevel = new RegExp($scope.firstCategorySelected, "i");
            var patternSecondLevel = new RegExp($scope.secondCategorySelected, "i");
            for(item in secondLevelCategoryItems_temp){
                if(patternFirstLevel.test(secondLevelCategoryItems_temp[item].firstCategoryName)
                    && patternSecondLevel.test(secondLevelCategoryItems_temp[item].secondCategoryName)) {
                    $scope.secondLevelCategoryItems.push(secondLevelCategoryItems_temp[item]);
                }
            }
        };

        $scope.deleteItem = function(selectedItem) {
            $scope.selectedSecondLevelCategoryID = selectedItem.id;
            $scope.selectedSecondLevelCategoryItem = selectedItem;
            console.log("Selected id: " + $scope.selectedSecondLevelCategoryID);
        };
    });
    app.controller("userAdminCtrl", function ($scope){
        $scope.userItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get product list data
        console.log("Invoke user admin controller, get user admin list data here!");
        $scope.userItems = [];
        $scope.userItems[0] = {
            "id": "1",
            "phoneNumber": "13xxxxxxxxx",
            "registerDate": new Date(),
            "babySex": "男",
            "babyBirthday": new Date()
        };
        $scope.userItems[1] = {
            "id": "2",
            "phoneNumber": "137xxxxxxxx",
            "registerDate": new Date(),
            "babySex": "男",
            "babyBirthday": new Date()
        };
        $scope.userItems[2] = {
            "id": "3",
            "phoneNumber": "1366xxxxxxx",
            "registerDate": new Date(),
            "babySex": "女",
            "babyBirthday": new Date()
        };
        $scope.userItems[3] = {
            "id": "4",
            "phoneNumber": "13777xxxxxx",
            "registerDate": new Date(),
            "babySex": "男",
            "babyBirthday": new Date()
        };
        $scope.userItems[4] = {
            "id": "5",
            "phoneNumber": "131111xxxxx",
            "registerDate": new Date(),
            "babySex": "女",
            "babyBirthday": new Date()
        };

        //temp user items array for search feature
        userItems_temp = [];

        $scope.searchUserListByPhone = function (){
            if(userItems_temp.length == 0)
                userItems_temp = $scope.userItems;
            $scope.userItems = [];
            var pattern = new RegExp($scope.searchPhoneNumber, "i");
            for(item in userItems_temp){
                if(pattern.test(userItems_temp[item].phoneNumber)) {
                    $scope.userItems.push(userItems_temp[item]);
                }
            }
        };

        $scope.resetPWD = function(userItem) {
            //alert("用户（" + "手机号码:"+ userItem.phoneNumber+"）重置密码");
            $scope.selectedUserID = userItem.id;
            $scope.selectedUserItem = userItem;
            console.log("Selected user id: " + $scope.selectedUserID);
        };
    })
    app.controller("logDownloadCtrl", function ($scope){
        $scope.logItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get download log list data
        console.log("Invoke log list controller, get download log list data here!");
        $scope.logItems = [];
        $scope.logItems[0] = {
            "id": "1",
            "phoneNumber": "13xxxxxxxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[1] = {
            "id": "2",
            "phoneNumber": "1323425xxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[2] = {
            "id": "3",
            "phoneNumber": "1323666xxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[3] = {
            "id": "4",
            "phoneNumber": "13234256666",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[4] = {
            "id": "5",
            "phoneNumber": "1377425xxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
    });
    app.controller("otherUrlCtrl", function () {
        console.log("Otherwise URL contoller...");
    });

    loading = function(){
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });
    };

}());

