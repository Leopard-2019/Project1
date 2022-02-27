// Global variables

var laT1 = 0;
var lnG1 = 0;
var newStateArray = [];

// Event listener for all button elements

$("#add-to-do").on("click", function (event) {
  // prevent form from trying to submit/refresh the page

  event.preventDefault();

  $.getJSON("./doctor.json", function (data) {
    for (i = 0; i < data.length; i++) {
      newStateArray.push({
        id: data[i].id,
        name: data[i].Name,
        speciality: data[i].Speciality,
        street: data[i].Street,
        city: data[i].City,
        state: data[i].State,
        zip: data[i].Zipcode,
        phone: data[i].Phone,
        lat: data[i].lat,
        lng: data[i].lng,
      });
    }
    sample1(newStateArray);
  });

  //zip code typed by the user
  function sample1() {
    var zipcode = $("#to-do").val().trim();

    // checking if the zip code given has 5 digits, if the zip code given has less or more than 5 digits
    // there will not be any URL's construction to zipcodeapi, i.e., any AJAX call etc, otherwise
    // the rest of code is executed, etc.

    if (zipcode.toString().length != 5) {
      var p = $("<p>");
      var p1 = $("<p>").text("PLEASE TYPE A VALID FIVE-DIGITS  ZIP  CODE!!!");
      p = p.append(p1);
      $("#doctorsList").append(p);
    } else {
      // Constructing a URL to search zipcodeapi to covert zip code into location (latitude and longitude)

      // (function () {
      //   var cors_api_host = "cors-anywhere.herokuapp.com";
      //   var cors_api_url = "https://" + cors_api_host + "/";
      //   var slice = [].slice;
      //   var origin = window.location.protocol + "//" + window.location.host;
      //   var open = XMLHttpRequest.prototype.open;
      //   XMLHttpRequest.prototype.open = function () {
      //     var args = slice.call(arguments);
      //     var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
      //     if (
      //       targetOrigin &&
      //       targetOrigin[0].toLowerCase() !== origin &&
      //       targetOrigin[1] !== cors_api_host
      //     ) {
      //       args[1] = cors_api_url + args[1];
      //     }
      //     return open.apply(this, args);
      //   };
      // })();

      var queryURL = `https://app.zipcodebase.com/api/v1/search?apikey=d4432520-9500-11ec-8bf3-df0e35543ab0&codes=${zipcode}&country=us`;

      console.log(queryURL);

      // "https://cors-anywhere.herokuapp.com/https://www.zipcodeapi.com/rest/387ChGdlgT1Ktdv2QD1G3dhtVn6kLUsWOM0auADpXexBunPoU1sDbgf4iPvOoxG5/info.json/" +
      // zipcode +
      // "/degrees";

      // Using ajaxStart to show the loader image

      https: $(document).ajaxStart(function () {
        // Show image container
        $("#loader").show();
      });

      // Performing our AJAX GET request to convert zip code into location (latitude and longitude)

      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (res) {
        // store the response ((latitude, longitude) from the first AJAX call
        const zip = zipcode;
        console.log(res.results[zip][0].latitude);
        laT1 = res.results[zip][0].latitude;
        lnG1 = res.results[zip][0].longitude;
        sample2(laT1, lnG1, newStateArray);

        $(document).ajaxComplete(function () {
          // Hide image container
          $("#loader").hide();
        });
      });
    }
  }
  function sample2() {
    for (var i = 0; i < newStateArray.length; i++) {
      var R = 3958.8; // Radius of earth in Miles
      var dLat =
        (newStateArray[i].lat * Math.PI) / 180 - (laT1 * Math.PI) / 180;
      var dLon =
        (newStateArray[i].lng * Math.PI) / 180 - (lnG1 * Math.PI) / 180;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((laT1 * Math.PI) / 180) *
          Math.cos((newStateArray[i].lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d1 = R * c;

      // A maximum search radius of 5 miles is used around the zipcode typed by the user.

      if (d1 < 5) {
        // Creating a couple of div's with their classes associated with Materialize that will eventually

        var gifDiv1 = $("<div>");
        var gifDiv2 = $("<div>");
        gifDiv1.addClass("card white-grey darken-1");
        gifDiv2.addClass("card-content white-text");

        sec = newStateArray[i].speciality;

        //doctor's specialty selected by the user

        bar1 = $("#op1").val().trim();

        // store the data from the second AJAX call

        if (sec === bar1) {
          var name = newStateArray[i].name;
          var street = newStateArray[i].street;
          var city = newStateArray[i].city;
          var state = newStateArray[i].state;
          var zip = newStateArray[i].zip;
          var phone = newStateArray[i].phone;

          // Creating a paragraph (<p>), span (<span>), and </br>tag with the results

          var p = $("<p>");
          var p1 = $("<span>").text(name);
          var p1a = $("</br>");
          var p2 = $("<span>").text(sec);
          var p2a = $("</br>");
          var p3 = $("<span>").text(street);
          var p3a = $("</br>");
          var p4 = $("<span>").text(city + "," + state + "," + zip);
          var p4a = $("</br>");
          var p5 = $("<span>").text("phone No:" + "" + phone);

          // Preappending the paragraph , span, and break lines into the main paragraph

          p = p.prepend(p1, p1a, p2, p2a, p3, p3a, p4, p4a, p5);

          // Appending the paragraph  into the gifDiv2

          gifDiv2.append(p);

          // Preappending the gifDiv2 into the gifDiv1

          gifDiv1.prepend(gifDiv2);

          // Prepending the gifDiv1 into the "#doctorsList" div in the HTML

          $("#doctorsList").prepend(gifDiv1);
        }
      }
    }
  }
});

//Function  to re-refresh the html page.

$("#rP1").on("click", function rStart() {
  window.location.reload(false);
});
