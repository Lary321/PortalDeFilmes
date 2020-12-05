function loadData(event) {
    event.preventDefault();

    let search;
    if (!$("input").val()) {
        search = "marvel";
    } else {
        search = $("input").val();
        $("input").val("");
    }

    const api = "&api_key=d3ab28ca6569a183d27c4c051c647700";
    const endpoint = `https://api.themoviedb.org/3/search/movie?query=${search}${api}&language=pt-BR`;
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
        for (let i = 0; i < data.results.length; i++) {
            //if (window.CP.shouldStopExecution(0)) break;
            const movieResults = data.results[i];
            $(".error").html("");
            gridHtml += `<li>
          <img src = "${poster}${movieResults.poster_path}">
      </li>`;
        }  // } windows.CP.exitedLoop(0);

        $(".films").html(gridHtml);
    });

    $("body").on("click", ".add-fav", function () {
        let favItems = $(".selectedFilm__poster").attr("src");
        $(".favourite").append(`<img class ="favImg" src ="${favItems}">`);
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


const form = $(".form");
form.submit(loadData);


$(function () {
    $(".carousel").on("slide.bs.carousel", function (e) {
      var prev = $(this)
        .find(".active")
        .index();
      var next = $(e.relatedTarget).index();
      var video = $("#video-player")[0];
      var videoSlide = $("#video-player")
        .closest(".carousel-item")
        .index();
      if (next === videoSlide) {
        if (video.tagName == "IFRAME") {
          player.playVideo();
        } else {
          createVideo(video);
        }
      } else {
        if (typeof player !== "undefined") {
          player.pauseVideo();
        }
      }
    });
  });
  
  function createVideo(video) {
    var youtubeScriptId = "youtube-api";
    var youtubeScript = document.getElementById(youtubeScriptId);
    var videoId = video.getAttribute("data-video-id");
  
    if (youtubeScript === null) {
      var tag = document.createElement("script");
      var firstScript = document.getElementsByTagName("script")[0];
  
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = youtubeScriptId;
      firstScript.parentNode.insertBefore(tag, firstScript);
    }
  
    window.onYouTubeIframeAPIReady = function () {
      window.player = new window.YT.Player(video, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0
        }
      });
    };
  }
  
  