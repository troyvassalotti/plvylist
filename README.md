# Plvylist

A simple media player web component.

## How to use it

Download `plvylist-component.js` from `/dist` or install through npm: `npm i plvylist`. Import (if installed with npm) or add the script (if installed manually), then place the element `<plvylist-player></plvylist-player>` to the page you want to stream music from.

The only required attribute for Plvylist to work is `tracks` which accepts a path to a `.json` file describing your tracks: `tracks="location/to/files.json"`. The syntax for the file is as follows:

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

- Each key aside from `file` is optional and will default to placeholders if they aren't provided.

You can do some customization with these other attributes on the element:
- `placeholder="path/to/placeholder.jpg"` in case of no cover art available for a song or you want to provide your own default. The component comes with a default if you don't provide this.
- `starting-volume="some number between 0.0 and 1"` if you want to start the component at a different volume level than half-full.
- `starting-time="honestly I don't know, but it is a number"` if you want to change the initial starting time for the component, but through testing I don't really know how this works aside from knowing it's an option.

All the CSS and HTML are built into the component and intended to inherit whatever the outer container uses. You can edit the `svg` icons or styles if you wish directly within the component file, but you're on your own if you want to do that sort of thing.

## Notes
Placeholder image from https://www.svgrepo.com/svg/36360/compact-disc