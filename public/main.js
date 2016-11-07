'use strict'
$(document).ready(function(){
const drawlist = function(){
    $.ajax({
        url      : "/todos",
        type     : 'get',
        dataType : 'json',
        success  : function(todos) {
        $('#MyTodoList').html(' ');
          todos.forEach(function(todoItem){
              const li = $('<li>'+todoItem.message+'<input type="checkbox"><button id="'+todoItem.id+'" class = "dlt">Delete</button></li>');
              const input = li.find("input");
              input.prop('checked', todoItem.completed);
              input.on('change', function(){
                  todoItem.completed = input.prop('checked');
              });
              
              $('#MyTodoList').append(li);
              li.find(".dlt").on("click", function() {
                $.ajax({
                    url     : "/todos/" + todoItem.id,
                    type    : 'delete',
                    success : function(data) {
                      
                      drawlist();
                    },
                    error   : function(data) {
                        alert('Error deleting the item');
                    }
                  });
              });
                li.find('input').prop('checked',todoItem.completed).on('change',function(){
                  $.ajax({
                      url         : "/todos/" + todoItem.id,
                      type        : 'put',
                      dataType    : 'json',
                      data        : JSON.stringify(todoItem),
                      contentType : "application/json; charset=utf-8",
                      success     : function(data) {
                        
                      },
                      error       : function(data) {
                          alert('Error creating todo');
                      }
                  });
                });
 
           });
          
       
        }
        })
        
};
 drawlist();
 $('#add').on('click', function() {
  const val = $('#Add').val();
 $('#Add').val('');
    $.ajax({
       url         : "/todos",
       type        : 'post',
       dataType    : 'json',
       data        : JSON.stringify({
           message   : val,
           completed : false
       }),
       contentType : "application/json; charset=utf-8",
       success     : function(data) {
        $('#MyTodoList').html(' ');
         
         drawlist();
       }
   });
});
$('#searchbtn').on('click', function(){
    let searchtext = $('#searchbox').val();
    $.ajax({
        url      : "/todosSearch",
        type     : 'get',
        dataType : 'json',
        success  : function(todos) {
              $('#MyTodoList').html(' ');
                let filteredTodos = todos.filter(function(item){
                  return searchtext && item.message.indexOf(searchtext) >= 0;
                });
              filteredTodos.forEach(function(todoItem){
                const li = $('<li>'+todoItem.message+'<input type="checkbox"><button class = "dlt">Delete</button></li>');
                const input = li.find("input");
                input.prop('checked', todoItem.completed);
                input.on('change', function(){
                    todoItem.completed = input.prop('checked');
                });
                li.find('input').prop('checked',todoItem.completed).on('change',function(){
                  $.ajax({
                      url         : "/todos/" + todoItem.id,
                      type        : 'put',
                      dataType    : 'json',
                      data        : JSON.stringify(todoItem),
                      contentType : "application/json; charset=utf-8",
                      success     : function(data) {
                        
                      },
                      error       : function(data) {
                          alert('Error creating todo');
                      }
                  });
                });
                $('#MyTodoList').append(li);
              });
        },
        error    : function(data) {
            alert('Error searching');
        }
    });
  });
  
  
    
})