// Grab the Plvylist wrapper and create the overarching audio element
const plvylist = document.querySelector(".plvylist");
const audio = document.createElement("audio");
audio.setAttribute("id", "plvylist");

// Create the div the hold all the meta information - artwork and track information
const plvyMetaDiv = document.createElement("div");
plvyMetaDiv.classList.add("plvy--meta");

// The artwork element
// Since this is made for a single album, there's only one artwork variable, but this could be made to support more.
const artwork = document.createElement("img");
const artworkAttributes = {
  src: "",
  width: "300",
  height: "300",
  alt: "album artwork",
  id: "artwork"
};
const artworkAttributesKeys = Object.keys(artworkAttributes);
artworkAttributesKeys.forEach((key, index) => {
  artwork.setAttribute(`${key}`, `${artworkAttributes[key]}`);
});

// All the track information - artist, track title, album, and timing
const plvyTrackInfoDiv = document.createElement("div");
plvyTrackInfoDiv.classList.add("plvy--track-info");
var trackInformation = [];

const artist = document.createElement("p");
artist.classList.add("plvy--artist");
trackInformation.push(artist);

const track = document.createElement("p");
track.classList.add("plvy--track");
trackInformation.push(track);

const album = document.createElement("p");
album.classList.add("plvy--album");
trackInformation.push(album);

const plvyTimerP = document.createElement("p");
plvyTimerP.classList.add("plvy--timer");
plvyTimerP.innerHTML = " / ";

const current = document.createElement("span");
current.classList.add("plvy--currentTime");
trackInformation.push(current);

const duration = document.createElement("span");
duration.classList.add("plvy--duration");
trackInformation.push(duration);

trackInformation.forEach((item, index) => {
  item.innerHTML = "--";
});

// The slider to seek through the track and it's container div
const plvySeekerDiv = document.createElement("div");
plvySeekerDiv.classList.add("plvy--seeker");

const seeker = document.createElement("input");
const seekerAttributes = {
  type: "range",
  min: "0",
  step: "0.01",
  value: "0",
  "aria-label": "seek through the track",
  style: "--min: 0; --max: 100; --val: 0"
};
const seekerAttributesKeys = Object.keys(seekerAttributes);
seekerAttributesKeys.forEach((key, index) => {
  seeker.setAttribute(`${key}`, `${seekerAttributes[key]}`);
});

// The containers for all the controls
const plvyControlsDiv = document.createElement("div");
plvyControlsDiv.classList.add("plvy--controls");
const plvyControlsPrimary = document.createElement("div");
plvyControlsPrimary.classList.add("controls__primary");
const plvyControlsSecondary = document.createElement("div");
plvyControlsSecondary.classList.add("controls__secondary");

// The backwards button
const bkwd = document.createElement("button");
bkwd.setAttribute("id", "bkwd");
bkwd.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <title>Previous</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M21 5v14l-8 -7z" />
            <path d="M10 5v14l-8 -7z" />
          </svg>`;

// The main action button
const action = document.createElement("button");
action.setAttribute("id", "action");
const actionSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const playIcon = `<title>Play</title><path d="M7 4v16l13 -8z"/>`;
const pauseIcon = `<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`;
const actionSvgAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "34",
  height: "34",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  fill: "none"
};
const actionSvgAttributesKeys = Object.keys(actionSvgAttributes);
actionSvgAttributesKeys.forEach((key, index) => {
  actionSvg.setAttribute(`${key}`, `${actionSvgAttributes[key]}`);
});
actionSvg.innerHTML = playIcon;

// The forward button
const fwd = document.createElement("button");
fwd.setAttribute("id", "fwd");
fwd.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <title>Next</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 5v14l8-7z" />
            <path d="M14 5v14l8-7z" />
          </svg>`;

// The shuffle button
const shuffle = document.createElement("button");
shuffle.setAttribute("id", "shuffle");
shuffle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <title>Shuffle</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="15" y="15" width="6" height="6" rx="1" />
            <path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3" />
            <path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3" />
          </svg>`;

// The loop button
const loop = document.createElement("button");
loop.setAttribute("id", "loop");
loop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <title>Loop</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
            <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3" />
            <path d="M11 11l1 -1v4" />
          </svg>`;

