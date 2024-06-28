
function sandbox(){
const width = 1600;
const height = 800;
const imgsize = 80;
const imageUrl = '/static/img/Flores_images/'

d3.json("static/js/db.json").then(jsonData => {
    const checkboxIds = ['wit225', 'wit226', 'wit227', 'wit228', 'wit229', 'wit240', 'wit241'];
    const typeIds = ['Eclipse', 'Menelaus', 'Planet', 'Sun', 'Moon', 'Geometry', 'Algebra'];
    const witList = [];
    const typeList = []; 
    
    function handleCheckboxChange(event) {
        const checkbox = event.target;
        if (checkbox.checked) {
            witList.push(checkbox.id); 
        } else {
            const index = witList.indexOf(checkbox.id); 
            if (index > -1) {
                witList.splice(index, 1);
            }
        }
        update(witList, typeList);
    }
    function handletypeChange(event) {
        const checkbox = event.target;
        if (checkbox.checked) {
            typeList.push(checkbox.id); 
        } else {
            const index = typeList.indexOf(checkbox.id); 
            if (index > -1) {
                typeList.splice(index, 1);
            }
        }
        console.log(typeList)
        update(witList, typeList);
    }
    checkboxIds.forEach(function(id) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', handleCheckboxChange);
        }
    });
    typeIds.forEach(function(id) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', handletypeChange);
        }
    });
    update([], []);

    
    
    
function update(witList,typeList){
d3.select("svg")
  .remove();

  const filteredObservations = jsonData.filter(obs => witList.includes(obs.wit) && typeList.includes(obs.type));
    for (let i = 0; i < filteredObservations.length; i++) {
        filteredObservations [i].pX = (i % 18) * (imgsize + 1)+50;
        filteredObservations [i].pY = Math.floor(i / 18) * (imgsize + 1)+200;
    }

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom", zoomed));

const g = svg.append("g");


g.selectAll("image")
  .data(filteredObservations )
  .join("image")
  .attr('width', imgsize)
  .attr('height', imgsize)
  .attr("href", d => imageUrl + d.img_name)
  .attr("x", d => d.pX)
  .attr("y", d => d.pY)
  .call(d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded));



function zoomed(event) {
    const [x, y] = d3.pointer(event);
    const nearbyCircle = filteredObservations.some(d => {
        const dx = x - d.pX;
        const dy = y - d.pY;
        return Math.sqrt(dx * dx + dy * dy) < imgsize;
    });

    if (!nearbyCircle) {
        g.attr("transform", event.transform);
    }
}

function dragStarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
    offsetX = event.x - d3.select(this).attr("x");
    offsetY = event.y - d3.select(this).attr("y");
}

function dragged(event, d) {
    d3.select(this)
        .attr("x", d.pX = event.x-offsetX )
        .attr("y", d.pY = event.y-offsetY );
}

function dragEnded(event, d) {
    d3.select(this).attr("stroke", null);
}
}
});

}
if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", function () {
      sandbox();
    });
  } else {
    // `DOMContentLoaded` has already fired
     sandbox();
  }