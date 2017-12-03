(function(){
    angular.module("pollApp")
    .service("notificationService", ["toastr", function(toastr){
        return {
          success: successFunction,
          failure: failFunction,
          warn: warnFunction
        };
        
        function successFunction(msg){
            toastr.success(msg);
        }
        
        function failFunction(msg){
            toastr.fail(msg);
        }
        
        function warnFunction(msg){
            toastr.warning(msg);
        }
        
    }]);
}());