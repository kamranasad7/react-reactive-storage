# Changelog

## [1.0.5] - 2024-04-18
- Removed top-level await to support more browsers.
- A bug that made `useLsState` function undefined sometimes due to top-level await fixed.

## [1.0.4] - 2024-03-25
 
This version focuses on replacing [secure-ls](https://github.com/softvar/secure-ls) which uses crypto-js <4.2.0 PBKDF2 (1.3M times weaker than current standard).

- secure-ls is replaced by native Web Crypto API which is built-in Javscript module.
- updated devDependencies to latest versions.
- library is now built as ES module only. 
 
## [1.0.3] - 2023-11-14
 
- useLsState React hook for encrypted-reactive local storage.
- [secure-ls](https://github.com/softvar/secure-ls) used for encryption.
- First Release.
