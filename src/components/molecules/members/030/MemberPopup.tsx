'use client'

/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// ═══════════════════════════════════════════════════════
//  AUDIO ENGINE
// ═══════════════════════════════════════════════════════
const useP3Audio = () => {
  const ctxRef = useRef<AudioContext | null>(null)
  const bgmGainRef = useRef<GainNode | null>(null)
  const dataBgmGainRef = useRef<GainNode | null>(null)
  const bgmPlayingRef = useRef(false)
  const dataBgmPlayingRef = useRef(false)

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const startBGM = useCallback(() => {
    if (bgmPlayingRef.current) return
    const ctx = getCtx(); bgmPlayingRef.current = true
    const master = ctx.createGain(); master.gain.value = 0.18; master.connect(ctx.destination); bgmGainRef.current = master
    const buildLayer = (freq: number, detune: number, lfoFreq: number, lfoDepth: number) => {
      const osc = ctx.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = freq; osc.detune.value = detune
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = lfoFreq
      const lfoG = ctx.createGain(); lfoG.gain.value = lfoDepth; lfo.connect(lfoG); lfoG.connect(osc.frequency)
      const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 900; filt.Q.value = 6
      const g = ctx.createGain(); g.gain.value = 0.15; osc.connect(filt); filt.connect(g); g.connect(master); lfo.start(); osc.start()
    }
    buildLayer(55,0,0.07,3); buildLayer(110,-8,0.13,5); buildLayer(164.81,12,0.19,7)
    const bufSz = ctx.sampleRate*2; const nBuf = ctx.createBuffer(1,bufSz,ctx.sampleRate); const nd = nBuf.getChannelData(0)
    for (let i=0;i<bufSz;i++) nd[i]=(Math.random()*2-1)*0.08
    const nSrc=ctx.createBufferSource(); nSrc.buffer=nBuf; nSrc.loop=true
    const nFilt=ctx.createBiquadFilter(); nFilt.type='bandpass'; nFilt.frequency.value=200; nFilt.Q.value=0.8
    const nLfo=ctx.createOscillator(); nLfo.frequency.value=0.05
    const nLfoG=ctx.createGain(); nLfoG.gain.value=80; nLfo.connect(nLfoG); nLfoG.connect(nFilt.frequency)
    nSrc.connect(nFilt); nFilt.connect(master); nLfo.start(); nSrc.start()
  }, [getCtx])

  const stopBGM = useCallback(() => {
    if (!bgmPlayingRef.current) return; bgmPlayingRef.current = false
    if (bgmGainRef.current) { try { bgmGainRef.current.gain.setTargetAtTime(0,bgmGainRef.current.context.currentTime,0.3) } catch {} }
  }, [])

  const startDataBGM = useCallback(() => {
    if (dataBgmPlayingRef.current) return
    const ctx = getCtx(); dataBgmPlayingRef.current = true
    const master = ctx.createGain(); master.gain.value=0; master.connect(ctx.destination); dataBgmGainRef.current=master
    master.gain.setTargetAtTime(0.22,ctx.currentTime,1.2)
    const convolver=ctx.createConvolver()
    const irLen=ctx.sampleRate*2.5; const irBuf=ctx.createBuffer(2,irLen,ctx.sampleRate)
    for (let ch=0;ch<2;ch++){const d=irBuf.getChannelData(ch);for(let i=0;i<irLen;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/irLen,2.5)}
    convolver.buffer=irBuf
    const dry=ctx.createGain(); dry.gain.value=0.6; const wet=ctx.createGain(); wet.gain.value=0.4
    dry.connect(master); convolver.connect(wet); wet.connect(master)
    const notes=[{f:440,t:0,d:0.8},{f:392,t:0.9,d:0.7},{f:329.63,t:1.7,d:1.0},{f:293.66,t:2.8,d:0.7},{f:220,t:3.6,d:1.5},{f:261.63,t:5.2,d:0.8},{f:329.63,t:6.1,d:0.7},{f:392,t:6.9,d:1.2},{f:440,t:8.2,d:2.0}]
    const loop=10.5
    const playLoop=(st:number)=>{notes.forEach(({f,t,d})=>{const nt=st+t;[1,2,3].forEach((h,hi)=>{const o=ctx.createOscillator();o.type='sine';o.frequency.value=f*h;const e=ctx.createGain();const v=hi===0?0.5:hi===1?0.15:0.05;e.gain.setValueAtTime(0,nt);e.gain.linearRampToValueAtTime(v,nt+0.015);e.gain.exponentialRampToValueAtTime(v*0.3,nt+0.12);e.gain.exponentialRampToValueAtTime(0.001,nt+d*0.9);o.connect(e);e.connect(dry);e.connect(convolver);o.start(nt);o.stop(nt+d+0.1)})})}
    const pads=[220,261.63,329.63,392]
    pads.forEach((f,i)=>{const o=ctx.createOscillator();o.type='triangle';o.frequency.value=f;o.detune.value=(i%2===0?-5:5);const lfo=ctx.createOscillator();lfo.frequency.value=0.15+i*0.03;const lg=ctx.createGain();lg.gain.value=3;lfo.connect(lg);lg.connect(o.frequency);const g=ctx.createGain();g.gain.value=0.04;o.connect(g);g.connect(convolver);g.connect(dry);lfo.start();o.start()})
    let c=0; const sched=()=>{playLoop(ctx.currentTime+c*loop);c++;setTimeout(()=>{if(dataBgmPlayingRef.current)sched()},(loop-0.5)*1000)}; sched()
  }, [getCtx])

  const stopDataBGM = useCallback((fast=false)=>{
    if(!dataBgmPlayingRef.current)return;dataBgmPlayingRef.current=false
    if(dataBgmGainRef.current){try{dataBgmGainRef.current.gain.setTargetAtTime(0,dataBgmGainRef.current.context.currentTime,fast?0.15:0.8)}catch{}}
  },[])

  const playFlip=useCallback(()=>{const ctx=getCtx();const o=ctx.createOscillator();o.type='triangle';o.frequency.setValueAtTime(800,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(400,ctx.currentTime+0.08);const g=ctx.createGain();g.gain.setValueAtTime(0.25,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.1);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.1)},[getCtx])
  const playWrong=useCallback(()=>{const ctx=getCtx();const o=ctx.createOscillator();o.type='square';o.frequency.setValueAtTime(120,ctx.currentTime);o.frequency.setValueAtTime(80,ctx.currentTime+0.06);const g=ctx.createGain();g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.18);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.18);const o2=ctx.createOscillator();o2.type='sawtooth';o2.frequency.setValueAtTime(340,ctx.currentTime+0.05);o2.frequency.setValueAtTime(200,ctx.currentTime+0.12);const g2=ctx.createGain();g2.gain.setValueAtTime(0.15,ctx.currentTime+0.05);g2.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2);o2.connect(g2);g2.connect(ctx.destination);o2.start(ctx.currentTime+0.05);o2.stop(ctx.currentTime+0.2)},[getCtx])
  const playMatch=useCallback(()=>{const ctx=getCtx();[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const t=ctx.currentTime+i*0.07;const o=ctx.createOscillator();o.type='sine';o.frequency.value=f;const e=ctx.createGain();e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(0.35,t+0.02);e.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.connect(e);e.connect(ctx.destination);o.start(t);o.stop(t+0.35)})},[getCtx])
  const playWin=useCallback(()=>{const ctx=getCtx();[{f:392,t:0},{f:523.25,t:0.1},{f:659.25,t:0.2},{f:783.99,t:0.3},{f:1046.5,t:0.4},{f:1318.5,t:0.55}].forEach(({f,t})=>{const o=ctx.createOscillator();o.type='square';o.frequency.value=f;const e=ctx.createGain();e.gain.setValueAtTime(0.001,ctx.currentTime+t);e.gain.linearRampToValueAtTime(0.22,ctx.currentTime+t+0.03);e.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.25);o.connect(e);e.connect(ctx.destination);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.3)})},[getCtx])
  const playEvoker=useCallback(()=>{const ctx=getCtx();const bs=Math.floor(ctx.sampleRate*0.15);const b=ctx.createBuffer(1,bs,ctx.sampleRate);const ch=b.getChannelData(0);for(let i=0;i<bs;i++)ch[i]=(Math.random()*2-1);const s=ctx.createBufferSource();s.buffer=b;const se=ctx.createGain();se.gain.setValueAtTime(1.2,ctx.currentTime);se.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);const sf=ctx.createBiquadFilter();sf.type='highpass';sf.frequency.value=300;s.connect(sf);sf.connect(se);se.connect(ctx.destination);s.start();s.stop(ctx.currentTime+0.15);const r=ctx.createOscillator();r.type='sine';r.frequency.setValueAtTime(220,ctx.currentTime+0.05);r.frequency.exponentialRampToValueAtTime(55,ctx.currentTime+0.8);const rg=ctx.createGain();rg.gain.setValueAtTime(0.6,ctx.currentTime+0.05);rg.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.9);r.connect(rg);rg.connect(ctx.destination);r.start(ctx.currentTime+0.05);r.stop(ctx.currentTime+0.9)},[getCtx])
  const playFaceClick=useCallback(()=>{const ctx=getCtx();const z=ctx.createOscillator();z.type='sawtooth';z.frequency.setValueAtTime(1200,ctx.currentTime);z.frequency.exponentialRampToValueAtTime(200,ctx.currentTime+0.12);const zg=ctx.createGain();zg.gain.setValueAtTime(0.4,ctx.currentTime);zg.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);z.connect(zg);zg.connect(ctx.destination);z.start();z.stop(ctx.currentTime+0.15)},[getCtx])
  const playGlitchSnap=useCallback(()=>{const ctx=getCtx();const o=ctx.createOscillator();o.type='square';o.frequency.setValueAtTime(440,ctx.currentTime);o.frequency.setValueAtTime(220,ctx.currentTime+0.03);o.frequency.setValueAtTime(880,ctx.currentTime+0.06);const g=ctx.createGain();g.gain.setValueAtTime(0.18,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.12);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.12)},[getCtx])
  const playClose=useCallback(()=>{const ctx=getCtx();const o=ctx.createOscillator();o.type='triangle';o.frequency.setValueAtTime(200,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+0.12);const g=ctx.createGain();g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.15)},[getCtx])
  
  // UI Interaction SFX
  const playTabSwitch=useCallback(()=>{const ctx=getCtx();const o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(600,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(1200,ctx.currentTime+0.05);const g=ctx.createGain();g.gain.setValueAtTime(0.1,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.1);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.1)},[getCtx])

  const destroyCtx=useCallback(()=>{stopBGM();stopDataBGM(true);setTimeout(()=>{ctxRef.current?.close();ctxRef.current=null;bgmPlayingRef.current=false;dataBgmPlayingRef.current=false},400)},[stopBGM,stopDataBGM])

  return {startBGM,stopBGM,startDataBGM,stopDataBGM,playFlip,playWrong,playMatch,playWin,playEvoker,playFaceClick,playGlitchSnap,playClose,playTabSwitch,destroyCtx}
}

