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
3. By using `<plvy-list-track>` elements as children with corresponding Plvylist-specific elements as its children: `<plvy-list-track-title>`, `<plvy-list-track-artist>`, `<plvy-list-track-album>`, and `<plvy-list-track-artwork>`. Artist and album elements can have `<a>` children to to link to the artist or album, while the artwork element is looking for an `<img>`.
4. By using `<audio>` elements as child nodes with corresponding `data-` attributes matching the Plvylist schema.

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

### Example Using Child Audio Elements

```html
<plvy-list>
  <audio
    controls
    src="https://res.cloudinary.com/dpmchqezv/video/upload/v1631305734/troy/alone-in-a-crowded-room/01_I_Know_I_m_Not_jvp3af.mp3"
    data-title="I Know I'm Not"
    data-artist="troyalllowercase"
    data-artist-url="https://troyalllowercase.bandcamp.com/"
    data-album="Alone In A Crowded Room"
    data-album-url="https://troyalllowercase.bandcamp.com/album/alone-in-a-crowded-room"
    data-artwork="https://res.cloudinary.com/dpmchqezv/image/upload/c_scale,f_auto,q_auto:eco,w_300/v1631306010/troy/alone-in-a-crowded-room/AIACR-troy_cwoizg.png"></audio>
  <audio
    controls
    src="https://res.cloudinary.com/dpmchqezv/video/upload/v1631305723/troy/alone-in-a-crowded-room/04_Like_Sinking_ginqay.mp3"
    data-title="Like Sinking"
    data-artist="troyalllowercase"
    data-artwork="https://res.cloudinary.com/dpmchqezv/image/upload/c_scale,f_auto,q_auto:eco,w_300/v1631306010/troy/alone-in-a-crowded-room/AIACR-troy_cwoizg.png"></audio>
</plvy-list>
```

### Example Using Child Plvylist Tracks

```html
<plvy-list>
  <plvy-list-track>
    <plvy-list-track-artwork>
      <img
        src="https://res.cloudinary.com/dpmchqezv/image/upload/c_scale,f_auto,q_auto:eco,w_300/v1631306010/troy/alone-in-a-crowded-room/AIACR-troy_cwoizg.png"
        alt="" />
    </plvy-list-track-artwork>
    <div>
      <plvy-list-track-title>I Know I'm Not</plvy-list-track-title>
      <span>by</span>
      <plvy-list-track-artist>
        <a href="https://troyalllowercase.bandcamp.com">troyalllowercase</a>
      </plvy-list-track-artist>
      <span>from the album</span>
      <plvy-list-track-album>
        <a href="https://troyalllowercase.bandcamp.com/album/alone-in-a-crowded-room"
          >Alone In A Crowded Room</a
        >
      </plvy-list-track-album>
    </div>
    <audio
      controls
      src="https://res.cloudinary.com/dpmchqezv/video/upload/v1631305734/troy/alone-in-a-crowded-room/01_I_Know_I_m_Not_jvp3af.mp3"></audio>
  </plvy-list-track>
  <plvy-list-track>
    <div>
      <plvy-list-track-title>Baby Blue</plvy-list-track-title>
      <span>by</span>
      <plvy-list-track-artist>troyalllowercase</plvy-list-track-artist>
      <span>from</span>
      <plvy-list-track-album>Alone In A Crowded Room</plvy-list-track-album>
    </div>
    <audio
      controls
      src="https://res.cloudinary.com/dpmchqezv/video/upload/v1631305724/troy/alone-in-a-crowded-room/02_Baby_Blue_lwf7zf.mp3"></audio>
  </plvy-list-track>
  <plvy-list-track>
    <plvy-list-track-title>Insincerity</plvy-list-track-title>
    <audio
      controls
      src="https://res.cloudinary.com/dpmchqezv/video/upload/v1631305729/troy/alone-in-a-crowded-room/03_Insincerity_x29pxf.mp3"></audio>
  </plvy-list-track>
</plvy-list>
```
