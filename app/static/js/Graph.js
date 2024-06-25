import { graph_date } from '/static/js/date.js';
import { random_images } from '/static/js/cerclem.js';
import {graph_place} from '/static/js/place.js';
import {graph_witness} from '/static/js/witness.js';
import {graph_place_date} from '/static/js/place_date.js';
import {graph_place_witness} from '/static/js/place_witness.js';
import { toggleFriseOpacity } from '/static/js/frise_slider.js';


function avoidOverlap(data, projection, imageWidth, imageHeight) {
 for (let i = 0; i < data.length; i++) {
   let [x1, y1] = projection([data[i].long, data[i].lat]);
   data[i].adjustedX = x1;
   data[i].adjustedY = y1;
 }
 for (let i = 0; i < data.length; i++) {
   for (let j = i + 1; j < data.length; j++) {
     let [x2, y2] = projection([data[j].long, data[j].lat]);
     const dx = x2 - data[i].adjustedX;
     const dy = y2 - data[i].adjustedY;
     const distance = Math.sqrt(dx * dx + dy * dy);
     if (distance < imageWidth) {
       data[j].adjustedX = x2 + (imageWidth / 4) * (1 / (distance + 1));
       data[j].adjustedY = y2 + (imageHeight / 4) * (1 / (distance + 1));
       data[i].adjustedX = data[i].adjustedX - (imageWidth / 4) * (1 / (distance + 1));
       data[i].adjustedY = data[i].adjustedY - (imageHeight / 4) * (1 / (distance + 1));
     } else {
       data[j].adjustedX = x2;
       data[j].adjustedY = y2;
     }
   }
 }
}
var mouseover = function (event, d) {
 Tooltip.style("opacity", 1)
}
var mousemove = function (event, d) {
 Tooltip
   .html("Manuscrit:" + d.wit)
   .style("left", (d3.pointer(this)[0] + 10) + "px")
   .style("top", (d3.pointer(this)[1]) + "px")
}
var mouseleave = function (event, d) {
 Tooltip.style("opacity", 0)
}
var Tooltip = d3.select("body") // Style of the tooltip
.append("div")
.attr("class", "tooltip")
.style("opacity", 0)
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")
//get one random observation per witness
function getRandomObservations(observations, key) {
 // Group observations by the distinct variable
 const grouped = observations.reduce((acc, observation) => {
   const keyValue = observation[key];
   if (!acc[keyValue]) {
     acc[keyValue] = [];
   }
   acc[keyValue].push(observation);
   return acc;
 }, {});

 // Select one random observation per group
 const result = Object.values(grouped).map(group => {
   const randomIndex = Math.floor(Math.random() * group.length);
   return group[randomIndex];
 });

 return result;
}

