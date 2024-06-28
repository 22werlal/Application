// frise_slider.js

let friseInitialized = false;
let friseVisible = true; // Track the visibility of the frise

export function load_frise(randomObservations) {
    if (!friseInitialized) {
        initializeFrise(randomObservations);
        friseInitialized = true;
    } else {
        initializeFrise(randomObservations);
    }

    toggleFriseOpacity(friseVisible);
}

export function toggleFriseOpacity(visible) {
    d3.select("#frise").style("opacity", visible ? 1 : 0); // Toggle opacity
}

function initializeFrise(randomObservations) {
    const content = d3.select("#content");

     const margin = { top: 20, right: 20, bottom: 50, left: 20 };
     const width = 1600 - margin.left - margin.right;
     const height =  800 - margin.top - margin.bottom;

     const svg = d3.select("#content")
        .selectAll("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%Y");
    const formatYear = d3.timeFormat("%Y");

    randomObservations.forEach(d => {
        d.date_min = parseDate(d.date_min);
        d.date_max = parseDate(d.date_max);
    });

    const x = d3.scaleTime()
        .domain([
            d3.timeYear.offset(d3.extent(randomObservations, d => d.date_min)[0], -1),
            d3.timeYear.offset(d3.extent(randomObservations, d => d.date_max)[1], 1)
        ])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(randomObservations.map(d => d.wit))
        .range([0, height])
        .padding(0.1);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x));

    const imageUrl = '/static/img/Flores_images/';
    const imageWidth = 75;
    const imageHeight = 75;

    // Transition des images existantes vers les nouvelles positions
    d3.selectAll("svg")
        .selectAll("image")
        .data(randomObservations)
        .join(
            enter => enter.append("image")
                .attr("x", d => x(d.date_min) + (x(d.date_max) - x(d.date_min)) / 2 - imageWidth / 2) // Position au milieu entre date_min et date_max
                .attr("y", d => y(d.wit) - (imageHeight -100 ) / 2)
                .attr("width", 0)
                .attr("height", 0)
                .attr("href", d => imageUrl + d.img_name)
                .style('opacity', 0)
                .transition()
                .duration(1000)
                .attr("width", imageWidth)
                .attr("height", imageHeight)
                .style('opacity', 1),
            update => update
                .transition()
                .duration(1000)
                .attr("x", d => x(d.date_min) + (x(d.date_max) - x(d.date_min)) / 2 - imageWidth / 2)
                .attr("y", d => y(d.wit) - imageHeight / 2)
                .attr("width", imageWidth)
                .attr("height", imageHeight)
                .style('opacity', 1)
        );

    // Ajout des rectangles et des cercles avec des transitions
    const images = svg.selectAll(".event-image")
        .data(randomObservations)
        .enter()
        .append("g")
        .attr("class", "event-group")
        .attr("transform", d => `translate(${x(d.date_min)}, ${y(d.wit)})`);

    images.append("rect")
        .attr("class", "event-bar")
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", 0)
        .attr("height", 2)
        .attr("fill", "#3d52a0")
        .transition()
        .duration(1000)
        .attr("width", d => x(d.date_max) - x(d.date_min));

    images.each(function (d) {
        const group = d3.select(this);

        if (d.date_max.getFullYear() - d.date_min.getFullYear() < 20) {
            group.append("circle")
                .attr("class", "special-date-circle")
                .attr("cx", x(d.date_max) - x(d.date_min) + 15)
                .attr("cy", 37.5)
                .attr("r", 0)
                .attr("fill", "orange")
                .on("mouseover", function (event) {
                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .html(`${formatYear(d.date_min)} - ${formatYear(d.date_max)}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function () {
                    d3.select("#tooltip").style("opacity", 0);
                })
                .transition()
                .duration(1000)
                .attr("r", 7);
        }

        group.append("circle")
            .attr("class", "event-bar-end")
            .attr("cx", 0)
            .attr("cy", 31)
            .attr("r", 0)
            .attr("fill", "#3d52a0")
            .on("mouseover", function (event) {
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .html(formatYear(d.date_min))
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                d3.select("#tooltip").style("opacity", 0);
            })
            .transition()
            .duration(1000)
            .attr("r", 3);

        group.append("circle")
            .attr("class", "event-bar-end")
            .attr("cx", x(d.date_max) - x(d.date_min))
            .attr("cy", 31)
            .attr("r", 0)
            .attr("fill", "#3d52a0")
            .on("mouseover", function (event) {
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .html(formatYear(d.date_max))
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                d3.select("#tooltip").style("opacity", 0);
            })
            .transition()
            .duration(1000)
            .attr("r", 3);
    });

    // Ajuster la taille du slider
    if (d3.select("#slider").select("svg").empty()) {
        const sliderWidth = 200;
        const sliderHeight = 50;

        const slider = d3.select("#slider")
            .append("svg")
            .attr("width", sliderWidth + margin.left + margin.right)
            .attr("height", sliderHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${sliderHeight / 2})`);

        const xSlider = d3.scaleTime()
            .domain(x.domain())
            .range([0, sliderWidth])
            .clamp(true);

        slider.append("line")
            .attr("class", "track")
            .attr("x1", xSlider.range()[0])
            .attr("x2", xSlider.range()[1])
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "track-inset")
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", function () {
                    slider.interrupt();
                })
                .on("start drag", function (event) {
                    update(xSlider.invert(event.x));
                }));

        const handle = slider.append("circle")
            .attr("class", "handle")
            .attr("r", 9)
            .attr("cy", 0)
            .attr("cx", xSlider(x.domain()[0]));

        function update(h) {
            handle.attr("cx", xSlider(h));
            images.selectAll(".event-bar")
                .attr("width", d => Math.max(0, Math.min(x(h), x(d.date_max)) - x(d.date_min)));
        }

        update(xSlider.domain()[0]);
    }

}