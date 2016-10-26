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
                templateUrl : "app/views/product/product_list.html"
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
                templateUrl : "app/views/category/first_level_category.html"
            })
            .when("/second_level_category", {
                templateUrl : "app/views/category/second_level_category.html"
            })
            .when("/user_admin", {
                templateUrl : "app/views/user/user_admin.html"
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
}());