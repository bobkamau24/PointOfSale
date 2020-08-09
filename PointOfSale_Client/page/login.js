
function Login(){
	$.ajax({
		url: "http://localhost:8000/Staff/",
	}).then(function(data){
		var username = $('#username').val();
		var pwd = $('#password').val();
		
		for(var i=0; i<data.results.length; i++)
		{
			var u = data.results[i].username;
			var e = data.results[i].email;
			var p = data.results[i].password;
			if(username == u || username == e && pwd == p)
			{
				// Check browser support
				if (typeof(Storage) !== "undefined") {
					localStorage.setItem("staffId", data.results[i].id);
				}
				else
				{
					alert("Your browser does not support session storage.");
				}
				console.log(localStorage);
				window.location.assign("home/home.html");
			}
			else 
			{
				if(username != u || username != e)
				{
					$('#username').val("");
					$('#username').focus();
				}
				else if(pwd != p)
				{
					$('#password').val("");
					$('#password').focus();
				}
			}
		}
	});
};

function Close(){
	$('#closeRegisterModal').modal('show');
	//
	$.ajax({
		url: "http://localhost:8000/Register/",
	}).then(function(register_data){
		var register_id = register_data.results[register_data.results.length-1].id;
		// console.log(register_id);
		$.ajax({
			url : "http://localhost:8000/Register/"+register_id+"/",
		}).then(function(data){
			// console.log(data.sales_id.length);
			var expected = 0;
			var cash_payment_received = 0;
			var store_credit = 0;
			var total = 0;
			for(var i=0; i<data.sales_id.length; i++)
			{
				expected = expected + data.sales_id[i].amount_paid;
				cash_payment_received = cash_payment_received + data.sales_id[i].amount_paid;
				store_credit = 0;
				total = total + data.sales_id[i].amount_paid;
				
			}
			var openingBalance = Number(register_data.results[register_data.results.length-1].opening_balance);
			$('#expected').text(expected + openingBalance);
			$('#cash_payment_received').text(cash_payment_received);
			$('#store_credit').text(store_credit);
			$('#total').text(total + openingBalance);
			
			$('#counted').val(expected + openingBalance);
			$('#counted').select();
			$('#counted').focus();
		});
	});
};

function CloseRegister(){
	if($('#counted').val() != "" && $('#closing_note').val() != "")
	{
		$.ajax({
			url:"http://localhost:8000/Register/",
		}).then(function(register_data){
			var register_id = register_data.results[register_data.results.length-1].id;
			$.ajax({
				url : "http://localhost:8000/Register/"+register_id+"/",
			}).then(function(data){
				var sts = "Closed";
				var opening_balance = data.opening_balance;
				var opening_note = data.opening_note;
				var opening_time = data.opening_time;
				var closing_time = new Date().toLocaleTimeString();
				var expected = $('#expected').text();
				var counted = $('#counted').val();
				var difference = $('#difference').text();
				var cash_payment_received = $('#cash_payment_received').text();
				var store_credit = $('#store_credit').text();
				var total = $('#total').text();
				var closing_note = $('#closing_note').val();
				
				var putData = {
					"status": sts,
					"opening_balance": opening_balance,
					"opening_note": opening_note,
					"opening_time": opening_time,
					"closing_time": closing_time,
					"expected": expected,
					"counted": counted,
					"difference": difference,
					"cash_payment_received": cash_payment_received,
					"store_credit": store_credit,
					"total": total,
					"closing_note": closing_note,
				};
				$.ajax({
					type : "PUT",
					contentType : "application/json; charset=utf-8",
					url : "http://localhost:8000/Register/"+register_id+"/",
					data : JSON.stringify(putData),
					dataType: "json",
					success: function(){
						window.location.assign("../index.html");
					}
				});
			});
		});
	}
	else 
	{
		alert("Please insert data!");
	}
};

// Calculate difference
function CalculateDifference(){
	if($('#counted').val() != "")
	{
		var expected = Number($('#expected').text());
		var counted = Number($('#counted').val());
		$('#tCounted').text(counted);
		if(counted >= expected) {
			$('#difference').text(counted - expected);
			$('#difference').css('color', 'green');
			$('#tDifference').text(counted - expected);
			$('#tDifference').css('color', 'green');
		}
		else {
			$('#difference').text(expected - counted);
			$('#difference').css('color', 'red');
			$('#tDifference').text(expected - counted);
			$('#tDifference').css('color', 'red');
		}
	}
};

function ClearCloseRegisterModal(){
	$('#closeRegisterModal').modal('hide');
};
