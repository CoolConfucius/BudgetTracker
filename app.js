'use strict'; 

$(document).ready(init); 

var $add; 
var $newMessage;
var $newDate; 
var $newAmount; 
var $newCredit; 
var $newDebit; 
var newType = ''; 
var $body; 
var $removeSelected; 
var $sortAlpha; 
var $balance; 
var balance = '1000'; 
var $showAll;
var $showCredit;
var $showDebit;

// var now = moment().format("MM-DD-YYYY"); 

function init(){
  var currentDate = moment().format('YYYY-MM-DD');
  $balance = $('#balance');
  $add = $('#add'); 
  $newMessage = $("#newMessage");
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
  // if (!newType || $newAmount.val() < 0.01) { return };
  var $toAddRow = $('<div>').addClass('row item'); 
  $toAddRow.append($('<div>').addClass('col-md-5').text($newMessage.val() ) );
  $toAddRow.append($('<div>').addClass('col-md-2').text($newDate.val()) ); 
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
  $newMessage.val('');
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
  // $item.each(function(index){
  //   if ($item.eq(index).children(".type").text()!=='credit') {
  //     $item.eq(index).addClass('hide');
  //   };
  // })
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
