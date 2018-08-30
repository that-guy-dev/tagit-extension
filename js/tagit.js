(function( $, window, document, undefined ) {
    $( document ).ready(function() {
        var t = $( "#tags" ).tagging();
    });
})( window.jQuery, window, document );

function clickHandler(e) {
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true,
    },
    function (foundTabs) {
      if (foundTabs.length > 0) {
        const url = foundTabs[0].url;
        $(".tag span").add($(".tag a")).remove();
        const tags = [];
        $(".tag").each(function(){ 
          tags.push($(this).text());
        });
        $("#tagButton").text("")
        $(".spinner").removeClass("hidden")
        $.post('http://localhost:5000/article', { url, tags })
        .done( function() {
          $(".spinner").addClass("hidden")
          $("#tagButton").text("tag")
          $("#success").removeClass("hidden");
        })
        .fail(function() {
          alert( "error" );
        });
      } 
    }
  );
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      document.querySelector("#urlpath").value = tabs[0].url;
  });
  document.querySelector('#tagButton').addEventListener('click', clickHandler);
});
