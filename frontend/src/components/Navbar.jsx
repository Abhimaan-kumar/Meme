import React from 'react'

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/5">
      <div className="h-16 flex items-center justify-between p-3">
        <div className="font-bold text-2xl">MemeVault</div>
        <nav className="flex items-center">
          <a className="text-slate-400 ml-4 text-lg hover:text-white hover:bg-white/20 rounded-md px-2 py-1" href="#">Account</a>
          <a className="text-slate-400 ml-4 text-lg hover:text-white hover:bg-white/20 rounded-md px-2 py-1" href="#">Friends</a>
          <a className="text-slate-400 ml-4 text-lg hover:text-white hover:bg-white/20 rounded-md px-2 py-1" href="#">Add API</a>
        </nav>
      </div>
    </header>
  )
}
