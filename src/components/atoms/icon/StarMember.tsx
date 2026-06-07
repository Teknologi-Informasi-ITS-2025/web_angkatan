import Image, { ImageProps } from 'next/image'

import StarImage from '@/assets/images/members/star.svg'

type StarProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
}

const Star = ({ className, ...props }: StarProps) => {
  return <Image src={StarImage} alt="Star Member" className={className} {...props} />
}

export default Star
