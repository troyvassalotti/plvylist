# Plvylist
A simple media player web component. I'm always thinking of ways to improve this, so it'll continue to get better.

## Assumptions
- You have a `.json` file of all the tracks you want abiding by the demo's key-value pairs.

## How to use it
- Download `plvylist-component.js` from dist/v3.
- Add `<plvylist-player></plvylist-player>` to the HTML page you want to stream music from.
- The following attributes are required to be added to the HTML (see the demo or index.html in this repo):
    - tracks="location/to/files.json"
    - placeholder="path/to/placeholder.jpg" in case of no cover art available for a song
- You can do some customization with these attributes:
    - starting-volume="some number between 0.0 and 1"
    - starting-time="honestly I don't know, but it is a number"

All te styles and HTML are built in to the component and intended to inherit whatever the outer container uses. You can edit the `svg` icons if you wish via the `constructor()` but keep it to the _inside_ of the element and don't declare a new `svg` or else it'll break. You'll need to do further customization for that sort of thing.

You can choose to import or link to your own stylesheets if you know exactly what the path to them is. Just add the `@import` statements of `<link>` to them within the template literal.

## Known Bugs
- Browsers like to set the track seeker to 50 while switching or loading tracks. I don't know why this is as I've tried to explicitly set the value to 0 in many places.
- There's an error when shuffling tracks regarding the `emptied` event listener that I can't seem to solve.
- The minified version keeps the whitespace/new line characters in place from the template literal, and I wish it didn't.