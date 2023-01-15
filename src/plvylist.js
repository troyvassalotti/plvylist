/**
 * @file Plvylist Web Component
 */

import { html } from "common-tags";
import placeholderArtwork from "./placeholder-artwork.svg";

const EMPTY_METADATA = "--";

/**
 * Fetches data from a JSON file to look for its tracks.
 * @param {string} location Path to JSON file.
 * @returns {Array<Record<string, string>} Tracks field from data.
 */
const fetchTrackData = async (location) => {
  if (location) {
    const res = await fetch(location);
    const data = await res.json();

    return data.tracks;
  }
};

/**
 * @tag plvy-list
 * @summary A media player for playlists or other collections of audio.
 *
 * @attribute {string} file - Path to JSON file containing tracks.
 * @attribute {string} placeholder - Path to image file to replace the default placeholder image of albums.
 * @attribute {string} starting-volume - Number between 0 and 1 to set the volume at.
 * @attribute {string} starting-time - Some number (format unsure) if you want to change the initial starting time of component. Through testing, I don't really know how this works aside from knowing it's an option I've given you.
 *
 * @cssproperty --plvylist-accent - Accent color for form elements.
 * @cssproperty --plvylist-font - Font family for component.
 * @cssproperty --plvylist-line-height - Line height for text.
 * @cssproperty --plvylist-changed - Color to use for changed button states (currently only the loop button).
 *
 * @example
 * ```html
 * <plvy-list file="./tracks.json" starting-volume="0.75" starting-time=".4" placeholder="./image.jpg"></plvy-list>
 * ```
 */
