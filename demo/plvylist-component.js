"use strict";

class Plvylist extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.playIcon = `<title>Play</title><path d="M7 4v16l13 -8z"/>`;
        this.fwdIcon = `<title>Next</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 5v14l8-7z"></path><path d="M14 5v14l8-7z"></path>`;
        this.bkwdIcon = `<title>Previous</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>`;
        this.loopIcon = `<title>Loop</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path><path d="M11 11l1 -1v4"></path>`;
        this.shuffleIcon = `<title>Shuffle</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="15" width="6" height="6" rx="1"></rect><path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path><path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>`;
        this.pauseIcon = `<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`;
        this.volIconMid = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`;
        this.volIconOff = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" />`;
        this.volIconLow = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`;
        this.tracks = [
            {
                file: this.getAttribute("audio-location") + "01_I_Know_I'm_Not.mp3" || '',
                title: "I Know I'm Not" || '',
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name")  || '',
                artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "02_Baby_Blue.mp3" || '',
                title: "Baby Blue" || '',
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name")  || '',
                artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "03_Insincerity.mp3" || '',
                title: "Insincerity" || '',
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name")  || '',
                artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "04_Like_Sinking.mp3" || '',
                title: "Like Sinking" || '',
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name")  || '',
                artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "05_Do_Better.mp3" || '',
                title: "Do Better" || '',
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name")  || '',
                artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "06_Market_Street.mp3",
                title: "Market Street",
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name") || '',
                artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "07_Alone_In_a_Crowded_Room.mp3",
                title: "Alone In A Crowded Room",
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name") || '',
                artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "08_Long_Time_Caller_First Time List.mp3",
                title: "Long Time Caller, First Time Listener",
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name") || '',
                artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "09_Detroit.mp3",
                title: "Detroit",
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name") || '',
                artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "10_We_Can't_Rush_These_Things.mp3",
                title: "We Can't Rush These Things",
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name") || '',
                artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "11_Closure.mp3",
                title: "Closure",
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name") || '',
                artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
            },
            {
                file: this.getAttribute("audio-location") + "12_Like_Drowning_(Bonus_Track).mp3",
                title: "Like Drowning (Bonus Track)",
                artist: this.getAttribute("artist-name") || '',
                album: this.getAttribute("album-name") || '',
                artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
            }
        ];
    }

    connectedCallback() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `
            <style>
                @import "https://unpkg.com/sanitize.css";
                .container {
                    --color-primary: #0a7ac9;
                    --color-changed: #e53d00;
                    --color-base: #010101;
                    --color-layout: #f5f5f5;
                    --color-contrast-1: lightgrey;
                    --color-contrast-2: #eee;
                    --track-width: 100%;
                    --track-height: .25em;
                    --track-color: var(--color-contrast-1);
                    --thumb-diameter: 1em;
                    --thumb-color: var(--color-base);
                    --fill-color: var(--color-primary);
                    --button-color: var(--color-primary);
                    --active-color: var(--color-primary);
                    --active-background: var(--color-contrast-2);
                    --font-family: Monospace, monospace;
                    --font-size-responsive: clamp(0.9113rem, 0.8922rem + 0.0951vw, 0.96rem);
                    --font-color: var(--color-base);
                    --main-background: var(--color-layout);
                    --loop-color: var(--color-changed);
                    --artwork-shadow: var(--color-base);
                    padding: .5em;
                    font-family: var(--font-family);
                    font-size: 16px;
                    color: var(--font-color);
                    background-color: var(--main-background);
                    width: 100%;
                    max-width: 45rem;
                    margin: auto;
                }

                img {
                    max-width: 100%;
                    display: block;
                    margin: auto;
                    height: auto;
                }

                img#artwork {
                    box-shadow: 0 0 5px 1px var(--artwork-shadow);
                }

                .meta {
                    display: flex;
                    flex-direction: column;
                    margin: auto;
                    gap: 1em;
                }

                .track-info p {
                    margin: 0;
                    font-size: var(--font-size-responsive);
                }

                .controls {
                    display: flex;
                    align-items: center;
                }

                .controls__primary {
                    display: flex;
                    width: 100%;
                    flex: 1;
                }

                #fwd {
                    margin-right: auto;
                }

                #loop.loop--active svg {
                    stroke: var(--loop-color);
                }

                .volume {
                    display: inline-flex;
                    align-items: center;
                    gap: .5em;
                }

                .controls button {
                    border: none;
                    border-radius: 25%;
                    background: none;
                    transition: background .1s ease-in-out;
                }

                .controls button svg {
                    stroke: var(--font-color);
                    transition: stroke .1s ease-in-out;
                }

                .controls button:hover svg {
                    stroke: var(--button-color);
                }

                .seeker {
                    margin: 1em auto;
                }

                .song__title:hover {
                    text-decoration: underline;
                    cursor: pointer;
                }

                #songs {
                    padding-left: 2em;
                    line-height: 1.5;
                    font-size: var(--font-size-responsive);
                }

                .song {
                    padding: 0 .5em;
                }

                .song:hover {
                    background: var(--active-background);
                }

                .song__active {
                    color: var(--active-color);
                }

                /* ==============
                ALL THE STYLES FOR THE SLIDER INPUTS BELOW HERE
                =============== */
                input[type="range"] {
                    --range: calc(var(--max) - var(--min));
                    --ratio: calc((var(--val) - var(--min)) / var(--range));
                    --sx: calc(0.5 * var(--thumb-diameter) + var(--ratio) * (100% - var(--thumb-diameter)));
                    margin: 0;
                    padding: 0;
                    max-width: var(--track-width);
                    height: var(--track-height);
                    background: transparent;
                    font: 1em/1 arial, sans-serif;
                    display: inline-block;
                    width: 100%;
                    height: 31px;
                    padding: 0;
                }

                input[type="range"],
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                }

                input[type="range"],
                input[type="range"]:focus {
                    border: none;
                    box-shadow: none;
                    -webkit-appearance: none;
                }

                input[type="range"]::-webkit-slider-runnable-track {
                    box-sizing: border-box;
                    max-width: var(--track-width);
                    height: var(--track-height);
                    background: var(--track-color);
                    border-radius: 6px;
                    padding-top: 1.5px;
                    padding-bottom: 1.5px;
                    background: linear-gradient(var(--fill-color), var(--fill-color)) 0/var(--sx) 100% no-repeat var(--track-color);
                }

                input[type="range"]::-moz-range-track {
                    box-sizing: border-box;
                    max-width: var(--track-width);
                    height: var(--track-height);
                    background: var(--track-color);
                    border-radius: 6px;
                    padding-top: 1.5px;
                    padding-bottom: 1.5px;
                }

                input[type="range"]::-ms-track {
                    box-sizing: border-box;
                    max-width: var(--track-width);
                    height: var(--track-height);
                    background: var(--track-color);
                    border-radius: 6px;
                }

                input[type="range"]::-moz-range-progress {
                    height: var(--track-height);
                    background: var(--fill-color);
                    border-radius: 6px;
                }

                input[type="range"]::-webkit-slider-thumb {
                    margin-top: -9px;
                    box-sizing: border-box;
                    background: var(--thumb-color);
                    width: var(--thumb-diameter);
                    height: var(--thumb-diameter);
                    border-radius: 50%;
                }

                input[type="range"]::-moz-range-thumb {
                    border: none;
                    box-sizing: border-box;
                    background: var(--thumb-color);
                    width: var(--thumb-diameter);
                    height: var(--thumb-diameter);
                    border-radius: 50%;
                }

                input[type="range"]:focus {
                    outline: none;
                }

                /*** Firefox Code Needed ***/
                    input[type="range"]::-moz-focus-outer {
                    border: none !important;
                }

                /*** IE/Edge code needed ***/
                    input[type="range"]::-ms-track {
                    color: transparent;
                    border: none !important;
                }

                input[type="range"]::-ms-tooltip {
                    display: none;
                }

                input[type="range"]::-ms-fill-lower {
                    background: var(--fill-color);
                }

                input[type="range"]::-ms-fill-upper {
                    background: var(--track-color);
                }

                input[type="range"]::-ms-thumb {
                    margin-top: 1px !important;
                    height: 10px !important;
                    width: 10px !important;
                    border-radius: 50%;
                    background: var(--thumb-color);
                    cursor: pointer;
                    border: 10px solid var(--thumb-color) !important;
                    box-shadow: none !important;
                }

                @media only screen and (max-width: 23.4375rem) {
                    .controls {
                        flex-direction: column;
                    }

                    .controls__primary {
                        justify-content: center;
                    }

                    #fwd {
                        margin-right: 0;
                    }
                }

                @media only screen and (min-width: 43.75rem) {
                    .meta {
                        display: grid;
                        grid-template-columns: 18.75rem 1fr;
                        align-items: end;
                    }
                }
            </style>

            <div class="container">
                <audio id="plvylist"></audio>
                <div class="meta">
                    <img src="${this.getAttribute("placeholder-image")}" alt="album artwork" id="artwork" width="300" height="300">
                    <div class="track-info">
                        <p class="artist">--</p>
                        <p class="track">--</p>
                        <p class="album">--</p>
                        <p class="timer"><span class="currentTime">--</span> / <span class="duration">--</span></p>
                    </div>
                </div>
                <div class="seeker">
                    <input id="seeker" type="range" min="0" step="0.01" value="0" aria-label="seek through the track" style="--min: 0; --max: 100; --val: 0">
                </div>
                <div class="controls">
                    <div class="controls__primary">
                        <button id="bkwd">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                ${this.bkwdIcon}
                            </svg>
                        </button>
                        <button id="action">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
                                ${this.playIcon}
                            </svg>
                        </button>
                        <button id="fwd">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                ${this.fwdIcon}
                            </svg>
                        </button>
                        <button id="shuffle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                ${this.shuffleIcon}
                            </svg>
                        </button>
                        <button id="loop">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                ${this.loopIcon}
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
                            <input id="volume" type="range" min="0" max="1" step="0.01" aria-label="volume control" style="--min: 0; --max: 100; --val: 50">
                        </div>
                    </div>
                </div>
                <div class="tracklist">
                    <ol id="songs"></ol>
                </div>
            </div>
        `;

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
        const playIcon = this.playIcon;
        const pauseIcon = this.pauseIcon;
        const volIconMid = this.volIconMid;
        const volIconOff = this.volIconOff;
        const volIconLow = this.volIconLow;
        var allTracks = []; // let this stay empty
        var tracks = this.tracks;
        var trackCount = tracks.length;
        var audioOverride = false;
        var currentTrack = undefined;

        // load the custom settings
        volume.value = this.getAttribute('starting-volume') || 0.5;
        audio.volume = this.getAttribute('starting-volume') || 0.5;
        seeker.value = this.getAttribute('starting-time') || 0;
        audio.currentTime = this.getAttribute('starting-time') || 0;

        // set the audio file
        function loadTrack(index) {
            seeker.value = 0;
            audio.currentTime = 0;
            audio.src = tracks[index].file;
            currentTrack = index;
            artist.innerHTML = tracks[index].artist || "--";
            track.innerHTML = tracks[index].title || "--";
            album.innerHTML = tracks[index].album || "--";
            artwork.setAttribute("src", tracks[index].artwork);
            loadCurrentTime();
        }

        // function to build the song list
        function loadTrackList() {
            let list = "";
            tracks.forEach((track, index) => {
                list += `<li data-track="${index}" data-file="${track.file}" class="song"><span class="song__title">${track.title}</span></li>`;
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
            action.querySelector('svg').innerHTML = playIcon;
            audioOverride = !audioOverride;
        }

        // master Play button
        function pressPlay() {
            audio.play();
            action.querySelector('svg').innerHTML = pauseIcon;
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
                volumeBtn.querySelector('svg').innerHTML = volIconOff;
            } else if (audio.volume <= 0.45) {
                volumeBtn.querySelector('svg').innerHTML = volIconLow;
            } else {
                volumeBtn.querySelector('svg').innerHTML = volIconMid;
            }
        }

        // mute the volume with the volume button
        function toggleVolume() {
            if (!audio.muted) {
                audio.muted = !audio.muted;
                volumeBtn.querySelector('svg').innerHTML = volIconOff;
                volume.value = 0;
                volume.style.setProperty("--val", volume.value * 100);
            } else {
                audio.muted = !audio.muted;
                setVolumeIcon();
                volume.value = audio.volume;
                volume.style.setProperty("--val", volume.value * 100);
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
            seeker.value = `${parseInt((audio.currentTime / audio.duration) * 100, 10)}`;
            seeker.style.setProperty("--val", seeker.value);
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
                seeker.style.setProperty("--val", seeker.value);
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
                seeker.style.setProperty("--val", seeker.value);
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

        // adjust the volume with the button
        volumeBtn.addEventListener("click", toggleVolume);

        // these are needed to apply css overrides to the range inputs
        volume.addEventListener(
            "input",
            (e) => {
                audio.volume = volume.value;
                volume.style.setProperty("--val", volume.value * 100);
            },
            false
        );

        loadTrackList();
    }
}

customElements.define('plvylist-player', Plvylist);