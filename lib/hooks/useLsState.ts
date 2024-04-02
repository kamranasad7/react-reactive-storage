import { useEffect, useState } from "react";
import { ReactiveStorage, encryption } from "../ReactiveStorage";

const get = async <T>(key: string): Promise<T | null> => {
  const value = localStorage.getItem(key);
  if (value === null) { return value; }

  if (ReactiveStorage.isEncrypted()) {
    return JSON.parse(await encryption.decrypt(value)) as T;
  }
  else return JSON.parse(value) as T;
}

const set = async <T>(key: string, value: T | null): Promise<void> => {
  if (ReactiveStorage.isEncrypted()) {
    localStorage.setItem(key, await encryption.encrypt(JSON.stringify(value)))
  }
  else localStorage.setItem(key, JSON.stringify(value));
}

const useLsState = <T>(key: string, defaultValue?: T): [T | null, (value: T) => void] => {

  const [state, _setState] = useState<T | null>(defaultValue ?? null);

  const setState = (value: T | null): void => {
    set(key, value);
    _setState(value);
  }

  const onStorageChange = async (e: StorageEvent) => {
    if(e.key == key) { _setState(await get(key)); }
  }

  useEffect(() => {
    const getInitialValue = async () => {
      const initialValue = await get<T>(key);
      setState(initialValue ?? defaultValue ?? null);
    };

    getInitialValue();
    
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [state, setState];
}

export { useLsState };
