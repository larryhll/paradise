/**
 * Created by hualiang on 16-10-23.
 */
$(function() {
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
                templateUrl : "app/views/product/new_ar_product_detail.html"
            })
            .when("/new_video_product_detail", {
                templateUrl : "app/views/product/new_video_product_detail.html"
            })
            .when("/first_level_category", {
                templateUrl : "app/views/category/first_level_category.html",
                controller : "firstLevelCategoryCtrl"
            })
            .when("/second_level_category", {
                templateUrl : "app/views/category/second_level_category.html"
            })
            .when("/user_admin", {
                templateUrl : "app/views/user/user_admin.html",
                controller : "userAdminCtrl"
            })
            .when("/log_download", {
                templateUrl : "app/views/log/log_download.html"
            })
            .otherwise("/primary_product",{
                templateUrl : "app/views/product/primary_product.html",
                controller : "otherUrlCtrl"
            });
    });
    app.controller("otherUrlCtrl", function () {
        console.log("Otherwise URL contoller...");
    });
    app.controller("updateARProductDetail", function ($routeParams) {
        console.log("Product ID: "+ $routeParams.productID);
    });
    app.controller("primaryProductCtrl", function () {
        console.log("Arrived at primary product page already!!");
    });
    app.controller("productListCtrl", function ($scope){
        $scope.productItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get product list data
        console.log("Invoke product list controller, get product list data from remote here!");
        $scope.productItems = [];
        $scope.productItems[0] = {
            "id": "1",
            "cover": "xxx.jpg",
            "productName": "宝贝英语说",
            "releaseState": "上架",
            "modifyDate": new Date(),
            "recommend": "是",
            "productType": "视频产品",
            "checked" : false
        };
        $scope.productItems[1] = {
            "id": "2",
            "cover": "xxx.jpg",
            "productName": "蛋生世界",
            "releaseState": "下架",
            "modifyDate": new Date(),
            "recommend": "否",
            "productType": "AR产品",
            "checked" : false
        };
        $scope.productItems[2] = {
            "id": "3",
            "cover": "yyy.jpg",
            "productName": "宝贝英语说aaa",
            "releaseState": "上架",
            "modifyDate": new Date(),
            "recommend": "是",
            "productType": "视频产品",
            "checked" : false
        };
        $scope.productItems[3] = {
            "id": "4",
            "cover": "xxx.jpg",
            "productName": "宝贝英语说",
            "releaseState": "上架",
            "modifyDate": new Date(),
            "recommend": "否",
            "productType": "视频产品",
            "checked" : false
        };
        $scope.productItems[4] = {
            "id": "5",
            "cover": "xxx.jpg",
            "productName": "蛋生世界",
            "releaseState": "上架",
            "modifyDate": new Date(),
            "recommend": "否",
            "productType": "AR产品",
            "checked" : false
        };
        $scope.productItems[5] = {
            "id": "6",
            "cover": "yyy.jpg",
            "productName": "宝贝英语说aaa",
            "releaseState": "上架",
            "modifyDate": new Date(),
            "recommend": "是",
            "productType": "AR产品",
            "checked" : false
        };

        //temp product item array for search feature
        if(typeof productItems_temp == 'undefined')
            productItems_temp = [];
        if(productItems_temp.length == 0)
            productItems_temp = $scope.productItems;

        //temp selected product item array for actions
        if(typeof productItems_selected == 'undefined')
            productItems_selected = [];

        //initialize selected product items
        if(typeof productItems_selected == 'undefined')
            productItems_selected = [];

        $scope.checkALLYesNo = function (){
            console.log("Check all flag: " + $scope.checkAll);
            var allCheck = $('input[name=mySelectedProduct]');
            allCheck.prop('checked', $scope.checkAll);
            productItems_selected = [];
            if($scope.checkAll){
                for(item in productItems_temp){
                    productItems_selected.push(productItems_temp[item]);
                }
            }
            console.log("Current selected number: "+productItems_selected.length);
        };

        $scope.checkItem = function(userItem){
            console.log("Check item flag: " + userItem.checked);
            if (userItem.checked){
                productItems_selected.push(userItem);
            }else{
                for(item in productItems_selected){
                    if(productItems_selected[item].id == userItem.id){
                        productItems_selected.splice(item, 1);
                    }
                }
            }
            console.log("Current selected number: "+productItems_selected.length);
            var allCheck = $("#allCheckControl");
            if(productItems_selected.length == 0){
                allCheck.prop('checked', false);
            }else if(productItems_selected.length == productItems_temp.length){
                allCheck.prop('checked', true);
            }
        };

        $scope.searchProductListByFilters = function (){
            console.log("Starting to search product items by filters...");
            console.log("Selected product category: " + $("#product_category").val());
            console.log("Selected product type: " + $("#product_type").val());
            console.log("Selected release state: " + $("#release_state").val());
            console.log("Selected recommendation: " + $("#recommendation").val());

            $scope.productItems = [];
            for(item in productItems_temp){
                if(productItems_temp[item].releaseState == $("#release_state").val()
                    && productItems_temp[item].recommend == $("#recommendation").val()
                    && productItems_temp[item].productType == $("#product_type").val()){
                    $scope.productItems.push(productItems_temp[item]);
                }
            }
        };

        $scope.resetSearch = function (){
            $scope.productItems = productItems_temp;
        };
    })
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
    })
}());

