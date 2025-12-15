function updateCarousel(cities, index){
    const packs = $(".pack");
    packs.each(function(i){
        const city = cities[(index + i) % cities.length];
        $(this).css("background-image", "url('" + city["image"]["url"] + "')");
        const text = $(this).children(".pack-text");
        text.children("h2").text(city["name"]);
        text.children("h4").text(city["country"] + ", " + city["continent"]);
        text.children("p").text(city["description"]);
    });
}

$(function(){
    let index = 0;

    $.getJSON("data/ciudades-del-mundo.json", function(data){
        var cities = [];
        for(let i = 0; i < data["continents"].length; i++){
            const continent = data["continents"][i];
            const continent_name = continent["name"];
            for (let j = 0; j < continent["countries"].length; j++){
                const country = continent["countries"][j];
                const country_name = country["name"];
                for (let k = 0; k < country["cities"].length; k++){
                    const city = country["cities"][k];
                    city["country"] = country_name;
                    city["continent"] = continent_name;
                    cities.push(city);
                }
            }
        }

        updateCarousel(cities, index);

        $(".prev").on("click", function(){
            index -= $(".pack").length;
            if(index < 0) index = cities.length + index;
            updateCarousel(cities, index);
        });
        $(".next").on("click", function(){
            index = (index + $(".pack").length) % cities.length;
            updateCarousel(cities, index);
        });
    });
});