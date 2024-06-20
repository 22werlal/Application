import {load_map} from '/static/js/load_map.js';

export function graph_place(randomObservations) {
    
    console.log("yeepee ka yee")
  load_map();
//avoid the overlap
  d3.json("static/js/db.json").then(jsonData => {
      console.log("Loaded JSON data:", jsonData);
  
    const imageUrl = '/static/img/Flores_images/'; //url
    const imageWidth = 40; // Width of the image
    const imageHeight = 40; // Height of the image=
  
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
      .style('opacity', 1)
  
      console.log("lieu")
}  
)}