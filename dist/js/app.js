/*! 
* FUNP - v1.0.0 
* © Copyright 2016  Liangli Huang
 */
/**
 * Created by hualiang on 16-10-19.
 */

$(function() {
    var apiPath = "http://118.178.124.197:8080/";
    var  usrInvalid = function(){

        //check if both key userName and timeStamp exist
        if(null === sessionStorage.getItem("userName") || null === sessionStorage.getItem("timeStamp")){
            return true;
        }

        //check login expired or not
        var checkResult = false;
        var now = new Date();
        var expiration = new Date(sessionStorage.getItem("timeStamp"));
        expiration.setMinutes(expiration.getMinutes() + 30);

        // ditch the content if too old
        if (now.getTime() > expiration.getTime()) {
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("timeStamp");
            checkResult = true;
        }

        return checkResult;
    };
    var loading = function(){
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });
    };
    var app = angular.module("app", ["ngRoute"]);
    app.service('productBackAction', function(){
        var productBack = false;
        var type = null;
        var publishState = null;
        var productRecommend = null;
        var productCategory = null;
        return {
            getProductBack:function(){
               return productBack;
            },
            getType:function(){
                return type;
            },
            getPublishState:function(){
                return publishState;
            },
            getProductRecommend:function(){
                return productRecommend;
            },
            getProductCategory:function(){
                return productCategory;
            },
            setProductBack:function(value){
                productBack = value;
            },
            setType:function(value){
                type = value;
            },
            setPublishState:function(value){
                publishState = value;
            },
            setProductRecommend:function(value){
                productRecommend = value;
            },
            setProductCategory:function(value){
                productCategory = value;
            }
        };
    });
    app.directive('fileInput',['$parse',function($parse){
        return {
            restrict: 'A',
            link:function(scope, elm, attrs){
                elm.bind('change', function(){
                    $parse(attrs.fileInput).assign(scope, elm[0].files);
                    scope.$apply();
                    angular.element(this)[0].nextElementSibling.click();
                });
            }
        };
    }]);
    app.config(function($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl : "app/views/common/login.html",
                controller : "loginCtrl"
            })
            .when("/logout", {
                templateUrl : "app/views/common/login.html",
                controller : "logoutCtrl"
            })
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
            .when("/new_video_product_detail/:productID", {
                templateUrl : "app/views/product/new_video_product_detail.html",
                controller : "updateVideoDetailCtrl"
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
            .when("/system_info", {
                templateUrl : "app/views/log/system_info.html",
                controller : "systemInfoCtrl"
            })
            .otherwise("/primary_product",{
                templateUrl : "app/views/product/primary_product.html",
                controller : "otherUrlCtrl"
            });
    });
    app.controller("primaryProductCtrl", function ($scope, $http) {
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        //get product list data
        $scope.productItems = [];
        $scope.layoutUpdate = {"entities": []};

        $http.get(apiPath + "eden/prods/allprods")
            .then(function successCallback(response) {
                console.log("Get all product list successfully.");
                $scope.productItems = response.data;

                //get layout items
                $http.get(apiPath + "eden/membs/unlogin")
                    .then(function successCallback(response) {
                        console.log("Get product layout");
                        angular.forEach(response.data.layoutDOs, function(item){
                            var layoutItem = {};
                            layoutItem.layoutPosition = item.layoutPosition;
                            layoutItem.layoutValue = item.layoutValue;
                            $scope.layoutUpdate.entities.push(layoutItem);

                            //initialize each product layout item
                            angular.forEach($scope.productItems, function(product){
                                if(null !== item.layoutValue && product.id === item.layoutValue){
                                    if(item.layoutPosition == 1){
                                        $scope.mainProductOne = product;
                                        if( null !== $scope.mainProductOne.productCover && typeof $scope.mainProductOne.productCover !== "undefined"){
                                            $("#mainProductOneImage").attr("src", $scope.mainProductOne.productCover);
                                        }
                                    }else if(item.layoutPosition == 2){
                                        $scope.mainProductTwo = product;
                                        if( null !== $scope.mainProductTwo.productCover && typeof $scope.mainProductTwo.productCover !== "undefined"){
                                            $("#mainProductTwoImage").attr("src", $scope.mainProductTwo.productCover);
                                        }
                                    }else if(item.layoutPosition == 3){
                                        $scope.mainProductThree = product;
                                        if( null !== $scope.mainProductThree.productCover && typeof $scope.mainProductThree.productCover !== "undefined"){
                                            $("#mainProductThreeImage").attr("src", $scope.mainProductThree.productCover);
                                        }
                                    }else if(item.layoutPosition == 4){
                                        $scope.mainProductFour = product;
                                        if( null !== $scope.mainProductFour.productCover && typeof $scope.mainProductFour.productCover !== "undefined"){
                                            $("#mainProductFourImage").attr("src", $scope.mainProductFour.productCover);
                                        }
                                    }
                                }
                            });
                        });

                        if($scope.layoutUpdate.entities.length == 0){
                            $scope.layoutUpdate = {"entities": [
                                {"layoutPosition":1,"layoutValue":null},
                                {"layoutPosition":2,"layoutValue":null},
                                {"layoutPosition":3,"layoutValue":null},
                                {"layoutPosition":4,"layoutValue":null}
                            ]};
                        }
                    }, function errorCallback(response) {
                        console.log("Failed to get product layout");
                    });
            }, function errorCallback(response) {
                console.log("Failed to get product list by filter");
            });

        $scope.mainProductOneChange = function(){
            var index = 0;
            angular.forEach($scope.layoutUpdate.entities, function(item){
                if(item.layoutPosition == 1){
                    $scope.layoutUpdate.entities[index].layoutValue = $scope.mainProductOne.id;
                    $("#mainProductOneImage").attr("src", $scope.mainProductOne.productCover);
                }
                index ++;
            });
        };
        $scope.mainProductTwoChange = function(){
            var index = 0;
            angular.forEach($scope.layoutUpdate.entities, function(item){
                if(item.layoutPosition == 2){
                    $scope.layoutUpdate.entities[index].layoutValue = $scope.mainProductTwo.id;
                    $("#mainProductTwoImage").attr("src", $scope.mainProductTwo.productCover);
                }
                index ++;
            });
        };
        $scope.mainProductThreeChange = function(){
            var index = 0;
            angular.forEach($scope.layoutUpdate.entities, function(item){
                if(item.layoutPosition == 3){
                    $scope.layoutUpdate.entities[index].layoutValue = $scope.mainProductThree.id;
                    $("#mainProductThreeImage").attr("src", $scope.mainProductThree.productCover);
                }
                index ++;
            });
        };
        $scope.mainProductFourChange = function(){
            var index = 0;
            angular.forEach($scope.layoutUpdate.entities, function(item){
                if(item.layoutPosition == 4){
                    $scope.layoutUpdate.entities[index].layoutValue = $scope.mainProductFour.id;
                    $("#mainProductFourImage").attr("src", $scope.mainProductFour.productCover);
                }
                index ++;
            });
        };
        $scope.saveLayout = function(){
            $http.post(apiPath + "eden/layout/updates", $scope.layoutUpdate)
                .then(function successCallback(response) {
                    if(response.status == 200){
                        console.log("Update product layout successfully");
                    }else{
                        console.log("Failed to update product layout");
                    }
                    $("#updateLayoutModal").modal('hide');
                }, function errorCallback(response) {
                    console.log("Failed to update product layout");
                    $("#updateLayoutModal").modal('hide');
                });
        };
    });
    app.controller("productListCtrl", function ($scope, $http, productBackAction){
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        //parse product category id to name
        var parseProductCategoryItem = function(){
            angular.forEach($scope.productItems, function(product){
                var productCategoryIDItems = product.productCategory.split(',');

                var productCategoryNameItem = [];
                angular.forEach(productCategoryIDItems, function(item){
                    angular.forEach($scope.productCategoryItems, function(categoryItem){
                        if(item == categoryItem.id){
                            productCategoryNameItem.push(categoryItem.categoryName);
                        }
                    });
                });
                product.productCategoryName = productCategoryNameItem.join(',');
            });
        };

        //Get product list data by filters
        $scope.searchProductListByFilters = function (){
            console.log("Starting to search product items by filters...");
            console.log("Selected product category: " + $scope.productCategory + " Selected index: " + $("#product_category").prop('selectedIndex'));
            console.log("Selected product type: " + $scope.productType + " Selected index: " + $("#product_type").prop('selectedIndex'));
            console.log("Selected publish state: " + $scope.publishState + " Selected index: " + $("#publish_state").prop('selectedIndex'));
            console.log("Selected recommendation: " + $scope.recommendation + " Selected index: " + $("#recommendation").prop('selectedIndex'));

            var searchProductByFilters = {};
            searchProductByFilters.type = $("#product_type").prop('selectedIndex');
            searchProductByFilters.publishState = $("#publish_state").prop('selectedIndex');
            searchProductByFilters.productRecommend = $("#recommendation").prop('selectedIndex');
            searchProductByFilters.productCategory = $scope.productCategory.id;

            $http.post(apiPath + "eden/prods/lists", searchProductByFilters)
                .then(function successCallback(response) {
                    console.log("Get product list by filter successfully.");
                    $scope.productItems = response.data;
                    parseProductCategoryItem();
                    $scope.productItems_copy = $scope.productItems;
                    $scope.productItems_selected = [];
                }, function errorCallback(response) {
                    console.log("Failed to get product list by filter");
                });
        };

        //reset search to get all products
        $scope.cleanSearchProductListByFilters = function(){
            $http.get(apiPath + "eden/prods/allprods")
                .then(function successCallback(response) {
                    console.log("Get all product list successfully.");
                    $scope.productItems = response.data;
                    parseProductCategoryItem();
                    $scope.productItems_copy = $scope.productItems;
                    $scope.productItems_selected = [];
                }, function errorCallback(response) {
                    console.log("Failed to get all product list");
                });
        };

        var initialize = function(){
            var searchProductByFilters = {};
            if(productBackAction.getProductBack()){
                searchProductByFilters.type = productBackAction.getType();
                searchProductByFilters.publishState = productBackAction.getPublishState();
                searchProductByFilters.productRecommend = productBackAction.getProductRecommend();
                searchProductByFilters.productCategory = $scope.productCategoryList[0].id;

                $scope.productCategory = $scope.productCategoryList[0];
                $scope.publishState = productBackAction.getPublishState()==0 ? "上架":"下架";
                $scope.productType = productBackAction.getType()==0 ? "视频产品":"AR产品";
                $scope.recommendation = productBackAction.getProductRecommend()==0 ? "是":"否";

                productBackAction.setProductBack(false);

                $http.post(apiPath + "eden/prods/lists", searchProductByFilters)
                    .then(function successCallback(response) {
                        console.log("Get product list by filter successfully.");
                        $scope.productItems = response.data;
                        parseProductCategoryItem();
                        $scope.productItems_copy = $scope.productItems;
                        $scope.productItems_selected = [];
                    }, function errorCallback(response) {
                        console.log("Failed to get product list by filter");
                    });
            }else{
                //default initialization product list page by all show
                $scope.cleanSearchProductListByFilters();
            }
        };

        //click top check item - all yes or no
        $scope.checkALLYesNo = function (){
            console.log("Check all flag: " + $scope.checkAll);
            var allCheck = $('input[name=mySelectedProduct]');
            allCheck.prop('checked', $scope.checkAll);
            $scope.productItems_selected = [];
            if($scope.checkAll){
                for(var item in $scope.productItems_copy){
                    $scope.productItems_selected.push($scope.productItems_copy[item]);
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);
        };
        //click check item for each line and update top check status if need
        $scope.checkItem = function(userItem){
            console.log("Check item flag: " + userItem.checked);
            if (userItem.checked){
                $scope.productItems_selected.push(userItem);
            }else{
                for(var item in $scope.productItems_selected){
                    if($scope.productItems_selected[item].id == userItem.id){
                        $scope.productItems_selected.splice(item, 1);
                    }
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);

            //update all check field status
            var allCheck = $("#allCheckControl");
            if($scope.productItems_selected.length == 0){
                allCheck.prop('checked', false);
            }else if($scope.productItems_selected.length == $scope.productItems_copy.length){
                allCheck.prop('checked', true);
            }
        };

        //open modal dialog to recommend/recommendCancel/publish/un-publish
        $scope.actionClickModal = function (action){
            console.log("Click button: "+action);
            $scope.actionSelected = action;
        };
        //confirm yes or no in modal dialog
        $scope.actionConfirm = function (){
            console.log("Confirm action: "+$scope.actionSelected);
            angular.forEach($scope.productItems_selected, function(item){
                $http.get(apiPath + "eden/prods/opes/" + $scope.actionSelected + "/" + item.id)
                    .then(function successCallback(response) {
                        console.log($scope.actionSelected + " product: " + item.name + " successfully");
                        $(confirmDiag).modal('hide');
                        var allCheck = $("#allCheckControl");
                        allCheck.prop('checked', false);
                        $scope.searchProductListByFilters();
                    }, function errorCallback(response) {
                        console.log("Failed to " + $scope.actionSelected + " product: " + item.name);
                    });
            });
        };

        $scope.productItems = null;
        $scope.productItems_selected = [];
        $scope.actionSelected = "";
        $scope.productItems_copy = [];
        //wait for loading product list
        loading();
        //initialize product item selection
        $scope.productCategoryItems = [];
        $scope.productCategoryList = [{"id":0,"name":"全部"}];
        $scope.productCategory = $scope.productCategoryList[0];
        $scope.publishState = "上架";
        $scope.productType = "视频产品";
        $scope.recommendation = "是";
        $http.get(apiPath + "eden/cates/list/levelone")
            .then(function successCallback(response) {
                console.log("Get all product category list successfully");
                $scope.productCategoryItems = response.data;
                for(var item in response.data){
                    var cateItem = {};
                    cateItem.id = response.data[item].id;
                    cateItem.name = response.data[item].categoryName;
                    $scope.productCategoryList.push(cateItem);
                }
                //initialize product list with product detail page back or not
                initialize();
            }, function errorCallback(response) {
                console.log("Failed to get product category list");
            });
    });
    app.controller("updateARProductDetail", function ($scope, $http, $routeParams, productBackAction) {
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        console.log("Product ID: "+ $routeParams.productID);
        $scope.firstScreenShot = "";
        $scope.secondScreenShot = "";
        $scope.thirdScreenShot = "";
        $scope.productCategory = [];

        //get product item with id
        var getProductItem = function(){
            $http.get(apiPath + "eden/prods/" + $routeParams.productID)
                .then(function successCallback(response) {
                    console.log("Success to get AR product item: " + $routeParams.productID);
                    $scope.productInfo = response.data;
                    //parse images list
                    var imageArr = response.data.productImages.split(',');
                    $scope.firstScreenShot = (typeof imageArr[0] == "undefined" ? "" : imageArr[0]);
                    $scope.secondScreenShot = (typeof imageArr[1] == "undefined" ? "" : imageArr[1]);
                    $scope.thirdScreenShot = (typeof imageArr[2] == "undefined" ? "" : imageArr[2]);

                    var mediaTypeArr = response.data.media.split(',');
                    (mediaTypeArr.indexOf("电子书")>=0) ? $scope.mediaTypeElectricBook = true : $scope.mediaTypeElectricBook = false;
                    (mediaTypeArr.indexOf("书籍")>=0) ? $scope.mediaTypeBook = true : $scope.mediaTypeBook = false;
                    (mediaTypeArr.indexOf("卡牌")>=0) ? $scope.mediaTypeCard = true : $scope.mediaTypeCard = false;
                    (mediaTypeArr.indexOf("教具")>=0) ? $scope.mediaTypeTeachTool = true : $scope.mediaTypeTeachTool = false;
                    (mediaTypeArr.indexOf("益智玩具")>=0) ? $scope.mediaTypeIntelligentToy = true : $scope.mediaTypeIntelligentToy = false;
                    (mediaTypeArr.indexOf("其它")>=0) ? $scope.mediaTypeOther = true : $scope.mediaTypeOther = false;

                    $scope.productInfo.productAppEnabled = $scope.productInfo.productAppEnabled == 0 ? true : false;
                    $scope.productInfo.productPlayEnabled = $scope.productInfo.productPlayEnabled == 0 ? true : false;
                    $scope.productInfo.productTrialEnabled = $scope.productInfo.productTrialEnabled == 0 ? true : false;

                    var matchAgeItems = response.data.productMatchScope.split(',');
                    (matchAgeItems.indexOf("3")>=0) ? $scope.threeYearsOld = true : $scope.threeYearsOld = false;
                    (matchAgeItems.indexOf("4")>=0) ? $scope.fourYearsOld = true : $scope.fourYearsOld = false;
                    (matchAgeItems.indexOf("5")>=0) ? $scope.fiveYearsOld = true : $scope.fiveYearsOld = false;
                    (matchAgeItems.indexOf("6")>=0) ? $scope.sixYearsOld = true : $scope.sixYearsOld = false;
                    (matchAgeItems.indexOf("7")>=0) ? $scope.sevenYearsOld = true : $scope.sevenYearsOld = false;

                    var productCategoryNameItems = response.data.productCategory.split(',');
                    $scope.productCategorySelected = [];
                    angular.forEach($scope.productCategoryItems, function(item){
                        angular.forEach(productCategoryNameItems, function(selectedItem){
                            if(selectedItem == item.id){
                                $scope.productCategorySelected.push(item);
                            }
                        });
                    });
                    $scope.productCategory = $scope.productCategorySelected;
                }, function errorCallback(response) {
                    console.log("Failed to get AR product item");
                });
        };
        //change level two category list with level one changed
        var initialize = function(){
            //get product category
            $http.get(apiPath + "eden/cates/list/levelone")
                .then(function successCallback(response) {
                    $scope.productCategoryItems = response.data;
                    if (response.data.length > 0){
                        $scope.productCategory.push(response.data[0]);
                        console.log("Success to get all product category");
                    }
                    getProductItem();
                }, function errorCallback(response) {
                    console.log("Failed to get all product category");
                });
        };
        //initialize product page
        initialize();

        //update image file
        var updateImage = function(files, imageDisplayID, imageType){
            console.log("Selected file number: " + files.length);
            var fd = new FormData();
            fd.append("root", files[0]);
            $http.post(apiPath + "eden/prods/upload",fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(
                function successCallback(response) {
                    if(response.status === 200){
                        console.log("Upload image file successfully");
                        $("#"+imageDisplayID).attr("src", response.data.urls);
                        if(imageType == "description"){
                            $scope.productInfo.productDesc = response.data.urls;
                        }else if(imageType == "cover"){
                            $scope.productInfo.productCover = response.data.urls;
                        }else if(imageType == "firstScreen"){
                            $scope.firstScreenShot = response.data.urls;
                        }else if(imageType == "secondScreen"){
                            $scope.secondScreenShot = response.data.urls;
                        }else if(imageType == "thirdScreen"){
                            $scope.thirdScreenShot = response.data.urls;
                        }else if(imageType == "trial"){
                            $scope.productInfo.productTrialAddr = response.data.urls;
                        }else if(imageType == "QRCode"){
                            $scope.productInfo.productMicroStoreByecodeAddr = response.data.urls;
                        }
                    }else{
                        console.log("Failed to upload image file");
                    }
                },
                function errorCallback(response) {
                    console.log("Failed to upload image file");
                });
        };
        //update product description image
        $scope.updateProductDescriptionImage = function(){
            updateImage($scope.productDescriptionImageFile, "productDescImage","description");
        };
        $scope.updateProductDescriptionImageStart = function(){
            $(productDescFileSelect).click();
            console.log("Click product description file selection dialog");
        };
        //update product cover image
        $scope.updateProductCoverImage = function(){
            updateImage($scope.productCoverImageFile, "productCoverImage","cover");
        };
        $scope.updateProductCoverImageStart = function(){
            $(productCoverFileSelect).click();
            console.log("Click product cover file selection dialog");
        };
        //update product screen shot images
        $scope.updateFirstScreenShotImage = function(){
            updateImage($scope.firstScreenShotFile, "productScreenShotFirstImage","firstScreen");
        };
        $scope.updateFirstScreenShotImageStart = function(){
            $("#productScreenShotFirstFileSelect").click();
            console.log("Click the first product screen shot file selection dialog");
        };
        $scope.updateSecondScreenShotImage = function(){
            updateImage($scope.secondScreenShotFile, "productScreenShotSecondImage","secondScreen");
        };
        $scope.updateSecondScreenShotImageStart = function(){
            $("#productScreenShotSecondFileSelect").click();
            console.log("Click the second product screen shot file selection dialog");
        };
        $scope.updateThirdScreenShotImage = function(){
            updateImage($scope.thirdScreenShotFile, "productScreenShotThirdImage","thirdScreen");
        };
        $scope.updateThirdScreenShotImageStart = function(){
            $("#productScreenShotThirdFileSelect").click();
            console.log("Click the third product screen shot file selection dialog");
        };
        //update trial image
        $scope.updateProductTrialImage = function(){
            updateImage($scope.productTrialFile, "productTrialImage","trial");
        };
        $scope.updateProductTrialImageStart = function(){
            $("#productTrialFileSelect").click();
            console.log("Click product trial file selection dialog");
        };
        //update QR code image
        $scope.updateProductQRImage = function(){
            updateImage($scope.productQRFile, "productQRImage","QRCode");
        };
        $scope.updateProductQRImageStart = function(){
            $("#productQRFileSelect").click();
            console.log("Click product QR code image file selection dialog");
        };

        //update APK file
        var updateAPKFile = function(files){
            console.log("Selected file number: " + files.length);
            var fd = new FormData();
            fd.append("root", files[0]);
            $http.post(apiPath + "eden/prods/upload",fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(
                function successCallback(response) {
                    if(response.status === 200){
                        console.log("Upload APK file successfully");
                        $scope.productInfo.productApkDownUrl = response.data.urls;
                    }else{
                        console.log("Failed to upload APK file");
                    }
                },
                function errorCallback(response) {
                    console.log("Failed to upload APK file");
                });
        };
        $scope.updateAPKFile = function(){
            updateAPKFile($scope.apkFile);
        };
        $scope.updateAPKFileStart = function(){
            $("#apkFileSelect").click();
            console.log("Click APK file selection dialog");
        };

        //submit product info
        $scope.submitProductInfo = function(){
            //get product item info from input
            $scope.productInfo.productCategory = $scope.productCategory.map(function(item){return item.id}).join(',')+",";

            var mediaItems = [];
            mediaItems.push($scope.mediaTypeElectricBook ? "电子书" : "");
            mediaItems.push($scope.mediaTypeBook ? "书籍" : "");
            mediaItems.push($scope.mediaTypeCard ? "卡牌" : "");
            mediaItems.push($scope.mediaTypeTeachTool ? "教具" : "");
            mediaItems.push($scope.mediaTypeIntelligentToy ? "益智玩具" : "");
            mediaItems.push($scope.mediaTypeOther ? "其它" : "");
            $scope.productInfo.media = mediaItems.map(function(item){if(item != ""){return item;}}).join(',');

            var matchAgeItems = [];
            matchAgeItems.push($scope.threeYearsOld ? "3" : "");
            matchAgeItems.push($scope.fourYearsOld ? "4" : "");
            matchAgeItems.push($scope.fiveYearsOld ? "5" : "");
            matchAgeItems.push($scope.sixYearsOld ? "6" : "");
            matchAgeItems.push($scope.sevenYearsOld ? "7" : "");
            $scope.productInfo.productMatchScope = matchAgeItems.map(function(item){if(item != ""){return item;}}).join(',');

            var productScreenshotImage = [];
            if($scope.firstScreenShot !== ""){
                productScreenshotImage.push($scope.firstScreenShot);
            }
            if($scope.secondScreenShot !== ""){
                productScreenshotImage.push($scope.secondScreenShot);
            }
            if($scope.thirdScreenShot !== ""){
                productScreenshotImage.push($scope.thirdScreenShot);
            }
            $scope.productInfo.productImages = productScreenshotImage.map(function(item){return item}).join(',');
            $scope.productInfo.productModifyDate = new Date();
            $scope.productInfo.productAppEnabled = $scope.productInfo.productAppEnabled ? 0 : 1;
            $scope.productInfo.productPlayEnabled = $scope.productInfo.productPlayEnabled ? 0 : 1;
            $scope.productInfo.productTrialEnabled = $scope.productInfo.productTrialEnabled ? 0 : 1;

            $http.post(apiPath + "eden/prods/update", $scope.productInfo)
                .then(function successCallback(response) {
                    if(response.status === 200){
                        console.log("Update AR product item successfully");
                        productBackAction.setProductBack(true);
                        productBackAction.setType($scope.productInfo.type);
                        productBackAction.setPublishState($scope.productInfo.publishState);
                        productBackAction.setProductRecommend($scope.productInfo.productRecommend);
                        productBackAction.setProductCategory("全部");
                        window.location.href = "#product_list/";
                    }else{
                        alert("更新AR产品失败！返回码："+response.status);
                        console.log("Failed to update AR product item ");
                    }
                }, function errorCallback(response) {
                    alert("更新AR产品失败！返回码："+response.status);
                    console.log("Failed to update AR product item ");
                });
        };
    });
    app.controller("newARDetailCtrl", function ($scope, $http, productBackAction) {
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        //new product info
        $scope.productInfo = {};
        $scope.firstScreenShot = ""
        $scope.secondScreenShot = "";
        $scope.thirdScreenShot = "";
        $scope.mediaTypeElectricBook = true;
        $scope.threeYearsOld = true;
        $scope.fourYearsOld = true;
        $scope.productCategory = [];

            //get product category list
        $http.get(apiPath + "eden/cates/list/levelone")
            .then(function successCallback(response) {
                $scope.productCategoryItems = response.data;
                if (response.data.length > 0){
                    $scope.productCategory.push(response.data[0]);
                    console.log("Success to get all product category");
                }
            }, function errorCallback(response) {
                console.log("Failed to get all product category");
            });

        //update image file
        var updateImage = function(files, imageDisplayID, imageType){
            console.log("Selected file number: " + files.length);
            var fd = new FormData();
            fd.append("root", files[0]);
            $http.post(apiPath + "eden/prods/upload",fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(
                function successCallback(response) {
                    if(response.status === 200){
                        console.log("Upload image file successfully");
                        $("#"+imageDisplayID).attr("src", response.data.urls);
                        if(imageType == "description"){
                            $scope.productInfo.productDesc = response.data.urls;
                        }else if(imageType == "cover"){
                            $scope.productInfo.productCover = response.data.urls;
                        }else if(imageType == "firstScreen"){
                            $scope.firstScreenShot = response.data.urls;
                        }else if(imageType == "secondScreen"){
                            $scope.secondScreenShot = response.data.urls;
                        }else if(imageType == "thirdScreen"){
                            $scope.thirdScreenShot = response.data.urls;
                        }else if(imageType == "trial"){
                            $scope.productInfo.productTrialAddr = response.data.urls;
                        }else if(imageType == "QRCode"){
                            $scope.productInfo.productMicroStoreByecodeAddr = response.data.urls;
                        }
                    }else{
                        console.log("Failed to upload image file");
                    }
                },
                function errorCallback(response) {
                    console.log("Failed to upload image file");
                });
        };
        //update product description image
        $scope.updateProductDescriptionImage = function(){
            updateImage($scope.productDescriptionImageFile, "productDescImage","description");
        };
        $scope.updateProductDescriptionImageStart = function(){
            $(productDescFileSelect).click();
            console.log("Click product description file selection dialog");
        };
        //update product cover image
        $scope.updateProductCoverImage = function(){
            updateImage($scope.productCoverImageFile, "productCoverImage","cover");
        };
        $scope.updateProductCoverImageStart = function(){
            $(productCoverFileSelect).click();
            console.log("Click product cover file selection dialog");
        };
        //update product screen shot images
        $scope.updateFirstScreenShotImage = function(){
            updateImage($scope.firstScreenShotFile, "productScreenShotFirstImage","firstScreen");
        };
        $scope.updateFirstScreenShotImageStart = function(){
            $("#productScreenShotFirstFileSelect").click();
            console.log("Click the first product screen shot file selection dialog");
        };
        $scope.updateSecondScreenShotImage = function(){
            updateImage($scope.secondScreenShotFile, "productScreenShotSecondImage","secondScreen");
        };
        $scope.updateSecondScreenShotImageStart = function(){
            $("#productScreenShotSecondFileSelect").click();
            console.log("Click the second product screen shot file selection dialog");
        };
        $scope.updateThirdScreenShotImage = function(){
            updateImage($scope.thirdScreenShotFile, "productScreenShotThirdImage","thirdScreen");
        };
        $scope.updateThirdScreenShotImageStart = function(){
            $("#productScreenShotThirdFileSelect").click();
            console.log("Click the third product screen shot file selection dialog");
        };
        //update trial image
        $scope.updateProductTrialImage = function(){
            updateImage($scope.productTrialFile, "productTrialImage","trial");
        };
        $scope.updateProductTrialImageStart = function(){
            $("#productTrialFileSelect").click();
            console.log("Click product trial file selection dialog");
        };
        //update QR code image
        $scope.updateProductQRImage = function(){
            updateImage($scope.productQRFile, "productQRImage","QRCode");
        };
        $scope.updateProductQRImageStart = function(){
            $("#productQRFileSelect").click();
            console.log("Click product QR code image file selection dialog");
        };

        //update APK file
        var updateAPKFile = function(files){
            console.log("Selected file number: " + files.length);
            var fd = new FormData();
            fd.append("root", files[0]);
            $http.post(apiPath + "eden/prods/upload",fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(
                function successCallback(response) {
                    if(response.status === 200){
                        console.log("Upload APK file successfully");
                        $scope.productInfo.productApkDownUrl = response.data.urls;
                    }else{
                        console.log("Failed to upload APK file");
                    }
                },
                function errorCallback(response) {
                    console.log("Failed to upload APK file");
                });
        };
        $scope.updateAPKFile = function(){
            updateAPKFile($scope.apkFile);
        };
        $scope.updateAPKFileStart = function(){
            $("#apkFileSelect").click();
            console.log("Click APK file selection dialog");
        };

        //submit product info
        $scope.submitProductInfo = function(){
            //get product item info from input
            $scope.productInfo.type = 1;
            $scope.productInfo.publishState = 1;
            $scope.productInfo.productRecommend = 1;
            $scope.productInfo.productCategory = $scope.productCategory.map(function(item){return item.id}).join(',')+",";

            var mediaItems = [];
            mediaItems.push($scope.mediaTypeElectricBook ? "电子书" : "");
            mediaItems.push($scope.mediaTypeBook ? "书籍" : "");
            mediaItems.push($scope.mediaTypeCard ? "卡牌" : "");
            mediaItems.push($scope.mediaTypeTeachTool ? "教具" : "");
            mediaItems.push($scope.mediaTypeIntelligentToy ? "益智玩具" : "");
            mediaItems.push($scope.mediaTypeOther ? "其它" : "");
            $scope.productInfo.media = mediaItems.map(function(item){if(item != ""){return item;}}).join(',');

            var matchAgeItems = [];
            matchAgeItems.push($scope.threeYearsOld ? "3" : "");
            matchAgeItems.push($scope.fourYearsOld ? "4" : "");
            matchAgeItems.push($scope.fiveYearsOld ? "5" : "");
            matchAgeItems.push($scope.sixYearsOld ? "6" : "");
            matchAgeItems.push($scope.sevenYearsOld ? "7" : "");
            $scope.productInfo.productMatchScope = matchAgeItems.map(function(item){if(item != ""){return item;}}).join(',');

            $scope.productInfo.productImages = "";
            var productScreenshotImage = [];
            if($scope.firstScreenShot !== ""){
                productScreenshotImage.push($scope.firstScreenShot);
            }
            if($scope.secondScreenShot !== ""){
                productScreenshotImage.push($scope.secondScreenShot);
            }
            if($scope.thirdScreenShot !== ""){
                productScreenshotImage.push($scope.thirdScreenShot);
            }
            $scope.productInfo.productImages = productScreenshotImage.map(function(item){return item}).join(',');
            $scope.productInfo.productUploadDate = new Date();
            $scope.productInfo.productModifyDate = new Date();
            $scope.productInfo.productAppEnabled = $scope.productInfo.productAppEnabled ? 0 : 1;
            $scope.productInfo.productPlayEnabled = $scope.productInfo.productPlayEnabled ? 0 : 1;
            $scope.productInfo.productTrialEnabled = $scope.productInfo.productTrialEnabled ? 0 : 1;

            $http.post(apiPath + "eden/prods/add", $scope.productInfo)
                .then(function successCallback(response) {
                    if(response.status === 200){
                        console.log("Create AR product item successfully");
                        productBackAction.setProductBack(true);
                        productBackAction.setType($scope.productInfo.type);
                        productBackAction.setPublishState($scope.productInfo.publishState);
                        productBackAction.setProductRecommend($scope.productInfo.productRecommend);
                        productBackAction.setProductCategory("全部");
                        window.location.href = "#product_list/";
                    }else{
                        alert("创建AR产品失败！返回码："+response.status);
                        console.log("Failed to create AR product item ");
                    }
                }, function errorCallback(response) {
                    alert("创建AR产品失败！返回码："+response.status);
                    console.log("Failed to create AR product item ");
                });
        };
    });
    app.controller("updateVideoDetailCtrl", function($scope, $http, $routeParams, productBackAction){
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        $scope.productCategory = [];

        //get product item with id
        var getProductItem = function(){
            $http.get(apiPath + "eden/prods/" + $routeParams.productID)
                .then(function successCallback(response) {
                    $scope.productInfo = response.data;

                    var mediaTypeArr = response.data.media.split(',');
                    (mediaTypeArr.indexOf("电子书")>=0) ? $scope.mediaTypeElectricBook = true : $scope.mediaTypeElectricBook = false;
                    (mediaTypeArr.indexOf("书籍")>=0) ? $scope.mediaTypeBook = true : $scope.mediaTypeBook = false;
                    (mediaTypeArr.indexOf("卡牌")>=0) ? $scope.mediaTypeCard = true : $scope.mediaTypeCard = false;
                    (mediaTypeArr.indexOf("教具")>=0) ? $scope.mediaTypeTeachTool = true : $scope.mediaTypeTeachTool = false;
                    (mediaTypeArr.indexOf("益智玩具")>=0) ? $scope.mediaTypeIntelligentToy = true : $scope.mediaTypeIntelligentToy = false;
                    (mediaTypeArr.indexOf("其它")>=0) ? $scope.mediaTypeOther = true : $scope.mediaTypeOther = false;

                    var matchAgeItems = response.data.productMatchScope.split(',');
                    (matchAgeItems.indexOf("3")>=0) ? $scope.threeYearsOld = true : $scope.threeYearsOld = false;
                    (matchAgeItems.indexOf("4")>=0) ? $scope.fourYearsOld = true : $scope.fourYearsOld = false;
                    (matchAgeItems.indexOf("5")>=0) ? $scope.fiveYearsOld = true : $scope.fiveYearsOld = false;
                    (matchAgeItems.indexOf("6")>=0) ? $scope.sixYearsOld = true : $scope.sixYearsOld = false;
                    (matchAgeItems.indexOf("7")>=0) ? $scope.sevenYearsOld = true : $scope.sevenYearsOld = false;

                    var productCategoryNameItems = response.data.productCategory.split(',');
                    $scope.productCategorySelected = [];
                    angular.forEach($scope.productCategoryItems, function(item){
                        angular.forEach(productCategoryNameItems, function(selectedItem){
                            if(selectedItem == item.id){
                                $scope.productCategorySelected.push(item);
                            }
                        });
                    });
                    $scope.productCategory = $scope.productCategorySelected;
                }, function errorCallback(response) {
                    console.log("Failed to get AR product item");
                });
        };

        //initialize product info fields
        var initialize = function(){
            //get all level two category list
            $http.get(apiPath + "eden/cates/list/levelone")
                .then(function successCallback(response) {
                    $scope.productCategoryItems = response.data;
                    if (response.data.length > 0){
                        $scope.productCategory.push(response.data[0]);
                        console.log("Success to get all product category");
                    }
                    getProductItem();
                }, function errorCallback(response) {
                    console.log("Failed to get all product category");
                });
        };
        //call function to initialize product page
        initialize();

        //update image file
        var updateImage = function(files, imageDisplayID, imageType){
            console.log("Selected file number: " + files.length);
            var fd = new FormData();
            fd.append("root", files[0]);
            $http.post(apiPath + "eden/prods/upload",fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(
                function successCallback(response) {
                    if(response.status === 200){
                        console.log("Upload image file successfully");
                        $("#"+imageDisplayID).attr("src", response.data.urls);
                        if(imageType == "description"){
                            $scope.productInfo.productDesc = response.data.urls;
                        }else if(imageType == "cover"){
                            $scope.productInfo.productCover = response.data.urls;
                        }
                    }else{
                        console.log("Failed to upload image file");
                    }
                },
                function errorCallback(response) {
                    console.log("Failed to upload image file");
                });
        };
        //update product description image
        $scope.updateProductDescriptionImage = function(){
            updateImage($scope.productDescriptionImageFile, "productDescImage","description");
        };
        $scope.updateProductDescriptionImageStart = function(){
            $(productDescFileSelect).click();
            console.log("Click product description file selection dialog");
        };
        //update product cover image
        $scope.updateProductCoverImage = function(){
            updateImage($scope.productCoverImageFile, "productCoverImage","cover");
        };
        $scope.updateProductCoverImageStart = function(){
            $(productCoverFileSelect).click();
            console.log("Click product cover file selection dialog");
        };

        //create and delete video item
        $scope.selectVideoItem = function(item){
            $scope.videoItemSelected = item;
        };
        $scope.delVideoItem = function(){
            for(var item in $scope.productInfo.videoDOs){
                var index = $scope.productInfo.videoDOs.indexOf($scope.videoItemSelected);
                if(index > -1){
                    $scope.productInfo.videoDOs.splice(index, 1);
                    console.log("Delete video item index: "+index);
                }
            }
            $(deleteVideoItemModal).modal('hide');
        };
        $scope.newVideoItem = function(){
            var videoItem = {};
            videoItem.videoName = $scope.videoName;
            videoItem.videoUrl = $scope.videoUrl;

            $scope.productInfo.videoDOs.push(videoItem);
            $(newVideoItemModal).modal('hide');
        };

        //submit product info
        $scope.submitProductInfo = function(){
            $scope.productInfo.productModifyDate = new Date();
            $scope.productInfo.productCategory = $scope.productCategory.map(function(item){return item.id}).join(',')+",";

            var mediaItems = [];
            mediaItems.push($scope.mediaTypeElectricBook ? "电子书" : "");
            mediaItems.push($scope.mediaTypeBook ? "书籍" : "");
            mediaItems.push($scope.mediaTypeCard ? "卡牌" : "");
            mediaItems.push($scope.mediaTypeTeachTool ? "教具" : "");
            mediaItems.push($scope.mediaTypeIntelligentToy ? "益智玩具" : "");
            mediaItems.push($scope.mediaTypeOther ? "其它" : "");
            $scope.productInfo.media = mediaItems.map(function(item){if(item != ""){return item;}}).join(',');

            var matchAgeItems = [];
            matchAgeItems.push($scope.threeYearsOld ? "3" : "");
            matchAgeItems.push($scope.fourYearsOld ? "4" : "");
            matchAgeItems.push($scope.fiveYearsOld ? "5" : "");
            matchAgeItems.push($scope.sixYearsOld ? "6" : "");
            matchAgeItems.push($scope.sevenYearsOld ? "7" : "");
            $scope.productInfo.productMatchScope = matchAgeItems.map(function(item){if(item != ""){return item;}}).join(',');

            $http.post(apiPath + "eden/prods/update", $scope.productInfo)
                .then(function successCallback(response) {
                    if(response.status === 200){
                        console.log("Update video product item successfully, go back to product list page...");
                        productBackAction.setProductBack(true);
                        productBackAction.setType($scope.productInfo.type);
                        productBackAction.setPublishState($scope.productInfo.publishState);
                        productBackAction.setProductRecommend($scope.productInfo.productRecommend);
                        productBackAction.setProductCategory("全部");
                        window.location.href = "#product_list/";
                    }else{
                        alert("更新视频产品失败！返回码："+response.status);
                        console.log("Failed to update video product item");
                    }
                }, function errorCallback(response) {
                    alert("更新视频产品失败！返回码："+response.status);
                    console.log("Failed to update video product item ");
                });
        };
    });
    app.controller("newVideoDetailCtrl", function ($scope, $http, productBackAction) {
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        //new product info
        $scope.productInfo = {};
        $scope.productInfo.videoDOs = [];
        $scope.mediaTypeElectricBook = true;
        $scope.threeYearsOld = true;
        $scope.fourYearsOld = true;
        $scope.productCategory = [];

        //get product category list
        $http.get(apiPath + "eden/cates/list/levelone")
            .then(function successCallback(response) {
                $scope.productCategoryItems = response.data;
                if (response.data.length > 0){
                    $scope.productCategory.push(response.data[0]);
                    console.log("Success to get all product category");
                }
            }, function errorCallback(response) {
                console.log("Failed to get all product category");
            });

        //update image file
        var updateImage = function(files, imageDisplayID, imageType){
            console.log("Selected file number: " + files.length);
            var fd = new FormData();
            fd.append("root", files[0]);
            $http.post(apiPath + "eden/prods/upload",fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(
                function successCallback(response) {
                    if(response.status === 200){
                        console.log("Upload image file successfully");
                        $("#"+imageDisplayID).attr("src", response.data.urls);
                        if(imageType == "description"){
                            $scope.productInfo.productDesc = response.data.urls;
                        }else if(imageType == "cover"){
                            $scope.productInfo.productCover = response.data.urls;
                        }
                    }else{
                        console.log("Failed to upload image file");
                    }
                },
                function errorCallback(response) {
                    console.log("Failed to upload image file");
                });
        };
        //update product description image
        $scope.updateProductDescriptionImage = function(){
            updateImage($scope.productDescriptionImageFile, "productDescImage","description");
        };
        $scope.updateProductDescriptionImageStart = function(){
            $(productDescFileSelect).click();
            console.log("Click product description file selection dialog");
        };
        //update product cover image
        $scope.updateProductCoverImage = function(){
            updateImage($scope.productCoverImageFile, "productCoverImage","cover");
        };
        $scope.updateProductCoverImageStart = function(){
            $(productCoverFileSelect).click();
            console.log("Click product cover file selection dialog");
        };

        //create and delete video item
        $scope.selectVideoItem = function(item){
            $scope.videoItemSelected = item;
        };
        $scope.delVideoItem = function(){
            for(var item in $scope.productInfo.videoDOs){
                var index = $scope.productInfo.videoDOs.indexOf($scope.videoItemSelected);
                if(index > -1){
                    $scope.productInfo.videoDOs.splice(index, 1);
                    console.log("Delete video item index: "+index);
                }
            }
            $(deleteVideoItemModal).modal('hide');
        };
        $scope.newVideoItem = function(){
            var videoItem = {};
            videoItem.videoName = $scope.videoName;
            videoItem.videoUrl = $scope.videoUrl;

            $scope.productInfo.videoDOs.push(videoItem);
            $(newVideoItemModal).modal('hide');
        };

        //submit product info
        $scope.submitProductInfo = function(){
            $scope.productInfo.type = 0;
            $scope.productInfo.publishState = 1;
            $scope.productInfo.productRecommend = 1;
            $scope.productInfo.productCategory = $scope.productCategory.map(function(item){return item.id}).join(',')+",";

            var mediaItems = [];
            mediaItems.push($scope.mediaTypeElectricBook ? "电子书" : "");
            mediaItems.push($scope.mediaTypeBook ? "书籍" : "");
            mediaItems.push($scope.mediaTypeCard ? "卡牌" : "");
            mediaItems.push($scope.mediaTypeTeachTool ? "教具" : "");
            mediaItems.push($scope.mediaTypeIntelligentToy ? "益智玩具" : "");
            mediaItems.push($scope.mediaTypeOther ? "其它" : "");
            $scope.productInfo.media = mediaItems.map(function(item){if(item != ""){return item;}}).join(',');

            var matchAgeItems = [];
            matchAgeItems.push($scope.threeYearsOld ? "3" : "");
            matchAgeItems.push($scope.fourYearsOld ? "4" : "");
            matchAgeItems.push($scope.fiveYearsOld ? "5" : "");
            matchAgeItems.push($scope.sixYearsOld ? "6" : "");
            matchAgeItems.push($scope.sevenYearsOld ? "7" : "");
            $scope.productInfo.productMatchScope = matchAgeItems.map(function(item){if(item != ""){return item;}}).join(',');

            $scope.productInfo.productUploadDate = new Date();
            $scope.productInfo.productModifyDate = new Date();
            $http.post(apiPath + "eden/prods/add", $scope.productInfo)
                .then(function successCallback(response) {
                    if(response.status === 200){
                        console.log("Create video product item successfully");
                        productBackAction.setProductBack(true);
                        productBackAction.setType($scope.productInfo.type);
                        productBackAction.setPublishState($scope.productInfo.publishState);
                        productBackAction.setProductRecommend($scope.productInfo.productRecommend);
                        productBackAction.setProductCategory("全部");
                        window.location.href = "#product_list/";
                    }else{
                        alert("创建视频产品失败！返回码："+response.status);
                        console.log("Failed to create video product item ");
                    }
                }, function errorCallback(response) {
                    alert("创建视频产品失败！返回码："+response.status);
                    console.log("Failed to create video product item ");
                });
        };
    });
    app.controller("firstLevelCategoryCtrl", function ($scope,$http){
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        $scope.firstLevelCategoryItems = null;
        loading();

        //temp level one category items array for search feature
        firstLevelCategoryItems_temp = [];

        //Get first level category list data
        $http.get(apiPath + "eden/cates/list/levelone")
            .then(function successCallback(response) {
                $scope.firstLevelCategoryItems = response.data;
                firstLevelCategoryItems_temp = $scope.firstLevelCategoryItems;
            }, function errorCallback(response) {
                console.log("Failed to get the first level category");
            });

        //filter category list by category name
        $scope.searchByCategory = function (){
            if(null === $scope.firstLevelCategoryItems){
                console.log("The first level category is empty");
                return;
            }

            $scope.firstLevelCategoryItems = [];
            var pattern = new RegExp($scope.firstCategorySearch, "i");
            for(var item in firstLevelCategoryItems_temp){
                if(pattern.test(firstLevelCategoryItems_temp[item].categoryName)) {
                    $scope.firstLevelCategoryItems.push(firstLevelCategoryItems_temp[item]);
                }
            }
        };

        //get selected category item for updating
        $scope.updateItem = function(selectedItem) {
            $scope.currentUpdateItem = selectedItem;
            $scope.levelOneCategoryName = selectedItem.categoryName;
        };
        //update level one category
        $scope.updateFirstCategory = function(){
            console.log("Update the first level category: "+$scope.levelOneCategoryName);

            $scope.currentUpdateItem.categoryName = $scope.levelOneCategoryName;
            $http.post(apiPath + "eden/cates/update", $scope.currentUpdateItem)
                .then(function successCallback(response) {
                    console.log("Update first category item successfully.");
                    $(updateFirstCategoryModal).modal('hide');

                    $http.get(apiPath + "eden/cates/list/levelone")
                        .then(function successCallback(response) {
                            $scope.firstLevelCategoryItems = response.data;
                        }, function errorCallback(response) {
                            console.log("Failed to get the first level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to update first category item ");
                });
        };

        //get selected category item for deleting
        $scope.deleteItem = function(selectedItem) {
            $scope.selectedFirstLevelCategoryID = selectedItem.id;
            $scope.selectedFirstLevelCategoryItem = selectedItem;
        };
        //delete level one category item
        $scope.deleteFirstCategory = function(){
            $http.get(apiPath + "eden/cates/delete/" + $scope.selectedFirstLevelCategoryID)
                .then(function successCallback(response) {
                    if(response.status === 200){
                        console.log("Success to delete the first level category ID: " + $scope.selectedFirstLevelCategoryID);
                        $http.get(apiPath + "eden/cates/list/levelone")
                            .then(function successCallback(response) {
                                $(deleteFirstCategoryModal).modal('hide');
                                $scope.firstLevelCategoryItems = response.data;
                            }, function errorCallback(response) {
                                console.log("Failed to get the first level category");
                            });
                    }else{
                        alert("删除产品分类失败！返回码："+response.status);
                        console.log("Failed to delete product category item ");
                    }

                }, function errorCallback(response) {
                    alert("删除产品分类失败！返回码："+response.status);
                    console.log("Failed to delete product category item");
                });
        };

        //create level one category
        $scope.createFirstCategory = function(){
            var newFirstCategory = {};
            newFirstCategory.categoryName = $scope.newFirstCategoryName;
            newFirstCategory.categoryUpdateDate = new Date();
            newFirstCategory.categoryLevel = 1;
            newFirstCategory.categoryPrevious = 0;
            newFirstCategory.categoryDeleted = 0;

            $http.post(apiPath + "eden/cates/add", newFirstCategory)
                .then(function successCallback(response) {
                    console.log("Create first category item successfully.");
                    $(newFirstCategoryModal).modal('hide');

                    $http.get(apiPath + "eden/cates/list/levelone")
                        .then(function successCallback(response) {
                            $scope.firstLevelCategoryItems = response.data;
                        }, function errorCallback(response) {
                            console.log("Failed to get the first level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to create first category item ");
                });

            $scope.newFirstCategoryName = "";
        };
    });
    app.controller("userAdminCtrl", function ($scope, $http){
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        $scope.userItems = null;
        loading();

        //Get product list data
        console.log("Invoke user admin controller, get user admin list data");
        $http.get(apiPath + "eden/membs/lists")
            .then(function successCallback(response) {
                $scope.userItems = response.data;
                userItems_temp = response.data;
            }, function errorCallback(response) {
                console.log("Failed to get admin user list");
            });

        $scope.searchUserListByPhone = function (){
            $scope.userItems = [];
            var pattern = new RegExp($scope.searchPhoneNumber, "i");
            for(var item in userItems_temp){
                if(pattern.test(userItems_temp[item].memberMobile)) {
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
        $scope.confirmResetPWD = function(){
            console.log("Confirmed to reset member name: " + $scope.selectedUserItem.memberName);

            $http.get(apiPath + "eden/membs/pc/" + $scope.selectedUserItem.memberMobile)
                .then(function successCallback(response) {
                    if(response.status === 200){
                        console.log("Reset password for user item successfully.");
                        $(reset).modal('hide');
                    }else{
                        console.log("Failed to reset password for user item, status code: " + response.status);
                    }
                }, function errorCallback(response) {
                    console.log("Failed to reset password for user item");
                });
        };
    });
    app.controller("logDownloadCtrl", function ($scope, $http){
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        $scope.logItems = null;
        $scope.allItemsLength = 0;
        $scope.currentPage = 0;
        $scope.pageInTotal = 0;
        $scope.previousInvalid = true;
        $scope.nextInvalid = true;

        $scope.pageNumType = ["5","10","20","50"];
        loading();
        $scope.itemNumOfPage = "10";

        //Get download log list data
        console.log("Invoke log list controller, get download log list");
        $http.get(apiPath + "eden/logs/lists")
            .then(function successCallback(response) {
                $scope.logAllItems = response.data;
                $scope.allItemsLength = $scope.logAllItems.length;

                if($scope.allItemsLength > 0){
                    $scope.changeNumOfPage();
                }else{
                    $scope.logItems = [];
                }
            }, function errorCallback(response) {
                console.log("Failed to get log list");
            });

        //update previous and next page button status, get current page log items
        var pageControlUpdate = function(){
            $scope.pageInTotal = ($scope.allItemsLength/$scope.itemNumOfPage).toFixed();
            if($scope.allItemsLength > ($scope.itemNumOfPage * $scope.pageInTotal)){
                $scope.pageInTotal++;
            }
            $scope.previousInvalid = true;
            ($scope.pageInTotal > $scope.currentPage) ? ($scope.nextInvalid = false) : ($scope.nextInvalid = true);
            ($scope.currentPage > 1) ? ($scope.previousInvalid = false) : ($scope.previousInvalid = true);
            var startIndex = ($scope.currentPage-1) * $scope.itemNumOfPage;
            $scope.logItems = $scope.logAllItems.slice(startIndex, startIndex + $scope.itemNumOfPage);
        };

        //change page number selection
        $scope.changeNumOfPage = function(){
            console.log("Change number of page to " + $scope.itemNumOfPage);
            if($scope.allItemsLength > 0){
                $scope.currentPage = 1;
                pageControlUpdate();
            }
        };

        //click previous page button
        $scope.previousPage = function(){
            console.log("Click previous button");
            $scope.currentPage--;
            pageControlUpdate();
        };
        //click next page button
        $scope.nextPage = function(){
            console.log("Click next button");
            $scope.currentPage++;
            pageControlUpdate();
        }
    });
    app.controller("systemInfoCtrl", function ($scope, $http){

        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }

        $scope.systemInfo = {};
        $scope.systemInfo.systemLatestVersion = "";
        $scope.systemInfo.systemApkDownUrl = "";
        $scope.apkURLInvalid = false;

        //get system info
        $http.get(apiPath + "eden/sys/version")
            .then(function successCallback(response) {
                console.log("Success to get system info");
                $scope.systemInfo.systemLatestVersion = response.data.systemLatestVersion;
                $scope.systemInfo.systemApkDownUrl = response.data.systemApkDownUrl;
            }, function errorCallback(response) {
                console.log("Failed to get system info");
            });

        //update APK file
        var updateAPKFile = function(files){
            console.log("Selected file number: " + files.length);
            var fd = new FormData();
            fd.append("root", files[0]);
            $http.post(apiPath + "eden/prods/upload",fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(
                function successCallback(response) {
                    if(response.status === 200){
                        console.log("Upload APK file successfully");
                        $scope.systemInfo.systemApkDownUrl = response.data.urls;
                    }else{
                        console.log("Failed to upload APK file");
                    }
                },
                function errorCallback(response) {
                    console.log("Failed to upload APK file");
                });
        };
        $scope.updateAPKFile = function(){
            updateAPKFile($scope.apkFile);
        };
        $scope.updateAPKFileStart = function(){
            $("#apkFileSelect").click();
            console.log("Click APK file selection dialog");
        };

        $scope.systemInfoSubmit = function(){
            if($scope.systemInfo.systemApkDownUrl.length == 0){
                $scope.apkURLInvalid = true;
                return;
            }else{
                $scope.apkURLInvalid = false;
            }

            $http.post(apiPath + "eden/sys/save", $scope.systemInfo)
                .then(function successCallback(response) {
                    if(response.status == 200){
                        alert("更新系统信息成功！");
                        console.log("Update/create system info successfully.");
                    }
                }, function errorCallback(response) {
                    console.log("Failed to update/create system info ");
                });
        };
    });
    app.controller("loginCtrl", function ($scope, $http) {
        $scope.userLogin = function(){
            console.log("$scope.userName");
            console.log("$scope.userPassword");

            //credential verification and set both userName and timeStamp
            sessionStorage.setItem("userName","admin");
            sessionStorage.setItem("timeStamp",new Date());
        };
    });
    app.controller("logoutCtrl", function ($scope, $http) {
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("timeStamp");
        window.location.href = "#login/";
    });
    app.controller("otherUrlCtrl", function () {
        console.log("Otherwise URL contoller...");
        if(usrInvalid()){
            window.location.href = "#login/";
            return;
        }
    });
}());