// ═══════════════════════════════════════════════════════
//  MEMORY GAME
// ═══════════════════════════════════════════════════════
type GameAudio={playFlip:()=>void;playWrong:()=>void;playMatch:()=>void;playWin:()=>void}

const MemoryGameStage=({onWin,onClose,audio}:{onWin:()=>void;onClose:()=>void;audio:GameAudio})=>{
  const [cards,setCards]=useState<{id:number;word:string}[]>([])
  const [flipped,setFlipped]=useState<number[]>([])
  const [matched,setMatched]=useState<number[]>([])
  const [locked,setLocked]=useState(false)
  useEffect(()=>{const words=['FOOL','MAGICIAN','MOON','TARTARUS'];const deck=[...words,...words].map((word,index)=>({id:index,word})).sort(()=>Math.random()-0.5);setCards(deck)},[])
  const handleCardClick=(index:number)=>{
    if(locked||flipped.includes(index)||matched.includes(index))return
    audio.playFlip();const nf=[...flipped,index];setFlipped(nf)
    if(nf.length===2){setLocked(true);const match=cards[nf[0]].word===cards[nf[1]].word
      if(match){audio.playMatch();const nm=[...matched,nf[0],nf[1]];setMatched(nm);setFlipped([]);setLocked(false);if(nm.length===cards.length){setTimeout(()=>audio.playWin(),100);setTimeout(onWin,600)}}
      else{audio.playWrong();setTimeout(()=>{setFlipped([]);setLocked(false)},800)}}
  }
  return(
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="hypr-glass rounded-2xl border border-[#00ddff]/30 p-4 sm:p-6 shadow-[0_0_30px_rgba(0,221,255,0.15)] max-w-md w-full relative animate-p3-container pointer-events-auto" onClick={e=>e.stopPropagation()}>
        <button type="button" aria-label="Close" onClick={onClose} className="absolute -top-[12px] -right-[12px] z-[120] flex h-8 w-8 items-center justify-center rounded-full border border-[#00ddff]/50 bg-black/80 text-[#00ddff] font-black text-sm hover:bg-[#00ddff] hover:text-black transition-colors shadow-lg" title="Kembali (Esc)">✕</button>
        <div className="relative z-10 text-center mb-4">
          <p className="text-[10px] font-mono text-[#00ddff] tracking-[0.3em] uppercase mb-1 sm:mb-2 opacity-80">― Dark Hour Protocol ―</p>
          <h3 className="text-2xl sm:text-3xl font-black italic text-white uppercase drop-shadow-[0_2px_10px_rgba(0,221,255,0.4)] tracking-wide">ARCANA LOCK</h3>
          <p className="bg-[#00ddff]/20 text-[#00ddff] px-2 sm:px-3 py-1 rounded-full inline-block text-[8px] sm:text-[10px] font-mono font-bold mt-2 border border-[#00ddff]/30 backdrop-blur-sm">MATCH THE ARCANA FRAGMENTS TO AWAKEN</p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3 relative z-10">
          {cards.map((card,index)=>{const isFlipped=flipped.includes(index)||matched.includes(index);const isMatched=matched.includes(index);return(
            <button key={card.id} onClick={()=>handleCardClick(index)} className={`h-16 sm:h-24 rounded-lg sm:rounded-xl relative border transition-all duration-300 transform ${isMatched?'bg-[#00ddff]/80 border-[#00ddff] scale-105 shadow-[0_0_15px_rgba(0,221,255,0.5)]':isFlipped?'bg-white/90 border-white scale-105':'bg-black/40 border-[#00ddff]/30 hover:border-[#00ddff]/80 hover:bg-[#00ddff]/10 hover:scale-105'}`} style={{perspective:'1000px'}}>
              <div className={`absolute inset-0 flex items-center justify-center font-black italic text-[10px] sm:text-sm ${isMatched?'text-black':isFlipped?'text-blue-900':'text-transparent'}`}>
                {isFlipped?<span>{card.word}</span>:<span className="text-[#00ddff] opacity-40 text-xl sm:text-2xl font-mono">?</span>}
              </div>
            </button>)})}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  ANIMATED NAME
// ═══════════════════════════════════════════════════════
const AnimatedName=({name}:{name:string})=>{
  const chars=name.split('')
  const [on,setOn]=useState<boolean[]>(Array(chars.length).fill(false))
  const enter=()=>chars.forEach((_,i)=>setTimeout(()=>setOn(p=>{const n=[...p];n[i]=true;return n}),i*30))
  const leave=()=>chars.forEach((_,i)=>setTimeout(()=>setOn(p=>{const n=[...p];n[i]=false;return n}),(chars.length-1-i)*20))
  return(
    <h2 className="font-black italic tracking-tight uppercase cursor-default select-none leading-tight" style={{fontSize:'clamp(0.9rem, 4vw, 1.4rem)'}} onMouseEnter={enter} onMouseLeave={leave}>
      {chars.map((c,i)=>(
        <span key={i} className="inline-block transition-all duration-150" style={{transform:on[i]?'translateY(-2px) scale(1.05)':'translateY(0) scale(1)',color:on[i]?'#00ddff':'white',textShadow:on[i]?'0 0 12px rgba(0,221,255,0.8)':'0 2px 4px rgba(0,0,0,0.8)'}}>
          {c===' '?'\u00A0':c}
        </span>
      ))}
    </h2>
  )
}

// ═══════════════════════════════════════════════════════
//  KOMPONEN UTAMA
// ═══════════════════════════════════════════════════════
type TabType = 'home' | 'stats';

const MemberPopup=({isOpen,onClose}:MemberPopupProps)=>{
  const [popupStage,setPopupStage]=useState<'game'|'evoker'|'data'>('game')
  const [ambientOn,setAmbientOn]=useState(true)
  const [activeTab,setActiveTab]=useState<TabType>('home')
  
  const imgRef=useRef<HTMLDivElement>(null)
  const [tracking,setTracking]=useState(false)
  const [glitching,setGlitching]=useState(false)
  const [faceClick,setFaceClick]=useState(false)
  const [arcana,setArcana]=useState(false)
  const audio=useP3Audio()

  const onMouseMove=(e:React.MouseEvent<HTMLDivElement>)=>{
    if(!imgRef.current)return;const r=imgRef.current.getBoundingClientRect()
    imgRef.current.style.setProperty('--mx',`${e.clientX-r.left}px`);imgRef.current.style.setProperty('--my',`${e.clientY-r.top}px`)
  }
  const onPhotoEnter=()=>{setTracking(true);setGlitching(false)}
  const onPhotoLeave=()=>{setTracking(false);audio.playGlitchSnap();setGlitching(true);setTimeout(()=>setGlitching(false),600)}
  const onFaceClick=()=>{if(faceClick)return;audio.playFaceClick();setFaceClick(true);setArcana(true);setTimeout(()=>setFaceClick(false),700);setTimeout(()=>setArcana(false),1800)}
  const toggleAmbient=()=>{if(ambientOn){audio.stopDataBGM();setAmbientOn(false)}else{audio.startDataBGM();setAmbientOn(true)}}

  const switchTab = (tab: TabType) => {
    if (tab === activeTab) return;
    audio.playTabSwitch();
    setActiveTab(tab);
  }

  useEffect(()=>{
    if(!isOpen){setPopupStage('game');setAmbientOn(true);setActiveTab('home');audio.destroyCtx();return}
    audio.startBGM()
    const kd=(e:KeyboardEvent)=>{if(e.key==='Escape'){audio.playClose();setTimeout(onClose,120)}}
    document.body.style.overflow='hidden';window.addEventListener('keydown',kd)
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',kd)}
  },[isOpen])

  if(!isOpen)return null
  const handleClose=()=>{audio.playClose();setTimeout(onClose,120)}
  const handleWin=()=>{audio.stopBGM();setTimeout(()=>audio.playEvoker(),100);setPopupStage('evoker');setTimeout(()=>{setPopupStage('data');setTimeout(()=>audio.startDataBGM(),400)},2000)}

  return createPortal(
    <>
      <style>{`
        /* Animasi dasar */
        @keyframes p3-summon{0%{opacity:0;transform:scale(0.95) translateY(20px);filter:brightness(1.5) blur(10px)}100%{opacity:1;transform:scale(1) translateY(0);filter:brightness(1) blur(0px)}}
        @keyframes evoker-flash{0%{background-color:rgba(0,0,0,1)}10%{background-color:rgba(255,255,255,1)}20%{background-color:rgba(0,68,204,1)}100%{background-color:rgba(0,0,0,1)}}
        @keyframes evoker-zoom{0%{transform:scale(0.1) skewX(-20deg);opacity:0;letter-spacing:-20px}20%{transform:scale(1.2) skewX(-15deg);opacity:1;letter-spacing:10px;filter:drop-shadow(0 0 20px cyan)}80%{transform:scale(1) skewX(-10deg);opacity:1;letter-spacing:5px}100%{transform:scale(5) skewX(-30deg);opacity:0;filter:blur(10px)}}
        @keyframes shatter{0%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}50%{clip-path:polygon(10% 20%,90% 10%,80% 80%,20% 90%);opacity:0.8}100%{clip-path:polygon(50% 50%,50% 50%,50% 50%,50% 50%);opacity:0}}
        @keyframes t-glitch{0%{filter:hue-rotate(0deg) blur(0px)}20%{filter:hue-rotate(45deg) blur(1px);transform:translate(-1px,1px)}40%{filter:hue-rotate(-45deg) blur(0px);transform:translate(1px,-1px)}60%{filter:hue-rotate(0deg) blur(1px);transform:translate(0,0)}100%{filter:hue-rotate(0deg) blur(0px)}}
        @keyframes ai-scan{0%{top:5%;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:95%;opacity:0}}
        @keyframes glitch-d{0%{transform:translate(0,0) skewX(0deg)}10%{transform:translate(-8px,2px) skewX(-4deg);filter:hue-rotate(90deg) saturate(3);clip-path:inset(20% 0 40% 0)}30%{transform:translate(-4px,4px) skewX(-2deg);clip-path:inset(5% 0 70% 0)}50%{transform:translate(-6px,0px) skewX(-3deg);filter:hue-rotate(270deg)}70%{transform:translate(-2px,-2px) skewX(-1deg);clip-path:inset(0% 0 0% 0)}100%{transform:translate(0,0) skewX(0deg);filter:none;clip-path:none}}
        @keyframes face-flash{0%{opacity:0}10%{opacity:0.7;transform:translate(-4px,0);filter:hue-rotate(180deg)}35%{opacity:0.6}70%{opacity:0.2}100%{opacity:0}}
        @keyframes arcana-rev{0%{opacity:0;transform:scale(0.3) rotate(-15deg);filter:brightness(3)}15%{opacity:1;transform:scale(1.08) rotate(2deg);filter:brightness(1.5)}70%{opacity:1;transform:scale(1) rotate(0deg)}100%{opacity:0;transform:scale(1.1) rotate(3deg)}}
        
        /* UPDATED: Garis scan naik turun dikembalikan */
        @keyframes scanline-up-down {
          0%, 100% { transform: translateY(0); opacity: 0; }
          5%, 45%, 55%, 95% { opacity: 1; }
          50% { transform: translateY(160px); opacity: 0; } /* Tinggi box 160px */
        }
        
        @keyframes fade-in-tab{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}

        .animate-p3-container{animation:p3-summon 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards}
        .animate-evoker-bg{animation:evoker-flash 2s cubic-bezier(0.2,0.8,0.2,1) forwards}
        .animate-evoker-text{animation:evoker-zoom 1.8s cubic-bezier(0.1,0.9,0.2,1) forwards}
        .animate-shatter{animation:shatter 0.5s ease-out 1.5s forwards}
        .animate-tracker-glitch{animation:t-glitch 0.3s ease-in-out infinite alternate}
        .animate-ai-scan{animation:ai-scan 2.5s linear infinite}
        .animate-glitch-disp{animation:glitch-d 0.6s steps(1) forwards}
        .animate-face-flash{animation:face-flash 0.7s steps(2) forwards}
        .animate-arcana{animation:arcana-rev 1.8s cubic-bezier(0.22,1,0.36,1) forwards}
        
        /* UPDATED Class: Scanline naik turun */
        .animate-scan-drift-up-down {
          animation: scanline-up-down 3s ease-in-out infinite alternate;
        }
        
        .animate-tab-enter{animation:fade-in-tab 0.4s ease-out forwards}

        /* Hyprland / Modern Flat Glass Aesthetics */
        .hypr-glass {
          background: rgba(3, 8, 20, 0.45);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .hypr-panel {
          background: rgba(5, 15, 35, 0.5);
          border: 1px solid rgba(0, 221, 255, 0.15);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          border-radius: 24px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.3s ease;
        }
        .hypr-panel:hover {
          border-color: rgba(0, 221, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(0, 221, 255, 0.05);
        }
        .hypr-pill {
          background: rgba(0, 221, 255, 0.05);
          border: 1px solid rgba(0, 221, 255, 0.2);
          border-radius: 999px;
        }
        
        /* Scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar{width:4px}
        .custom-scrollbar::-webkit-scrollbar-track{background:rgba(0,0,0,0.2);border-radius:4px}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(0,221,255,0.4);border-radius:4px}
        .custom-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(0,221,255,0.8)}
      `}</style>

      {/* Backdrop Luar */}
      <div className={`fixed inset-0 z-[90] transition-opacity duration-500 ease-in-out ${popupStage==='evoker'?'opacity-0':'opacity-100'} ${popupStage==='data'?'hidden':'block'}`}
        style={{background:'rgba(0,3,10,0.85)',backdropFilter:'blur(12px)'}}></div>

      {/* STAGE 1 & 2: Game & Evoker */}
      <div className={`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-[5dvh] ${popupStage==='data'?'hidden':'block'}`}>
        <button type="button" aria-label="Close" onClick={handleClose} className="absolute inset-0 cursor-default"/>
        {popupStage==='game'&&<MemoryGameStage onWin={handleWin} onClose={handleClose} audio={{playFlip:audio.playFlip,playWrong:audio.playWrong,playMatch:audio.playMatch,playWin:audio.playWin}}/>}
        {popupStage==='evoker'&&(
          <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden animate-evoker-bg pointer-events-none">
            <div className="absolute inset-0 bg-blue-500 mix-blend-overlay animate-shatter"></div>
            <div className="relative text-center">
              <p className="text-[#00ddff] text-2xl tracking-widest font-mono mb-4 opacity-70 italic font-black">I am thou, thou art I...</p>
              <h1 className="text-6xl sm:text-9xl font-black text-white italic uppercase drop-shadow-[0_0_25px_rgba(0,195,255,0.9)] animate-evoker-text mix-blend-screen">PERSONA!</h1>
            </div>
          </div>
        )}
      </div>

      {/* STAGE 3: DATA — HYPRLAND / MODERN FLAT STYLE (MOBILE RESPONSIVE) */}
      {popupStage==='data'&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8"
          style={{background:'radial-gradient(circle at center, rgba(0,20,50,0.4) 0%, rgba(0,2,10,0.95) 100%)', backdropFilter:'blur(20px)'}}>
          
          {/* Overlay Click to close */}
          <button type="button" aria-label="Close" onClick={handleClose} className="absolute inset-0 cursor-default"/>

          {/* ════ MASTER LAYOUT: Floating Windows Concept ════ */}
          <div className="relative z-10 w-full max-w-[1100px] h-[92dvh] sm:h-[85vh] min-h-[500px] sm:min-h-[600px] flex flex-col sm:flex-row gap-3 sm:gap-6 animate-p3-container pointer-events-none">
            
            {/* ── WINDOW 1: SIDEBAR NAV ── */}
            <div className="hypr-panel w-full sm:w-[80px] sm:h-full flex flex-row sm:flex-col items-center justify-between sm:justify-start py-2 px-3 sm:py-6 sm:px-0 pointer-events-auto flex-shrink-0 z-20">
              {/* Logo / Header */}
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#00ddff]/20 to-transparent flex items-center justify-center border border-[#00ddff]/40 shadow-[0_0_15px_rgba(0,221,255,0.2)] sm:mb-8 flex-shrink-0">
                <span className="text-[#00ddff] font-black text-base sm:text-xl italic">S</span>
              </div>
              
              {/* Nav Buttons (HANYA HOME & STATS) */}
              <div className="flex flex-row sm:flex-col gap-1.5 sm:gap-4 flex-1 justify-center sm:justify-start">
                {[
                  { id: 'home', icon: '⌂', label: 'Home' },
                  { id: 'stats', icon: '☆', label: 'Stats' }
                ].map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => switchTab(item.id as TabType)}
                    className={`relative w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 group
                      ${activeTab === item.id 
                        ? 'bg-[#00ddff]/20 text-[#00ddff] border border-[#00ddff]/50 shadow-[0_0_15px_rgba(0,221,255,0.3)]' 
                        : 'text-white/40 border border-transparent hover:bg-white/5 hover:text-white/80'
                      }`}
                  >
                    <span className="text-base sm:text-xl">{item.icon}</span>
                    {/* Tooltip */}
                    <div className="absolute left-16 bg-[#00ddff]/90 text-black font-mono text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Bottom Actions (BGM / Close) */}
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 sm:mt-auto">
                <button 
                  onClick={toggleAmbient}
                  title="Toggle BGM"
                  className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl transition-all border ${ambientOn ? 'bg-[#00ddff]/10 text-[#00ddff] border-[#00ddff]/30' : 'bg-black/30 text-white/30 border-white/10'}`}
                >
                  <svg className="w-2.5 h-3 sm:w-3 sm:h-[14px]" viewBox="0 0 10 12" fill="currentColor"><path d="M9 0v8.5A1.5 1.5 0 1 1 7 7V2.5L3 3.5V10A1.5 1.5 0 1 1 1 8.5V1.5L9 0Z"/></svg>
                </button>
                <button 
                  onClick={handleClose} 
                  title="Close Window"
                  className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-mono text-xs sm:text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── WINDOW 2: MAIN IMAGE (RESPONSIVE HEIGHT ON MOBILE) ── */}
            <div className="hypr-panel relative overflow-hidden pointer-events-auto flex flex-col justify-end group z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[#00ddff]/20 flex-none h-[240px] sm:h-auto sm:flex-1">
              {/* Photo Area */}
              <div ref={imgRef} onMouseMove={onMouseMove} onMouseEnter={onPhotoEnter} onMouseLeave={onPhotoLeave} onClick={onFaceClick}
                className="absolute inset-0 cursor-crosshair">
                
                {/* Background Image */}
                <Image src={ProfileImage} alt="Profile"
                  className={`w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75 transition-all duration-700 ${glitching?'animate-glitch-disp':''} group-hover:scale-105 group-hover:brightness-90`}/>
                
                {/* Ambient Scanline Grid */}
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                  style={{backgroundImage:'linear-gradient(rgba(0,221,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,221,255,0.5) 1px, transparent 1px)',backgroundSize:'40px 40px'}}></div>
                
                {/* Color Reveal Tracker */}
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{opacity:tracking?1:0,clipPath:'polygon(calc(var(--mx) - 80px) calc(var(--my) - 80px),calc(var(--mx) + 80px) calc(var(--my) - 80px),calc(var(--mx) + 80px) calc(var(--my) + 80px),calc(var(--mx) - 80px) calc(var(--my) + 80px))'}}>
                  <Image src={ProfileImage} alt="Color" className="w-full h-full object-cover object-center saturate-[1.3] contrast-110 animate-tracker-glitch"/>
                  <div className="absolute inset-0 bg-[#00ddff]/10 mix-blend-screen"></div>
                </div>

                {/* Cyberpunk Crosshair Tracker (UPDATED MANTAP) */}
                <div className="absolute pointer-events-none z-10 transition-opacity duration-200"
                  style={{opacity:tracking?1:0,left:'calc(var(--mx) - 80px)',top:'calc(var(--my) - 80px)',width:'160px',height:'160px'}}>
                  
                  {/* Box Corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ddff]"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ddff]"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ddff]"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ddff]"></div>
                  
                  {/* Center Cross kaku (opsional, bisa dihapus jika terlalu ramai) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00ddff] shadow-[0_0_5px_#00ddff] -translate-y-1/2 opacity-30"></div>
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#00ddff] shadow-[0_0_5px_#00ddff] -translate-x-1/2 opacity-30"></div>
                  </div>

                  {/* Labels (Ala SEES HUD) */}
                  <div className="absolute -top-6 left-0 bg-[#0044cc]/80 border border-[#00ddff] px-1.5 py-0.5 shadow-[0_0_8px_rgba(0,221,255,0.4)] backdrop-blur-sm">
                    <p className="text-white font-mono text-[9px] tracking-widest whitespace-nowrap drop-shadow-[0_0_2px_#00ddff]">SEES:MBR_5027251030</p>
                  </div>
                  <div className="absolute -bottom-5 right-0">
                    <p className="text-[#00ddff] font-mono text-[9px] tracking-widest whitespace-nowrap drop-shadow-[0_0_2px_#00ddff] animate-pulse">[LCK_ON]</p>
                  </div>

                  {/* ── UPDATED: Garis Scanline Naik Turun Dikembalikan ── */}
                  <div className="absolute left-[-100vw] right-[-100vw] h-[2px] bg-[#00ddff] shadow-[0_0_12px_#00ddff] top-0 animate-scan-drift-up-down opacity-0" style={{mixBlendMode: 'screen'}}>
                    {/* Internal glow for the scanline */}
                    <div className="absolute inset-0 bg-[#00ddff] shadow-[0_0_20px_4px_rgba(0,221,255,0.8)]"></div>
                  </div>
                </div>

                {/* Face Click / Arcana FX */}
                {faceClick&&(
                  <div className="absolute inset-0 z-30 pointer-events-none animate-face-flash"
                    style={{background:'radial-gradient(circle at center, rgba(0,221,255,0.3) 0%, transparent 70%)'}}>
                  </div>
                )}
                {arcana&&(
                  <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-arcana">
                    <div className="bg-black border-4 border-white w-24 h-36 sm:w-32 sm:h-48 flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-[0_0_30px_rgba(0,195,255,0.8)]" style={{ transform: 'rotate(-2deg)' }}>
                      <p className="text-[#00ddff] font-mono text-[10px] sm:text-xs tracking-widest">— 0 —</p>
                      <p className="text-white text-3xl sm:text-4xl">☆</p>
                      <p className="text-white font-black text-xs sm:text-sm italic tracking-wider uppercase">THE FOOL</p>
                      <div className="w-full px-2 sm:px-3 mt-1"><div className="h-[1px] bg-white/50 w-full"></div><p className="text-white/60 font-mono text-[6px] sm:text-[8px] text-center mt-1 tracking-widest">SEES MEMBER</p></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge (Top Right Overlay) */}
              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 pointer-events-none flex items-center gap-1.5 sm:gap-2 hypr-glass px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#00ddff]/20">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00ddff] animate-pulse"></div>
                <span className="font-mono text-[8px] sm:text-[10px] text-[#00ddff] tracking-widest font-bold">SYS.ONLINE</span>
              </div>

              {/* ── FLOATING NAME PILL (UPDATED: Ke Kiri Bawah & Lebih Kecil Di HP) ── */}
              <div className="absolute bottom-1.5 left-1.5 sm:bottom-6 sm:left-6 z-20 pointer-events-auto max-w-[calc(100%-12px)] sm:max-w-[calc(100%-48px)] scale-[0.85] sm:scale-100 origin-bottom-left">
                <div className="hypr-panel px-3 py-2 sm:px-6 sm:py-4 rounded-[16px] sm:rounded-[20px] backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl flex flex-col gap-0.5 sm:gap-1">
                  <p className="text-[#00ddff] font-mono text-[8px] sm:text-[9px] tracking-[0.3em] uppercase opacity-80 mb-0.5 sm:mb-1">Operative Designation</p>
                  <AnimatedName name="Muhammad Syadzili Abdul Muhyi" />
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-1 sm:mt-2">
                    <span className="text-white/50 font-mono text-[7px] sm:text-[10px] bg-white/5 px-1.5 sm:px-2 py-0.5 rounded-md border border-white/5">NRP. 5027251030</span>
                    <span className="text-white/50 font-mono text-[7px] sm:text-[10px] italic">"Clouxy"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── WINDOW 3: DYNAMIC CONTENT PANEL (Right Side) ── */}
            <div className="hypr-panel w-full sm:w-[360px] flex-1 sm:flex-none h-auto sm:h-full pointer-events-auto flex flex-col overflow-hidden z-20 bg-gradient-to-b from-[rgba(5,15,35,0.7)] to-[rgba(0,5,15,0.9)] relative">
              
              {/* Header Panel */}
              <div className="h-12 sm:h-16 border-b border-[#00ddff]/10 flex items-center px-4 sm:px-6 shrink-0 bg-black/20">
                <h3 className="font-black italic text-lg sm:text-xl text-white tracking-wide flex items-center gap-2 sm:gap-3">
                  {activeTab === 'home' && <><span className="text-[#00ddff]">⌂</span> OVERVIEW</>}
                  {activeTab === 'stats' && <><span className="text-[#00ddff]">☆</span> FUN-FACT</>}
                </h3>
              </div>

              {/* Content Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 relative">
                
                {/* --- TAB: HOME (Digabung dengan Music) --- */}
                {activeTab === 'home' && (
                  <div className="flex flex-col gap-5 sm:gap-6 animate-tab-enter">
                    {/* S.Link Card */}
                    <div className="hypr-pill p-4 sm:p-5 flex flex-col gap-1 bg-gradient-to-r from-[#00ddff]/10 to-transparent">
                      <p className="font-mono text-[8px] sm:text-[9px] text-[#00ddff]/70 tracking-widest uppercase">Social Link</p>
                      <div className="flex items-end gap-2">
                        <p className="font-black text-3xl sm:text-4xl text-white italic">Lv.24</p>
                        <p className="font-mono text-[10px] sm:text-xs text-white/40 mb-1">MAX</p>
                      </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col gap-1">
                        <span className="font-mono text-[7px] sm:text-[8px] text-[#00ddff]/60 tracking-wider uppercase"> From</span>
                        <span className="font-bold text-xs sm:text-sm text-white">Jakarta, ID</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col gap-1">
                        <span className="font-mono text-[7px] sm:text-[8px] text-[#00ddff]/60 tracking-wider uppercase">Dept</span>
                        <span className="font-bold text-xs sm:text-sm text-white">Info Tech</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col gap-1 col-span-2">
                        <span className="font-mono text-[7px] sm:text-[8px] text-[#00ddff]/60 tracking-wider uppercase">Hobby</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg">☆</span>
                          <span className="font-bold text-sm sm:text-base text-white italic">Reading Cool Stuff & sleep</span>
                        </div>
                      </div>
                    </div>

                    {/* Communications / Socials */}
                    <div>
                      <p className="font-mono text-[9px] sm:text-[10px] text-white/40 tracking-widest uppercase mb-2 sm:mb-3 px-1">Secure Comms</p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Instagram username="syadzili1969" />
                        <LinkedInButtonLink username="muhammad-syadzili-abdul-muhyi-114859333" />
                      </div>
                    </div>

                    {/* Pembatas untuk Music */}
                    <div className="h-[1px] w-full bg-[#00ddff]/20 my-1 sm:my-2"></div>

                    {/* BATTLE THEME SPOTIFY EMBED (UPDATED: Fixed min-height) */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#00ddff] animate-pulse text-sm sm:text-base">♪</span>
                        <p className="font-mono text-[9px] sm:text-[10px] text-[#00ddff]/80 tracking-widest uppercase font-bold">Now Broadcasting</p>
                      </div>
                      
                      {/* Explicitly mapping the 3 requested Spotify links */}
                      <div className="flex flex-col gap-2">
                        {[
                          'https://open.spotify.com/track/3znIACSXPLn3HFCf7moZ28?si=H5Pa0T5lQCmJziU18xp_DA',
                          'https://open.spotify.com/track/34RdcQ0rkkbdjbx7ks6BJF?si=rk7nD9jsS-ebBRcrhJW1ww',
                          'https://open.spotify.com/track/4pjFNyjGaoKgLTnndISP6V?si=5-sfkVoESnqw9CvZIhwbMQ'
                        ].map((url, idx) => (
                          <div key={idx} className="w-full min-h-[160px] h-auto rounded-xl overflow-hidden border border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-all hover:border-[#00ddff]/40 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 flex-shrink-0">
                            <SpotifyEmbed spotifyUrl={url} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: STATS --- */}
                {activeTab === 'stats' && (
                  <div className="flex flex-col gap-5 sm:gap-6 animate-tab-enter">
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-1 sm:mb-2">
                      Fox, Raccoon, and Cat are my absolute favorite animals! Just putting them here because I like them.
                    </p>
                    
                    {/* Dummy Stat Bars */}
                    <div className="flex flex-col gap-4 sm:gap-5">
                      {[
                        { label: 'Fox', val: 85, color: '#ff3366', rank: 'Mife' },
                        { label: 'Raccoon', val: 60, color: '#ff33b5', rank: 'ola' },
                        { label: 'Cat', val: 92, color: '#00ddff', rank: 'Meng' }
                      ].map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-1.5 sm:gap-2">
                          <div className="flex justify-between items-end">
                            <span className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">{stat.label}</span>
                            <span className="font-mono text-[9px] sm:text-[10px] text-white/50">{stat.rank}</span>
                          </div>
                          <div className="h-1.5 sm:h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                                 style={{ width: `${stat.val}%`, backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Condition & Quotes */}
                    <div className="mt-2 sm:mt-4 p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-3 sm:gap-4">
                      <p className="font-mono text-[9px] sm:text-[10px] text-[#00ddff] tracking-widest uppercase border-b border-white/10 pb-1.5 sm:pb-2">Condition</p>
                      <div className="flex flex-col gap-0.5 sm:gap-1">
                        <span className="font-mono text-[9px] sm:text-[10px] text-white/40">Daily Energy</span>
                        <div className="flex items-end gap-1.5 sm:gap-2 text-[#00ff88]">
                          <span className="font-black text-xl sm:text-2xl italic">888</span><span className="text-[10px] sm:text-xs mb-0.5 sm:mb-1 opacity-50">/ 888</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:gap-1">
                        <span className="font-mono text-[9px] sm:text-[10px] text-white/40">Social Battery</span>
                        <div className="flex items-end gap-1.5 sm:gap-2 text-[#cc00ff]">
                          <span className="font-black text-xl sm:text-2xl italic">222</span><span className="text-[10px] sm:text-xs mb-0.5 sm:mb-1 opacity-50">/ 254</span>
                        </div>
                      </div>
                      
                      {/* QUOTES SECTION */}
                      <div className="w-full h-[1px] bg-white/10 mt-0.5 sm:mt-1"></div>
                      <p className="font-mono text-[8px] sm:text-[9px] text-[#00ddff]/70 tracking-widest italic leading-relaxed">
                        "– Remember, you will die. But until then, keep moving forward."
                      </p>
                    </div>
                  </div>
                )}

              </div>
              
              {/* Footer Panel */}
              <div className="h-10 sm:h-12 border-t border-[#00ddff]/10 bg-black/40 flex items-center justify-between px-4 sm:px-6 shrink-0 backdrop-blur-md">
                <span className="font-mono text-[7px] sm:text-[8px] text-white/30 tracking-widest uppercase">System v5.4.0</span>
                <span className="font-mono text-[7px] sm:text-[8px] text-[#00ddff]/50 tracking-widest uppercase italic animate-pulse">"Memento Mori"</span>
              </div>
            </div>

          </div>{/* end master layout */}
        </div>
      )}
    </>,
    document.body
  )
}

export default MemberPopup