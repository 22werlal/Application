// graph_date.js

import { load_frise } from '/static/js/frise_slider.js'; // Chemin vers votre fichier frise-slider.js

export function graph_date(randomObservations) {
    // Masquer les anciennes visualisations sans les supprimer
    d3.select('#content g.map')
        .selectAll('path, line, rect, text, circle, image, #slider')
        .style('opacity', 0);

    // Appel de la fonction pour charger la frise chronologique et le slider
    load_frise(randomObservations);
}