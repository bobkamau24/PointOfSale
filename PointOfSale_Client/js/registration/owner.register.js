function OwnerRegister(){
	window.location.assign("shop.register.html");
};

function ClearOwnerRegisterModal(){
	$('#ownerName').val(null);
	$('#ownerEmail').val(null);
	$('#ownerPassword').val(null);
	$('#reOwnerPassword').val(null);
	$('#ownerNote').val(null);
	
	$('#ownerRegisterModal').modal('hide');
};