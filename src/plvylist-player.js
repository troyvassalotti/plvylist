/**
 * @file Plvylist Web Component
 */

export class Plvylist extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    /**
     * Bind component functions
     */
    this.createIcon = this.createIcon.bind(this);
    this.createSlider = this.createSlider.bind(this);

    /**
     * Icon Storage
     * @type {{play: string, volOff: string, volLow: string, pause: string, volMid: string}}
     */
    this.icons = {
      play: `<title>Play</title><path d="M7 4v16l13 -8z"/>`,
      pause: `<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`,
      previous: `<title>Previous</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>`,
      next: `<title>Next</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 5v14l8-7z"></path><path d="M14 5v14l8-7z"></path>`,
      shuffle: `<title>Shuffle</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="15" width="6" height="6" rx="1"></rect><path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path><path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>`,
      loop: `<title>Loop</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path><path d="M11 11l1 -1v4"></path>`,
      volOff: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" />`,
      volLow: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
      volMid: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
    };

    /**
     * Default image for the album artwork
     * @type {string}
     */
    this.placeholder = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA2MCA2MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjAgNjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNMzAsMEMxMy40NTgsMCwwLDEzLjQ1OCwwLDMwczEzLjQ1OCwzMCwzMCwzMHMzMC0xMy40NTgsMzAtMzBTNDYuNTQyLDAsMzAsMHogTTMwLDU4QzE0LjU2MSw1OCwyLDQ1LjQzOSwyLDMwUzE0LjU2MSwyLDMwLDJzMjgsMTIuNTYxLDI4LDI4UzQ1LjQzOSw1OCwzMCw1OHoiLz48cGF0aCBkPSJNMjMuMTY1LDguNDU5YzAuNTM3LTAuMTMsMC44NjgtMC42NywwLjczOS0xLjIwNmMtMC4xMjktMC41MzctMC42Ny0wLjg2Ni0xLjIwNi0wLjczOWMtMy45MzUsMC45NDYtNy41MjIsMi45NTUtMTAuMzc2LDUuODA5UzcuNDYsMTguNzY0LDYuNTE0LDIyLjY5OGMtMC4xMjksMC41MzYsMC4yMDIsMS4wNzYsMC43MzksMS4yMDZjMC4wNzgsMC4wMTksMC4xNTcsMC4wMjcsMC4yMzQsMC4wMjdjMC40NTEsMCwwLjg2MS0wLjMwOCwwLjk3Mi0wLjc2N2MwLjg1OS0zLjU3NSwyLjY4NS02LjgzNiw1LjI3Ny05LjQyOVMxOS41OSw5LjMxOCwyMy4xNjUsOC40NTl6Ii8+PHBhdGggZD0iTTUyLjc0NywzNi4wOTZjLTAuNTM4LTAuMTI5LTEuMDc3LDAuMjAxLTEuMjA2LDAuNzM5Yy0wLjg1OSwzLjU3NS0yLjY4NSw2LjgzNi01LjI3Nyw5LjQyOXMtNS44NTQsNC40MTgtOS40Myw1LjI3N2MtMC41MzcsMC4xMy0wLjg2OCwwLjY3LTAuNzM5LDEuMjA2YzAuMTEsMC40NTksMC41MjEsMC43NjcsMC45NzIsMC43NjdjMC4wNzcsMCwwLjE1Ni0wLjAwOSwwLjIzNC0wLjAyN2MzLjkzNi0wLjk0Niw3LjUyMy0yLjk1NSwxMC4zNzctNS44MDlzNC44NjItNi40NDEsNS44MDktMTAuMzc2QzUzLjYxNSwzNi43NjYsNTMuMjg0LDM2LjIyNiw1Mi43NDcsMzYuMDk2eiIvPjxwYXRoIGQ9Ik0yNC40NTIsMTMuMjg2YzAuNTM4LTAuMTI1LDAuODczLTAuNjYzLDAuNzQ3LTEuMmMtMC4xMjUtMC41MzgtMC42NjUtMC44NzgtMS4yLTAuNzQ3Yy0zLjA5LDAuNzItNS45MDQsMi4yODItOC4xNDEsNC41MmMtMi4yMzcsMi4yMzYtMy44LDUuMDUxLTQuNTIsOC4xNDFjLTAuMTI2LDAuNTM3LDAuMjA5LDEuMDc1LDAuNzQ3LDEuMmMwLjA3NiwwLjAxOSwwLjE1MiwwLjAyNiwwLjIyOCwwLjAyNmMwLjQ1NCwwLDAuODY1LTAuMzEyLDAuOTczLTAuNzczYzAuNjM1LTIuNzI1LDIuMDE0LTUuMjA3LDMuOTg2LTcuMThTMjEuNzI4LDEzLjkyMSwyNC40NTIsMTMuMjg2eiIvPjxwYXRoIGQ9Ik00OC42NjEsMzYuMDAxYzAuMTI2LTAuNTM3LTAuMjA5LTEuMDc1LTAuNzQ3LTEuMmMtMC41MzgtMC4xMzMtMS4wNzUsMC4yMDktMS4yLDAuNzQ3Yy0wLjYzNSwyLjcyNS0yLjAxNCw1LjIwNy0zLjk4Niw3LjE4cy00LjQ1NSwzLjM1Mi03LjE4LDMuOTg2Yy0wLjUzOCwwLjEyNS0wLjg3MywwLjY2My0wLjc0NywxLjJjMC4xMDcsMC40NjIsMC41MTksMC43NzMsMC45NzMsMC43NzNjMC4wNzUsMCwwLjE1MS0wLjAwOCwwLjIyOC0wLjAyNmMzLjA5LTAuNzIsNS45MDQtMi4yODIsOC4xNDEtNC41MkM0Ni4zNzksNDEuOTA1LDQ3Ljk0MSwzOS4wOTEsNDguNjYxLDM2LjAwMXoiLz48cGF0aCBkPSJNMjYuNDk1LDE2LjkyNWMtMC4xMTktMC41NDEtMC42NTMtMC44NzktMS4xOS0wLjc2M2MtNC41NTcsMC45OTctOC4xNDYsNC41ODYtOS4xNDMsOS4xNDNjLTAuMTE4LDAuNTM5LDAuMjI0LDEuMDcyLDAuNzYzLDEuMTljMC4wNzIsMC4wMTYsMC4xNDQsMC4wMjMsMC4yMTUsMC4wMjNjMC40NiwwLDAuODczLTAuMzE4LDAuOTc2LTAuNzg2YzAuODMxLTMuNzk2LDMuODIxLTYuNzg2LDcuNjE3LTcuNjE3QzI2LjI3MSwxNy45OTcsMjYuNjEzLDE3LjQ2NCwyNi40OTUsMTYuOTI1eiIvPjxwYXRoIGQ9Ik00My44MzgsMzQuNjk1YzAuMTE4LTAuNTM5LTAuMjI0LTEuMDcyLTAuNzYzLTEuMTljLTAuNTQtMC4xMTgtMS4wNzIsMC4yMjItMS4xOSwwLjc2M2MtMC44MzEsMy43OTYtMy44MjEsNi43ODYtNy42MTcsNy42MTdjLTAuNTM5LDAuMTE4LTAuODgxLDAuNjUxLTAuNzYzLDEuMTljMC4xMDMsMC40NjgsMC41MTYsMC43ODYsMC45NzYsMC43ODZjMC4wNzEsMCwwLjE0My0wLjAwOCwwLjIxNS0wLjAyM0MzOS4yNTIsNDIuODQxLDQyLjg0MSwzOS4yNTIsNDMuODM4LDM0LjY5NXoiLz48cGF0aCBkPSJNMzguMDgsMzBjMC00LjQ1NS0zLjYyNS04LjA4LTguMDgtOC4wOHMtOC4wOCwzLjYyNS04LjA4LDguMDhzMy42MjUsOC4wOCw4LjA4LDguMDhTMzguMDgsMzQuNDU1LDM4LjA4LDMweiBNMzAsMzYuMDhjLTMuMzUzLDAtNi4wOC0yLjcyOC02LjA4LTYuMDhzMi43MjgtNi4wOCw2LjA4LTYuMDhzNi4wOCwyLjcyOCw2LjA4LDYuMDhTMzMuMzUzLDM2LjA4LDMwLDM2LjA4eiIvPjwvZz48L3N2Zz4=`;

    /**
     * Plvylist CSS
     * @type {string}
     */
    this.styles = `
    <style>
      * {
        margin: 0;
      }
      
      .plvylist {
        accent-color: var(--plvylist-accent, royalblue);
        font-family: var(--plvylist-font, inherit);
        line-height: var(--plvlist-line-height, 1.5);
        margin-inline: auto;
      }
      
      #artwork {
        block-size: auto;
        max-inline-size: 100%;
      }
      
      .meta {
        align-items: flex-end;
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
      }
      
      #next {
        margin-inline-end: auto;
      }
      
      .loop--active svg {
        stroke: var(--plvylist-changed, crimson);
      }
      
      .seeker {
        margin-block: 1rem;
      }
      
      .volume {
        display: inline-flex;
      }
      
      :is(.controls, .song) button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font: inherit;
        stroke: currentColor;
      }
      
      .controls {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-block: 1rem;
      }
      
      .controls button:hover svg {
        opacity: .666;
      }
      
      .controls__primary {
        display: flex;
        flex: 1;
        inline-size: 100%;
        justify-content: center;
      }
      
      .song__title {
        text-align: inherit;
        transition: .1s color ease-in-out;
      }
      
      .song__active button,
      .song__title:hover {
        opacity: .666;
        text-decoration: underline;
      }
      
      input[type=range] {
        inline-size: 100%;
      }
      
      img[src^="data:image/svg+xml"] {
        filter: contrast(.5)
      }
    </style>
        `;

    /**
     * Plvylist HTML
     * @type {string}
     */
    this.container = `
      <div class="plvylist">
        <audio id="plvylist"></audio>
        <section class="meta">
          <img src="${this.placeholder}" alt="album artwork" id="artwork" width="300" height="300" loading="lazy" decoding="async">
          <div class="track-info">
            <p class="artist">--</p>
            <p class="track">--</p>
            <p class="album">--</p>
            <p class="timer"><span class="currentTime">--</span> / <span class="duration">--</span></p>
          </div>
        </section>
        <section class="seeker"></section>
        <section class="controls">
          <div class="controls__primary"></div>
          <div class="controls__secondary">
            <div class="volume"></div>
          </div>
        </section>
        <section class="tracklist">
          <ol id="songs"></ol>
        </section>
      </div>
      `;
  }

  /**
   * Get the track location from the component attributes
   * @returns {string}
   */
  get tracksLocation() {
    return this.getAttribute("tracks");
  }

  get startingVolume() {
    return this.getAttribute("starting-volume");
  }

  get startingTime() {
    return this.getAttribute("starting-time");
  }

  /**
   * Creates a button element with the chosen SVG icon
   * @param id
   * @param icon
   * @param type
   * @returns {HTMLButtonElement}
   */
  createIcon(id, icon, type = "") {
    const button = document.createElement("button");
    button.id = id;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("fill", "none");

    switch (type) {
      case "large":
        svg.setAttribute("width", "34");
        svg.setAttribute("height", "34");
        break;
      default:
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        break;
    }

    svg.innerHTML = icon;
    button.appendChild(svg);

    return button;
  }

  /**
   * Creates a range input for sliders
   * @param id
   * @param options
   * @returns {HTMLInputElement}
   */
  createSlider(id, options = {}) {
    const input = document.createElement("input");
    input.id = id;
    input.type = "range";

    for (const option in options) {
      input.setAttribute(option, options[option]);
    }

    return input;
  }

  /**
   * Runs when the web component is connected to the DOM
   * @function
   */
  connectedCallback() {
    const { shadowRoot } = this;
    shadowRoot.innerHTML = `
        ${this.styles}
        ${this.container}
        `;

    /**
     * Store the primary controls container and attach all the buttons
     * @type {Element}
     */
    const controlsPrimaryContainer = shadowRoot.querySelector(".controls__primary");
    controlsPrimaryContainer.appendChild(this.createIcon("previous", this.icons.previous));
    controlsPrimaryContainer.appendChild(this.createIcon("action", this.icons.play, "large"));
    controlsPrimaryContainer.appendChild(this.createIcon("next", this.icons.next));
    controlsPrimaryContainer.appendChild(this.createIcon("shuffle", this.icons.shuffle));
    controlsPrimaryContainer.appendChild(this.createIcon("loop", this.icons.loop));

    /**
     * Store the track seeker container and attach the input
     * @type {Element}
     */
    const seekerContainer = shadowRoot.querySelector(".seeker");
    seekerContainer.appendChild(
      this.createSlider("seeker", {
        "min": "0",
        "step": "0.01",
        "value": "0",
        "aria-label": "seek through the track",
      })
    );

    /**
     * Store the volume container and attach the input
     * @type {Element}
     */
    const volumeContainer = shadowRoot.querySelector(".volume");
    volumeContainer.appendChild(this.createIcon("volumeBtn", this.icons.volMid));
    volumeContainer.appendChild(
      this.createSlider("volume", {
        "min": "0",
        "max": "1",
        "step": "0.01",
        "aria-label": "volume control",
      })
    );

    /** Variables need to be 1) defined, and 2) done so in connectedCallback() because `this` is undefined in practice */
    let audioOverride = false;
    let currentTrack = undefined;
    const playIcon = this.icons.play;
    const pauseIcon = this.icons.pause;
    const volIconMid = this.icons.volMid;
    const volIconOff = this.icons.volOff;
    const volIconLow = this.icons.volLow;
    const placeholderImage = this.placeholder;
    const tracksLocation = this.tracksLocation;
    const audio = shadowRoot.querySelector("#plvylist");
    const artwork = shadowRoot.querySelector("#artwork");
    const artist = shadowRoot.querySelector(".artist");
    const track = shadowRoot.querySelector(".track");
    const album = shadowRoot.querySelector(".album");
    const current = shadowRoot.querySelector(".currentTime");
    const duration = shadowRoot.querySelector(".duration");
    const seeker = shadowRoot.querySelector("#seeker");
    const previous = shadowRoot.querySelector("#previous");
    const action = shadowRoot.querySelector("#action");
    const next = shadowRoot.querySelector("#next");
    const shuffle = shadowRoot.querySelector("#shuffle");
    const loop = shadowRoot.querySelector("#loop");
    const volumeBtn = shadowRoot.querySelector("#volumeBtn");
    const volume = shadowRoot.querySelector("#volume");
    const songs = shadowRoot.querySelector("#songs");

    /**
     * Load any custom settings defined in component attributes
     * @type {string|number}
     */
    volume.value = this.startingVolume || 0.5;
    audio.volume = this.startingVolume || 0.5;
    seeker.value = this.startingTime || 0;
    audio.currentTime = this.startingTime || 0;

    /**
     * Fetches the tracks in JSON and then creates Plvylist
     * @returns {Promise<void>}
     * @constructor
     */
    async function CreatePlvylist() {
      await fetch(tracksLocation)
        .then((res) => res.json())
        .then((data) => {
          let allTracks = [];
          let tracks = data.tracks;
          let trackCount = tracks.length;

          const empty = "--";

          /**
           * All core Plvylist functions need to be defined in connectedCallback because they rely on DOM elements to work
           */

          /**
           * Set the current audio file
           * @param index
           */
          function loadTrack(index) {
            seeker.value = 0;
            audio.currentTime = 0;
            audio.src = tracks[index].file;
            currentTrack = index;

            artist.innerHTML = tracks[index].artist || empty;
            track.innerHTML = tracks[index].title || empty;
            album.innerHTML = tracks[index].album || empty;

            artwork.setAttribute("src", tracks[index].artwork || placeholderImage);
            loadCurrentTime();
          }

          /**
           * Build the track list from the fetched data
           */
          function loadTrackList() {
            let list = "";

            tracks.forEach((track, index) => {
              list += `<li data-track="${index}" data-file="${track.file}" class="song"><button class="song__title">${track.title}</button></li>`;
            });

            songs.innerHTML = list;
            allTracks = shadowRoot.querySelectorAll(".song__title");

            allTracks.forEach((track, index) =>
              track.addEventListener("click", () => {
                if (currentTrack === undefined) {
                  loadTrack(index);
                  pressPlay();
                } else if (audio.paused) {
                  loadTrack(index);
                } else {
                  loadTrack(index);
                  audio.play();
                }
              })
            );
          }

          /**
           * Pauses the track
           */
          function pressPause() {
            audio.pause();
            action.querySelector("svg").innerHTML = playIcon;
            audioOverride = !audioOverride;
          }

          /**
           * Plays the track
           */
          function pressPlay() {
            audio.play();
            action.querySelector("svg").innerHTML = pauseIcon;
            audioOverride = !audioOverride;
          }

          /**
           * Play the previous track
           */
          function previousTrack() {
            if (currentTrack === undefined) {
              return false;
            } else if (currentTrack - 1 > -1) {
              if (!audio.paused) {
                loadTrack(currentTrack - 1);
                audio.play();
              } else {
                loadTrack(currentTrack - 1);
              }
            } else {
              pressPause();
              loadTrack(currentTrack);
              audioOverride = false;
            }
          }

          /**
           * Play the next track
           */
          function nextTrack() {
            if (currentTrack === undefined) {
              loadTrack(0);
            } else if (currentTrack + 1 < trackCount) {
              if (!audio.paused) {
                loadTrack(currentTrack + 1);
                audio.play();
              } else {
                loadTrack(currentTrack + 1);
              }
            } else {
              pressPause();
              loadTrack(0);
              audioOverride = false;
            }
          }

          /**
           * Load the current track's duration
           */
          function loadDuration() {
            let time = audio.duration;

            let minutes = Math.floor(time / 60);
            minutes < 10 ? (minutes = `0${minutes}`) : minutes;

            let seconds = Math.floor(time % 60);
            seconds < 10 ? (seconds = `0${seconds}`) : seconds;

            duration.innerHTML = `${minutes}:${seconds}`;
          }

          /**
           * Load the current track's time
           * @param time
           * @returns {boolean}
           */
          function loadCurrentTime(time = audio.currentTime) {
            if (audio.src === "") {
              return false;
            }

            let minutes = Math.floor(time / 60);
            minutes < 10 ? (minutes = `0${minutes}`) : minutes;

            let seconds = Math.floor(time % 60);
            seconds < 10 ? (seconds = `0${seconds}`) : seconds;

            current.innerHTML = `${minutes}:${seconds}`;
          }

          /**
           * Change the volume icon based on input value
           */
          function setVolumeIcon() {
            if (audio.volume === 0 || audio.muted) {
              volumeBtn.querySelector("svg").innerHTML = volIconOff;
            } else if (audio.volume <= 0.45) {
              volumeBtn.querySelector("svg").innerHTML = volIconLow;
            } else {
              volumeBtn.querySelector("svg").innerHTML = volIconMid;
            }
          }

          /**
           * Toggle volume on or off
           */
          function toggleVolume() {
            if (!audio.muted) {
              audio.muted = !audio.muted;
              volumeBtn.querySelector("svg").innerHTML = volIconOff;
              volume.value = 0;
            } else {
              audio.muted = !audio.muted;
              setVolumeIcon();
              volume.value = audio.volume;
            }
          }

          /**
           * Turn on or off track looping
           * Only repeats a single track at a time, not full playlists
           */
          function toggleLoop() {
            audio.loop = !audio.loop;
            loop.classList.toggle("loop--active");
          }

          /**
           * Shuffle the tracks and return a newly-ordered array of tracks
           * @returns {*}
           */
          function shuffleTracks() {
            for (let i = tracks.length - 1; i > 0; i--) {
              let j = Math.floor(Math.random() * (i + 1));
              let tempTracks = tracks[i];
              tracks[i] = tracks[j];
              tracks[j] = tempTracks;
            }

            return tracks;
          }

          /**
           * On track loadstart, identify the active track
           */
          audio.addEventListener("loadstart", () => {
            shadowRoot
              .querySelector(`[data-file="${tracks[currentTrack].file}"]`)
              .classList.add("song__active");
          });

          /**
           * Load in the duration of the track when the metadata finishes loading
           */
          audio.addEventListener("loadedmetadata", loadDuration);

          /**
           * Listen for volume changes and adjust the icon
           */
          audio.addEventListener("volumechange", setVolumeIcon);

          /**
           * Define what to do when a track ends
           */
          audio.addEventListener("ended", () => {
            if (!audio.loop) {
              if (currentTrack === trackCount - 1) {
                nextTrack();
              } else {
                nextTrack();
                audio.play();
              }
            }
          });

          /**
           * Display progress & sets percentage
           */
          audio.addEventListener("timeupdate", () => {
            seeker.value = `${parseInt((audio.currentTime / audio.duration) * 100, 10)}`;
            loadCurrentTime();
          });

          /**
           * When the track gets emptied, remove the active track class
           */
          audio.addEventListener("emptied", () => {
            shadowRoot.querySelector(".song__active").classList.remove("song__active");
          });

          /**
           * Listen for changes to the track seeker
           */
          seeker.addEventListener("change", () => {
            if (currentTrack === undefined) {
              return false;
            } else {
              audio.currentTime = (seeker.value * audio.duration) / 100;
              audioOverride ? audio.play() : false;
            }
          });

          /**
           * Listen for direct changes to the track seeker
           */
          seeker.addEventListener("input", (event) => {
            if (currentTrack === undefined) {
              return false;
            } else {
              audio.pause();
              let newTime = (event.target.value * audio.duration) / 100;
              loadCurrentTime(newTime);
            }
          });

          /**
           * Set previous track event
           */
          previous.addEventListener("click", previousTrack);

          /**
           * Control playing and pausing of media
           */
          action.addEventListener("click", () => {
            if (currentTrack === undefined) {
              loadTrack(0);
              pressPlay();
            } else if (audio.paused) {
              pressPlay();
            } else {
              pressPause();
            }
          });

          /**
           * Set the next track event
           */
          next.addEventListener("click", nextTrack);

          /**
           * Set the looper on click
           */
          loop.addEventListener("click", toggleLoop);

          /**
           * Shuffle songs on click
           */
          shuffle.addEventListener("click", () => {
            window.alert("This will stop your current track and start you over fresh, okay?");

            shuffleTracks();
            loadTrackList();

            if (!audio.paused) {
              loadTrack(0);
              audio.play();
            } else {
              loadTrack(0);
            }
          });

          /**
           * Turn volume on or off
           */
          volumeBtn.addEventListener("click", toggleVolume);

          /**
           * Keep the audio and volume input values in sync
           */
          volume.addEventListener(
            "input",
            (e) => {
              audio.volume = volume.value;
            },
            false
          );

          loadTrackList();
        });
    }

    CreatePlvylist();
  }
}

customElements.define("plvylist-player", Plvylist);
