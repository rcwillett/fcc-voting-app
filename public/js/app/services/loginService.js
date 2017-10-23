angular.module("loginServiceModule", [])
.service("loginService", ["$rootscope", "$http", function ($rootScope, $http){
    var self = this;
    
    self.login = login;
    
    self.logout = logout;
    
    self.isLoggedIn = isLoggedIn;
    
    function login(){
        return $http.get("/auth/github");
    }
    
    function logout(){
        return $http.get("/logout");
    }
    
    function isLoggedIn(){
        return $http.get("/isLoggedIn");
    }
    
    return self;
}]);