import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../supabase';

const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [platform, setPlatform]     = useState(null);
  const [activePlat, setActivePlat] = useState('overall');
  const [loading, setLoading]       = useState(true);
  const location = useLocation();

  const reloadPlatform = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('platform')
      .eq('id', user.id)
      .single();

    if (data) {
      setPlatform(data.platform);
      setActivePlat(data.platform === 'both' ? 'overall' : data.platform);
    }
    setLoading(false);
  };

  useEffect(() => {
    reloadPlatform();
  }, []);

  useEffect(() => {
    // Step 1 — always fully reset everything first
    document.body.classList.remove('theme-yt', 'theme-ig');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-dark');

    // Step 2 — platform select page stays clean default
    if (location.pathname === '/select-platform') return;

    // Step 3 — apply background theme but always force blue accent
    if (activePlat === 'youtube') {
      document.body.classList.add('theme-yt');
    } else if (activePlat === 'instagram') {
      document.body.classList.add('theme-ig');
    }

    // Step 4 — always override accent back to blue regardless of platform
    document.documentElement.style.setProperty('--accent', '#818cf8');
    document.documentElement.style.setProperty('--accent-dark', '#554ee6');

  }, [activePlat, location.pathname]);

  return (
    <PlatformContext.Provider value={{ platform, setPlatform, activePlat, setActivePlat, reloadPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);