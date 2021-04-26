//Use the D3 library to read in samples.json.

//global of what neighborhood is selected
var neighborhood;
//global array of AirBnb Listings per Neighborhood
var neighborhoodCount = [];
//global array of unique neighborhoods 
var uniqueN = [];

var airData = d3.json("http://127.0.0.1:5000/airbnb");
var crimeData = d3.json("http://127.0.0.1:5000/crimes");

// Get a reference to the table body
var meta = d3.select("#sample-metadata");
var list = d3.select("#listings");
var form = d3.select("#selDataset");
var labelN = d3.select("#dataLabel");

/*
var granimInstance = new Granim({
  element: ‘#granim-canvas’,
  direction: ‘top-bottom’,
  isPausedWhenNotInView: true,
  image : {
    source: ‘img/chi_flag.png’,
    blendingMode: ‘multiply’
},
  states : {
      “default-state”: {
          gradients: [
              [‘#FF0000’, ‘#B3DDF2’],
              [‘#B3DDF2’, ‘#0096FF’],
              [‘#FF0000’, ‘#B3DDF2’],
              [‘#B3DDF2’, ‘#0047AB’],
          ],
          transitionSpeed: 3000
      }
  }
});
*/

//Map stuff
var map = L.map("map", {center: [41.881832, -87.623177], zoom: 11 });
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
  }
).addTo(map);

// var markerLayer = L.layerGroup([littleton, denver, aurora, golden]);
/*
var myMap = L.map("map", {
  center: [41.881832, -87.623177],
  zoom: 11
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
*/

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

function setDropDown(indata){
  //console.log(initdata);
  // sort in alphabetical order
  var options = '';
  var tempA = [];
  for ( var j = 0 ; j < indata.length; j++) {
    tempA.push(indata[j].neighbourhood);
    //console.log(indata[j].neighbourhood);
  }
  uniqueN = tempA.filter(onlyUnique);
  //add unique N to the drop down
  uniqueN.sort();
  for ( var k = 0 ; k < uniqueN.length; k++) {
    //metaId.push(otuData.metadata[j].id);
    options += '<option value="' + uniqueN[k] + '">' + uniqueN[k] + '</option>';
  }
  form.html(options);
};

//first attempt at drop down population

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
  //uniqueN = selections.filter(onlyUnique);
  //console.log(unique);
  unique.sort();
  for ( var k = 0 ; k < unique.length; k++) {
    //metaId.push(otuData.metadata[j].id);
    options += '<option value="' + unique[k] + '">' + unique[k] + '</option>';
  }
  form.html(options);
};

// counts the numer of listings per neighborhood
function countListings(val){
  // counts the numer of listings per neighborhood
  var countfiltered = airData.filter(function(element){
    return element.neighbourhood === val;
  }).length;
  console.log(countfilterd);
};

function buildNeighborhoodListingPiePlot(inData){
// Render the plot to the div tag with id "bar"
for (var k = 0; k<uniqueN.length; k++){
    neighborhoodCount[k] = 0;
}
for (var i = 0; i<inData.length; i++){
  for (var j = 0; j<uniqueN.length; j++){
    if (inData[i].neighbourhood === uniqueN[j]){
      neighborhoodCount[j] = neighborhoodCount[j]+1;
    }
  }
}

//console.log(neighborhoodCount);
//console.log(uniqueN);
var plotData = [{
  values: neighborhoodCount,
  labels: uniqueN,
  type: 'pie',
  textinfo:  'none'
}];

var layout = {
  title: "Number of Listings by Neighborhood",
  //legend: true,
  height: 400,
  width: 500
};
Plotly.newPlot("bar", plotData, layout);

};

//Build initial Sidebar metadata
function buildInitTable( ) {
  meta.html("");
  labelN.text("Low Listing Neighborhoods");
  var row;
  var cell;
  var str;
  console.log("hitting build init table");
  //var row = meta.append("tr");
  //Object.entries(indata).forEach(([key, value]) => { 
  for (var i = 0; i<uniqueN.length; i++) 
  {
    if (parseInt(neighborhoodCount[i])<10){
      row = meta.append("tr");
      cell = row.append("td");
      str = uniqueN[i] + ": " + neighborhoodCount[i];
      console.log(str);
      cell.text(str);
    }
  }
};

