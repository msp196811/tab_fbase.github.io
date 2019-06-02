 var nextkey =0;
 var firebaseConfig = {
    apiKey: "AIzaSyBSWFK3i8tp6PwX0TVMPK8613yuqqJZhWc",
    authDomain: "datatable-54557.firebaseapp.com",
    databaseURL: "https://datatable-54557.firebaseio.com",
    projectId: "datatable-54557",
    storageBucket: "datatable-54557.appspot.com",
    messagingSenderId: "1013895628287",
    appId: "1:1013895628287:web:a24c3f4371234ece"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

 var database = firebase.database();
 database.ref('users').on('child_added', function(data) {
 add_data_table(data.val().username,data.val().email,data.val().pic,data.val().dep,data.val().selery,data.key);
 var lastkey = data.key;
 nextkey = parseInt(lastkey)+1;
 });
 database.ref('users').on('child_changed', function(data) {
 update_data_table(data.val().username,data.val().email,data.val().pic,data.val().dep,data.val().selery,data.key)
 });
 database.ref('users').on('child_removed', function(data) {
 remove_data_table(data.key)
 });
 
 function add_data_table(name,email,pic,dep,selery,key){
 $("#card-list").append('<tr class="key" id="'+key+'"><td><div class="book-pic">'+name+'</div></td><td><div class="name">'+email+'</div></td><td><div class="book">'+pic+'</div></td><td><div class="dep">'+dep+'</div></td><td><div class="selery">'+selery+'</div></td><td width="2%"><button class="btn btn-default"><a href="#" data-key="'+key+'" class="btnEdit">&#9997</a></button></td><td width="2%"><button class="btn btn-default"><a href="#" class="btnRemove"  data-key="'+key+'">&#128465</a></button></td></div></tr></tr>');
 getPagination('#table-id');

 }
 function update_data_table(name,email,pic,dep,selery,key){
$("#card-list #"+key).html('<td><div class="book-pic">'+name+'</div></td><td><div class="name">'+email+'</div></td><td><div class="book">'+pic+'</div></td><td><div class="dep">'+dep+'</div></td></td><td><div class="selery">'+selery+'</div></td><td width="2%"><button class="btn btn-default"><a href="#" data-key="'+key+'" class="btnEdit">&#9997</a></button></td><td width="2%"><button class="btn btn-default"><a href="#" class="btnRemove"  data-key="'+key+'">&#128465</a></button></td>');
 getPagination('#table-id');
 }
 function remove_data_table(key){
$("#card-list #"+key).remove();
 getPagination('#table-id');
 }
 function new_data(name,email,pic,dep,selery,key){
 database.ref('users/' + key).set({
 username: name,
 email: email,
 pic: pic,
 dep: dep,
 selery: selery
 });
 }
 function update_data(name,email,pic,dep,selery,key){
 database.ref('users/' + key).update({
 username: name,
 email: email,
 pic: pic,
 dep: dep,
 selery: selery
 });
 }
 $( "#btnAdd" ).click(function() {
 $("#txtName").val("");
 $("#txtEmail").val("");
 $("#txtPic").val("");
 $("#txtDep").val("");
 $("#txtSelery").val("");
 $("#txtType").val("N");
 $("#txtKey").val("0");
 $( "#modal" ).addClass( "is-active" );
 
 });
 $("#btnSave" ).click(function() {
 if($("#txtType").val() == 'N'){
 database.ref('users').once("value").then(function(snapshot) {
 if(snapshot.numChildren()==0){
 nextkey = 1;
 }
 new_data($("#txtName").val(),$("#txtEmail").val(),$("#txtPic").val(), $("#txtDep").val(),$("#txtSelery").val(),nextkey);
 });
 }else{
 update_data($("#txtName").val(),$("#txtEmail").val(),$("#txtPic").val(),$("#txtDep").val(),$("#txtSelery").val(),$("#txtKey").val());
 }
 $("#btnClose").click();
 });
 $(document).on("click",".btnEdit",function(event){
 event.preventDefault();
 key = $(this).attr("data-key");
 database.ref('users/'+key).once("value").then(function(snapshot){
 $("#txtName").val(snapshot.val().username);
 $("#txtEmail").val(snapshot.val().email);
 $("#txtPic").val(snapshot.val().pic);
 $("#txtDep").val(snapshot.val().dep);
 $("#txtSelery").val(snapshot.val().selery);  
 $("#txtType").val("E"); 
 $("#txtKey").val(key); 
 });
 $( "#modal" ).addClass( "is-active" );
 });
 
 $(document).on("click",".btnRemove",function(event){
 if(confirm("Точно удалить?")){
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('users/' + key).remove();
 }
 })
 
 $( "#btnClose,.btnClose" ).click(function() {
 $( "#modal" ).removeClass( "is-active" );
 });

    function getPagination (table){

    var lastPage = 1 ; 

          $('#maxRows').on('change',function(evt){
            //$('.paginationprev').html('');                       

        lastPage = 1 ; 
         $('.pagination').find("li").slice(1, -1).remove();
            var trnum = 0 ;                                 
            var maxRows = parseInt($(this).val());          

            if(maxRows == 5000 ){

                $('.pagination').hide();
            }else {
                
                $('.pagination').show();
            }

            var totalRows = $(table+' tbody tr').length;        
             $(table+' tr:gt(0)').each(function(){          
                trnum++;                                   
                if (trnum > maxRows ){                     
                    
                    $(this).hide();                         
                }if (trnum <= maxRows ){$(this).show();}
             });                                            
             if (totalRows > maxRows){                      
                var pagenum = Math.ceil(totalRows/maxRows); 
                                                            
                for (var i = 1; i <= pagenum ;){            
                $('.pagination #prev').before('<li data-page="'+i+'">\
                                      <span>'+ i++ +'<span class="sr-only">(current)</span></span>\
                                    </li>').show();
                }                                           
            }                                               
            $('.pagination [data-page="1"]').addClass('active'); 
            $('.pagination li').on('click',function(evt){       
                evt.stopImmediatePropagation();
                evt.preventDefault();
                var pageNum = $(this).attr('data-page');    

                var maxRows = parseInt($('#maxRows').val());            

                if(pageNum == "prev" ){
                    if(lastPage == 1 ){return;}
                    pageNum  = --lastPage ; 
                }
                if(pageNum == "next" ){
                    if(lastPage == ($('.pagination li').length -2) ){return;}
                    pageNum  = ++lastPage ; 
                }

                lastPage = pageNum ;
                var trIndex = 0 ;                           
                $('.pagination li').removeClass('active');   
                $('.pagination [data-page="'+lastPage+'"]').addClass('active');
                // $(this).addClass('active');                  
                 $(table+' tr:gt(0)').each(function(){      
                    trIndex++;                              
                    if (trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
                        $(this).hide();     
                    }else {$(this).show();}                 
                 });                                        
                    });                                     

        }).val(5).change();                             
    }   


$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table-id tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

(function(){
    'use strict';
  var $ = jQuery;
  $.fn.extend({
    filterTable: function(){
      return this.each(function(){
        $(this).on('keyup', function(e){
          $('.filterTable_no_results').remove();
          var $this = $(this), 
                        search = $this.val().toLowerCase(), 
                        target = $this.attr('data-filters'), 
                        $target = $(target), 
                        $rows = $target.find('tbody tr');
          if(search == '') {
            $rows.show(); 
            getPagination('#table-id');
          } else {
            $rows.each(function(){
              var $this = $(this);
              $this.text().toLowerCase().indexOf(search) === -1 ? $this.hide() : $this.show();
            })
            if($target.find('tbody tr:visible').size() === 0) {
              var col_count = $target.find('tr').first().find('td').size();
              var no_results = $('<tr class="filterTable_no_results"><td colspan="'+col_count+'">Не нашло результатов</td></tr>')
              $target.find('tbody').append(no_results);
            }
             if($target.find('tbody tr:visible').size() <= $('#maxRows').val()){
              $('.pagination').hide();
            }
          }
        });
      });
    }
  });
  $('[data-action="filter"]').filterTable();
})(jQuery);

$(function(){
  $('[data-action="filter"]').filterTable();
  
  $('.container').on('click', '.panel-heading span.filter', function(e){
    var $this = $(this), 
      $panel = $this.parents('.panel');
    
    $panel.find('.panel-body').slideToggle();
    if($this.css('display') != 'none') {
      $panel.find('.panel-body input').focus();
    }
  });
  $('[data-toggle="tooltip"]').tooltip();
})


function sortTable(f,n){
    var rows = $('#table-id tbody  tr').get();
    rows.sort(function(a, b) {
        var A = getVal(a);
        var B = getVal(b);
        if(A < B) {
            return -1*f;
        }
        if(A > B) {
            return 1*f;
        }
        return 0;
    });

    function getVal(elm){
        var v = $(elm).children('td').eq(n).text().toUpperCase();
        if($.isNumeric(v)){
            v = parseInt(v,10);
        }
        return v;
    }
    $.each(rows, function(index, row) {
        $('#table-id').children('tbody').append(row);
    });
}
var f_sl = 1; 
var f_nm = 1; 
$("#name").click(function(){
    f_sl *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_sl,n);
});
$("#email").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});
$("#pic").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});
$("#dep").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});
$("#selery").click(function(){
    f_nm *= -1; 
    var n = $(this).prevAll().length;
    sortTable(f_nm,n);
});