// this isn't being used but I would like to make it possible
export default [
    {
        file: this.getAttribute("audio-location") + "01_I_Know_I'm_Not.mp3" || '',
        title: "I Know I'm Not" || '',
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name")  || '',
        artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "02_Baby_Blue.mp3" || '',
        title: "Baby Blue" || '',
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name")  || '',
        artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "03_Insincerity.mp3" || '',
        title: "Insincerity" || '',
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name")  || '',
        artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "04_Like_Sinking.mp3" || '',
        title: "Like Sinking" || '',
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name")  || '',
        artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "05_Do_Better.mp3" || '',
        title: "Do Better" || '',
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name")  || '',
        artwork: this.getAttribute("cover-art")  || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "06_Market_Street.mp3",
        title: "Market Street",
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name") || '',
        artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "07_Alone_In_a_Crowded_Room.mp3",
        title: "Alone In A Crowded Room",
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name") || '',
        artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "08_Long_Time_Caller_First Time List.mp3",
        title: "Long Time Caller, First Time Listener",
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name") || '',
        artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "09_Detroit.mp3",
        title: "Detroit",
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name") || '',
        artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "10_We_Can't_Rush_These_Things.mp3",
        title: "We Can't Rush These Things",
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name") || '',
        artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "11_Closure.mp3",
        title: "Closure",
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name") || '',
        artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
    },
    {
        file: this.getAttribute("audio-location") + "12_Like_Drowning_(Bonus_Track).mp3",
        title: "Like Drowning (Bonus Track)",
        artist: this.getAttribute("artist-name") || '',
        album: this.getAttribute("album-name") || '',
        artwork: this.getAttribute("cover-art") || this.getAttribute("placeholder-image")
    }
];