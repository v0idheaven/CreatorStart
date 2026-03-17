import { useState } from 'react'
import { Zap, ChevronDown } from 'lucide-react'
import { usePlatform } from '../hooks/usePlatform'

const NICHES = [
  'Fitness & Gym','Cooking & Food','Tech & Gadgets','Finance & Money',
  'Travel','Fashion & Style','Mental Health','Gaming','Education',
  'Motivation','Beauty & Skincare','Business & Entrepreneurship','Other'
]

const FORMATS = {
  instagram: ['Reel','Story','Carousel','Static Post'],
  youtube: ['Short (60s)','Long Video','Vlog','Tutorial']
}

const GOALS = ['Educate','Entertain','Inspire','Promote','Build Community']
const TONES = ['Friendly','Casual','Bold & Punchy','Professional','Humorous','Storytelling']

function Select({ id, label, options, value, onChange, openSelect, setOpenSelect }) {
  const open = openSelect === id

  const selectOption = (opt) => {
    onChange(opt)
    setOpenSelect(null)
  }

  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        fontSize: '11px',
        color: 'var(--dim)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '8px',
        display: 'block'
      }}>
        {label}
      </label>

      <div
        onClick={() => setOpenSelect(open ? null : id)}
        style={{
          padding: '10px 12px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          background: 'var(--card)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: value ? 'var(--text)' : 'var(--dim)'
        }}
      >
        {value || `Select ${label}`}
        <ChevronDown size={14} />
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          border: '1px solid var(--border)',
          background: 'var(--card)',
          borderRadius: '6px',
          zIndex: 20,
          maxHeight: '220px',
          overflowY: 'auto'
        }}>
          {options.map(opt => {
            const selected = value === opt
            return (
              <div
                key={opt}
                onClick={() => selectOption(opt)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  color: selected ? 'var(--accent)' : 'var(--text)',
                  background: selected ? 'rgba(129,140,248,0.06)' : 'transparent'
                }}
              >
                {opt}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ResultBlock({ label, children }) {
  return (
    <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
      <span style={{
        fontSize: '10px',
        color: 'var(--dim)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
      }}>
        {label}
      </span>
      <div style={{
        marginTop: '8px',
        color: 'var(--text)',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        {children}
      </div>
    </div>
  )
}

function ContentGenerator() {
  const { platform } = usePlatform()

  const [openSelect, setOpenSelect] = useState(null)
  const [formatTab, setFormatTab] = useState('instagram')
  const [formats, setFormats] = useState('')
  const [niche, setNiche] = useState('')
  const [goal, setGoal] = useState('')
  const [tone, setTone] = useState('')
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getFormats = () => {
    if (platform === 'instagram') return FORMATS.instagram
    if (platform === 'youtube') return FORMATS.youtube
    if (platform === 'both') {
      if (formatTab === 'instagram') return FORMATS.instagram
      if (formatTab === 'youtube') return FORMATS.youtube
      return [...FORMATS.instagram, ...FORMATS.youtube]
    }
    return []
  }

  const availableFormats = getFormats()
  const canGenerate = formats && niche && goal && tone
  const activePlatform = platform === 'both' ? formatTab : platform

  const generate = async () => {
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a social media content strategist. Always respond with valid JSON only, no markdown, no extra text, no backticks.'
            },
            {
              role: 'user',
              content: `Generate a complete content idea for a ${formats} on ${activePlatform}.
Niche: ${niche}
Goal: ${goal}
Tone: ${tone}
${topic ? `Topic: ${topic}` : ''}

Respond in this exact JSON format only, no markdown:
{
  "hook": "attention-grabbing opening line",
  "angle": "unique angle or perspective",
  "outline": ["point 1", "point 2", "point 3", "point 4"],
  "caption": "ready to use caption with emojis",
  "tip": "one actionable tip"
}`
            }
          ],
          temperature: 0.7
        })
      })

      const data = await response.json()

      // API error check
      if (!response.ok) {
        const msg = data?.error?.message || `API error ${response.status}`
        setError(`API Error: ${msg}`)
        setLoading(false)
        return
      }

      // choices check
      if (!data.choices || data.choices.length === 0) {
        setError('No content returned. Please try again.')
        setLoading(false)
        return
      }

      const text = data.choices[0]?.message?.content
      if (!text) {
        setError('Empty response. Please try again.')
        setLoading(false)
        return
      }

      // JSON parse
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)

    } catch (err) {
      console.error('Groq error:', err)
      if (err instanceof SyntaxError) {
        setError('Response was not valid JSON. Please try again.')
      } else {
        setError('Something went wrong. Check your API key and try again.')
      }
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '56px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          marginBottom: '6px'
        }}>
          Generate your next post
        </h1>
        <p style={{ color: 'var(--dim)', fontSize: '14px' }}>
          Create scroll-stopping content ideas in seconds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '28px' }}>

        {/* Form Card */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: '12px',
          background: 'var(--card)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
        }}>
          <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {platform === 'both' && (
              <div>
                <label style={{
                  fontSize: '11px',
                  color: 'var(--dim)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Platform
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => { setFormatTab('instagram'); setFormats('') }}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: formatTab === 'instagram' ? 'rgba(193,53,132,0.1)' : 'var(--card)',
                      color: formatTab === 'instagram' ? '#c13584' : 'var(--dim)',
                      cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    Instagram
                  </button>
                  <button
                    onClick={() => { setFormatTab('youtube'); setFormats('') }}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: formatTab === 'youtube' ? 'rgba(255,0,0,0.1)' : 'var(--card)',
                      color: formatTab === 'youtube' ? '#ff4444' : 'var(--dim)',
                      cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    YouTube
                  </button>
                </div>
              </div>
            )}

            <Select id="format" label="Format" options={availableFormats} value={formats} onChange={setFormats} openSelect={openSelect} setOpenSelect={setOpenSelect} />
            <Select id="niche" label="Niche" options={NICHES} value={niche} onChange={setNiche} openSelect={openSelect} setOpenSelect={setOpenSelect} />
            <Select id="goal" label="Goal" options={GOALS} value={goal} onChange={setGoal} openSelect={openSelect} setOpenSelect={setOpenSelect} />
            <Select id="tone" label="Tone" options={TONES} value={tone} onChange={setTone} openSelect={openSelect} setOpenSelect={setOpenSelect} />

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (optional)"
              style={{
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: 'transparent',
                color: 'var(--text)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ padding: '22px' }}>
            {error && (
              <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{error}</p>
            )}
            <button
              onClick={generate}
              disabled={!canGenerate || loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: canGenerate && !loading
                  ? 'linear-gradient(135deg,var(--accent),var(--accent-dark))'
                  : 'var(--border)',
                color: '#fff',
                fontWeight: '600',
                cursor: canGenerate && !loading ? 'pointer' : 'not-allowed'
              }}
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </div>

        {/* Result Card */}
        <div>
          {!result && !loading && (
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '40px',
              background: 'var(--card)',
              minHeight: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <Zap size={28} color="var(--accent)" style={{ marginBottom: '12px' }} />
              <h3 style={{ color: 'var(--text)', fontSize: '16px', marginBottom: '6px' }}>
                Your content idea will appear here
              </h3>
              <p style={{ color: 'var(--dim)', fontSize: '13px', maxWidth: '240px' }}>
                Select format, niche, tone and generate a complete post idea.
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '40px',
              background: 'var(--card)',
              minHeight: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--dim)',
              fontSize: '14px'
            }}>
              Generating your content idea...
            </div>
          )}

          {result && !loading && (
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--card)' }}>
              <ResultBlock label="Hook">{result.hook}</ResultBlock>
              <ResultBlock label="Angle">{result.angle}</ResultBlock>
              <ResultBlock label="Outline">
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  {result.outline?.map((o, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{o}</li>
                  ))}
                </ul>
              </ResultBlock>
              <ResultBlock label="Caption">
                {result.caption?.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </ResultBlock>
              <ResultBlock label="Tip">{result.tip}</ResultBlock>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentGenerator