
  //DOCUMENT READY//

  $( document ).ready(function() {

    //call api for local coordinates, city, state
    $.getJSON("https://ipapi.co/json", function(json) {
    //$.getJSON("http://ip-api.com/json", function(json) {
      console.log(json);
      var lat = json.latitude;
      var lon = json.longitude;
      var city = json.city;
      var state = json.region;
      var zip = json.postal;
      var url = "https://cors-everywhere.herokuapp.com/https://api.darksky.net/forecast/9ce0f25e3cbd60e8f739e602ada1e60c/" + lat + "," + lon;
      
      //call darkSky api for weather data
      $.getJSON(url, function(darkSky) {
        console.log(darkSky);
        var currTemp = darkSky.currently.temperature;
        var feelsLike = darkSky.currently.apparentTemperature;
        var highTemp = darkSky.daily.data[0].temperatureMax;
        var lowTemp = darkSky.daily.data[0].temperatureMin;
        var rainChance = darkSky.currently.precipProbability * 100;
        var pressure = Math.round(100*(darkSky.currently.pressure * 0.02953))/100;
        var humidity = Math.round(darkSky.currently.humidity * 100); 
        var icon = darkSky.currently.icon;   

        var iconArray = [];

        for (i = 0; i <= 4; i++) {
          iconArray.push(darkSky.daily.data[i].icon);
        }   
        
        //Time section
          var sunriseUnix = new Date(darkSky.daily.data[0].sunriseTime * 1000);
          var sunriseHour = sunriseUnix.getHours();
          var sunriseMinute = sunriseUnix.getMinutes();
          if (sunriseMinute < 10) {
            sunriseMinute = "0" + sunriseMinute;
          }
          var sunrise = sunriseHour + ":" + sunriseMinute + "am";
          
          var sunsetUnix = new Date(darkSky.daily.data[0].sunsetTime * 1000);
          var sunsetHour = sunsetUnix.getHours() - 12;
          var sunsetMinute = sunsetUnix.getMinutes();
          if (sunsetMinute < 10) {
            sunsetMinute = "0" + sunsetMinute;
          }
          var sunset = sunsetHour + ":" + sunsetMinute + "pm";
          

          //WINDSPEED SECTION
          var windSpeed = darkSky.currently.windSpeed;
          var windBearing = darkSky.currently.windBearing;
          var windDir;
          if (windBearing > 293 || windBearing < 67) {
            windDir = 'N';
          } else if (windBearing < 247 || windBearing > 113) {
            windDir = 'S';
          } else if (windBearing > 22 || windBearing < 157) {
            windDir = 'E';
          } else if (windBearing < 337 || windBearing > 203) {
            windDir = 'W';
          }
          var wind = windSpeed + " kn " + windDir;
        
          // F to C to F func
          
          var isFahrenheit = true;
          var loArray = [];
          var hiArray = [];

          for(i=0; i<5; i++) {
            loArray.push(darkSky.daily.data[i].temperatureMin);
            hiArray.push(darkSky.daily.data[i].temperatureMax);
          }
        

        // convert F to C function section

          var clickDegrees = function() {

            var changeDegrees = function(inVal) {
              if (isFahrenheit) {
                var outVal = (inVal - 32) * 5 / 9;
                return outVal;
              } else if (!isFahrenheit) {
                var outVal = ((inVal * 9 / 5) + 32);
                return outVal;         
              }
            }

            currTemp = changeDegrees(currTemp);
            $("#temp-num").html(Math.round(currTemp) + "&deg;");

            feelsLike = changeDegrees(feelsLike);
            $("#feels-like").html("feels like " + Math.round(feelsLike) + "&deg;");

            //convert summary string to degC
            var degPos = darkSky.daily.summary.indexOf("°");
            var startPos = darkSky.daily.summary.lastIndexOf(" ",degPos) + 1;
            var summTemp = darkSky.daily.summary.substring(startPos, degPos);
            var cTemp = Math.round(((summTemp - 32) * 5 / 9));
            var newSummString = darkSky.daily.summary.replace((summTemp + "°F"), (cTemp + "°C"));
            
            // update forecast day boxes
            for (i=0; i<5; i++) {
              loArray[i] = changeDegrees(loArray[i]);
              hiArray[i] = changeDegrees(hiArray[i]);
              $("#lo-temp-fc" + i).html(Math.round(loArray[i]) + "&deg;");
              $("#hi-temp-fc" + i).html(Math.round(hiArray[i]) + "&deg;");
            };

            isFahrenheit ? isFahrenheit = false : isFahrenheit = true;
            isFahrenheit ? $("#fOrC").html("&deg;F") : $("#fOrC").html("&deg;C");
            isFahrenheit 
              ? $( "li" ).first().html("Pressure: " + pressure + "inHg") 
              : $( "li" ).first().html("Pressure: " + Math.round(pressure * 25.4, 2) + "mmHg");
            isFahrenheit
              ? $("li:nth-child(3)").html("Wind: " + windSpeed + " kn " + windDir)
              : $("li:nth-child(3)").html("Wind: " + Math.round(windSpeed * 1.852,2) + " km/h " + windDir);
            isFahrenheit
              ? $(".forecast-week-data-box").html(darkSky.daily.summary)
              : $(".forecast-week-data-box").html(newSummString);

          }
          
        //update main view
        
        $(".location-box").html(json.city + ", " + json.regionName + "  " + json.zip);

        $(".container").css("background-image", "url('https://res.cloudinary.com/mgoetti/image/upload/v1495463509/" + icon + "j.jpg')");
        
        $("#temp-num").html(Math.round(currTemp) + "&deg;");
        $("#feels-like").html("feels like " + Math.round(feelsLike) + "&deg;");
        $("#weather-temp-box").click(function(){
          clickDegrees();
        });
        
        $( "li" ).first().html("Pressure: " + pressure + "inHg");
        $("li:nth-child(2)").html("Humidity: " + humidity + "<span id='pct'>&#37;</span>");
        $("li:nth-child(3)").html("Wind: " + wind);
        $("li:nth-child(4)").html("Rain: " + rainChance + "<span id='pct'>&#37;</span>");
        $("li:nth-child(5)").html("Sunrise: " + sunrise);
        $("li:nth-child(6)").html("Sunset: " + sunset);
       
        $("#weather-icon-box").html("<img src='https://res.cloudinary.com/mgoetti/image/upload/v1495229661/" + icon + ".svg' />");
        
        if (currTemp > 99) {
          $("#temp-num").css({
            "font-size": "64px",
            "padding": "0px"
          });
        }
        
        $(".forecast-day-data-box").html(darkSky.minutely.summary + "  " + darkSky.hourly.summary);
        
        // forecast row box section
        for (i=0; i<8; i++) {
          
          var imgString = "<img src='https://res.cloudinary.com/mgoetti/image/upload/v1495229661/" + darkSky.daily.data[i].icon + ".svg' />";
          
          var loString = "<div class='lo-temp-fc' id='lo-temp-fc" + i + "'>" + Math.round(darkSky.daily.data[i].temperatureMin) + "&deg;</div>";
          
          var hiString = "<div class='hi-temp-fc' id='hi-temp-fc" + i + "'>" + Math.round(darkSky.daily.data[i].temperatureMax) + "&deg;</div>";
          
          var precipString = "<div class='precip-fc'>" + Math.round(darkSky.daily.data[i].precipProbability * 100) + "<span id='pct'>&#37;</span></div>";
          
        $( ".forecast-row-box > div:nth-child(" + (i+1) + ")" ).html(imgString + loString + hiString + precipString);
        }  
        
        $(".forecast-week-data-box").html(darkSky.daily.summary);

        
      }); // end callback section
    });

  });



