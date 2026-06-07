interface InstagramButtonLinkProps {
  username: string
}

const InstagramButtonLink = ({ username }: InstagramButtonLinkProps) => {
  return (
    <a
      href={`https://instagram.com/${username}`}
      className="hover:text-blue-cs-20 focus-visible:text-blue-cs-20 focus-visible:ring-blue-cs-20 group inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white transition-all duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:outline-none"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${username}'s Instagram profile`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 transition-[color,filter] duration-200 group-hover:drop-shadow-[0_0_8px_rgba(72,136,200,0.75)] group-focus-visible:drop-shadow-[0_0_8px_rgba(72,136,200,0.75)]"
        aria-hidden="true"
      >
        <path
          d="M20.4167 7.58325H20.4283M8.16667 2.33325H19.8333C23.055 2.33325 25.6667 4.94492 25.6667 8.16659V19.8333C25.6667 23.0549 23.055 25.6666 19.8333 25.6666H8.16667C4.945 25.6666 2.33333 23.0549 2.33333 19.8333V8.16659C2.33333 4.94492 4.945 2.33325 8.16667 2.33325ZM18.6667 13.2649C18.8106 14.2359 18.6448 15.2275 18.1927 16.0988C17.7406 16.97 17.0253 17.6766 16.1486 18.1179C15.2718 18.5592 14.2782 18.7128 13.3091 18.5568C12.34 18.4009 11.4447 17.9433 10.7506 17.2493C10.0566 16.5552 9.59902 15.6599 9.44308 14.6908C9.28714 13.7217 9.44074 12.7281 9.88205 11.8514C10.3234 10.9746 11.0299 10.2593 11.9011 9.8072C12.7724 9.35512 13.764 9.18927 14.735 9.33325C15.7254 9.48012 16.6423 9.94163 17.3503 10.6496C18.0583 11.3576 18.5198 12.2745 18.6667 13.2649Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

export default InstagramButtonLink
