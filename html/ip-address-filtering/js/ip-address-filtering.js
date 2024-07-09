window.onload = function(){
    $("#signup").on("click", function(){ signup() });
    $("#login").on("click", function(){ login() });
}

function signup() {
    window.location.href = "/ip-address-filtering-api/";
}

function login() {
    const startTime = new Date().getTime();
    const params = new URLSearchParams({ startTime }).toString();
    window.location.href = "/ip-address-filtering/login/index.html?" + params;
}

