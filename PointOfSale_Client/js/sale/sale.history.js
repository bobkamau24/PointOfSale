$(document).ready(function(){
	$.ajax({
		url: "http://localhost:8000/Sales/"
	}).then(function(sale){
		for (let i=0; i<sale.results.length; i++){
			$.when( 
				$.ajax({url: "http://localhost:8000/Register/"+sale.results[i].register_id+"/"}),
				$.ajax({url: "http://localhost:8000/Customer/"+sale.results[i].customer_id+"/"}),
				$.ajax({url: "http://localhost:8000/Staff/"+sale.results[i].staff_id+"/"})
			).then(function(register_data, customer_data, staffData){
				var d = new Date(sale.results[i].transaction_date);
				var dd = d.toDateString();

				var transaction_date = dd;
				var receipt = sale.results[i].id;
				var sold_by = staffData[0].username;
				var customer_name = customer_data[0].customer_name;
				var opening_note = register_data[0].opening_note;
				var amount_paid = sale.results[i].amount_paid;
				var sts = register_data[0].status;
				
				var row = $('<tr>');
				$(row).append('<td>'+transaction_date+'</td>')
				$(row).append('<td>'+receipt+'</td>')
				$(row).append('<td>'+sold_by+'</td>')
				$(row).append('<td>'+customer_name+'</td>')
				$(row).append('<td>'+opening_note+'</td>')
				$(row).append('<td>'+amount_paid+'</td>')
				$(row).append('<td>'+sts+'</td>')
				
				$('#tableBody').append(row);
			});
		}
	});
});
