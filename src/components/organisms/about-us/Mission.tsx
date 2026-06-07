import React from 'react'

const Mission = () => {
  return (
    <section className="relative mt-12 flex w-full flex-col items-center px-4 py-16 text-center md:mt-20">
      <h2 className="font-rubikone relative z-10 mb-8 text-4xl text-white md:text-5xl">Our Mission</h2>

      <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-base leading-relaxed text-white md:text-xl">
        <p>
          Membangun lingkungan yang <span className="text-yellow-cs-20 font-bold">inklusif</span> dan{' '}
          <span className="text-yellow-cs-20 font-bold">supportif</span> berlandaskan{' '}
          <span className="text-yellow-cs-20 font-bold">rasa kepedulian</span>
        </p>

        <p>
          Memberikan wadah <span className="text-yellow-cs-20 font-bold">kolaborasi</span> dan{' '}
          <span className="text-yellow-cs-20 font-bold">eksplorasi</span> untuk mengembangkan{' '}
          <span className="text-yellow-cs-20 font-bold">potensi setiap</span> individu sehingga mampu memberikan{' '}
          <span className="text-yellow-cs-20 font-bold">dampak positif</span>
        </p>
      </div>
    </section>
  )
}

export default Mission
