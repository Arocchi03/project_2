//Use the D3 library to read in samples.json.
var neighborhood;

var airData = d3.json("http://127.0.0.1:5000/airbnb");
var crimeData = d3.json("http://127.0.0.1:5000/crimes");

// Get a reference to the table body
var meta = d3.select("#sample-metadata");
var list = d3.select("#listings");
var form = d3.select("#selDataset");


function onlyUnique(value, index, self){
  return self.indexOf(value) === index;
}

function sum(arr) {
  return arr.reduce(function (a, b) {
     return parseInt(a) + parseInt(b);
  }, 0);
};

function average(arr) {
  return sum(arr)/arr.length;
};

function optionChanged(val) {
  console.log("new neighborhood: " + val);
  neighborhood = val;
  buildPage(val);
};

function initSelect(indata){
  //console.log(initdata);
  // sort in alphabetical order
  var options = '';
  var selections = [];
  for ( var j = 0 ; j < indata.length; j++) {
    selections.push(indata[j].neighbourhood);
    //console.log(indata[j].neighbourhood);
  }
  var unique = selections.filter(onlyUnique);
  //console.log(unique);
  unique.sort();
  for ( var k = 0 ; k < unique.length; k++) {
    //metaId.push(otuData.metadata[j].id);
    options += '<option value="' + unique[k] + '">' + unique[k] + '</option>';
  }
  form.html(options);
  //otuId.sort();
  //console.log(otuId);
  //console.log(metaId);
};

//Build Sidebar metadata
function buildTable(avail, minday, price) {
    meta.html("");
    //var row = meta.append("tr");
    //Object.entries(indata).forEach(([key, value]) => {  
      var row = meta.append("tr");
      var cell = row.append("td");
      //var str = key + " : " + value;
      var str = "Number of Listings: " + avail.length;
      cell.text(str);
      var row2 = meta.append("tr");
      var cell2 = row2.append("td");
      //var str = key + " : " + value;
      var str2 = "Average Availability: " + math.round(average(avail),2);
      cell2.text(str2);
      var row3 = meta.append("tr");
      var cell3 = row3.append("td");
      //var str = key + " : " + value;
      var str3 = "Average Min Nights: " + math.round(average(minday),2);
      cell3.text(str3);
      var row4 = meta.append("tr");
      var cell4 = row4.append("td");
      //var str = key + " : " + value;
      var str4 = "Average Price: " + math.round(average(price),2);
      cell4.text(str4);
    //});
};

function buildListingTable(inId, inName, inPrice) {
  list.html("");
  //var row = list.append("tr");
  //Object.entries(indata).forEach(([key, value]) => {
  for (var m = 0; m < inId.length; m++){
    var row = list.append("tr");
    var cell = row.append("td");
    cell.text(m+1);
    var cell1 = row.append("td");
    cell1.text(inId[m]);
    var cell2 = row.append("td");
    cell2.text(inName[m]);
    var cell3 = row.append("td");
    cell3.text(inPrice[m]);
  }
  //});
};

function buildTopTenPlot(id, price) {
  // Trace1 for the Greek Data
  var otuy = [];
  //var otu = price.slice(0,10).reverse();
  var otu = price.sort((a , b) => b - a);
  for (var k=0; k< 10; k++) {
    otuy.push("ID-"+id[k]);
  }
  var trace1 = {
  //x: reversedData.map(object => object.sample_values),
  //y: reversedData.map(object => object.otu_ids),
  //text: reversedData.map(object => object.otu_labels),
    x: otu.slice(0,10).reverse(),
    //y: sampleid.otu_ids.slice(0,10).reverse(),
    y:  otuy,
    //text: sampleid.otu_labels.slice(0,10).reverse(),
    name: "Top 10 by Price",
    type: "bar",
    orientation: "h"
  };

  // data
  var data = [trace1];

  // Apply the group bar mode to the layout
  var layout = {
    title: "Top 10",
    height: 400,
    width: 500
  };

//console.log(samples.samples[0].otu_ids);

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", data, layout);

};

