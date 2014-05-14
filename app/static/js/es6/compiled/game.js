(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getforest);
    $('.container').on('click', '#sell', sell);
    $('#forest').on('click', '.tree.alive', grow);
    $('#forest').on('click', '.chop', chop);
  }
  function sell() {
    alert('h');
  }
  function chop() {
    var tree = $(this).closest('.tree-container');
    var treeId = tree.children().first().data('id');
    debugger;
    $.ajax({
      url: ("/tree/" + treeId + "/chop"),
      type: 'PUT',
      datatype: 'html',
      success: (function(t) {
        console.log(t);
      })
    });
  }
  function grow() {
    var tree = $(this).closest('.tree-container');
    var treeId = $(this).data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/grow"),
      type: 'PUT',
      datatype: 'html',
      success: (function(t) {
        tree.empty();
        tree.replaceWith(t);
      })
    });
  }
  function getforest() {
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      datatype: 'html',
      success: (function(r) {
        $('#forest').empty().append(r);
      })
    });
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      data: {userId: userId},
      datatype: 'html',
      success: (function(tree) {
        $('#forest').append(tree);
      })
    });
  }
  function login(event) {
    var username = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: username,
      success: (function(r) {
        $('#username').text(r.user.username);
        $('#username').attr('data-id', r.user._id);
        $('#wood').text(r.user.wood);
        $('#cash').text(r.user.cash);
        if (r.duplicate) {
          $('#userinput').val('');
          $('#userinput').attr('placeholder', 'Username taken!');
        } else {
          $('#userinput').val('');
          $('#userinput').attr('placeholder', 'Username');
        }
      })
    });
    event.preventDefault();
  }
})();

//# sourceMappingURL=game.map
