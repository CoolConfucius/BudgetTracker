'use strict'; 

$(document).ready(init); 

var $add; 
var $newMessage;
var $newDate; 
var $body; 
var $removeCom; 
var $sortAlpha; 
var now = moment(); 

function init(){
  $add = $('#add'); 
  $newMessage = $("#newMessage");
  $newDate = $("#newDate");
  $newAmount = $("#newAmount");
  $body = $('#body');
  $removeCom = $('#removeCom');
  $sortAlpha = $('#sortAlpha');
  $add.click(hitAdd);
  $removeCom.click(hitRemoveCom);
  $body.on('click', '.check',(hitCheck)); 
  $body.on('click', '.delete',(hitDelete)); 
  $sortAlpha.click(hitSortAlpha);
};

function hitAdd(event){
  console.log('due: ', $newDate.val());
  var text = $newMessage.val(); 
  var $toAddRow = $('<div>').addClass('row item'); 
  $toAddRow.append($('<div>').addClass('col-md-5').text(text) );
  $toAddRow.append($('<div>').addClass('col-md-3').text($newDate.val()) ); 
  $toAddRow.append($('<input />', { type: 'checkbox'}).addClass('col-md-2 check')); 
  $toAddRow.append($('<div>').addClass('col-md-2 delete').text('\u27F0')); 
  
  $body.append($toAddRow);
  $newMessage.val('');
  $newDate.val('');
};

function hitCheck(event){
    var $this = $(this);
    $this.siblings().toggleClass('strike'); 
    $this.parent().toggleClass('completed');
};

function hitDelete(event){
  $(this).parent().remove(); 
};

function hitRemoveCom(event){
  var $tasks = $('.item');
  $tasks.each(function(index){
    if ($tasks.eq(index).hasClass('completed')) {
      $tasks.eq(index).remove(); 
    };
  });
};

function hitSortAlpha(event){
  var $sortedBody = $('<div>').addClass('container');
  var $tasks = $('.item');
  console.log($tasks);
  $tasks.each(function(index){
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
