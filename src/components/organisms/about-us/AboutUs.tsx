const AboutUs = () => {
  return (
    <section
      id="about-us"
      className="text-neutral-cs-10 relative my-8 flex w-full justify-center px-6 py-18 text-center sm:px-10 lg:my-36 lg:px-[90px]"
    >
      <div className="relative w-full max-w-[1180px]">
        <h2 className="font-rubikone text-neutral-cs-00 relative z-10 mb-8 text-3xl leading-none tracking-[0.04em] lg:mb-12 lg:text-5xl">
          É. VAS. TRA
        </h2>

        <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-gradient-to-b from-[#4364B7] via-[#3555A7] to-[#243E86] px-6 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_rgba(5,12,37,0.28)] sm:px-10 sm:py-12 lg:rounded-[38px] lg:px-[88px] lg:py-[72px]">
          <div
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{
              backgroundImage: "url('/assets/images/texture/noise-monotone.svg')",
              backgroundSize: '170px 170px',
              mixBlendMode: 'multiply'
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-[920px] space-y-8 font-sans text-base leading-[1.45] font-semibold text-white sm:leading-[1.55] lg:text-[20px] lg:leading-[1.58]">
            <p>
              <span className="text-yellow-cs-20 font-bold">Evolve:</span> berkembang dan bertumbuh. Merepresentasikan
              proses setiap individu untuk terus mengembangkan karakter dan kompetensi-nya melalui pengalaman dan
              pembelajaran bersama.
            </p>

            <p>
              <span className="text-yellow-cs-20 font-bold">Astra:</span> bintang, harapan dan tujuan yang tinggi.
              Melambangkan arah serta cita-cita bersama yang menjadi motivasi untuk terus maju dan berkembang.
            </p>

            <p>
              <span className="text-yellow-cs-20 font-bold">EVASTRA</span> merupakan nama angkatan Teknologi Informasi
              ITS 2025 yang merepresentasikan semangat untuk{' '}
              <span className="text-yellow-cs-20 font-bold">berkembang bersama</span>,{' '}
              <span className="text-yellow-cs-20 font-bold">menguatkan karakter</span>, dan{' '}
              <span className="text-yellow-cs-20 font-bold">meningkatkan kompetensi</span>.
            </p>

            <p>
              <span className="text-yellow-cs-20 font-bold">Evolve</span> berarti{' '}
              <span className="text-yellow-cs-20 font-bold">berkembang dan bertumbuh</span>.{' '}
              <span className="text-yellow-cs-20 font-bold">EVASTRA</span> diharapkan menjadi tempat bagi setiap
              individu untuk terus <span className="text-yellow-cs-20 font-bold">memperbaiki diri</span>,{' '}
              <span className="text-yellow-cs-20 font-bold">membentuk karakter</span>, serta{' '}
              <span className="text-yellow-cs-20 font-bold">meningkatkan kompetensi</span> melalui{' '}
              <span className="text-yellow-cs-20 font-bold">pengalaman</span>,{' '}
              <span className="text-yellow-cs-20 font-bold">pembelajaran</span>, dan{' '}
              <span className="text-yellow-cs-20 font-bold">kebersamaan</span> baik di dalam maupun di luar angkatan.
            </p>

            <p>
              Terinspirasi dari pepatah Latin klasik, &ldquo;
              <span className="text-yellow-cs-20 font-bold">ad astra per aspera</span>&rdquo; yang berarti, &ldquo;
              <span className="text-yellow-cs-20 font-bold">melalui rintangan, menuju bintang-bintang</span>
              &rdquo;. Makna ini menggambarkan <span className="text-yellow-cs-20 font-bold">EVASTRA</span> yang
              diharapkan menjadi angkatan yang mampu{' '}
              <span className="text-yellow-cs-20 font-bold">menghadapi rintangan</span> dan{' '}
              <span className="text-yellow-cs-20 font-bold">menggapai impiannya</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
