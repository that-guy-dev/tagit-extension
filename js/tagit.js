(function( $, window, document, undefined ) {
    $( document ).ready(function() {
        var t = $( "#tags" ).tagging();
        
        chrome.storage.sync.get(['key'], function(result) {        
          if (!result.key) {
            $("#login").removeClass("hidden");
            $("#mainPopup").addClass("hidden");
          }
        });                
    });
})( window.jQuery, window, document );

function clickHandler(e) {
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true,
    },
    function (foundTabs) {
      
      chrome.storage.sync.get(['key'], function(result) {
        var token = result.key;

        if (foundTabs.length > 0) {
          const url = foundTabs[0].url;
          $(".tag span").add($(".tag a")).remove();
          const tags = [];
          $(".tag").each(function(){ 
            tags.push($(this).text());
          });
          $("#tagButton").text("")
          $(".spinner").removeClass("hidden");

          $.ajax({
            url: 'http://localhost:5000/article',
            type: 'post',
            data: {
              url, tags
            },
            headers: {
              Authorization: `Bearer ${token}`
            },
            dataType: 'json',            
            success: function (data) {
              $(".spinner").addClass("hidden")
              $("#tagButton").text("tag")
              $("#success").removeClass("hidden");
            },
            failure: function(error) {
              alert( "error" );
            },
          });

          // $.post('http://localhost:5000/article', { url, tags })
          // .done( function() {
          //   $(".spinner").addClass("hidden")
          //   $("#tagButton").text("tag")
          //   $("#success").removeClass("hidden");
          // })
          // .fail(function() {
          //   alert( "error" );
          // });

        }  

      });

     
    }
  );
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      document.querySelector("#urlpath").value = tabs[0].url;
  });
  document.querySelector('#tagButton').addEventListener('click', clickHandler);
});
