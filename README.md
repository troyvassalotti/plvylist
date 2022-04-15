# Plvylist

A simple media player web component.

## How to use it

Get Plvylist from one of the following ways:

- Install through npm: `npm i plvylist`.
- Import from something like Skypack: `<script src="https://cdn.skypack.dev/plvylist"></script>`.

Import (if installed with npm) or add the script (if installed manually) to your page, then place the element `<plvylist-player></plvylist-player>` wherever you want it.

The only required HTML attribute for Plvylist to work is `tracks` which accepts a path to a `.json` file describing your tracks: `tracks="location/to/files.json"`. The syntax for the file is as follows:

```json
{
  "tracks": [
    {
      "file": "path/to/song.mp3",
      "title": "Song Name",
      "artist": "Artist Name",
      "album": "Album/Collection Name",
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

All the CSS and HTML are built into the component and intended to inherit whatever the outer container uses. Since CSS custom properties can enter the shadow DOM, there are a few you can change the values of yourself:

```css
--plvylist-accent: <color>;
--plvylist-changed: <color>;
--plvylist-contrast: <color>;
--plvylist-line-height: <number>;
--plvylist-font: <font-family>;
```

## Notes

Placeholder image from https://www.svgrepo.com/svg/36360/compact-disc
