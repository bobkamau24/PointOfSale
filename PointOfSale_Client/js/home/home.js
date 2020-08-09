$(document).ready(function(){
	var userId = sessionStorage.getItem("userId");
	alert(userId);
	$.ajax({
		url: "http://localhost:8000/Staff/"+userId+"/",
	}).then(function(data){
		console.log(data);
		// Check browser support
		if (typeof(Storage) !== "undefined") {
			$('#username').text(data.username);
		}
		else
		{
			$('#username').text("Admin");
		}
	});
});