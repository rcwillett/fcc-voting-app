(function(){
    angular.module("pollApp")
    .service("notificationService", ["toastr", function(toastr){
        return {
          success: successFunction,
          error: errorFunction,
          warn: warnFunction
        };
        
        function successFunction(msg){
            toastr.success(msg);
        }
        
        function errorFunction(msg){
            toastr.error(msg);
        }
        
        function warnFunction(msg){
            toastr.warning(msg);
        }
        
    }]);
}());