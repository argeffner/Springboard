/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
const defaultImage = "http://tinyurl.com/missing-tv";

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let res = await  axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  //need to store as shows for the below function to carry the datq
  //can only select 
  let shows = res.data.map(result => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : defaultImage,
  };
});
  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}"> 
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-outline-success select-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
// TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  // TODO: return array-of-episode-info, as described in docstring above
  let episodes = res.data.map(episode => ({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }));
    return episodes;
}

// now I need to populate the episodes in the DOM
//need to make li for each episode
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);
    $episodesList.append($item);
   // console.log($episodesList)
  }
//displays the episode Area section after data is appended
  $('#episodes-area').show();
}

// need to make a handleclick to get the episodes (not shows)
$("#shows-list").on("click",".select-episodes", async function handleClick(e){
  //button is in the Show div generated by PopulatesShows function
  let showId = $(e.target).closest(".Show").data("show-id");
  //chooses episodes from show ID of API
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});