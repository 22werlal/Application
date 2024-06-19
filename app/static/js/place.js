
export function graph_place(randomObservations) {
    let geojson = []
    console.log("yeepee ka yee")

//avoid the overlap
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
  d3.json("static/js/db.json").then(jsonData => {
      console.log("Loaded JSON data:", jsonData);
  
    const imageUrl = '/static/img/Flores_images/'; //url
    const imageWidth = 40; // Width of the image
    const imageHeight = 40; // Height of the image
    avoidOverlap(randomObservations, d3.geoAlbers().rotate([-20.0, 0.0]).scale(1500).translate([750, 700]), imageWidth, imageHeight);
  
    //charge the map
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


    d3.json('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson')
     .then(function (json) {
      geojson = json
      console.log('GeoJSON data loaded:', geojson);
      update(geojson);
    }); 
  
       
    function timePeriode(d,selectedValue) {
     if (selectedValue >= d.date_min && selectedValue <= d.date_max) {
      return 1; // fully visible
    } else {
      return 0; // hidden
    }
    }
        
    d3.select('#content g.map')
      .selectAll('path')
      .style('opacity', 1);
  
    function updateImages(selectedValue){
    d3.selectAll("svg")
      .selectAll("image")
      .join("image")
      .transition()
      .duration(1000)
      .attr("x", d => d.adjustedX - imageWidth / 2)
      .attr("y", d => d.adjustedY - imageHeight / 2)
      .attr("width", imageWidth)
      .attr("height", imageHeight)
      .attr("href", d => imageUrl + d.img_name)
      .style('opacity', d => timePeriode(d,selectedValue))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
      }
  
    document.getElementById('myRange').addEventListener('input', function(event) {
      let value = event.target.value;
      updateImages(value);
      console.log('sliderValue');
    });
    updateImages(1472)
  
}  
)}