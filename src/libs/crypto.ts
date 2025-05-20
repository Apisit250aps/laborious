import { GameStore } from '@/stores/game'

export const AES_SECRET_KEY = 'q/mDsl8OqPf5Ny2gozBpwcr1PUufbu+SnXYcHDi52H1O2sn' // ใช้รหัสผ่านที่ปลอดภัยกว่านี้ในโปรดักชัน

async function getKeyFromPassword(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('save-salt'),
      iterations: 100_000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function encryptObject(obj: object): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await getKeyFromPassword(AES_SECRET_KEY)
  const encoded = new TextEncoder().encode(JSON.stringify(obj))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  )

  const savePackage = {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encrypted))
  }

  return btoa(JSON.stringify(savePackage)) // แปลงเป็น string เก็บใน localStorage ได้
}

export async function decryptObject(str: string): Promise<GameStore> {
  const { iv, ciphertext } = JSON.parse(atob(str))
  const key = await getKeyFromPassword(AES_SECRET_KEY)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    new Uint8Array(ciphertext)
  )
  const decoded = new TextDecoder().decode(decrypted)
  return JSON.parse(decoded)
}
