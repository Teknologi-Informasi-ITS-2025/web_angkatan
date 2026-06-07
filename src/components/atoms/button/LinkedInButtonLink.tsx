interface LinkedInButtonLinkProps {
  username: string
}

const LinkedInButtonLink = ({ username }: LinkedInButtonLinkProps) => {
  return (
    <a
      href={`https://linkedin.com/in/${username}`}
      className="hover:text-blue-cs-20 focus-visible:text-blue-cs-20 focus-visible:ring-blue-cs-20 group inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white transition-all duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:outline-none"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${username}'s LinkedIn profile`}
    >
      <svg
        width="29"
        height="29"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 transition-[color,filter] duration-200 group-hover:drop-shadow-[0_0_8px_rgba(72,136,200,0.75)] group-focus-visible:drop-shadow-[0_0_8px_rgba(72,136,200,0.75)]"
        aria-hidden="true"
      >
        <path
          d="M18.9063 9.45315C20.7867 9.45315 22.59 10.2001 23.9196 11.5297C25.2492 12.8593 25.9962 14.6627 25.9962 16.543V24.8145H21.2696V16.543C21.2696 15.9162 21.0206 15.3151 20.5774 14.8719C20.1342 14.4287 19.5331 14.1797 18.9063 14.1797C18.2795 14.1797 17.6784 14.4287 17.2352 14.8719C16.792 15.3151 16.543 15.9162 16.543 16.543V24.8145H11.8164V16.543C11.8164 14.6627 12.5634 12.8593 13.893 11.5297C15.2226 10.2001 17.026 9.45315 18.9063 9.45315Z"
          stroke="currentColor"
          strokeWidth="2.36329"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.08986 10.6348H2.36328V24.8145H7.08986V10.6348Z"
          stroke="currentColor"
          strokeWidth="2.36329"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.72657 7.08986C6.03178 7.08986 7.08986 6.03178 7.08986 4.72657C7.08986 3.42136 6.03178 2.36328 4.72657 2.36328C3.42136 2.36328 2.36328 3.42136 2.36328 4.72657C2.36328 6.03178 3.42136 7.08986 4.72657 7.08986Z"
          stroke="currentColor"
          strokeWidth="2.36329"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

export default LinkedInButtonLink
