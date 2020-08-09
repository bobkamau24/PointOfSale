function CheckStore(e, passcode){
	if(e.keyCode === 13)
	{
		if(passcode.value == '123456')
		{
			$.ajax({
				url:"http://localhost:8000/Register/",
			}).then(function(register_data){
				if(register_data.results.length != 0)
				{
					var sts = register_data.results[register_data.results.length-1].status;
					if(sts == "Opened")
					{
						window.location.assign("page/login.html");
					}
					else if(sts == "Closed")
					{
						$('#openRegisterModal').modal('show');
					}
					else 
					{
						alert("Something is wrong!\nPlease contact to developer.");
					}
				}
				else 
				{
				}
			});
		}
		else 
		{
			passcode.value = null;
			passcode.focus;
		}
	}
};

function OpenRegister(){
	if($('#opening_balance').val() != "" && $('#opening_note').val() != "")
	{
		CreateOpenRegister();
		
		$('#opening_balance').val("");
		$('#opening_note').val("");
	}
	else 
	{
		alert("Please insert data into open register!");
	}
};

// Create register by opening
function CreateOpenRegister(){
	var sts = "Opened";
	var opening_balance = $('#openingAmount').val();
	var opening_note = $('#openingNote').val();
	var opening_time = new Date().toLocaleTimeString();
	var closing_time = new Date().toLocaleTimeString();

	if(sts != "" && opening_balance != "" && opening_note != "" && opening_time != "")
	{
		var postData = {
			"status": sts,
			"opening_balance": opening_balance,
			"opening_note": opening_note,
			"opening_time": opening_time,
			"closing_time": closing_time,
		};
		$.ajax({
			type: "POST",
			contentType : "application/json; charset=utf-8",
			url : "http://localhost:8000/Register/",
			data : JSON.stringify(postData),
			dataType: "json",
			success: function(){
				window.location.assign("page/login.html");
			}
		});
	}
	else 
	{
		alert("Please fill out this fields.");
	}
};

// Clear open register modal
function ClearOpenRegisterModal(){
	$('#openingAmount').val(null);
	$('#openingNote').val(null);
	$('#openRegisterModal').modal('hide');
	$('#passcode').val(null);
	$('#passcode').focus();
};

function Register(){
	$('#ownerSignInModal').modal('show');
};

function OwnerSignIn(){
	$('#ownerSignInModal').modal('hide');
	window.location.assign("page/registration/shop.register.html");
};

function ClearOwnerSignInModal(){
	$('#ownerEmail').val(null);
	$('#ownerPassword').val(null);
	
	$('#ownerSignInModal').modal('hide');
	
	$('#passcode').val(null);
	$('#passcode').focus();
};
