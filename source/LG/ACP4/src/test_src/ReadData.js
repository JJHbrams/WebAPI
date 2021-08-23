function callbackLP(URL){
  var xhr = new XMLHttpRequest();

  xhr.open('POST', URL, true);
  xhr.onload = function() {
      console.log(xhr.response);
      // alert(xhr.response)
    }
  xhr.send();

  // return xhr.response;
}
var lpoint = 'https://192.168.92.106/api/wapi/get_lpoint_all_small'
var cpoint = 'https://192.168.92.106/api/wapi/pm/get_cpoint_all' 
callbackLP(lpoint)
// callbackLP(cpoint)
setInterval(()=>callbackLP(lpoint), 500); 
// setInterval(()=>callbackLP(cpoint), 500); 
