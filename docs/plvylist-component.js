class Plvylist extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.playIcon = `<title>Play</title><path d="M7 4v16l13 -8z"/>`;
    this.pauseIcon = `<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`;
    this.volIconMid = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`;
    this.volIconOff = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" />`;
    this.volIconLow = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`;
    this.placeholder = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA2MCA2MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjAgNjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNMzAsMEMxMy40NTgsMCwwLDEzLjQ1OCwwLDMwczEzLjQ1OCwzMCwzMCwzMHMzMC0xMy40NTgsMzAtMzBTNDYuNTQyLDAsMzAsMHogTTMwLDU4QzE0LjU2MSw1OCwyLDQ1LjQzOSwyLDMwUzE0LjU2MSwyLDMwLDJzMjgsMTIuNTYxLDI4LDI4UzQ1LjQzOSw1OCwzMCw1OHoiLz48cGF0aCBkPSJNMjMuMTY1LDguNDU5YzAuNTM3LTAuMTMsMC44NjgtMC42NywwLjczOS0xLjIwNmMtMC4xMjktMC41MzctMC42Ny0wLjg2Ni0xLjIwNi0wLjczOWMtMy45MzUsMC45NDYtNy41MjIsMi45NTUtMTAuMzc2LDUuODA5UzcuNDYsMTguNzY0LDYuNTE0LDIyLjY5OGMtMC4xMjksMC41MzYsMC4yMDIsMS4wNzYsMC43MzksMS4yMDZjMC4wNzgsMC4wMTksMC4xNTcsMC4wMjcsMC4yMzQsMC4wMjdjMC40NTEsMCwwLjg2MS0wLjMwOCwwLjk3Mi0wLjc2N2MwLjg1OS0zLjU3NSwyLjY4NS02LjgzNiw1LjI3Ny05LjQyOVMxOS41OSw5LjMxOCwyMy4xNjUsOC40NTl6Ii8+PHBhdGggZD0iTTUyLjc0NywzNi4wOTZjLTAuNTM4LTAuMTI5LTEuMDc3LDAuMjAxLTEuMjA2LDAuNzM5Yy0wLjg1OSwzLjU3NS0yLjY4NSw2LjgzNi01LjI3Nyw5LjQyOXMtNS44NTQsNC40MTgtOS40Myw1LjI3N2MtMC41MzcsMC4xMy0wLjg2OCwwLjY3LTAuNzM5LDEuMjA2YzAuMTEsMC40NTksMC41MjEsMC43NjcsMC45NzIsMC43NjdjMC4wNzcsMCwwLjE1Ni0wLjAwOSwwLjIzNC0wLjAyN2MzLjkzNi0wLjk0Niw3LjUyMy0yLjk1NSwxMC4zNzctNS44MDlzNC44NjItNi40NDEsNS44MDktMTAuMzc2QzUzLjYxNSwzNi43NjYsNTMuMjg0LDM2LjIyNiw1Mi43NDcsMzYuMDk2eiIvPjxwYXRoIGQ9Ik0yNC40NTIsMTMuMjg2YzAuNTM4LTAuMTI1LDAuODczLTAuNjYzLDAuNzQ3LTEuMmMtMC4xMjUtMC41MzgtMC42NjUtMC44NzgtMS4yLTAuNzQ3Yy0zLjA5LDAuNzItNS45MDQsMi4yODItOC4xNDEsNC41MmMtMi4yMzcsMi4yMzYtMy44LDUuMDUxLTQuNTIsOC4xNDFjLTAuMTI2LDAuNTM3LDAuMjA5LDEuMDc1LDAuNzQ3LDEuMmMwLjA3NiwwLjAxOSwwLjE1MiwwLjAyNiwwLjIyOCwwLjAyNmMwLjQ1NCwwLDAuODY1LTAuMzEyLDAuOTczLTAuNzczYzAuNjM1LTIuNzI1LDIuMDE0LTUuMjA3LDMuOTg2LTcuMThTMjEuNzI4LDEzLjkyMSwyNC40NTIsMTMuMjg2eiIvPjxwYXRoIGQ9Ik00OC42NjEsMzYuMDAxYzAuMTI2LTAuNTM3LTAuMjA5LTEuMDc1LTAuNzQ3LTEuMmMtMC41MzgtMC4xMzMtMS4wNzUsMC4yMDktMS4yLDAuNzQ3Yy0wLjYzNSwyLjcyNS0yLjAxNCw1LjIwNy0zLjk4Niw3LjE4cy00LjQ1NSwzLjM1Mi03LjE4LDMuOTg2Yy0wLjUzOCwwLjEyNS0wLjg3MywwLjY2My0wLjc0NywxLjJjMC4xMDcsMC40NjIsMC41MTksMC43NzMsMC45NzMsMC43NzNjMC4wNzUsMCwwLjE1MS0wLjAwOCwwLjIyOC0wLjAyNmMzLjA5LTAuNzIsNS45MDQtMi4yODIsOC4xNDEtNC41MkM0Ni4zNzksNDEuOTA1LDQ3Ljk0MSwzOS4wOTEsNDguNjYxLDM2LjAwMXoiLz48cGF0aCBkPSJNMjYuNDk1LDE2LjkyNWMtMC4xMTktMC41NDEtMC42NTMtMC44NzktMS4xOS0wLjc2M2MtNC41NTcsMC45OTctOC4xNDYsNC41ODYtOS4xNDMsOS4xNDNjLTAuMTE4LDAuNTM5LDAuMjI0LDEuMDcyLDAuNzYzLDEuMTljMC4wNzIsMC4wMTYsMC4xNDQsMC4wMjMsMC4yMTUsMC4wMjNjMC40NiwwLDAuODczLTAuMzE4LDAuOTc2LTAuNzg2YzAuODMxLTMuNzk2LDMuODIxLTYuNzg2LDcuNjE3LTcuNjE3QzI2LjI3MSwxNy45OTcsMjYuNjEzLDE3LjQ2NCwyNi40OTUsMTYuOTI1eiIvPjxwYXRoIGQ9Ik00My44MzgsMzQuNjk1YzAuMTE4LTAuNTM5LTAuMjI0LTEuMDcyLTAuNzYzLTEuMTljLTAuNTQtMC4xMTgtMS4wNzIsMC4yMjItMS4xOSwwLjc2M2MtMC44MzEsMy43OTYtMy44MjEsNi43ODYtNy42MTcsNy42MTdjLTAuNTM5LDAuMTE4LTAuODgxLDAuNjUxLTAuNzYzLDEuMTljMC4xMDMsMC40NjgsMC41MTYsMC43ODYsMC45NzYsMC43ODZjMC4wNzEsMCwwLjE0My0wLjAwOCwwLjIxNS0wLjAyM0MzOS4yNTIsNDIuODQxLDQyLjg0MSwzOS4yNTIsNDMuODM4LDM0LjY5NXoiLz48cGF0aCBkPSJNMzguMDgsMzBjMC00LjQ1NS0zLjYyNS04LjA4LTguMDgtOC4wOHMtOC4wOCwzLjYyNS04LjA4LDguMDhzMy42MjUsOC4wOCw4LjA4LDguMDhTMzguMDgsMzQuNDU1LDM4LjA4LDMweiBNMzAsMzYuMDhjLTMuMzUzLDAtNi4wOC0yLjcyOC02LjA4LTYuMDhzMi43MjgtNi4wOCw2LjA4LTYuMDhzNi4wOCwyLjcyOCw2LjA4LDYuMDhTMzMuMzUzLDM2LjA4LDMwLDM2LjA4eiIvPjwvZz48L3N2Zz4=`;
  }

  connectedCallback() {
    const { shadowRoot } = this;
    shadowRoot.innerHTML = `
            <style>
                .plvylist {--accent: dodgerblue; --changed: crimson; --contrast-1: hsl(0, 0%, 50%); --contrast-2: hsl(0, 0%, 70%, 0.3); accent-color: var(--accent); font-family: inherit; inline-size: 100%; margin: auto;}
                img#artwork {block-size: auto; max-inline-size: 100%;}
                .meta {align-items: flex-end; display: flex; flex-wrap: wrap; gap: 1em;}
                .track-info p:not(:last-of-type) {margin-block-end: 0.5rem; margin-block-start: 0;}
                #fwd {margin-inline-end: auto;}
                #loop.loop--active svg {stroke: var(--changed);}
                .seeker {margin-block: 1rem;}
                .volume {display: inline-flex;}
                :is(.controls, .song) button {background: none; border: none; color: inherit; cursor: pointer; font: inherit; stroke: currentColor;}
                .controls {align-items: center; display: flex; flex-wrap: wrap; justify-content: center;}
                .controls button:hover svg {stroke: var(--accent);}
                .controls__primary {display: flex; flex: 1; inline-size: 100%; justify-content: center;}
                #songs {line-height: 1.5;}
                .song:hover {background: var(--contrast-2);}
                .song__active button,
                .song__title:hover {color: var(--accent);}
                input[type=range] {inline-size: 100%; max-inline-size: 100%;}
            </style>
            <div class="plvylist">
                <audio id="plvylist"></audio>
                <div class="meta">
                    <img src="${this.placeholder}" alt="album artwork" id="artwork" width="300" height="300">
                    <div class="track-info">
                        <p class="artist">--</p>
                        <p class="track">--</p>
                        <p class="album">--</p>
                        <p class="timer"><span class="currentTime">--</span> / <span class="duration">--</span></p>
                    </div>
                </div>
                <div class="seeker">
                    <input id="seeker" type="range" min="0" step="0.01" value="0" aria-label="seek through the track">
                </div>
                <div class="controls">
                    <div class="controls__primary">
                        <button id="bkwd">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <title>Previous</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>
                            </svg>
                        </button>
                        <button id="action">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
                                ${this.playIcon}
                            </svg>
                        </button>
                        <button id="fwd">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <title>Next</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 5v14l8-7z"></path><path d="M14 5v14l8-7z"></path>
                            </svg>
                        </button>
                        <button id="shuffle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <title>Shuffle</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="15" width="6" height="6" rx="1"></rect><path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path><path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>
                            </svg>
                        </button>
                        <button id="loop">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <title>Loop</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path><path d="M11 11l1 -1v4"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="controls__secondary">
                        <div class="volume">
                            <button id="volumeBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
                                    ${this.volIconMid}
                                </svg>
                            </button>
                            <input id="volume" type="range" min="0" max="1" step="0.01" aria-label="volume control">
                        </div>
                    </div>
                </div>
                <div class="tracklist">
                    <ol id="songs"></ol>
                </div>
            </div>
        `;

    // set some variables for later
    const placeholderImage = this.placeholder;
    const tracksLocation = this.getAttribute("tracks");
    const playIcon = this.playIcon;
    const pauseIcon = this.pauseIcon;
    const volIconMid = this.volIconMid;
    const volIconOff = this.volIconOff;
    const volIconLow = this.volIconLow;
    let audioOverride = false;
    let currentTrack = undefined;
    const audio = shadowRoot.querySelector("#plvylist");
    const artwork = shadowRoot.querySelector("#artwork");
    const artist = shadowRoot.querySelector(".artist");
    const track = shadowRoot.querySelector(".track");
    const album = shadowRoot.querySelector(".album");
    const current = shadowRoot.querySelector(".currentTime");
    const duration = shadowRoot.querySelector(".duration");
    const seeker = shadowRoot.querySelector("#seeker");
    const bkwd = shadowRoot.querySelector("#bkwd");
    const action = shadowRoot.querySelector("#action");
    const fwd = shadowRoot.querySelector("#fwd");
    const shuffle = shadowRoot.querySelector("#shuffle");
    const loop = shadowRoot.querySelector("#loop");
    const volumeBtn = shadowRoot.querySelector("#volumeBtn");
    const volume = shadowRoot.querySelector("#volume");
    const songs = shadowRoot.querySelector("#songs");

    // load any custom settings
    volume.value = this.getAttribute("starting-volume") || 0.5;
    audio.volume = this.getAttribute("starting-volume") || 0.5;
    seeker.value = this.getAttribute("starting-time") || 0;
    audio.currentTime = this.getAttribute("starting-time") || 0;

    async function CreatePlvylist() {
      await fetch(tracksLocation)
        .then((res) => res.json())
        .then((data) => {
          let allTracks = [];
          let tracks = data.tracks;
          let trackCount = tracks.length;

          // set the audio file
          function loadTrack(index) {
            seeker.value = 0;
            audio.currentTime = 0;
            audio.src = tracks[index].file;
            currentTrack = index;
            artist.innerHTML = tracks[index].artist || "--";
            track.innerHTML = tracks[index].title || "--";
            album.innerHTML = tracks[index].album || "--";
            artwork.setAttribute(
              "src",
              tracks[index].artwork || placeholderImage
            );
            loadCurrentTime();
          }

          // function to build the song list
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

          // master Pause button
          function pressPause() {
            audio.pause();
            action.querySelector("svg").innerHTML = playIcon;
            audioOverride = !audioOverride;
          }

          // master Play button
          function pressPlay() {
            audio.play();
            action.querySelector("svg").innerHTML = pauseIcon;
            audioOverride = !audioOverride;
          }

          // master Previous button
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

          // master Next button
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

          // load in the current track duration
          function loadDuration() {
            let time = audio.duration;
            let minutes = Math.floor(time / 60);
            minutes < 10 ? (minutes = `0${minutes}`) : minutes;
            let seconds = Math.floor(time % 60);
            seconds < 10 ? (seconds = `0${seconds}`) : seconds;
            duration.innerHTML = `${minutes}:${seconds}`;
          }

          // update current time
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

          // set the volume icon depending on the volume level
          function setVolumeIcon() {
            if (audio.volume === 0 || audio.muted) {
              volumeBtn.querySelector("svg").innerHTML = volIconOff;
            } else if (audio.volume <= 0.45) {
              volumeBtn.querySelector("svg").innerHTML = volIconLow;
            } else {
              volumeBtn.querySelector("svg").innerHTML = volIconMid;
            }
          }

          // mute the volume with the volume button
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

          // toggle the loop action
          function toggleLoop() {
            audio.loop = !audio.loop;
            loop.classList.toggle("loop--active");
          }

          // function to shuffle the tracks array
          function shuffleTracks() {
            for (let i = tracks.length - 1; i > 0; i--) {
              let j = Math.floor(Math.random() * (i + 1));
              let tempTracks = tracks[i];
              tracks[i] = tracks[j];
              tracks[j] = tempTracks;
            }
            return tracks;
          }

          // on loadstart of the audio resource, change the active song class
          audio.addEventListener("loadstart", () => {
            let getter = currentTrack;
            shadowRoot
              .querySelector(`[data-file="${tracks[getter].file}"]`)
              .classList.add("song__active");
          });

          // load in the duration of the track when the metadata finishes loading
          audio.addEventListener("loadedmetadata", loadDuration);

          // listen for volume changes
          audio.addEventListener("volumechange", setVolumeIcon);

          // define what to do when a track ends
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

          // display progress & sets percentage
          audio.addEventListener("timeupdate", () => {
            seeker.value = `${parseInt(
              (audio.currentTime / audio.duration) * 100,
              10
            )}`;
            loadCurrentTime();
          });

          // when the track gets emptied, remove the active track class
          audio.addEventListener("emptied", () => {
            shadowRoot
              .querySelector(".song__active")
              .classList.remove("song__active");
          });

          // listen for changes to the track seeker
          seeker.addEventListener("change", () => {
            if (currentTrack === undefined) {
              return false;
            } else {
              audio.currentTime = (seeker.value * audio.duration) / 100;
              audioOverride ? audio.play() : false;
            }
          });

          // listen for direct changes to the track seeker
          seeker.addEventListener("input", (event) => {
            if (currentTrack === undefined) {
              return false;
            } else {
              audio.pause();
              let newTime = (event.target.value * audio.duration) / 100;
              loadCurrentTime(newTime);
            }
          });

          // function to play the previous track
          bkwd.addEventListener("click", previousTrack);

          // function to control playing and pausing media
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

          // function to play the next track
          fwd.addEventListener("click", nextTrack);

          // function to set the looper
          loop.addEventListener("click", toggleLoop);

          // turn on the shuffle button
          shuffle.addEventListener("click", () => {
            window.alert(
              "This will stop your current track and start you over fresh, okay?"
            );
            shuffleTracks();
            loadTrackList();
            if (!audio.paused) {
              loadTrack(0);
              audio.play();
            } else {
              loadTrack(0);
            }
          });

          // adjust the volume with the button
          volumeBtn.addEventListener("click", toggleVolume);

          // these are needed to apply css overrides to the range inputs
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
