var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl).then(function(data) {
    //console.log(data.features);

    // set different color from magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // set radiuss from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  function styleFormat(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

    var quakesLayer = L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleFormat,
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    });

    createMap(quakesLayer);
  });

function createMap(quakes){
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  var overlayMaps = {
    Earthquakes: quakes
  };

  var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom:4,
    layers: [street, quakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({
    position: "bottomright"
  });

  // details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
    var labelsColor = [];
    var labelsText = [];

    limits.forEach(function(limit, index) {
      labelsColor.push(`<li style="background-color: ${colors[index]};"></li>`);
      labelsText.push(`<span class="legend-label">${limits[index]}</span>`)
    });

    var labelsColorHtml =  "<ul>" + labelsColor.join("") + "</ul>";
    var labelsTextHtml = `<div id="labels-text">${labelsText.join("<br>")}</div>`;
  
    var legendInfo = "<h4>Earthquake<br>Magnitude</h4>" +
      "<div class=\"labels\">" + labelsColorHtml + labelsTextHtml
      "</div>";
    div.innerHTML = legendInfo;
  
    return div;
  }

  // Add legend to the map.
  legend.addTo(myMap);
}