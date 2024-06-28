export function graph_witness(randomObservations, imageUrl) {
    d3.select('#content g.map')
        .selectAll('path, line, rect, text, #slider, #frise')
        .style('opacity', 0);
    d3.select('#image-svg').remove()
    d3.select('#frise')
        .selectAll('*')
        .style('opacity', 0);
    d3.select('#slider')
        .selectAll('*')
        .style('opacity', 0);


    d3.selectAll("svg")
     .selectAll("image")
     .data(randomObservations)
     .join("image")
     .transition()
     .duration(1000)
     .attr('y', 300)
     .attr('width', 200)
     .attr('height', 200)
     .attr("href", d => `${imageUrl}${d.img_name}`)
     .attr('x', (d, i) => i * 220)
     .style('opacity', 1);
}
