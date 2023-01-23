# Plvylist

A simple media player web component.

## Installation

Get Plvylist from one of the following ways:

- Install through npm: `npm i plvylist`.
- Import from something like Skypack: `<script type="module" src="https://cdn.skypack.dev/plvylist"></script>`.

## Usage

Import (if installed with npm) or add the script (if installed manually) to your page, then place the element `<plvy-list></plvy-list>` wherever you want it.

The only required HTML attribute for Plvylist to work is `file` which accepts a path to a `.json` file describing your tracks: `file="path/to/tracks.json"`. The syntax for the file is as follows:

```json
{
  "tracks": [
    {
      "file": "path/to/song.mp3",
      "title": "Song Name",
      "artist": "Artist Name",
      "artistUrl": "https://www.artist.com",
      "album": "Album/Collection Name",
      "albumUrl": "https://www.album.com",
      "artwork": "path/to/artwork.jpg"
    }
  ]
}
```

**Each key aside from `file` is optional and will default to placeholders if they aren't provided.**

## Notes

Placeholder image attribution: https://www.svgrepo.com/svg/36360/compact-disc
