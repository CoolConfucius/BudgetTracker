'use strict'; 

$(document).ready(init); 

var $add; 
var $newNote;
var $newDate; 
var $newAmount; 
var $newCredit; 
var $newDebit; 
var newType = ''; 
var editType, editAmount, editDate, editNote;
var $body; 
var $removeSelected; 
var $sortAlpha; 
var $balance; 
var balance = '1000'; 
var $showAll;
var $showCredit;
var $showDebit;
var editingTransaction = false; 


function init(){
  var currentDate = moment().format('YYYY-MM-DD');
  $balance = $('#balance');
  $add = $('#add'); 
  $newNote = $("#newNote");
  $newDate = $("#newDate");
  $newDate.attr('min', currentDate);
  $newAmount = $("#newAmount");
  $newCredit = $("#newCredit");
  $newDebit = $("#newDebit");
  $showAll = $("#showAll");
  $showCredit = $("#showCredit");
  $showDebit = $("#showDebit");
  $body = $('#body');
  $removeSelected = $('#removeSelected');
  $sortAlpha = $('#sortAlpha');
  $add.click(hitAdd);
  $newCredit.click(hitNewCredit);
  $newDebit.click(hitNewDebit);
  $showAll.click(hitShowAll);
  $showCredit.click(hitShowCredit);
  $showDebit.click(hitShowDebit);
  $removeSelected.click(hitRemoveSelected);
  $body.on('click', '.check',(hitCheck)); 
  $body.on('click', '.delete',(hitDelete)); 
  $body.on('click', '.edit',(hitEdit)); 
  $body.on('click', '#editCredit',(hitEditCredit)); 
  $body.on('click', '#editDebit',(hitEditDebit)); 
  $body.on('click', '#editConfirm',(hitEditConfirm)); 
  $sortAlpha.click(hitSortAlpha);
};

function hitNewCredit(event){
  $newCredit.toggleClass('pressed'); 
  if ($newDebit.hasClass('pressed')) {
    $newDebit.removeClass('pressed');
  };
  newType = "credit";
};

function hitNewDebit(event){
  $newDebit.toggleClass('pressed'); 
  if ($newCredit.hasClass('pressed')) {
    $newCredit.removeClass('pressed');
  };
  newType = "debit";
};

function hitAdd(event){
  if (!newType || $newAmount.val() < 0.01) { return };
  var $toAddRow = $('<div>').addClass('row item'); 
  $toAddRow.append($('<div>').addClass('col-md-5 note').text($newNote.val() ) );
  $toAddRow.append($('<div>').addClass('col-md-2 date').text($newDate.val()) ); 
  $toAddRow.append($('<div>').addClass('col-md-1 type').text( newType) ); 
  $toAddRow.append($('<div>').addClass('col-md-1 amount').text('$'+(parseFloat($newAmount.val()).toFixed(2))) ); 
  $toAddRow.append($('<input />', { type: 'checkbox'}).addClass('col-md-1 check')); 
  $toAddRow.append($('<div>').addClass('col-md-1 delete').text('\u27F0')); 
  $toAddRow.append($('<div>').addClass('col-md-1 edit').text('\u270E')); 
  
  $body.append($toAddRow);
  if (newType === 'credit') {
    balance = (parseFloat(balance) + parseFloat($newAmount.val()) ).toFixed(2).toString();
    $newCredit.removeClass('pressed');   
  } else {
    balance = (parseFloat(balance) - parseFloat($newAmount.val()) ).toFixed(2).toString();
    $newDebit.removeClass('pressed');
  }
  $balance.text(balance);
  $newNote.val('');
  $newDate.val('');
  $newAmount.val('0.00');
  newType = '';

};

function hitCheck(event){
    var $this = $(this);
    $this.siblings().toggleClass('strike'); 
    $this.parent().toggleClass('selected');
};

function hitDelete(event){
  var $this = $(this);
  var $parent = $this.parent(); 
  console.log("parseFloat: ", parseFloat($parent.children(".amount").text().substr(1)));
  if ($parent.children(".type").text()==="credit") {
    balance = (parseFloat(balance) - parseFloat($parent.children(".amount").text().substr(1)) ).toFixed(2).toString();
  } else {
    balance = (parseFloat(balance) + parseFloat($parent.children(".amount").text().substr(1)) ).toFixed(2).toString();
  }
  $balance.text(balance);
  $this.parent().remove(); 
};

function hitRemoveSelected(event){
  var $item = $('.item');
  $item.each(function(index){
    if ($item.eq(index).hasClass('selected')) {
      if ($item.eq(index).children(".type").text()==="credit") {
        balance = (parseFloat(balance) - parseFloat($item.eq(index).children(".amount").text().substr(1)) ).toFixed(2).toString();
      } else {
        balance = (parseFloat(balance) + parseFloat($item.eq(index).children(".amount").text().substr(1)) ).toFixed(2).toString();
      }
      $balance.text(balance);
      $item.eq(index).remove(); 
    };
  });
};

function hitShowAll(event){
  var $item = $('.item');
  $item.removeClass('hide');
};

function hitShowCredit(event){
  var $item = $('.item');
  $item.each(function(index){
    if ($item.eq(index).children(".type").text()!=='credit') {
      $item.eq(index).addClass('hide');
    } else {
      $item.eq(index).removeClass('hide');
    };
  })
};

