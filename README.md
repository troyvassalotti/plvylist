# Plvylist
A simple media player for the web built with HTML, CSS (or SASS), and JS.

## How to use it
Add the following to your page:
- plvylist.js
- plvylist.css (plvylist.scss if you have a build process for it)
- an element to latch onto, `<div class="plvylist"></div>`

## Why did I make this?
I wanted to learn web audio, specifically the Media Element API. At first it was daunting and made no sense, but I realized it wasn't so bad after all.

## Is this the best it could be?
Absolutely not, but thanks for thinking it could be.

## Known Bugs
- Chromium browsers (sometimes Firefox, but I can't pinpoint the exact times) like to set the track seeker to 50 while switching or loading tracks. I don't know why this is as I've tried to explicitly set the value to 0 in many places.

## TODO
- Make it easier to copy and paste
  - Make it less dependent on SASS by using CSS variables
  - Clean up the structures a bit
