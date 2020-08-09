$(document).ready(function(){
	FirstArea();
	
	// var userId = sessionStorage.getItem("userId");
	$.ajax({
		url: "http://localhost:8000/Staff/"+2+"/",
	}).then(function(data){
		if (typeof(Storage) !== "undefined") {
			$('#staffName').text(data.username);
			RetrieveProduct();
			
			$('#subtotal').text('0.00');
			$('#txtTax').val('0.00');
			$('#txtDiscount').val('0.00');
			$('#items').text('0');
			$('#btnCash').text('0.00');
		}
		else
		{
			$('#username').text("Admin");
		}
	});
});
//
// Retrieve product information
function RetrieveProduct(){
	$.ajax({
		url: "http://localhost:8000/Product/",
	}).then(function(data){
		if(data.results.length >= 12)
		{
			for(var i=0; i<12; i++)
			{
				var productId = data.results[i].id;
				var productName = data.results[i].product_name;
				var productPrice = data.results[i].product_price;
				
				$("<div onclick='AddItem("+productId+");' class='btn-info' style='width: 100px; height:100px; margin: 2px; padding: 3px 3px 2px; border: 1px solid #aaa; border-radius: 5px; text-align:center; float:left;'><p class='bg-primary'>"+productId+"</p>"+productName+"<br>"+productPrice+"</div>").appendTo("#saleProduct");
			}
		}
		else {
			for(var i=0; i<data.results.length; i++)
			{
				var productId = data.results[i].id;
				var productName = data.results[i].product_name;
				var productPrice = data.results[i].product_price;
				
				$("<div onclick='AddItem("+productId+");' class='btn-info' style='width: 100px; height:100px; margin: 2px; padding: 3px 3px 2px; border: 1px solid #aaa; border-radius: 5px; text-align:center; float:left;'><p class='bg-primary'>"+productId+"</p>"+productName+"<br>"+productPrice+"</div>").appendTo("#saleProduct");
			}
		}
	});
};

// function SearchProduct(){
	// var search = $('#searchProduct').val();
	// $.ajax({
		// url: "http://localhost:8000/Product/",
	// }).then(function(data){
		// $('#saleProduct').empty();
		// if(search != null){
			// alert(data.results.id);
		// }
	// });
// };

function SearchProduct(){
	var search = $('#searchProduct').val();
	$.ajax({
		url: "http://localhost:8000/Product/",
	}).then(function(data){
		$('#saleProduct').empty();
		if(search != null){
			for(var i=0; i<data.results.length; i++)
			{
				var productId = data.results[i].id;
				var productName = data.results[i].product_name;
				var productPrice = data.results[i].product_price;
				if(search == productId){
					$("<div onclick='AddItem("+productId+");' class='btn-info' style='width: 100px; height:100px; margin: 2px; padding: 3px 3px 2px; border: 1px solid #aaa; border-radius: 5px; text-align:center; float:left;'><p class='bg-primary'>"+productId+"</p>"+productName+"<br>"+productPrice+"</div>").appendTo("#saleProduct");
				}
				else if(search == productName){
					$("<div onclick='AddItem("+productId+");' class='btn-info' style='width: 100px; height:100px; margin: 2px; padding: 3px 3px 2px; border: 1px solid #aaa; border-radius: 5px; text-align:center; float:left;'><p class='bg-primary'>"+productId+"</p>"+productName+"<br>"+productPrice+"</div>").appendTo("#saleProduct");
				}
			}
		}
		else {
			RetrieveProduct();
		}
	});
};

