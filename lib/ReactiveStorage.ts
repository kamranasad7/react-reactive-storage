export abstract class ReactiveStorage {
  static #encrypted = true;

  static disableEncryption(value: boolean) {
    this.#encrypted = !value;
  }

  static isEncrypted() { return this.#encrypted; }
}

class Crypto {

  #key: CryptoKey | null;
  enc = new TextEncoder();
  dec = new TextDecoder();

  static #iv = new Uint8Array([-26, 100, -118, -90, -29, 56, 24, -66, -18, -107, -24, 109, -100, -34, -102, -72, -32]);
  static #keyType = { name: 'AES-GCM', length: 256 };
  static #algorithm = { name: 'AES-GCM', iv: this.#iv };
  static #wrappingKeyBuffer = new Uint8Array([81, -21, 31, -34, 109, 47, -19, 122, -31, -45, 127, -83, 10, -15, 126, -68, 99, -6, -87, 54, -24, 107, -44, 111, 124, -36, -102, 109, -108, 120, 63, 57]);
  static #wrappingKey: CryptoKey | null = null;

  private constructor(key: CryptoKey | null) {
    this.#key = key;
  }

  encrypt = async (str: string): Promise<string> => {
    if (crypto && this.#key) {
      const cr = await crypto.subtle.encrypt(Crypto.#algorithm, this.#key, this.enc.encode(str));
      return JSON.stringify(Array.from(new Int8Array(cr)));
    }
    else return str;
  }

  decrypt = async (str: string): Promise<string> => {
    if (crypto && this.#key) {
      try {
        const parsedBuffer = new Int8Array(JSON.parse(str));
        const dc = await crypto.subtle.decrypt(Crypto.#algorithm, this.#key, parsedBuffer.buffer);
        return this.dec.decode(dc);
      }
      catch (e) {
        return 'null';
      }
    }
    else return str;
  }

  static async generateKey(wrappingKey: CryptoKey) {
    const cryptoKey = await crypto.subtle.generateKey(this.#keyType, true, ['encrypt', 'decrypt']);
    const wrappedKey = await crypto.subtle.wrapKey('raw', cryptoKey, wrappingKey, this.#algorithm);
    localStorage.setItem('secure_reactive_storage', JSON.stringify(Array.from(new Int8Array(wrappedKey))));
    return cryptoKey;
  }

  static async createInstance() {
    if (crypto) {
      let cryptoKey: CryptoKey | null = null;
      this.#wrappingKey = await crypto.subtle.importKey('raw', this.#wrappingKeyBuffer, this.#algorithm.name, false, ['wrapKey', 'unwrapKey'])

      const currentKey = localStorage.getItem('secure_reactive_storage');
      if (currentKey) {
        try {
          const keyBuffer = new Int8Array(JSON.parse(currentKey))
          cryptoKey = await crypto.subtle.unwrapKey('raw', keyBuffer, this.#wrappingKey, this.#algorithm, this.#algorithm.name, true, ['encrypt', 'decrypt']);
        } catch {
          cryptoKey = await this.generateKey(this.#wrappingKey);
        }
      }
      else {
        cryptoKey = await this.generateKey(this.#wrappingKey);
      }

      return new Crypto(cryptoKey as CryptoKey);
    }
    else return new Crypto(null);
  }
}

const encryption = await Crypto.createInstance();
export { encryption };