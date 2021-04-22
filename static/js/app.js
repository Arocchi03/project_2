//Use the D3 library to read in samples.json.
//console.log(JSON.stringify("../../data/samples.json"));
//d3.json("data/samples.json").then((samples) => {
  //  Create the Traces
//  console.log(samples);
// there are 153 samples
// for otu_ids - they are arrays.  There are corresponding sample_values and otu_labels
//});
// dataset already seems to be sorted by highest found to lowest by sample_values
var airData = d3.json("http://127.0.0.1:5000/airbnb");
var crimeData = d3.json("http://127.0.0.1:5000/crimes");

// Get a reference to the table body
var meta = d3.select("#sample-metadata");

var list = d3.select("#listings");
// Select the button
var form = d3.select("#selDataset");
//metaId = [];

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
  buildPage(val);
};

function initSelect(indata){
  //console.log(initdata);
  // sort in alphabetical order
  var options = '';
  var selections = [];
  for ( var j = 0 ; j < indata.length; j++) {
    selections.push(indata[j].neighbourhood);
  }
  var unique = selections.filter(onlyUnique);
  console.log(unique);
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

function buildPage(id){
  airData.then((samples) => {
    //console.log(samples);
    console.log(samples);
    var countlist = 0;
    if(id == 0){
      // this is the initial page load
      // buildTop Ten Plot
      console.log("hitting init page");
      //buildTopTenPlot(samples.samples[0]);
      //build scatter plot
      //buildScatterPlot(samples.samples[0]);
      //build metadata
      //buildTable(samples.metadata[0]);
      //Build select
      //neighborhood = ["Beverly", "Gold Coast", "Downtown"];
      //initSelect(neighborhood);
      initSelect(samples);
      //build guage
      //buildGuage(samples.metadata[0])
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
      for ( var i = 0 ; i < samples.length; i++) {
        //if (samples.metadata[i].id === id){
        //  console.log("Building metadata");
        //  buildTable(samples.metadata[i]);
        //}
        if(samples[i].neighbourhood === id){
          countlist = countlist+1;
          tempId.push(samples[i].id);
          tempNames.push(samples[i].name);
          tempPrice.push(samples[i].price);
          tempRoomType.push(samples[i].room_type);
          tempAvail.push(samples[i].availability_365);
          tempMinNights.push(samples[i].minimum_nights);
          tempLat.push(samples[i].latitude);
          tempLong.push(samples[i].longitude);
          console.log("building plots")
          //console.log(samples[i]);
        }
      }
      buildTable(tempAvail, tempMinNights, tempPrice);
      buildListingTable(tempId, tempNames, tempPrice)
      buildGuage(countlist);
      buildTopTenPlot(tempId, tempPrice);
      buildScatterPlot(tempId, tempPrice, tempLat, tempLong)
    }
    
  });
};

buildPage(0);
//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.

//Create a bubble chart that displays each sample.
//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values.


//Display the sample metadata, i.e., an individual's demographic information.


//Display each key-value pair from the metadata JSON object somewhere on the page.


//Update all of the plots any time that a new sample is selected.