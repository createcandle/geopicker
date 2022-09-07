var city_names = "";
var cities = {};

window.addEventListener('load', (event) => {
    console.log('The page has fully loaded');
    
    var world_map = document.getElementById('world'); 
    var indicator = document.getElementById('indicator'); 
    var cell = document.getElementById('cell'); 
    
    //or however you get a handle to the IMG
    var world_map_width = world_map.clientWidth;
    var world_map_height = world_map.clientHeight;
    console.log("world_map_width: ", world_map_width);
    console.log("world_map.naturalWidth: ", world_map.naturalWidth);
    console.log("window.scrollX: ", window.scrollX);
    
    const x_fraction = world_map_width / 360;
    const y_fraction = world_map_height / 180;
    
    console.log("x_fraction: ", x_fraction);
    console.log("y_fraction: ", y_fraction);
    
    cell.style.width = x_fraction + 'px';
    cell.style.height = y_fraction + 'px';
    
	world_map.addEventListener('click', (event) => {
		console.log(event);
        
        console.log(world_map.offsetLeft);
        console.log(event.pageX);
        console.log("--");
        
        var offsets = getElementOffset(world_map);
        console.log("offsets: ", offsets);
        
        
        //var x = event.pageX - world_map.offsetLeft;
        //var y = event.pageY - world_map.offsetTop;
        
        var x = event.pageX - offsets.left;
        var y = event.pageY - offsets.top;
        console.log("pixel coordinates: ", x,y);
        
        indicator.style.left = x + 'px';
        indicator.style.top  = y + 'px';
        
        // Place at the rounded coordinates
        //indicator.style.left = Math.round(x) + 'px';
        //indicator.style.top  = Math.round(y) + 'px';
        
        // Invert Y coordinate for correct lattitude
        
        
        // calculate "precise" lat-lon. It's not very precise because its limited by the pixel resolution of the image.
        // TODO: perhaps a more precise pixel position could be gotten by using world_map.naturalWidth?
        var x_coordinate = (x / x_fraction - 180);
        var y_coordinate = (y / y_fraction - 90) * -1;
        console.log( "x_coordinate: ", x_coordinate);
        console.log( "y_coordinate: ", y_coordinate);
        document.getElementById('coordinates-lat').innerText = y_coordinate.toFixed(2);;
        document.getElementById('coordinates-lon').innerText = x_coordinate.toFixed(2);;
        
        // calculate rounded lat-lon
        var rounded_x_coordinate = Math.round(x_coordinate);
        var rounded_y_coordinate = Math.round(y_coordinate);
        console.log( "rounded_x_coordinate: ", rounded_x_coordinate);
        console.log( "rounded_y_coordinate: ", rounded_y_coordinate);
        document.getElementById('rounded-lat').innerText = rounded_y_coordinate;
        document.getElementById('rounded-lon').innerText = rounded_x_coordinate;
        
        document.getElementById('coordinates-container-precise').style.display = 'block';
        document.getElementById('coordinates-container-rounded').style.display = 'block';

	});
    
    
    var req = new XMLHttpRequest();
    req.open('GET', 'cities.csv');
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        if (req.status == 200) {
            
            processCSV(req.responseText);
          //var lines = req.responseText.split(/\n/g);
          //lines.forEach(function(line, i) {
            // 'line' is a line of your file, 'i' is the line number (starting at 0)
          //});
        } else {
            console.log('Error loading csv file');
          // (something went wrong with the request)
        }
      }
    }

    req.send();
    
    document.getElementById("search-input").addEventListener("keyup", (event) => {
        console.log("keyup"); 
        
        var search_string = document.getElementById("search-input").value;
        if(search_string.length > 1){
            search(search_string);
        }
        else{
            document.getElementById("search-results").innerHTML = "";
        }
        
    });
    
    
    document.getElementById("search-results").addEventListener('click', (event) => {
        console.log(event);
        console.log(event.target.innerText);
        pinpoint_city(event.target.innerText);
    });
    
});


function getElementOffset(el) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
  };
}


function processCSV(allText) {
    console.log("parsing csv...");
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            city_names += '"' + data[0] + '"';
            cities[data[0]] = {'lat':parseFloat(data[1])/10,'lon':parseFloat(data[2])/10}
        }
        else{
            console.log("Error in line, too many commas?: ", allTextLines[i]);
        }
    }
    console.log("csv parsed. names.length: ", city_names.length);
    document.getElementById('search-container').style.display = "block";
    
    // alert(lines);
}


function search(city_name){
    var rx = new RegExp('"([^"]*'+city_name+'[^"]*)"','gi');
    var i = 0, results = '';
    while (result = rx.exec(city_names)) {
      results += "<li>" + result[1] + "</li>";
      i += 1;
      if (i >=10)
        break;
    }
    console.log("Search results: ", results);
    console.log("result count: ", i);
    document.getElementById('search-results').innerHTML = results;
}

function pinpoint_city(city_name){
    try{
        console.log(cities[city_name]['lat']);
        console.log(cities[city_name]['lon']);
        
        document.getElementById('coordinates-lat').innerText = cities[city_name]['lat'];
        document.getElementById('coordinates-lon').innerText = cities[city_name]['lon'];
        document.getElementById('rounded-lat').innerText = Math.round(cities[city_name]['lat']);
        document.getElementById('rounded-lon').innerText = Math.round(cities[city_name]['lon']);
        
        show_pin(cities[city_name]['lat'],cities[city_name]['lon']);
    }
    catch(e){
        console.log("Error gettiing city data from dictionary: ", e);
    }
}


function show_pin(lat,lon){
    console.log("in show_pin. Lat and lon:", lat,lon);
    var world_map = document.getElementById('world'); 
    var indicator = document.getElementById('indicator'); 
    var cell = document.getElementById('cell'); 
    
    //or however you get a handle to the IMG
    var world_map_width = world_map.clientWidth;
    var world_map_height = world_map.clientHeight;
    console.log("world_map_width: ", world_map_width);
    console.log("world_map_height: ", world_map_height);
    console.log("world_map.naturalWidth: ", world_map.naturalWidth);
    console.log("window.scrollX: ", window.scrollX);
    
    const x_fraction = world_map_width / 360;
    const y_fraction = world_map_height / 180;
    
    console.log("x_fraction: ", x_fraction);
    console.log("y_fraction: ", y_fraction);
    
    console.log("lon + 180: ", lon + 180);
    console.log("lat + 90: ", lat + 90);
    
    const x_pos = x_fraction * (lon + 180);
    const y_pos = world_map_height - y_fraction * (lat + 90);
    console.log("x_pos: ", x_pos);
    console.log("y_pos: ", y_pos);
    
    indicator.style.left = x_pos + 'px';
    indicator.style.top  = y_pos + 'px';
    
    // Position cell at rough coordinates
    /*
    var rounded_pixel_x = (rounded_x_coordinate + 180) * x_fraction;
	var rounded_pixel_y = (rounded_y_coordinate + 90) * y_fraction;
    
    cell.style.left = Math.round(rounded_pixel_x - (x_fraction / 2)) + 'px';
    cell.style.top  = Math.round(rounded_pixel_y - (y_fraction / 2)) + 'px';
    */
    
    document.getElementById('coordinates-container-precise').style.display = 'block';
    document.getElementById('coordinates-container-rounded').style.display = 'block';
    
    
}
