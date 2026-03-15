import { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../supabase'

const PlatformContext = createContext()

export function PlatformProvider({ children }) {
  const [platform, setPlatform] = useState(null)
  const [activePlat, setActivePlat] = useState('youtube') // for 'both' users

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('platform').eq('id', user.id).single()
        if (data) {
          setPlatform(data.platform)
          setActivePlat(data.platform === 'both' ? 'youtube' : data.platform)
        }
      }
    }
    fetchProfile()
  }, [])

  return (
    <PlatformContext.Provider value={{ platform, activePlat, setActivePlat }}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform() {
  return useContext(PlatformContext)
}