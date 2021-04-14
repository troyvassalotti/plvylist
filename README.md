# Plvylist
A simple media player web component.

> I'm always thinking of ways to improve this thing, so it'll continue to get better and more robust.

## Assumptions
- You are hosting the files locally in the project _or_ you are able to manually input the **names** of the tracks and their files.
- You are hosting the cover art locally _or_ can directly link to their locations.
- You already know the name of the album or artist, _or_ you can manually input them for each track you provide.
- You are at least _a little_ familiar with Web Components.

## Is there a demo?
Yes and it's on [GitHub pages](https://troyvassalotti.github.io/plvylist).

## How to use it
- Download `plvylist-component.js` from dist/v2 (I don't have a minified version because that'd make it hard for you to customize).
    - If you're feeling ambitious, you can use dist/v1 instead; however, I am not maintaining that version anymore. While it should be fine to work with, please don't ask me to fix anything.
- Add `<plvylist-player></plvylist-player>` to the HTML page you want to stream music from.
- The following attributes are required to be added to the HTML (see the demo or index.html in this repo):
    - audio-location="location/to/files/"
    - album-name="Name of the album/collection"
    - artist-name="Name of the artist if there's only one"
    - placeholder-image="path/to/placeholder.jpg"
    - cover-art="path/to/general-cover-art.jpg"
- You can do some customization with these attributes:
    - starting-volume="some number between 0.0 and 1"
    - starting-time="honestly I don't know but it is a number"

All the styles, functionality, and HTML is built into the file. You can edit the `svg` icons if you wish via the `constructor()` but keep it to the _inside_ of the element and don't declare a new `svg` or else it'll break. You'll need to do further customization for that sort of thing.

You can choose to import or link to your own stylesheets if you know exactly what the path to them is. Just add the `@import` statements of `<link>` to them within the template literal.

## Why did I make this?
I wanted to learn web audio, specifically the Media Element API, so I made a basic V1. Then I wanted to turn it into a web component, so I did that too.

## Known Bugs
- Chromium browsers (sometimes Firefox, but I can't pinpoint the exact times) like to set the track seeker to 50 while switching or loading tracks. I don't know why this is as I've tried to explicitly set the value to 0 in many places.

## Ideas for Improvement
- Allow the option to fetch the track list from a remote location and dynamically generate things like track names, artists, etc.
- Add option to import modules for things like the track list.
- Move the function declarations out of the `connectedCallback()` function and into their own levels (I tried this and could only get so far since everything is so tightly wound together at the moment).