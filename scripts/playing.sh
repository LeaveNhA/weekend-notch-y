#!/bin/bash

SPOTIFY_PLAYING=$(osascript -e 'tell application "Spotify" to player state as string')
SPOTIFY_INFO=""

if [ "$SPOTIFY_PLAYING" == "playing" ]; then
    SPOTIFY_JSON=$(osascript -e 'tell application "Spotify" to if player state is playing then "{\"song\": \"" & name of current track & "\", \"artist\": \"" & artist of current track & "\", \"albumArt\": \"" & artwork url of current track & "\"}" as string')
    SPOTIFY_INFO="\"spotify\": $SPOTIFY_JSON"
fi

echo "{${SPOTIFY_INFO}}"
