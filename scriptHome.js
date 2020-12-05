window.onload = loadData;

function loadData(event) {
    event.preventDefault();

    let search;
    // check if no input
    // set default search to jaws
    if (!$("input").val()) {
        search = "marvel";
    } else {
        search = $("input").val();
        $("input").val("");
    }

    // api and end points
    // create search with user input
    const api = "&api_key=d3ab28ca6569a183d27c4c051c647700";
    const endpoint = `https://api.themoviedb.org/3/movie/now_playing?query=${search}${api}&language=pt-BR`;
    const endpointgenero = `https://api.themoviedb.org/3/genre/movie/list?query=${search}${api}&language=pt-BR`;
    const poster = "https://image.tmdb.org/t/p/w500/";

    let gridHtml = "";
    let selectedHtml = "";

    $.getJSON(endpoint, function (data) {

        // exibe pop up detalhes do filme
        $("body").on("click", "li", function (e) {
            $(".view-fav").fadeToggle();
            $(".selectedFilm").fadeIn();
            $(".bg").fadeToggle();

            let index = $("li").index(this);
            let selected = data.results[index];
            // cria pop up com informações do filme 
            gridHtml = `<i class="fa fa-times close" aria-hidden="true"></i>
            <div class="selectedFilm__img">
                    <img class ="selectedFilm__poster" src ="${poster}${selected.poster_path}">
             </div>
             <div class="selectedFilm__content">
                <h2>${selected.title}</h2>
                <h3>Resumo</h3>
                <p>${selected.overview}</p>
                <h3>Data de lançamento</h3>
                <p>${selected.release_date}</p>
            
            <span class ='add-fav'> Leia mais </span>
            </div>`;
            //$(".add-fav").src(selected.url);
            $(".selectedFilm").html(gridHtml);

            // fecha o pop up
            $(".close").on("click", function () {
                $(".selectedFilm").fadeOut();
                $(".bg").fadeToggle();
                $(".view-fav").fadeToggle();
            });
        });
        // exibe mensagem de erro em caso de resultados não encontrados
        if (data.results.length == 0) {
            $(".error").html("Nenhum resultado encontrado. Tente outra pesquisa.");
        }
        // cria o layout do filme 
        for (let i = 4; i < 8; i++) {
            //if (window.CP.shouldStopExecution(0)) break;
            const movieResults = data.results[i];
            const genero = movieResults.genre_ids
            $(".error").html("");
            gridHtml += `<li>
          <img src = "${poster}${movieResults.poster_path}">
          <h3><b>${movieResults.title}</b></h3>
          <p><b>Sinopse:</b> ${movieResults.overview} </p>
          <p><b>Nota média:</b> ${movieResults.vote_average} </p>
          <p><b>Quantidade de votos:</b> ${movieResults.vote_count} </p>
      </li>`;
        }  // } windows.CP.exitedLoop(0);

        $(".films").html(gridHtml);
    });

    // click of pop up image - add to favourites div
    $("body").on("click", ".add-fav", function () {
        // get the img src
        let favItems = $(".selectedFilm__poster").attr("src");
        $(".favourite").append(`<img class ="favImg" src ="${favItems}">`);
        // bug - unsure why? duplicate images being displayed on click.
        // removed any duplicated src
        var img = $(".favImg");
        var used = {};

        img.each(function () {
            var src = $(this).attr("src");
            if (used[src]) $(this).remove();
            used[src] = 1;
        });
        localStorage.getItem(favItems);
    });
    //localStorage.setItem(favItems);
}