export class Plvylist extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.placeholder = placeholderArtwork;

    this.file = ""; // No default tracks file
    this.tracks = []; // Starts empty because no tracks have been loaded and we can't fetch data from an empty file string

    this.startingVolume = 0.5;
    this.startingTime = 0;

    this.audioOverride = false; // Helps manage when tracks should be started or paused during selection.
    this.currentTrack = undefined;

    /**
     * Icon Storage
     * @type {{play: string, volumeOff: string, volumeLow: string, pause: string, volumeMid: string}}
     */
    this.icons = {
      play: html`<title>Play</title><path d="M7 4v16l13 -8z" />`,
      pause: html`<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect
          x="6"
          y="5"
          width="4"
          height="14"
          rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`,
      previous: html`<title>Previous</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>`,
      next: html`<title>Next</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><path d="M3 5v14l8-7z"></path><path d="M14 5v14l8-7z"></path>`,
      shuffle: html`<title>Shuffle</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><rect x="3" y="3" width="6" height="6" rx="1"></rect
        ><rect x="15" y="15" width="6" height="6" rx="1"></rect
        ><path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path
        ><path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>`,
      loop: html`<title>Loop</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path
        ><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path><path d="M11 11l1 -1v4"></path>`,
      volumeOff: html`<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path
          d="M16 10l4 4m0 -4l-4 4" />`,
      volumeLow: html`<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
          d="M15 8a5 5 0 0 1 0 8" /><path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
      volumeMid: html`<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
          d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
    };
  }

  /** Component API */
  static get observedAttributes() {
    return ["file", "placeholder", "starting-volume", "starting-time"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "file":
        this.file = newValue;
        this.tracks = fetchTrackData(this.file);
        break;
      case "placeholder":
        this.placeholder = newValue;
        break;
      case "starting-volume":
        this.startingVolume = newValue;
        break;
      case "starting-time":
        this.startingTime = newValue;
        break;
      default:
        return true;
    }
  }

  /**
   * Creates a button element with the chosen SVG icon.
   * @param id ID of the element.
   * @param icon Type of icon to use from the library.
   * @param type Icon could be "large" or default size.
   * @returns {HTMLButtonElement}
   */
  createIcon = (id, icon, type = "") => {
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
  };

  /**
   * Creates a range input for sliders.
   * @param id ID of the element.
   * @param options Any additional attributes and their values to apply.
   * @returns {HTMLInputElement}
   */
  createSlider = (id, options = {}) => {
    const input = document.createElement("input");
    input.id = id;
    input.type = "range";

    for (const option in options) {
      input.setAttribute(option, options[option]);
    }

    return input;
  };

  /**
   * Render component styles.
   * @returns {string} HTML string for the component styles in a `<style>` element.
   */
  renderStyles() {
    return html`
      <style>
        :host {
          accent-color: var(--plvylist-accent, royalblue);
          box-sizing: border-box;
          display: block;
          font-family: var(--plvylist-font, inherit);
          line-height: var(--plvlist-line-height, 1.5);
        }

        *,
        *::after,
        *::before {
          box-sizing: inherit;
        }

        * {
          margin: 0;
        }

        #artwork {
          block-size: auto;
          max-inline-size: 100%;
        }

        .metadata {
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

        :is(.song, .controls) button {
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
          opacity: 0.666;
        }

        .controls__primary {
          display: flex;
          flex: 1;
          inline-size: 100%;
          justify-content: center;
        }

        .song__title {
          text-align: inherit;
          transition: 0.1s color ease-in-out;
        }

        .song__active button,
        .song__title:hover {
          opacity: 0.666;
          text-decoration: underline;
        }

        img[src^="data:image/svg+xml"] {
          filter: contrast(0.5);
        }

        input[type="range"] {
          inline-size: 100%;
        }
      </style>
    `;
  }

  /**
   * Render the HTML shell of the component.
   * @returns {string} HTML string for the component's template.
   */
  renderContainer() {
    return html`
        <audio id="plvylist"></audio>
        <div class="meta">
          <img
            src="${this.placeholder}"
            alt="album artwork"
            id="artwork"
            width="300"
            height="300"
            loading="lazy"
            decoding="async" />
          <div class="track-info">
            <p class="artist">--</p>
            <p class="track">--</p>
            <p class="album">--</p>
            <p class="timer">
              <span class="currentTime">--</span> / <span class="duration">--</span>
            </p>
          </div>
        </div>
        <div class="seeker"></div>
        <div class="controls">
          <div class="controls__primary"></div>
          <div class="controls__secondary">
            <div class="volume"></div>
          </div>
        </div>
        <div class="tracklist">
          <ol id="songs"></ol>
        </div>
    `;
  }

  /**
   * Render the styles and HTML shell together at the given location.
   * @param {HTMLElement|Node|DocumentFragment} root Where to render the component styles and shell.
   */
  renderTemplate(root) {
    root.innerHTML = `${this.renderStyles()} ${this.renderContainer()}`;
  }

  /** Render the primary control bar by creating each button element and appending them to the container. */
  renderPrimaryControls = () => {
    if (this.controlsPrimaryContainer) {
      this.controlsPrimaryContainer.appendChild(this.createIcon("previous", this.icons.previous));
      this.controlsPrimaryContainer.appendChild(
        this.createIcon("action", this.icons.play, "large")
      );
      this.controlsPrimaryContainer.appendChild(this.createIcon("next", this.icons.next));
      this.controlsPrimaryContainer.appendChild(this.createIcon("shuffle", this.icons.shuffle));
      this.controlsPrimaryContainer.appendChild(this.createIcon("loop", this.icons.loop));
    }
  };

  /** Render the track seeker by creating the input element and appending it to the container. */
  renderSeekerBar = () => {
    if (this.seekerContainer) {
      const bar = this.createSlider("seeker", {
        "min": "0",
        "step": "0.01",
        "value": "0",
        "aria-label": "seek through the track",
      });

      this.seekerContainer.appendChild(bar);
    }
  };

  /** Render the volume bar by creating the input and associated button and appending them to the container. */
  renderVolumeBar = () => {
    if (this.volumeContainer) {
      const button = this.createIcon("volumeBtn", this.icons.volumeMid);
      const bar = this.createSlider("volume", {
        "min": "0",
        "max": "1",
        "step": "0.01",
        "aria-label": "volume control",
      });

      this.volumeContainer.appendChild(button);
      this.volumeContainer.appendChild(bar);
    }
  };

  /**
   * Render the track list by creating new list items and setting the resulting string as the inner HTML of the container.
   *
   * We fetch the tracks file here and set `this.tracks` to the return value. That property is used to iterate over and render list items.
   *
   * If we're shuffling tracks, then `this.tracks` is set to the return value of the shuffle method.
   *
   * @param {boolean} shuffled Whether or not we're getting tracks from a shuffled list or from the file.
   */
  renderTrackList = async (shuffled = false) => {
    if (!shuffled) {
      // Ignore VS Code saying await has no effect here.
      this.tracks = await fetchTrackData(this.file);
    } else {
      this.tracks = this.shuffleTracks();
    }

    let list = html``;

    this.tracks.forEach((track, index) => {
      list += html`<li data-track="${index}" data-file="${track.file}" class="song">
        <button class="song__title">${track.title}</button>
      </li>`;
    });

    this.songs.innerHTML = list;

    this.trackList.forEach((track, index) =>
      track.addEventListener("click", () => {
        if (this.currentTrack === undefined) {
          this.loadTrack(index);
          this.pressPlay();
        } else if (this.audio.paused) {
          this.loadTrack(index);
        } else {
          this.loadTrack(index);
          this.audio.play();
        }
      })
    );
  };

  /**
   * Query for an element within the shadow root.
   * @param {string} query Query string.
   * @param {boolean} all Whether to use querySelectorAll or querySelector.
   * @returns {Element|Element[]} Queried element.
   */
  queryShadowRoot(query, all = false) {
    if (all) {
      return this.shadowRoot?.querySelectorAll(query);
    }

    return this.shadowRoot?.querySelector(query);
  }

  /**
   * Audio element where tracks are played.
   * @type {HTMLAudioElement}
   */
  get audio() {
    return this.queryShadowRoot("#plvylist");
  }

  /**
   * Album artwork.
   * @type {HTMLImageElement}
   */
  get artwork() {
    return this.queryShadowRoot("#artwork");
  }

  /**
   * Artist name.
   * @type {HTMLParagraphElement}
   */
  get artist() {
    return this.queryShadowRoot(".artist");
  }

  /**
   * Track name.
   * @type {HTMLParagraphElement}
   */
  get track() {
    return this.queryShadowRoot(".track");
  }

  /**
   * Album/Release name.
   * @type {HTMLParagraphElement}
   */
  get album() {
    return this.queryShadowRoot(".album");
  }

  /**
   * Current time position of the track.
   * @type {HTMLSpanElement}
   */
  get current() {
    return this.queryShadowRoot(".currentTime");
  }

  /**
   * Total duration of the track.
   * @type {HTMLSpanElement}
   */
  get duration() {
    return this.queryShadowRoot(".duration");
  }

  /**
   * Container for the seeker bar.
   * @type {HTMLDivElement}
   */
  get seekerContainer() {
    return this.queryShadowRoot(".seeker");
  }

  /**
   * Seeker bar.
   * @type {HTMLInputElement}
   */
  get seeker() {
    return this.queryShadowRoot("#seeker");
  }

  /**
   * Previous track button.
   * @type {HTMLButtonElement}
   */
  get previous() {
    return this.queryShadowRoot("#previous");
  }

  /**
   * Primary action button.
   * @type {HTMLButtonElement}
   */
  get action() {
    return this.queryShadowRoot("#action");
  }

  /**
   * Inner SVG of the action button.
   * @type {SVGElement}
   */
  get actionSvg() {
    if (this.action) {
      return this.action.querySelector("svg");
    }
  }

  /**
   * Next track button.
   * @type {HTMLButtonElement}
   */
  get next() {
    return this.queryShadowRoot("#next");
  }

  /**
   * Shuffle tracks button.
   * @type {HTMLButtonElement}
   */
  get shuffle() {
    return this.queryShadowRoot("#shuffle");
  }

  /**
   * Track loop button.
   * @type {HTMLButtonElement}
   */
  get loop() {
    return this.queryShadowRoot("#loop");
  }

  /**
   * Container for the volume section.
   * @type {HTMLDivElement}
   */
  get volumeContainer() {
    return this.queryShadowRoot(".volume");
  }

  /**
   * Volume button.
   * @type {HTMLButtonElement}
   */
  get volumeBtn() {
    return this.queryShadowRoot("#volumeBtn");
  }

  /**
   * Inner SVG of the volume button.
   * @type {SVGElement}
   */
  get volumeBtnSvg() {
    if (this.volumeBtn) {
      return this.volumeBtn.querySelector("svg");
    }
  }

  /**
   * Volume bar.
   * @type {HTMLInputElement}
   */
  get volume() {
    return this.queryShadowRoot("#volume");
  }

  /**
   * Container for the track list.
   * @type {HTMLOListElement}
   */
  get songs() {
    return this.queryShadowRoot("#songs");
  }

  /**
   * Primary controls container.
   * @type {HTMLDivElement}
   */
  get controlsPrimaryContainer() {
    return this.queryShadowRoot(".controls__primary");
  }

  /** Total number of tracks. */
  get trackCount() {
    return this.tracks?.length;
  }

  /**
   * All the individual track list items.
   * @type {HTMLLIElement[]}
   */
  get trackList() {
    return this.queryShadowRoot(".song__title", true);
  }

  /** Set default or custom settings from the API. */
  applySettings = () => {
    this.volume.value = this.startingVolume;
    this.audio.volume = this.startingVolume;
    this.seeker.value = this.startingTime;
    this.audio.currentTime = this.startingTime;
  };

  /**
   * Load a given track by its indexed position in the tracks.
   * @param {number} index Valid index as number for the tracks array.
   */
  loadTrack = (index) => {
    this.seeker.value = 0;
    this.audio.currentTime = 0;
    this.audio.src = this.tracks[index].file;
    this.currentTrack = index;

    this.artist.innerHTML = this.tracks[index].artist || EMPTY_METADATA;
    this.track.innerHTML = this.tracks[index].title || EMPTY_METADATA;
    this.album.innerHTML = this.tracks[index].album || EMPTY_METADATA;

    this.artwork.setAttribute("src", this.tracks[index].artwork || placeholderImage);

    this.loadCurrentTime();
  };

  /** Pauses a track and sets the associated HTML and class properties. */
  pressPause = () => {
    this.audio.pause();
    this.actionSvg.innerHTML = this.icons.play;
    this.audioOverride = !this.audioOverride;
  };

  /** Plays a track and sets the associated HTML and class properties. */
  pressPlay = () => {
    this.audio.play();
    this.actionSvg.innerHTML = this.icons.pause;
    this.audioOverride = !this.audioOverride;
  };

  /** Changes selection to the previous track. */
  previousTrack = () => {
    if (this.currentTrack === undefined) {
      return false;
    } else if (this.currentTrack - 1 > -1) {
      if (!this.audio.paused) {
        this.loadTrack(this.currentTrack - 1);
        this.audio.play();
      } else {
        this.loadTrack(this.currentTrack - 1);
      }
    } else {
      this.pressPause();
      this.loadTrack(this.currentTrack);
      this.audioOverride = false;
    }
  };

  /** Changes selection to the next track. */
  nextTrack = () => {
    if (this.currentTrack === undefined) {
      this.loadTrack(0);
    } else if (this.currentTrack + 1 < this.trackCount) {
      if (!this.audio.paused) {
        this.loadTrack(this.currentTrack + 1);
        this.audio.play();
      } else {
        this.loadTrack(this.currentTrack + 1);
      }
    } else {
      this.pressPause();
      this.loadTrack(0);
      this.audioOverride = false;
    }
  };

  /** Loads the current track's duration from metadata and displays it. */
  loadDuration = () => {
    let time = this.audio.duration;

    let minutes = Math.floor(time / 60);
    minutes < 10 ? (minutes = `0${minutes}`) : minutes;

    let seconds = Math.floor(time % 60);
    seconds < 10 ? (seconds = `0${seconds}`) : seconds;

    this.duration.innerHTML = `${minutes}:${seconds}`;
  };

  /** Loads the current track's play progress from metadata and displays it. */
  loadCurrentTime = (time = this.audio.currentTime) => {
    if (!this.audio.src) {
      return false;
    }

    let minutes = Math.floor(time / 60);
    minutes < 10 ? (minutes = `0${minutes}`) : minutes;

    let seconds = Math.floor(time % 60);
    seconds < 10 ? (seconds = `0${seconds}`) : seconds;

    this.current.innerHTML = `${minutes}:${seconds}`;
  };

  /** Changes the icon in the volume button based on the current volume level. */
  setVolumeIcon = () => {
    if (this.audio.volume === 0 || this.audio.muted) {
      this.volumeBtnSvg.innerHTML = this.icons.volumeOff;
    } else if (this.audio.volume <= 0.45) {
      this.volumeBtnSvg.innerHTML = this.icons.volumeLow;
    } else {
      this.volumeBtnSvg.innerHTML = this.icons.volumeMid;
    }
  };

  /** Mutes or unmutes the track based on muted state. */
  toggleVolume = () => {
    if (!this.audio.muted) {
      this.audio.muted = !this.audio.muted;
      this.volumeBtnSvg.innerHTML = this.icons.volumeOff;
      this.volume.value = 0;
    } else {
      this.audio.muted = !this.audio.muted;
      this.setVolumeIcon();
      this.volume.value = this.audio.volume;
    }
  };

  /** Sets the track to loop or not based on loop state. */
  toggleLoop = () => {
    this.audio.loop = !this.audio.loop;
    this.loop.classList.toggle("loop--active");
  };

  /**
   * Shuffles the track list.
   * @returns {Array<Record<string, string>} New track list.
   */
  shuffleTracks = () => {
    let tracks = this.tracks;

    for (let i = tracks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempTracks = tracks[i];
      tracks[i] = tracks[j];
      tracks[j] = tempTracks;
    }

    this.tracks = tracks;

    return tracks;
  };

  /** Add event listeners to all relevant elements. */
  addAllEventListeners() {
    /** On track loadstart, identify the active track. */
    this.audio.addEventListener("loadstart", () => {
      this.queryShadowRoot(`[data-file="${this.tracks[this.currentTrack].file}"]`).classList.add(
        "song__active"
      );
    });

    /** Load in the duration of the track when the metadata finishes loading. */
    this.audio.addEventListener("loadedmetadata", this.loadDuration);

    /** Listen for volume changes and adjust the icon. */
    this.audio.addEventListener("volumechange", this.setVolumeIcon);

    /** When a track ends, either loop it or go to the next track. */
    this.audio.addEventListener("ended", () => {
      if (!this.audio.loop) {
        if (this.currentTrack === this.trackCount - 1) {
          this.nextTrack();
        } else {
          this.nextTrack();
          this.audio.play();
        }
      }
    });

    /** Display progress & sets percentage. */
    this.audio.addEventListener("timeupdate", () => {
      this.seeker.value = `${parseInt((this.audio.currentTime / this.audio.duration) * 100, 10)}`;
      this.loadCurrentTime();
    });

    /** When the track gets emptied, remove the active track class. */
    this.audio.addEventListener("emptied", () => {
      const activeSong = this.queryShadowRoot(".song__active");

      if (activeSong) activeSong.classList.remove("song__active");
    });

    /** Listen for changes to the track seeker and adjust any time values. */
    this.seeker.addEventListener("change", () => {
      if (this.currentTrack === undefined) {
        return false;
      } else {
        this.audio.currentTime = (this.seeker.value * this.audio.duration) / 100;
        this.audioOverride ? this.audio.play() : false;
      }
    });

    /** Listen for direct changes to the track seeker and adjust any time values. */
    this.seeker.addEventListener("input", (event) => {
      if (this.currentTrack === undefined) {
        return false;
      } else {
        this.audio.pause();
        let newTime = (event.target.value * this.audio.duration) / 100;
        this.loadCurrentTime(newTime);
      }
    });

    /** Play the previous track on click. */
    this.previous.addEventListener("click", this.previousTrack);

    /** Control playing and pausing of media on the action button. */
    this.action.addEventListener("click", () => {
      if (this.currentTrack === undefined) {
        this.loadTrack(0);
        this.pressPlay();
      } else if (this.audio.paused) {
        this.pressPlay();
      } else {
        this.pressPause();
      }
    });

    /** Play the next track on click. */
    this.next.addEventListener("click", this.nextTrack);

    /** Loop the active track on click. */
    this.loop.addEventListener("click", this.toggleLoop);

    /** Shuffle songs on click. */
    this.shuffle.addEventListener("click", () => {
      window.alert("This will stop your current track and start you over fresh, okay?");

      this.renderTrackList(true);

      if (!this.audio.paused) {
        this.loadTrack(0);
        this.audio.play();
      } else {
        this.loadTrack(0);
      }
    });

    /** Turn volume on or off on click. */
    this.volumeBtn.addEventListener("click", this.toggleVolume);

    /** Keep the audio and volume input values in sync during input. */
    this.volume.addEventListener(
      "input",
      (e) => {
        this.audio.volume = this.volume.value;
      },
      false
    );
  }

  connectedCallback() {
    this.renderTemplate(this.shadowRoot);
    this.renderPrimaryControls();
    this.renderSeekerBar();
    this.renderVolumeBar();
    this.applySettings();
    this.renderTrackList();
    this.addAllEventListeners();
  }
}

customElements.define("plvy-list", Plvylist);
