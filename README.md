# Plvylist

A simple media player web component.

## Installation

Get Plvylist from one of the following ways:

- Install through npm: `npm i plvylist`.
- Import from something like Skypack: `<script type="module" src="https://cdn.skypack.dev/plvylist"></script>`.

## Usage

Import (if installed with npm) or add the script (if installed manually) to your page, then place the element `<plvylist-player></plvylist-player>` wherever you want it.

The only required HTML attribute for Plvylist to work is `file` which accepts a path to a `.json` file describing your tracks: `file="location/to/files.json"`. The syntax for the file is as follows:

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

You can do some customization with these other HTML attributes:

- `placeholder="path/to/placeholder.jpg"` in case no cover art is available for a song and you want to provide your own default.
- `starting-volume="some number between 0.0 and 1"` if you want to start the component at a different volume level than half-full.
- `starting-time="honestly I don't know, but it is a number"` if you want to change the initial starting time for the component, but through testing I don't really know how this works aside from knowing it's an option I've given you.

## Styling

Inheritable properties will flow into `plvylist`; this means you can set properties like color and typography on the element or via a class and they will take effect. In addition, a set of CSS custom properties are available. Check the `custom-elements-manifest` provided in the package for more info.

## Notes

Placeholder image attribution: https://www.svgrepo.com/svg/36360/compact-disc
