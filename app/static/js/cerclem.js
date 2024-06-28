function random_images(randomObservations) {
    d3.json("static/js/db.json").then(jsonData => {
        console.log("Loaded JSON data:", jsonData);

        const margin = { top: 100, right: 500, bottom: 50, left: 20 };
        const width = 1600 - margin.left - margin.right;
        const height = 1200 - margin.top - margin.bottom;
        const circleRadius = 400;

        const svg = d3.select("#content")
            .append("svg")
            .attr("id", "image-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const imagePaths = jsonData.map(d => `static/img/Flores_images/${d.img_name}`);

        let centerImages = [];

        imagePaths.forEach((imagePath, index) => {
            const imgData = jsonData[index];

            // Calcul des coordonnées x et y pour placer les images sur le cercle
            const angle = index * (2 * Math.PI / imagePaths.length) + Math.PI / 2;
            const x = width / 2 + circleRadius * Math.cos(angle) + 50; // Légèrement à droite du centre
            const y = height / 2 + circleRadius * Math.sin(angle) + 50;

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
                        // Déplacer les deux images précédentes hors du centre
                        centerImages.forEach((image, i) => {
                            const angle = i === 0 ?
                                (index - 0.1) * (2 * Math.PI / imagePaths.length) + Math.PI / 2 :
                                (index + 0.1) * (2 * Math.PI / imagePaths.length) + Math.PI / 2;

                            const newX = width / 2 + circleRadius * Math.cos(angle);
                            const newY = height / 2 + circleRadius * Math.sin(angle);

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
                        // Si l'image est déjà cliquée, la retirer de centerImages
                        centerImages = centerImages.filter(image => image.node() !== this);
                        d3.select(this).classed("clicked", false)
                            .transition()
                            .duration(500)
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", 100)
                            .attr("height", 100);
                    } else {
                        // Ajouter une nouvelle image cliquée à centerImages
                        centerImages.push(d3.select(this).classed("clicked", true));

                        const newX = centerImages.length === 1 ? width / 2 - 150 : width / 2 + 50;
                        const newY = height / 2 - 100;

                        d3.select(this).transition()
                            .duration(500)
                            .attr("x", newX)
                            .attr("y", newY)
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
}

document.addEventListener("DOMContentLoaded", function () {
    random_images();
});
