(function(){
    angular.module("pollApp").constant("ngToastr", toastr);
    angular.module("pollApp")
    .service("pollNotifier", ["ngToastr", function(ngToastr){
        return {
          success: successFunction,
          failure: failFunction
        };
        
        function successFunction(msg){
            ngToastr.success(msg);
        }
        
        function failFunction(msg){
            ngToastr.fail(msg);
        }
        
    }]);
}());