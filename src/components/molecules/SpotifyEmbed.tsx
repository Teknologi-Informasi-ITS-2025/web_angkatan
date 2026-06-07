import React from 'react'

type SpotifyEmbedProps = {
  spotifyUrl: string
  title?: string
}

const getSpotifyTrackEmbedUrl = (spotifyUrl: string) => {
  const trackMatch = spotifyUrl.match(/open\.spotify\.com\/(?:(?:intl-[a-z]{2}\/)?|embed\/)track\/([^?/#]+)/i)
  const trackId = trackMatch?.[1]

  if (!trackId) {
    return spotifyUrl
  }

  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`
}

const SpotifyEmbed = ({ spotifyUrl, title = 'Spotify favorite song' }: SpotifyEmbedProps) => {
  return (
    <iframe
      title={title}
      src={getSpotifyTrackEmbedUrl(spotifyUrl)}
      width="100%"
      height="152"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="mt-4 rounded-xl"
    />
  )
}

export default SpotifyEmbed
