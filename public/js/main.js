$(document).ready(function(){
  $('.delete-note').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/notes/'+id,
      success: function(response){
        alert('Deleting Note');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});