// The volume slider, button, and container div
const plvyVolumeDiv = document.createElement("div");
plvyVolumeDiv.classList.add("plvy--volume");

const volumeBtn = document.createElement("button");
volumeBtn.setAttribute("id", "volumeBtn");
const volumeBtnSvg = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
const volIconMid = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`;
const volIconOff = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" />`;
const volIconLow = `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`;
const volumeBtnSvgAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  fill: "none"
};
const volumeBtnSvgAttributesKeys = Object.keys(volumeBtnSvgAttributes);
volumeBtnSvgAttributesKeys.forEach((key, index) => {
  volumeBtnSvg.setAttribute(`${key}`, `${volumeBtnSvgAttributes[key]}`);
});
volumeBtnSvg.innerHTML = volIconMid;

const volume = document.createElement("input");
const volumeAttributes = {
  type: "range",
  min: "0",
  max: "1",
  step: "0.01",
  "aria-label": "volume control",
  style: "--min: 0; --max: 100; --val: 50"
};
const volumeAttributesKeys = Object.keys(volumeAttributes);
volumeAttributesKeys.forEach((key, index) => {
  volume.setAttribute(`${key}`, `${volumeAttributes[key]}`);
});

// The container for the track list
const plvyTracklistDiv = document.createElement("div");
plvyTracklistDiv.classList.add("plvy--tracklist");
const songs = document.createElement("ol");
songs.setAttribute("id", "plvy--songs");

// Okay, now put all the pieces together!
plvylist.insertAdjacentElement("afterbegin", audio);
audio.insertAdjacentElement("afterend", plvyMetaDiv);
plvyMetaDiv.insertAdjacentElement("afterbegin", artwork);
artwork.insertAdjacentElement("afterend", plvyTrackInfoDiv);
plvyTrackInfoDiv.insertAdjacentElement("afterbegin", artist);
artist.insertAdjacentElement("afterend", track);
track.insertAdjacentElement("afterend", album);
album.insertAdjacentElement("afterend", plvyTimerP);
plvyTimerP.insertAdjacentElement("afterbegin", current);
plvyTimerP.insertAdjacentElement("beforeend", duration);
plvyMetaDiv.insertAdjacentElement("afterend", plvySeekerDiv);
plvySeekerDiv.insertAdjacentElement("afterbegin", seeker);
plvySeekerDiv.insertAdjacentElement("afterend", plvyControlsDiv);
plvyControlsDiv.insertAdjacentElement("afterbegin", plvyControlsPrimary);
plvyControlsPrimary.insertAdjacentElement("afterbegin", bkwd);
bkwd.insertAdjacentElement("afterend", action);
action.insertAdjacentElement("afterbegin", actionSvg);
action.insertAdjacentElement("afterend", fwd);
fwd.insertAdjacentElement("afterend", shuffle);
shuffle.insertAdjacentElement("afterend", loop);
plvyControlsPrimary.insertAdjacentElement("afterend", plvyControlsSecondary);
plvyControlsSecondary.insertAdjacentElement("afterbegin", plvyVolumeDiv);
plvyVolumeDiv.insertAdjacentElement("afterbegin", volumeBtn);
volumeBtn.insertAdjacentElement("afterbegin", volumeBtnSvg);
volumeBtn.insertAdjacentElement("afterend", volume);
plvyControlsDiv.insertAdjacentElement("afterend", plvyTracklistDiv);
plvyTracklistDiv.insertAdjacentElement("afterbegin", songs);

// Define all the tracks, settings, and such here
// Clearly, this is where you'd put your own songs to link to
const artworkForTracks = ".jpg", // file location for the artwork
  albumForTracks = "", // name of the album
  artistForTracks = "", // name of the artist
  filePrefix = "/assets/audio/"; // you want to change this to make sure the linking works, trust me. I put this /assets/audio/ directory as an example. This comes in to play when deciding what is the active song and how to highlight it with CSS.
var allTracks = [], // let this stay empty
  tracks = [{
    file: filePrefix + "filename.mp3", // the file name goes in the quotes
    title: "", // name of the track
    artist: artistForTracks,
    album: albumForTracks,
    artwork: artworkForTracks
  }],
  trackCount = tracks.length,
  settings = {
    startingVolume: 0.5,
    startingTime: 0,
    audioOverride: false,
    currentTrack: undefined
  };