function buildScatterPlot(id, price, lat, long) {
 // var divSize = sampleid.sample_values[0];
  var sizeref = 2.0 * price/ (80**2)
  //var divColor = sampleid.otu_ids[0];
  var divColorLen = id.length;
  otuColor = [];
  //sColor = 'rgb(93, 164, 214)';
 
  // picked 4 colors and adding based on otu
  
  for ( var i = 0 ; i < divColorLen; i++) {
    //otuId.push(samples.samples[i].id);
    if (price[i] < 150){
      otuColor.push('rgb(93, 164, 214)');
    }
    else if (price[i] < 300){
      otuColor.push('rgb(255, 144, 14)');
    }
    else if (price[i] < 450){
      otuColor.push('rgb(44, 160, 101)');
    }
    else {
      otuColor.push('rgb(255, 65, 54)');
    }
  }
  
  var trace2 = {
    y: long,
    x: lat,
    text: price,
    mode: 'markers+text',
    type: 'scatter',
    marker: {
      color: otuColor,
      size: 15,
      //sizeref: sizeref,
      //sizemode: 'area'
      //size: [50, 100, 150, 200]
    },
    name: "Price by Lat/Long"
  };

   // data
   var data2 = [trace2];

   var layout = {
     title: 'Price by Lat/Long',
     showlegend: false,
   };
 
   Plotly.newPlot("bubble", data2, layout);
 

};

function buildGuage(count){
  
  var data3 = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: count,
      title: { text: "Total Listings", font: { size: 10 } },
      //delta: { reference: 9, increasing: { color: "RebeccaPurple" } },
      gauge: {
        axis: { range: [null, 500], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 150], color: "lightgray" },
          { range: [150, 300], color: "lightgreen" },
          { range: [300, 500], color: "green" }
        ],
        threshold: {
          line: { color: "red", width: 1 },
          thickness: 0.5,
          value: 400
        }
      }
    }
  ];
  var layout = { width: 300, height: 150, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data3, layout);
}


var map = L.map("map", {center: [41.881832, -87.623177], zoom: 11 });
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
  }
).addTo(map);

// var markerLayer = L.layerGroup([littleton, denver, aurora, golden]);


  function outlineMap () {
    d3.json("https://data.cityofchicago.org/resource/igwz-8jzy.json").then(function(data3){
      data3.map(function(data) {
        data.type = "Feature";
        data.geometry = data.the_geom;
        data.properties = {
          name: data.community,
          popupContent: data.community
        };
    });

    L.geoJSON(data3, {
      style: {
        color: "white",
        fillColor: "purple",
        fillOpacity: 0.5,
        weight: 1.5
      }}).addTo(map);

    console.log("here! ", data3);
  })};


  function addMarkers() {
    var markerLayer = L.layerGroup([littleton, denver, aurora, golden]);
    }


function buildPage(id){
  airData.then((data) => {
    var countlist = 0;
    if(id == 0){
      // this is the initial page load
      // buildTop Ten Plot
      console.log("hitting init page");
      console.log(airData);
      //buildTopTenPlot(samples.samples[0]);
      //build scatter plot
      //buildScatterPlot(samples.samples[0]);
      //build metadata
      //buildTable(samples.metadata[0]);
      //Build select
      //neighborhood = ["Beverly", "Gold Coast", "Downtown"];
      //initSelect(neighborhood);
      initSelect(data);
    }
    else{
      tempId = [];
      tempNames = [];
      tempPrice = [];
      tempRoomType = [];
      tempAvail = [];
      tempMinNights = [];
      tempLat = [];
      tempLong = [];
      markers = [];
      for ( var i = 0 ; i < data.length; i++) {
        
        if(data[i].neighbourhood === neighborhood){
          countlist = countlist+1;
          tempId.push(data[i].id);
          tempNames.push(data[i].name);
          tempPrice.push(data[i].price);
          tempRoomType.push(data[i].room_type);
          tempAvail.push(data[i].availability_365);
          tempMinNights.push(data[i].minimum_nights);
          tempLat.push(data[i].latitude);
          tempLong.push(data[i].longitude);
          map.setView([tempLat[0], tempLong[0]], 13)
          console.log("building plots")
          markers.push([data[i].name,data[i].latitude, data[i].longitude])
          
        }
      }
      buildTable(tempAvail, tempMinNights, tempPrice);
      buildListingTable(tempId, tempNames, tempPrice)
      buildGuage(countlist);
      buildTopTenPlot(tempId, tempPrice);
      buildScatterPlot(tempId, tempPrice, tempLat, tempLong);
      outlineMap();
      console.log(markers)
      for (var i = 0; i < markers.length; i++) {
        marker = new L.marker([markers[i][1], markers[i][2]])
          .bindPopup(markers[i][0])
          .addTo(map);
    }
    
  };
})};

buildPage(0);