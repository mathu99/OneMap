$(window).on("load",function()
{
  var bestPictures = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local:searchData
  });

  $('#map-search .typeahead').typeahead(null,{
    name: 'best-pictures',
    display: 'value',
    source: bestPictures,
    templates: {
      empty: [
        '<div class="empty-message">',
        'Unable to find any rooms or areas that match that query',
        '</div>'
      ].join('\n'),
      suggestion: Handlebars.compile('<div><strong>{{value}}</strong></div>')
      //suggestion: Handlebars.compile('<div><strong>{{value}}</strong> – {{year}}</div>')
    }
  });

});

$( document ).ready(function()
{
	$(".icon-item").click(function()
	{
		$(".icon-item").removeClass('icon-selected');
		$(this).addClass('icon-selected');		
		$("#custom-icon-input").val("");
	});


	$(".marker-item").click(function()
	{
		$(".marker-item").removeClass('marker-selected');
		$(this).addClass('marker-selected');		
	});

	$("#custom-icon-input").focus(function()
	{
		$(".icon-item").removeClass('icon-selected');
	});

	//Funciton to get a selected menu item, move to a marker and open its popup
	$("body").on('click', '.tt-suggestion', function()
	{
      for (var i = 0; i < objectArray.length; i++)
		{
			if ($(this).text() == objectArray[i].desc)
			{
				objectArray[i].object.openPopup();
				
				
				var yeah,
                 thebounds;
				yeah= L.latLng(objectArray[i].lat,objectArray[i].lon);
				thebounds = L.latLngBounds(yeah, yeah);
				map1.setMaxBounds(thebounds);
			 
			 
				//map1.setView(yeah,5);
				
				sidebar1.close();
			}
		}
	});

	//http://twitter.github.io/typeahead.js/examples/



	/*var states = new Bloodhound(
	{
  		datumTokenizer: Bloodhound.tokenizers.whitespace,
  		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: data
	});*/



    $("")
});