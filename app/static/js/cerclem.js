export function random_images(randomObservations) {
     d3.select('#content g.map')
     .selectAll('path')
     .style('opacity', 0);
     d3.select('#content g.timeline')
        .selectAll('path, line, rect, text, #slider')
        .style('opacity', 0);

     d3.json("static/js/db.json").then(jsonData => {
        console.log("Loaded JSON data:", jsonData);

        const margin = { top: 5, right: 20, bottom: 50, left: 20 };
        const width = 1500 - margin.left - margin.right;
        const height = 1200 - margin.top - margin.bottom;

        const svg = d3.select("#content")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        d3.json("static/js/db.json").then(data => {
            const imagePaths = data.map(d => `static/img/Flores_images/${d.img_name}`);
            const circleRadius = 400;

            let centerImages = [];

            imagePaths.forEach((imagePath, index) => {
                const imgData = data[index];

                const angle = index * (2 * Math.PI / imagePaths.length) + Math.PI / 2;
                const x = width / 2 + circleRadius * Math.cos(angle) - 50;
                const y = height / 2 + circleRadius * Math.sin(angle) - 50;

                const imgElement = svg.append("image")
                    .attr("xlink:href", imagePath)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", 100)
                    .attr("height", 100)
                    .attr("class", "image")
                    .on("click", function (event) {
                        const clicked = d3.select(this).classed("clicked");

                        if (!clicked && centerImages.length >= 2) {
                            // Move previous two images out of center
                            centerImages.forEach((image, i) => {
                                const angle = i * (2 * Math.PI / imagePaths.length);
                                const newX = width / 2 + circleRadius * Math.cos(angle) - 100;
                                const newY = height / 2 + circleRadius * Math.sin(angle) - 100;

                                image.transition()
                                    .duration(500)
                                    .attr("x", newX)
                                    .attr("y", newY)
                                    .attr("width", 100)
                                    .attr("height", 100)
                                    .classed("clicked", false);
                            });
                            centerImages = [];
                        }

                        if (clicked) {
                            // If image is already clicked, remove from centerImages
                            centerImages = centerImages.filter(image => image.node() !== this);
                            d3.select(this).classed("clicked", false)
                                .transition()
                                .duration(500)
                                .attr("x", x)
                                .attr("y", y)
                                .attr("width", 50)
                                .attr("height", 50);
                        } else {
                            // Add new clicked image to centerImages
                            centerImages.push(d3.select(this).classed("clicked", true));
                            const newX = centerImages.length === 1 ? width / 2 - 100 : width / 2 + 50;
                            const newY = height / 2 - 100;

                            d3.select(this).transition()
                                .duration(500)
                                .attr("x", newX -100)
                                .attr("y", newY -100)
                                .attr("width", 200)
                                .attr("height", 200);
                        }

                        displayImageInfo(imgData);
                    });

                imgElement.on("mouseover", function () {
                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .html(imgData.img_name)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                });

                imgElement.on("mouseout", function () {
                    d3.select("#tooltip").style("opacity", 0);
                });
            });
        });
    });
}
