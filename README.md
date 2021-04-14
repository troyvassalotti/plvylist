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
- download the js file from this place
- add this html snippet to your page
- change these attributes because they're required
- change these attributes if you want to.

## Why did I make this?
I wanted to learn web audio, specifically the Media Element API, so I made a basic V1. Then I wanted to turn it into a web component, so I did that too.

## Known Bugs
- Chromium browsers (sometimes Firefox, but I can't pinpoint the exact times) like to set the track seeker to 50 while switching or loading tracks. I don't know why this is as I've tried to explicitly set the value to 0 in many places.

## Ideas for Improvement
- Allow the option to fetch the track list from a remote location and dynamically generate things like track names, artists, etc.