// function to load the custom settings
function initializeSettings() {
  volume.value = settings.startingVolume;
  audio.volume = settings.startingVolume;
  seeker.value = settings.startingTime;
  audio.currentTime = settings.startingTime;
}

// set the audio file
function loadTrack(index) {
  seeker.value = 0;
  audio.currentTime = 0;
  audio.src = tracks[index].file;
  settings.currentTrack = index;
  artist.innerHTML = tracks[index].artist;
  track.innerHTML = tracks[index].title;
  album.innerHTML = tracks[index].album;
  artwork.setAttribute("src", tracks[index].artwork);
  loadCurrentTime();
}

// function to build the song list
function loadTrackList() {
  let list = "";
  tracks.forEach((track, index) => {
    list += `<li data-track="${index}" data-file="${track.file}" class="plvy--song"><span class="plvy--song__title">${track.title}</span></li>`;
  });
  songs.innerHTML = list;
  allTracks = document.querySelectorAll(".plvy--song__title");
  allTracks.forEach((track, index) =>
    track.addEventListener("click", () => {
      if (settings.currentTrack === undefined) {
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
  actionSvg.innerHTML = playIcon;
  settings.audioOverride = !settings.audioOverride;
}

// master Play button
function pressPlay() {
  audio.play();
  actionSvg.innerHTML = pauseIcon;
  settings.audioOverride = !settings.audioOverride;
}

// master Previous button
function previousTrack() {
  if (settings.currentTrack === undefined) {
    return false;
  } else if (settings.currentTrack - 1 > -1) {
    if (!audio.paused) {
      loadTrack(settings.currentTrack - 1);
      audio.play();
    } else {
      loadTrack(settings.currentTrack - 1);
    }
  } else {
    pressPause();
    loadTrack(settings.currentTrack);
    settings.audioOverride = false;
  }
}

// master Next button
function nextTrack() {
  if (settings.currentTrack === undefined) {
    loadTrack(0);
  } else if (settings.currentTrack + 1 < trackCount) {
    if (!audio.paused) {
      loadTrack(settings.currentTrack + 1);
      audio.play();
    } else {
      loadTrack(settings.currentTrack + 1);
    }
  } else {
    pressPause();
    loadTrack(0);
    settings.audioOverride = false;
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
    volumeBtnSvg.innerHTML = volIconOff;
  } else if (audio.volume <= 0.45) {
    volumeBtnSvg.innerHTML = volIconLow;
  } else {
    volumeBtnSvg.innerHTML = volIconMid;
  }
}

// mute the volume with the volume button
function toggleVolume() {
  if (!audio.muted) {
    audio.muted = !audio.muted;
    volumeBtnSvg.innerHTML = volIconOff;
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
  let getter = settings.currentTrack;
  document
    // .querySelector(`[data-file="${audio.src}"]`)
    .querySelector(`[data-file="${tracks[getter].file}"]`)
    .classList.add("plvy--song__active");
});

// load in the duration of the track when the metadata finishes loading
audio.addEventListener("loadedmetadata", loadDuration);

// listen for volume changes
audio.addEventListener("volumechange", setVolumeIcon);

// define what to do when a track ends
audio.addEventListener("ended", () => {
  if (!audio.loop) {
    if (settings.currentTrack === trackCount - 1) {
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
  document
    .querySelector(".plvy--song__active")
    .classList.remove("plvy--song__active");
});

seeker.addEventListener("change", () => {
  if (settings.currentTrack === undefined) {
    return false;
  } else {
    audio.currentTime = (seeker.value * audio.duration) / 100;
    seeker.style.setProperty("--val", seeker.value);
    settings.audioOverride ? audio.play() : false;
  }
});

seeker.addEventListener("input", (event) => {
  if (settings.currentTrack === undefined) {
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
  if (settings.currentTrack === undefined) {
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
    volume.style.setProperty("--val", volume.value * 100);
  },
  false
);

// get the ball rolling
(() => {
  loadTrackList();
  initializeSettings();
})();