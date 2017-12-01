(function(){
    angular.module("pollApp")
    .service("pollNotifier", ["toastr", function(toastr){
        return {
          success: successFunction,
          failure: failFunction
        };
        
        function successFunction(msg){
            toastr.success(msg);
        }
        
        function failFunction(msg){
            toastr.fail(msg);
        }
        
    }]);
}());