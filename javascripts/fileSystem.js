if(jQuery) (function($){
	
	$.extend($.fn, {
    fileDataObject: function(data) {
      $(this).append('<li class="fs-file ' + data['dc:format'].replace('/','_') + '"><a href="#" data-filesize="' + data['nfo:fileSize'] +'" data-mime="' + data['dc:format'] + '">' + data['nfo:fileName'] + '</a></li>');
    },
    folder: function(data) {
      var title = data['nie:title'] || data['@id'] || '';
      $(this).append('<li class="fs-directory"><a href="#">' + title + '</a></li>');
      $(this).children('LI').last().folderContents(data['contains']);
    },
    folderContents: function(data) {
      if (data) {
        $(this).append('<ul style="display:none;"></ul>');
        var t = $(this).children('UL').last();
        for (var i = 0; i < data.length; i++) {
          var g = data[i];
          if (g['@type'] == 'nfo:Folder') {
            t.folder(g);
          } else {
            t.fileDataObject(g);
          }
        }
      }
    },
    bindHandlers: function(h) {
      $(this).find('LI.fs-directory A').bind('click', function() {

        $(this).parent().children('UL').slideToggle({ done: function(){
          if ($(this).is(':visible')) $(this).parent().addClass('fs-expanded');
          else $(this).parent().removeClass('fs-expanded');
        }});
        return false;
      });
      $(this).find('LI.fs-file A').bind('click', function() {
       h($(this)); return false; });
    },
		fileSystem: function(fileHandler) {
			var dataSrc = $(this).attr('data-src');
      if ( dataSrc === undefined ) return;
			var t = $(this);
      $.getJSON(dataSrc, function(data, status, xhr) {
        t.html('');
        t.folder(data);
        t.bindHandlers(fileHandler);
      });
		}
	});
})(jQuery);