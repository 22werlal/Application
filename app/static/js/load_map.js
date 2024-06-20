   
export function load_map(){
    d3.select('#content g.map')
      .selectAll('path')
      .style('opacity', 1);
    console.log("fin de chargement de la carte")
}