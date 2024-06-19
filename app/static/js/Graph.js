import {graph_place} from '/static/js/place.js';
import {graph_witness} from '/static/js/witness.js';


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


d3.json("static/js/db.json").then(jsonData => {
  console.log("Loaded JSON data:", jsonData);
  // Three function that change the tooltip when user hover / move / leave a cell
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
  
  const randomObservations = getRandomObservations(jsonData, 'wit');
  const imageUrl = '/static/img/Flores_images/'; //url


  
   
  function graph_start(randomObservations,imageUrl) {}

  function graph_date() {}

 d3.selectAll("svg")
  .selectAll("image")
  .data(randomObservations)
  .join("image")
  .attr('y', 300)
  .attr('width', 200)
  .attr('height', 200)
  .attr("href", d => imageUrl + d.img_name)
  .attr('x', (d, i) => i * 220)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove) 
  .on("mouseleave", mouseleave);
 
  let slider=document.getElementById('myRange')
  slider.style.display = 'none';

  const selectElement = document.getElementById("select_1");
  
  selectElement.addEventListener("change", function(event) {
    
    const selectedValue = event.target.value;
    if (selectedValue === "start_1") {
      slider.style.display = 'none';
      graph_start(randomObservations,imageUrl);
    } else if (selectedValue === "witness_1") {
      slider.style.display = 'none';
      graph_witness(imageUrl);
    } else if (selectedValue === "date_1") {
      graph_date();
      slider.style.display = 'none';
    }else if (selectedValue === "place_1") {
      slider.style.display = 'inline-block'
      graph_place(randomObservations);
    }
  });
  

}).catch(error => {
  console.error('Error loading JSON data:', error);
});

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", function () {
    update(geojson);
  });
} else {
  // `DOMContentLoaded` has already fired
  update(geojson);
}




