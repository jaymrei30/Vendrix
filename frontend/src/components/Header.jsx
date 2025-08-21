import React,{useEffect,useState} from 'react'
import logo from '../assets/logo.png'
import { APP_CONFIG } from '../config'
export default function Header({onToggleSidebar}){
  const [dark,setDark]=useState(false)
  useEffect(()=>{const r=document.documentElement; dark?r.classList.add('dark'):r.classList.remove('dark')},[dark])
  return (<header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200/40 dark:border-gray-800/40">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <button className="md:hidden px-3 py-2 rounded border" onClick={onToggleSidebar} aria-label="Toggle sidebar">☰</button>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vendrix Logo" className="w-10 h-10 rounded-md"/>
          <div className="leading-tight">
            <div className="flex items-baseline gap-2"><span className="text-xl sm:text-2xl font-extrabold tracking-tight">Vendrix</span><span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{APP_CONFIG.version}</span></div>
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{APP_CONFIG.tagline}</div>
          </div>
        </div>
      </div>
      <button onClick={()=>setDark(v=>!v)} className={'w-8 h-8 rounded-full border flex items-center justify-center transition ' + (dark?'bg-neutral-200 text-neutral-900 border-neutral-400':'bg-amber-400 text-amber-900 border-amber-500')} title="Toggle theme" aria-label="Toggle theme">●</button>
    </div>
  </header>)}
