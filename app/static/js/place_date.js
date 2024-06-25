import {load_map} from '/static/js/load_map.js';

export function graph_place_date(randomObservations) {

 d3.json("static/js/db.json").then(jsonData => {
      console.log("Loaded JSON data:", jsonData);

    load_map();
    const imageUrl = '/static/img/Flores_images/'; //url
    const imageWidth = 40; // Width of the image
    const imageHeight = 40; // Height of the image

    function timePeriode(d,selectedValue) {
     if (selectedValue >= d.date_min && selectedValue <= d.date_max) {
      return 1; // fully visible
    } else {
      return 0; // hidden
    }
    }

    function updateImages(selectedValue){
     d3.selectAll("svg")
      .selectAll("image")
      .data(randomObservations)
      .join("image")
      .transition()
      .duration(1000)
      .attr("x", d => d.adjustedX - imageWidth / 2)
      .attr("y", d => d.adjustedY - imageHeight / 2)
      .attr("width", imageWidth)
      .attr("height", imageHeight)
      .attr("href", d => imageUrl + d.img_name)
      .style('opacity', d => timePeriode(d,selectedValue))

      }

    document.getElementById('myRange').addEventListener('input', function(event) {
      let value = event.target.value;
      updateImages(value);
      console.log('sliderValue');
    });
    updateImages(1472)

}
)}