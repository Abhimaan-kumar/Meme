import React, { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import MemeCard from './components/MemeCard'

const BATCH = 5
// Use the public Meme API directly so the frontend doesn't depend on the backend proxy.
// If you need to switch back to the local backend, set VITE_BACKEND_URL in .env and update code.
const MEME_API_BASE = 'https://meme-api.com/gimme'

export default function App() {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(false)
  const observerRef = useRef(null)
  const inFlightRef = useRef(false)

  const fetchMemes = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    setLoading(true)
    try {
      const res = await fetch(`${MEME_API_BASE}/${BATCH}`)
      const data = await res.json()

      // Normalize response: the API sometimes returns { memes: [...] } or a single object
      let memesArr = []
      if (data && Array.isArray(data)) {
        memesArr = data
      } else if (data && data.memes) {
        memesArr = data.memes
      } else if (data && data.url) {
        memesArr = [data]
      }

      const valid = memesArr.filter((m) => m && m.url)
      setMemes((p) => [...p, ...valid])
    } catch (err) {
      console.error('Failed to fetch memes', err)
    } finally {
      setLoading(false)
      inFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchMemes()
  }, [fetchMemes])

  // IntersectionObserver: observe the 4th item of the latest batch
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchMemes()
          }
        })
      },
      { root: null, rootMargin: '0px', threshold: 0.25 }
    )
    observerRef.current = obs

    if (memes.length === 0) return () => obs.disconnect()

    const targetIndex = memes.length - BATCH + 3 // 0-based index of 4th of last batch
    if (targetIndex >= 0 && targetIndex < memes.length) {
      const el = document.getElementById(`meme-${targetIndex}`)
      if (el) obs.observe(el)
    }

    return () => obs.disconnect()
  }, [memes, fetchMemes])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto mt-5 p-3">
        <section className="flex flex-col gap-4">
          {memes.map((m, i) => (
            <div key={i} id={`meme-${i}`}>
              <MemeCard meme={m} />
            </div>
          ))}

          {loading && <div className="text-center text-slate-400 p-5">Loading...</div>}
        </section>
      </main>
    </div>
  )
}
