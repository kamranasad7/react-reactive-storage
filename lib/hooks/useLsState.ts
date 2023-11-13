import { useEffect, useState } from "react";
import SecureLS from "secure-ls";

const useLsState = <T>(key: string, defaultValue?: T): [T, (value: T) => void] => {

  const ls = new SecureLS();
  const [state, _setState] = useState<T>(ls.get(key) || null);

  const setState = (value: T): void => {
    ls.set(key, value);
    _setState(value);
  }

  const onStorageChange = (e: StorageEvent) => {
    if(e.key == key) { _setState(ls.get(key)); }
  }

  useEffect(() => {
    if(defaultValue && !ls.getAllKeys().includes(key)) { setState(defaultValue); }
    
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [])

  return [state, setState];
}

export { useLsState };
