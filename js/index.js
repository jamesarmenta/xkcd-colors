$(document).ready(function() {
  //variables
  var colors = [];
  var colorname = [];
  var hex = [];
  var rgb = [];
  
  ///////////////////
  //get text file
  $.ajax({
      type: "GET",
      url: "http://cdn.rawgit.com/jamesarmenta/xkcd-colors/master/rgb.txt",
      dataType: "text",
      success: function(data) {processData(data);}
   });

  //process file
  function processData(data)
  {
    all = data.split(/\,/);
    $.each(all, function(i, val){
      line = val.split("#");
      colorname[i] = line[0].slice(0, - 1);
      hex[i] = "#"+line[1];
      rgb[i] = hexToRgb(hex[i].replace("#",""));
      colors[i] = [colorname[i],hex[i],rgb[i]];
    })
  }

  //conversion
  function hexToRgb(hex) 
  {
      r = parseInt(hex.substring(0,2),16);
      g = parseInt(hex.substring(2,4),16);
      b = parseInt(hex.substring(4,6),16);

    return r+","+g+","+b;
  }
  /////////////////
  // clicks
  $("html").click(function(event){
    var target = $(event.target);
    if( !target ){ target = window.event;}
    if(!target.is("input")&&!target.is("a"))
      {
        random = parseInt(Math.random()*colors.length);
        activeColor(random);
      }
    if(target.is("a")){
      colorindex = target.attr("onclick");
      activeColor(colorindex);
    }
  });
  //active color
  function activeColor(index)
  {
    $("#cover").stop().animate({'background-color':colors[index][1]}, 10);
    $("#colorname").html(colors[index][0]);
    $("#rgb").html(colors[index][2]);
    $("#hex").html(colors[index][1]);

    var exists=$('#recent li:contains('+colors[index][0]+')').length;
    if(!exists){
      $("#recent li").last().remove();
      $("#recent ul").prepend(listColor(index));
    }
    
    rgbvals = colors[index][2].split(",");
    luma = parseInt(Number(rgbvals[0])*.2126+Number(rgbvals[1])*.7152+Number(rgbvals[2])*.0722);
    //alert(luma);
    if(luma>255*.75){$("*, a, .invert").css("color","#000 !important");}else{$("*, a, .invert").css("color","#FFF !important");}
  }
  //list function
  function listColor(index)
  {
    return '<li class="invert"><a href="#" onclick="'+index+'">'+colors[index][0]+'</a></li>';
  }
  
  $('#search').on('keyup', function () {
    var value = this.value;
    $("#results ul").html("");
    $.each(colors, function(i, val) {
        if (val[0].search(value) > -1) {
            $("#results ul").append(listColor(i));
        }
    });
    
    function clearSearch()
    {
      $('#search').val(""); 
      $("#results ul").html("");
    }
    
    $(document).keyup(function(e) {
      if (e.keyCode == 27){clearSearch();}   // esc
    });
});
});