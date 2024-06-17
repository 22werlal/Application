
let geojson = []

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
        // Apply jitter to avoid overlap
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
  const randomObservations = getRandomObservations(jsonData, 'wit');

  // Output the result
  console.log("Random observations per category:", randomObservations);
  d3.json('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson')
    .then(function (json) {
      geojson = json
      console.log('GeoJSON data loaded:', geojson);
      update(geojson);
    });

    
    
    const selectElement = document.getElementById("select_1");
    selectElement.addEventListener("change", function(event) {
        const selectedValue = event.target.value;
        if (selectedValue === "start_1") {
            graph_witness;
        } else if (selectedValue === "witness_1") {
            functionForOption2();
        }
        else if (selectedValue === "date_1") {
          functionForOption2();
       }
        else if (selectedValue === "place_1") {
         functionForOption2();
        }
        else if (selectedValue === "chapter_1") {
          functionForOption2();
         }
  function graph_witness(imageUrl) {
    console.log("Button clicked!");
    d3.select('#content g.map')
    .selectAll('path')
    .style('opacity', 0);
    d3.selectAll("svg")
      .selectAll("image")
      .join("image")
      .transition()
      .duration(1000)
      .attr('y', 300)
      .attr('width', 200)
      .attr('height', 200)
      .attr("href", d => imageUrl + d.img_name)
      .attr('x', (d, i) => i * 220)
      .on("mouseover", mouseover) 
      .on("mouseleave", mouseleave);
  }

  let projection = d3.geoAlbers()
    .rotate([-20.0, 0.0])
    .scale(1500)
    .translate([750, 700]);

  let geoGenerator = d3.geoPath()
    .projection(projection);

  function update(geojson) {
    let u = d3.select('#content g.map')
      .selectAll('path')
      .data(geojson.features);

    u.enter()
      .append('path')
      .attr('stroke', '#001f3f')
      .attr('stroke-width', 3)
      .attr("fill", "none")
      .attr('d', geoGenerator);
  }

  var Tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

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

  const imageUrl = '/static/img/Flores_images/'; // URL of the image you want to use
  const imageWidth = 40; // Width of the image
  const imageHeight = 40; // Height of the image

  avoidOverlap(randomObservations, d3.geoAlbers().rotate([-20.0, 0.0]).scale(1500).translate([750, 700]), imageWidth, imageHeight);


  d3.selectAll("svg")
    .selectAll("myImages")
    .data(randomObservations)
    .join("image")
    .attr("x", d => d.adjustedX - imageWidth / 2)
    .attr("y", d => d.adjustedY - imageHeight / 2)
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .attr("href", d => imageUrl + d.img_name)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  document.getElementById('updateButton').addEventListener('click', () => {
    handleButtonClick(randomObservations, imageUrl);
  });
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