function visualisation() {
  d3.json("static/js/db.json").then(jsonData => {
    console.log("Loaded JSON data:", jsonData);

    let geojson = [];
    let projection = d3.geoAlbers()
      .rotate([-20.0, 0.0])
      .scale(1500)
      .translate([750, 700]);

    let geoGenerator = d3.geoPath()
      .projection(projection);

    function update(geojson) {
      console.log("Items in update function:", geojson.features);

      let u = d3.select('#content g.map')
        .selectAll('path')
        .data(geojson.features);

      u.enter()
        .append('path')
        .merge(u)
        .attr('stroke', '#001f3f')
        .attr('stroke-width', 2)
        .attr("fill", "none")
        .attr("opacity", 0)
        .attr('d', geoGenerator);

      u.exit().remove();
    }

    d3.json('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson')
      .then(function (json) {
        geojson = json;
        console.log('GeoJSON data loaded:', geojson);
        update(geojson);
      })
      .catch(function (error) {
        console.error('Error loading or parsing GeoJSON data:', error);
      });

    const imageWidth = 40; // Width of the image
    const imageHeight = 40; // Height of the image
    const randomObservations = getRandomObservations(jsonData, 'wit');
    avoidOverlap(randomObservations, projection, imageWidth, imageHeight);

    // Assurez-vous que les noms de fichiers sont corrects
    randomObservations.forEach(obs => {
      console.log("Image name:", obs.img_name);
    });

    d3.selectAll("svg")
      .selectAll("image")
      .data(randomObservations)
      .join("image")
      .attr('y', 300)
      .attr('width', 200)
      .attr('height', 200)
      .attr("href", d => '/static/img/Flores_images/' + d.img_name)
      .attr('x', (d, i) => i * 220)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    let slider = document.getElementById('myRange');
    slider.style.display = 'none';
    const checkboxIds = ['wit225', 'wit226', 'wit227', 'wit228', 'wit229', 'wit240', 'wit241'];

    function hidecheckbox(checkboxIds) {
      console.log('Je suis cachee!');
      checkboxIds.forEach(function (id) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
          checkbox.style.display = 'none';
          const label = checkbox.nextElementSibling;
          if (label && label.tagName.toLowerCase() === 'label') {
            label.style.display = 'none';
          }
        }
      });
    }

    function showcheckbox(checkboxIds) {
      checkboxIds.forEach(function (id) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
          checkbox.style.display = 'inline-block';
          const label = checkbox.nextElementSibling;
          if (label && label.tagName.toLowerCase() === 'label') {
            label.style.display = 'inline-block';
          }
        }
      });
    }

    hidecheckbox(checkboxIds);

    const select1 = document.getElementById("select_1");
    const select2 = document.getElementById("select_2");

    function updateGraph() {
      const selectedValue1 = select1.value;
      const selectedValue2 = select2.value;

      if (selectedValue1 === "start_1" && selectedValue2 === "start_2") {
        slider.style.display = 'none';
        hidecheckbox(checkboxIds);
        random_images(randomObservations);
      } else if ((selectedValue1 === "place_1" && selectedValue2 === "place_2") |
                 (selectedValue1 === "start_1" && selectedValue2 === "place_2") |
                 (selectedValue1 === "place_1" && selectedValue2 === "start_2")) {
        hidecheckbox(checkboxIds);
        graph_place(randomObservations);
        toggleFriseOpacity(false);
      } else if ((selectedValue1 === "date_1" && selectedValue2 === "date_2") |
                 (selectedValue1 === "start_1" && selectedValue2 === "date_2") |
                 (selectedValue1 === "date_1" && selectedValue2 === "start_2")) {
        graph_date(randomObservations);
        slider.style.display = 'none';
        toggleFriseOpacity(true);
      } else if ((selectedValue1 === "witness_1" && selectedValue2 === "witness_2") |
                 (selectedValue1 === "start_1" && selectedValue2 === "witness_2") |
                 (selectedValue1 === "witness_1" && selectedValue2 === "start_2")) {
        slider.style.display = 'none';
        hidecheckbox(checkboxIds);
        graph_witness(randomObservations, 'static/img/Flores_images/');
        toggleFriseOpacity(false);
      } else if ((selectedValue1 === "place_1" && selectedValue2 === "date_2") |
                 (selectedValue1 === "date_1" && selectedValue2 === "place_2")) {
        slider.style.display = 'inline-block';
        hidecheckbox(checkboxIds);
        graph_place_date(randomObservations);
      } else if ((selectedValue1 === "witness_1" && selectedValue2 === "place_2") |
                 (selectedValue1 === "place_1" && selectedValue2 === "witness_2")) {
        slider.style.display = 'none';
        showcheckbox(checkboxIds);
        graph_place_witness(randomObservations);
        toggleFriseOpacity(false);
      } else if ((selectedValue1 === "witness_1" && selectedValue2 === "date_2") |
                 (selectedValue1 === "date_1" && selectedValue2 === "witness_2")) {
        slider.style.display = 'none';
        hidecheckbox(checkboxIds);
        graph_witness_date();
        toggleFriseOpacity(false);
      }
    }

    select1.addEventListener("change", updateGraph);
    select2.addEventListener("change", updateGraph);

  }).catch(error => {
    console.error('Error loading JSON data:', error);
  });
}

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", function () {
    visualisation();
  });
} else {
  // `DOMContentLoaded` has already fired
  visualisation();
}

