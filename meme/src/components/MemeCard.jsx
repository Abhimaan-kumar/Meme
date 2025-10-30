import React, { useState } from 'react'

export default function MemeCard({ meme }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 200))
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')

  const toggleLike = () => {
    setLiked((v) => {
      const nv = !v
      setLikes((l) => (nv ? l + 1 : Math.max(0, l - 1)))
      return nv
    })
  }

  const addComment = (e) => {
    e.preventDefault()
    if (!commentInput.trim()) return
    setComments((c) => [...c, commentInput.trim()])
    setCommentInput('')
  }

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: meme.title || 'Meme', url: meme.url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(meme.url)
        alert('Meme link copied to clipboard')
      } else {
        prompt('Copy this link', meme.url)
      }
    } catch (err) {
      console.error('Share failed', err)
    }
  }

  return (
    <article className="bg-[#0f1720] rounded-xl p-3 border border-white/10 max-w-xl mx-auto ">
      
      <div className="flex justify-center">
        <img className="max-w-full rounded-md" src={meme.url} alt={meme.title || 'meme'} />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          className={`px-3 py-2 rounded-lg border border-white/5 text-lg ${liked ? 'text-indigo-400 border-indigo-200' : 'text-slate-400'}`}
          onClick={toggleLike}
        >
          ❤️ {likes}
        </button>
        <button className="px-3 py-2 rounded-lg border border-white/5 text-slate-400 text-lg" onClick={() => setShowComments((s) => !s)}>
          💬 {comments.length}
        </button>
        <button className="px-3 py-2 rounded-lg border border-white/5 text-slate-400 text-lg" onClick={share}>
          🔗 Share
        </button>
      </div>

      {showComments && (
        <div className="mt-3">
          <form onSubmit={addComment} className="flex gap-2">
            <input
              className="flex-1 p-2 rounded-lg border border-white/5 bg-transparent text-white text-sm"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
            />
            <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm" type="submit">Post</button>
          </form>
          <ul className="mt-2 space-y-2">
            {comments.map((c, i) => (
              <li key={i} className="px-3 py-2 rounded-md bg-white/2 text-sm">{c}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
