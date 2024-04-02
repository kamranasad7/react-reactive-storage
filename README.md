
<div align="center">
  <h3>Reactive LocalStorage for React</h3>
  <br />
</div>

Reactive LocalStorage for React that uses [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) underneath for encryption using AES-GCM. 


### Table of Contents
  - [Browser Support](#browser-support)
  - [Installation](#installation)
  - [API](#api)
  - [Usage](#usage)
  - [Encryption](#encryption)
    - [Disabling Encryption](#disabling-encryption)


### Browser Support
![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) |
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |


### Installation
```bash
$ pnpm i react-reactive-storage
```

### API
It provides an easy-to-use `useLsState` hook which is very similar to `useState` in react. An additional `key` parameter is used which defines key of object on local storage.

```ts
const [state, setState] = useLsState<T>(key: string, defaultValue?: T);
```

### Usage
The usage is similar to `useState` from React. 
```ts
import { useLsState } from "react-reactive-storage";

const [user, setUser] = useLsState<{name: string, age: number}>('user', {name: 'asad', age: 2});
```

The item in localstorage is fully reactive and is updated and reflected everywhere even when changed through multiple tabs, either by 'setState' method or any other means for example through `window.localstorage` or devtools. 
Note that if encryption is enabled (see below) and the encrypted data is changed by any other means than this library, it will corrupt the data and value will be read null. See below for more details. 


### Encryption
**Important**: Sensitive secrets should never be stored on client-side even in encrypted format. 

The encryption is done through Web Crypto API which is native in Javascript that provides cryptographic functions under CryptoSubtle interface. 

The library uses `AES_GCM` algorithm. First it generates a symmetric key, encrypts the key further using a wrapping key and stores it in local storage with name `secure_reactive_storage` to persist the key across reloads. 
If `secure_reactive_storage` already exists in local storage then it decrypts the key and use it for encryption/decryption. 
Whenever data is read/written, the data is encrypted/decrypted using this symmetric key. 
If `secure_reactive_storage` gets deleted or modified, the key will be failed to load on page load and a new key will be generated hence discarding all the data encrypted with that key.

##### Disabling Encryption
By default encryption is **enabled**. The encryption can be enabled/disabled through `ReactiveStorage` class using `disableEncryption` method. Call the function once in the entry point of your app (e.g. in `main.tsx` or `App.tsx` whatever you have). 

```ts
import { ReactiveStorage } from 'react-reactive-storage'

ReactiveStorage.disableEncryption(true);
```
