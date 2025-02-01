# Plvylist

A simple media player web component.

## Installation

Get Plvylist from one of the following ways:

- Install through npm: `npm i plvylist`.
- Import from something like Skypack: `<script type="module" src="https://cdn.skypack.dev/plvylist"></script>`.

## Usage

Import (if installed with npm) or add the script (if installed manually) to your page, then place the element `<plvy-list></plvy-list>` wherever you want it.

Plvylist can define tracks in three ways, listed in order of precedence:

1. Through the `data` property which is an array of tracks matching the Plvylist schema.
2. Through the `file` property/attribute which links to a JSON file following the Plvylist schema.
3. By using `<audio>` elements as child nodes with corresponding `data-` attributes matching the Plvylist schema.

The schema is as follows:

```json
[
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
```

**Each key aside from `file` is optional and will default to placeholders if they aren't provided.**