// Add items
function AddItem(id){
	$.ajax({
		type: "GET",
		contentType: "application/json; charset=utf-8",
		url: "http://localhost:8000/Product/"+id+"/",
		// data: JSON.stringify(),
		dataType: "json",
	}).then(function(data){
		var productId = data.id;
		var productName = data.product_name;
		var productPrice = data.product_price;
		
		var tr = $('<tr>')
		$(tr).append('<td id="productId">'+productId+'</td>')
		$(tr).append('<td id="productName">'+productName+'</td>')
		$(tr).append('<td id="quantity">'+1+'</td')
		$(tr).append('<td id="productSubtotal">'+productPrice+'</td>')
		$(tr).append('<td><img src="../../image/delete.png" height="20px" onclick="RemoveItem(this);"></td>')
		$(tr).append('<td><input type="number" value="1" class="form-control" id="editQuantity" onchange="ChangeQuantity(this, '+productPrice+');"></td>')
		
		$('#saleProductTableBody').append(tr);

		var subtotal = Number($('#subtotal').text()) + productPrice;
		$('#subtotal').text(subtotal);
		
		var items = Number($('#items').text()) + 1;
		$('#items').text(items);
		
		var total = Number($('#btnTotal').text()) + productPrice;
		$('#btnTotal').text(total);

		$('#searchProduct').select();
		$('#searchProduct').focus();
		
		CalculatePay();
	});
};

// Remove items
function RemoveItem(row){
	var productSubtotal = $(row).closest('tr').find('#productSubtotal').text();
	var subtotal = $('#subtotal').text();
	var items = $('#items').text();
	var total = $('#btnTotal').text();
	$('#subtotal').text(subtotal - productSubtotal);
	$('#items').text(items - 1);
	$('#btnTotal').text(total - productSubtotal);
	$(row).closest('tr').remove();
	
	CalculatePay();
};

// Change quantity
function ChangeQuantity(quant, price){
	$(quant).closest('tr').find('#quantity').text($(quant).val());
	
	var quantity = $(quant).val();
	var productPrice = price;
	var pSub = $(quant).closest('tr').find('#productSubtotal').text();

	var productSubtotal = quantity * productPrice;
	$(quant).closest('tr').find('#productSubtotal').text(productSubtotal);
	
	var subtotal = $('#subtotal').text();
	$('#subtotal').text((subtotal - pSub) + productSubtotal);
	
	CalculatePay();
};

// Calculate subtotal and txtTax
function CalculatePay(){
	var subtotal = Number($("#subtotal").text());
	var tax = Number($("#txtTax").val());
	
	var d = Number($("#txtDiscount").val());
	var discount = ((d / 100) * subtotal)

	var total = (subtotal + tax) - discount;
	$('#btnTotal').text(total);
};

////////////////////////////////////////////////////////////
function Pay(){
	SecondArea();
	
	var saleProduct = [];
	var headers = $("#saleProductTable th");
	var rows = $("#saleProductTable tbody tr").each(function(index){
		cells = $(this).find("td");
		saleProduct[index] = {};
		cells.each(function(cellIndex){
			saleProduct[index][$(headers[cellIndex]).html()] = $(this).html();
		});
	});
	var myObj = {};
	myObj.saleProduct = saleProduct;
	// var summary = JSON.stringify(myObj);
	
	AddSummary(myObj);
};

// Add summary
function AddSummary(summary){
	$('#saleSummaryProductTableBody').empty();
	for(var i=0; i<summary.saleProduct.length; i++)
	{
		var row = $('<tr>')
		$(row).append('<td>'+summary.saleProduct[i].ID+'</td>')
		$(row).append('<td>'+summary.saleProduct[i].ProductName+'</td>')
		$(row).append('<td>'+summary.saleProduct[i].Quantity+'</td>')
		$(row).append('<td>'+summary.saleProduct[i].Amount+'</td>')
		
		$('#saleSummaryProductTableBody').append(row);
	}
	
	$('#smSubtotal').text($('#subtotal').text());
	$('#smTax').text($('#txtTax').val());
	$('#smDiscount').text($('#txtDiscount').val());
	$('#smItems').text($('#items').text());
	$('#smTotal').text($('#btnTotal').text());
	
	$('#txtPaid').val($('#btnTotal').text());
};

