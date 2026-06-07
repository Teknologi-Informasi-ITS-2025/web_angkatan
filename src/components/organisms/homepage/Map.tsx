import ScrollReveal from '@/components/atoms/animation/ScrollReveal'

import { getTextStrokeStyle } from '@/lib/textStroke'

import mapDataJson from '@/assets/maps/indonesia-map-generated.json'
import type { GeneratedMapData } from '@/types/maps'

import MapInteractive from './MapInteractive'

const mapData = mapDataJson as GeneratedMapData

const Map = () => {
  return (
    <section className="bg-yellow-cs-30 z-0 flex min-h-screen w-full flex-col items-center gap-16 py-10 md:py-16">
      <ScrollReveal className="flex w-full max-w-[1440px] justify-center px-4 md:px-8" direction="down" distance={18}>
        <h2
          className="font-rubikone text-blue-cs-30 text-[32px] leading-[40px] sm:text-[40px] sm:leading-[52px] lg:text-[56px] lg:leading-[70px]"
          style={getTextStrokeStyle({ color: '#ffffff', width: 4 })}
        >
          EVASTRA Maps
        </h2>
      </ScrollReveal>
      <ScrollReveal className="w-full" delay={120} distance={36}>
        <MapInteractive provinces={mapData.provinces} svgWidth={mapData.svgWidth} svgHeight={mapData.svgHeight} />
      </ScrollReveal>
    </section>
  )
}

export default Map