//Build Sidebar metadata
function buildTable(avail, minday, price) {
    meta.html("");
    labelN.text("Neighborhood Statistics");
    //var row = meta.append("tr");
    //Object.entries(indata).forEach(([key, value]) => {  
      var row = meta.append("tr");
      var cell = row.append("td");
      var str = "Number of Listings: " + avail.length;
      cell.text(str);
      var row2 = meta.append("tr");
      var cell2 = row2.append("td");
      var str2 = "Average Availability: " + math.round(average(avail),2);
      cell2.text(str2);
      var row3 = meta.append("tr");
      var cell3 = row3.append("td");
      var str3 = "Average Min Nights: " + math.round(average(minday),2);
      cell3.text(str3);
      var row4 = meta.append("tr");
      var cell4 = row4.append("td");
      var str4 = "Average Price: " + math.round(average(price),2);
      cell4.text(str4);
    //});
};

function buildListingTable(inId, inName, inPrice, sortid) {
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
};

function buildNewListingTable(inData, sortid) {
  var sortedData;
  list.html("");
  if (sortid == 0){
    // sort low to high
    console.log("Sorting by price low to high");
      sortedData = inData.sort(function(a, b){
        return parseInt(a.price) < parseInt(b.price);
      });
  }
  // sort low to high

  else if (sortid == 1){
    // sort by high to low
    console.log("Sorting by price high to low");
    sortedData = inData.sort(function(a, b){
      return parseInt(b.price) < parseInt(a.price);
    });
  }
  else{
    // default seems to be sort by id
    console.log("Sorting by id");
    sortedData = inData.sort();
  }

  console.log(sortedData);
  //});
  //var row = list.append("tr");
  //Object.entries(indata).forEach(([key, value]) => {
  for (var m = 0; m < sortedData.length; m++){
    var obj = sortedData[m];
    var row = list.append("tr");
    var cell = row.append("td");
    cell.text(m+1);
    var cell1 = row.append("td");
    cell1.text(obj.id);
    var cell2 = row.append("td");
    cell2.text(obj.name);
    var cell3 = row.append("td");
    cell3.text(obj.price);
  }

};

function buildTopTenPlot(id, price) {
  // Trace1 for the Data
  //bar.html("");
  var otuy = [];
  //var otu = price.slice(0,10).reverse();
  //var otu = inData.price.sort((a , b) => parseInt(b) - parseInt(a));
  //for (var k=0; k< 10; k++) {
  //otuy.push("ID-"+inData.id[k]);
  //}
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
  //console.log(sampleid);
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

    // console.log("here! ", data3);
  })};


function addMarkers() {
    for (var i = 0; i < markers.length; i++) {
      marker = new L.marker([markers[i][1], markers[i][2]])
        .bindPopup(markers[i][0])
        .addTo(map);
    }}
//console.log(crimeData)

function addCrimeMarkers(neighborhood) {
    crimeData.then((crimeData) => {
    crimemarkers = [];
    for (var i = 0 ; i < crimeData.length; i++) {
      if(crimeData[i].community_name === neighborhood){
        crimemarkers.push([crimeData[i].primary_type,crimeData[i].lat, crimeData[i].lng])}}
    console.log(crimemarkers)

    var redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    for (var i = 0; i < crimemarkers.length; i++) {
      marker = new L.marker([crimemarkers[i][1], crimemarkers[i][2]], {icon: redIcon})
        .bindPopup(crimemarkers[i][0])
        .addTo(map);}
  })};

  // build the page
function buildPage(id){
  airData.then((data) => {
    var countlist = 0;
    if(id == 0){
      // this is the initial page load
      // buildTop Ten Plot
      console.log("hitting init page");
      setDropDown(data);
      console.log(uniqueN);
      //console.log(airData);
      //neighborhood = ["Beverly", "Gold Coast", "Downtown"];
      //initSelect(neighborhood);
      //initSelect(data);
      buildNeighborhoodListingPiePlot(data);
      buildInitTable();
      //build guage
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
      crimemarkers = [];
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
          console.log("building plots")
          map.setView([tempLat[0], tempLong[0]], 13)
          console.log("building plots")
          markers.push([data[i].name,data[i].latitude, data[i].longitude])
        }
      }
      buildTable(tempAvail, tempMinNights, tempPrice);
      //buildListingTable(tempId, tempNames, tempPrice);
      //buildGuage(countlist);
      buildTopTenPlot(tempId, tempPrice);
      buildScatterPlot(tempId, tempPrice, tempLat, tempLong);
      var filteredData = data.filter(d => d.neighbourhood === id);
      buildNewListingTable(filteredData, 0);
      outlineMap();
      addMarkers();
      addCrimeMarkers(neighborhood);
      console.log(markers)
    }
    
  });
}

buildPage(0);