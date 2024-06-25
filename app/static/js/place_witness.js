import { load_map } from '/static/js/load_map.js';
export function graph_place_witness(randomObservations) {

  d3.json("static/js/db.json").then(jsonData => {
    console.log("Loaded JSON data:", jsonData);

    load_map();
    const imageUrl = '/static/img/Flores_images/'; //url
    const imageWidth = 40; // Width of the image
    const imageHeight = 40; // Height of the image

    function witness(d) {
      if (document.getElementById(d.wit).checked) {
        return 1; // fully visible
      } else {
        return 0; // hidden
      }
    }

    function update() {
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
        .style('opacity', d => witness(d))
    }

    const checkboxIds = ['wit225', 'wit226', 'wit227','wit228','wit229','wit240','wit241'];

    // Function to handle checkbox check
    function handleCheckboxChange(event) {
        if (event.target.checked) {
          console.log('A checkbox has been checked!');
          update();
        } else{
          update();
        }
    }

    // Attach event listeners to each checkbox
    checkboxIds.forEach(function(id) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', handleCheckboxChange);
        }
    });

    update();

  }
  )
}