// Calculate repay
function CalculateRepay(){
	var amountPaid = Number($('#smTotal').text());
	var paid = Number($('#txtPaid').val());
	if($('#txtPaid').val() != "" && $('#txtPaid').val() != 0.00 && paid >= amountPaid)
	{
		$('#lblRepay').text(paid - amountPaid);
		$('#cashSaleModal').modal('show');
	}
	else if(paid < amountPaid)
	{
		$('#lblCredit').text(amountPaid - paid);
		$('#creditSaleModal').modal('show');
	}
	else 
	{
		$('#txtPaid').focus;
	}
};

// Create sale data
function CreateSale(){
	// var transaction_date = new Date();
	var subtotal = $('#smSubtotal').text();
	var tax = $('#smTax').text();
	var discount = $('#smDiscount').text();
	var items = $('#smItems').text();
	var amount_paid = $('#smTotal').text();
	var paid = $('#txtPaid').val();
	var repay = $('#lblRepay').text();
	var customer_id = 1;
	var staff_id = 2;
	// var customer_id = $('#selCustomerName option:selected').val();
	// var staff_id = sessionStorage.getItem("userId");
	$.ajax({
		url:"http://localhost:8000/Register/",
	}).then(function(register_data){
		var register_id = register_data.results[register_data.results.length-1].id;
		var postData = {
			"subtotal": subtotal,
			"tax": tax,
			"discount": discount,
			"items": items,
			"amount_paid": amount_paid,
			"paid": paid,
			"repay": repay,
			"staff_id": staff_id,
			"customer_id": customer_id,
  			"register_id": register_id,
		};
		$.ajax({
			type: "POST",
			contentType : "application/json; charset=utf-8",
			url : "http://localhost:8000/Sales/",
			data : JSON.stringify(postData),
			dataType: "json",
			success: function(){
				CreateSaleDetail();
			}
		});
	});
};

// Create sale detail
function CreateSaleDetail(){
	var saleProduct = [];
	var headers = $("#saleSummaryProductTable th");
	var rows = $("#saleSummaryProductTable tbody tr").each(function(index){
		cells = $(this).find("td");
		saleProduct[index] = {};
		cells.each(function(cellIndex){
			saleProduct[index][$(headers[cellIndex]).html()] = $(this).html();
		});
	});
	var myObj = {};
	myObj.saleProduct = saleProduct;
	
	for(var i=0; i<myObj.saleProduct.length; i++)
	{
		var product_id = myObj.saleProduct[i].ID;
		var quantity = myObj.saleProduct[i].Quantity;
		var sub_total = myObj.saleProduct[i].Amount;
		
		$.ajax({
			url:"http://localhost:8000/Sales/",
		}).then(function(sales_data){
			var sales_id = sales_data.results[sales_data.results.length-1].id;
			var postData = {
				"product_id": product_id,
				"quantity": quantity,
				"sub_total": sub_total,
				"sales_id": sales_id,
			};
			$.ajax({
				type: "POST",
				contentType : "application/json; charset=utf-8",
				url : "http://localhost:8000/SaleDetails/",
				data : JSON.stringify(postData),
				dataType: "json",
				success: function(){
					// alert("Done ESC!");
					$('#saleProductTableBody').empty();
					$('#saleSummaryProductTableBody').empty();
					
					$('#subtotal').text('0.00');
					$('#txtTax').val('0.00');
					$('#txtDiscount').val('0.00');
					$('#items').text(0);
					$('#btnTotal').text('0.00');
					
					$('#txtPaid').val('0.00');
					
					ClearCashSaleModal();
					ClearCreditSaleModal();
					FirstArea();
				}
			});
		});
	}
};

function FirstArea(){
	$('#secondArea').hide();
	$('#firstArea').show();
	
	$('#searchProduct').select();
	$('#searchProduct').focus();
};

function SecondArea(){
	$('#firstArea').hide();
	$('#secondArea').show();

	$('#txtPaid').select();
	$('#txtPaid').focus();
};

function ClearCashSaleModal(){
	$('#lblRepay').text('0.00');
	$('#cashSaleModal').modal('hide');
};

function ClearCreditSaleModal(){
	$('#lblCredit').text('0.00');
	$('#creditSaleModal').modal('hide');
};