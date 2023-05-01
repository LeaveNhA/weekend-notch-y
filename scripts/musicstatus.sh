#!/bin/bash

TEMP_FILE="/tmp/spotify_song_hash.txt"

SPOTIFY_JSON=$(osascript -e 'tell application "Spotify" to if player state is playing then "{\"song\": \"" & name of current track & "\", \"artist\": \"" & artist of current track & "\", \"albumArt\": \"" & artwork url of current track & "\"}" as string')

if [ -z "$SPOTIFY_JSON" ]; then
    exit 0
fi

CURRENT_HASH=$(echo "$SPOTIFY_JSON" | md5)

if [ -f "$TEMP_FILE" ]; then
    PREVIOUS_HASH=$(cat "$TEMP_FILE")
else
    PREVIOUS_HASH=""
fi

if [ "$CURRENT_HASH" != "$PREVIOUS_HASH" ]; then
    echo "$CURRENT_HASH" > "$TEMP_FILE"
    SONG_JSON="\"spotify\": $SPOTIFY_JSON"
    echo "{${SONG_JSON}}"
else
    echo "{}"
fi
