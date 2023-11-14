## Reactive LocalStorage for React

Reactive LocalStorage for React that uses [secure-ls](https://github.com/softvar/secure-ls) underneath for encryption. 

### Installation
```
   $ pnpm i reactive-localstorage
```

### API
It provides an easy-to-use `useLsState` hook which is very similar to `useState` in react. An additional `key` parameter is used which defines key of object on local storage.

```const [state, setState] = useLsState<T>(key: string, defaultValue?: T);```

### Usage
The usage is similar to `useState` from React with an  
```
   import { useLsState } from "react-reactive-storage";

   const [user, setUser] = useLsState<{name: string, age: number}>('user', {name: 'asad', age: 2});
```
The item in localstorage is fully reactive and is updated and reflected everywhere even when changed through multiple tabs, either by 'setState' method or any other means for example through `window.localstorage` or devtools. 