function hitShowDebit(event){
  var $item = $('.item');
  $item.each(function(index){
    if ($item.eq(index).children(".type").text()!=='debit') {
      $item.eq(index).addClass('hide');
    } else {
      $item.eq(index).removeClass('hide');
    }
  })
};

function hitEdit(event){
  var $this = $(this);
  var $parent = $this.parent(); 
  if ($this.hasClass("isEditing")) {
    editType = '';
    $parent.children(".type").removeAttr("id");
    $parent.children(".amount").removeAttr("id");
    $('.editing').remove(); 
    $this.removeClass("isEditing");
    editingTransaction = false; 
  } else if(!editingTransaction) {
    editingTransaction = true; 
    $this.addClass("isEditing")
    $parent.attr("id", "previous"); 
    $parent.children(".type").attr("id", "previousType");
    $parent.children(".amount").attr("id", "previousAmount");
    $parent.children(".date").attr("id", "previousDate");
    $parent.children(".note").attr("id", "previousNote");

    editType = $parent.children(".type").text(); 
    editAmount = $parent.children(".amount").text().substr(1); 
    editDate = $parent.children(".date").text(); 
    editNote = $parent.children(".note").text(); 
    console.log("defaults: ", editType, editAmount, editDate, editNote);

    var $editForm = $('<div>').addClass('row editing');
    var $editNote = $('<div>').addClass('row editing');
    $editForm.append($('<span>').addClass('col-sm-1').text('Type:'));
    $editForm.append($('<div>').addClass('col-sm-1 btn btn-default').text('Credit').attr("id", "editCredit"));
    $editForm.append($('<div>').addClass('col-sm-1 btn btn-default').text('Debit').attr("id", "editDebit"));
    $editForm.append($('<span>').addClass('col-sm-1 col-sm-offset-1').text('Amount:'));
    $editForm.append($('<input>').addClass('col-sm-2').attr({type: "number", step: "0.01", value: "0.00", min: "0.00", id: "editAmount"} ) );
    $editForm.append($('<span>').addClass('col-sm-1 col-sm-offset-1').text('Date:'));
    $editForm.append($('<input>').addClass('col-sm-3').attr({type: "date", id: "editDate"} ) );
    $editNote.append($('<span>').addClass('col-sm-1').text('Note:'));
    $editNote.append($('<input>').addClass('col-sm-9').attr({type: "text", id: "editNote"} ) );
    $editNote.append($('<div>').addClass('col-sm-2 btn btn-default').text('Confirm').attr("id", "editConfirm"));
    $parent.after($editForm, $editNote);    
  }
};

function hitEditCredit(event){
  var $editCredit = $("#editCredit");
  var $editDebit = $("#editDebit");
  $editCredit.toggleClass('pressed'); 
  if ($editDebit.hasClass('pressed')) {
    $editDebit.removeClass('pressed');
  };
  editType = "credit";
};

function hitEditDebit(event){
  var $editDebit = $("#editDebit");
  var $editCredit = $("#editCredit");
  $editDebit.toggleClass('pressed'); 
  if ($editCredit.hasClass('pressed')) {
    $editCredit.removeClass('pressed');
  };
  editType = "debit";
};


function hitEditConfirm(event){
  console.log("editType: ", editType);
  var $previousType = $("#previousType");
  var $previousAmount = $("#previousAmount");
  console.log("previousType", $previousType.text());
  console.log('previousAmount: ',parseFloat($("#previousAmount") .text().substr(1)) );
  console.log('previousAmount: ',parseFloat($("#previousAmount") .text() ) );
  var workingBalance = parseFloat(balance);
  console.log("workingBalance", workingBalance);
  if ($previousType.text()==="credit") {
    workingBalance -= parseFloat($("#previousAmount") .text().substr(1));
  } else {
    workingBalance += parseFloat($("#previousAmount") .text().substr(1));
  }
  $previousType.text(editType);
  console.log("workingBalance", workingBalance);
  if (editType==="credit") {
    workingBalance += parseFloat($('#editAmount').val()) ;
  } else {
    workingBalance -= parseFloat($('#editAmount').val()) ;
  }
  console.log("editAmount: ", $('#editAmount').val());
  console.log("workingBalance", workingBalance);
  $previousAmount.text('$'+$('#editAmount').val().toString());


  balance = workingBalance.toFixed(2).toString();
  $balance.text(balance);
  console.log("neweditamount: ", editAmount);
  $("#previous").children(".type").text(editType);
  $("#previous").children(".date").text(editDate);
  $("#previous").children(".note").text(editNote);




  $("#previousAmount").removeAttr("id");
  $(".isEditing").removeClass(".isEditing");
  $(".editing").remove(); 

  editingTransaction = false; 
};




function hitSortAlpha(event){
  var $sortedBody = $('<div>').addClass('container');
  var $item = $('.item');
  console.log($item);
  $item.each(function(index){
    var $sortedRow = $('<div>').addClass('row item');
    $sortedRow.append($('<div>').addClass('col-md-5').text('yolo') );
    $sortedRow.append($('<div>').addClass('col-md-3').text('swag') ); 
    $sortedRow.append($('<input />', { type: 'checkbox'}).addClass('col-md-2 check')); 
    $sortedRow.append($('<div>').addClass('col-md-2 delete').text('\u27F0')); 
    $sortedBody.append($sortedRow);
  });
  $body.remove(); 
  $body = $sortedBody.attr('id','body');
  $body.on('click', '.check',(hitCheck)); 
  $body.on('click', '.delete',(hitDelete));   
  $('#labels').after($body); 
}
