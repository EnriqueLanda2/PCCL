'use client';

/* Nombre de la sesión: cifrado en localStorage, en claro en una variable global.
 *
 * El login responde con `user.fullName`; ese valor se guarda cifrado en
 * localStorage (sobrevive a recargas y a cambios de pantalla) y se descifra una
 * sola vez a `nombreUsuario`, la variable global que consulta el resto de la
 * app vía `getUserName()`.
 *
 * Ojo con el cifrado: NO es bcrypt. bcrypt es un hash de un solo sentido —
 * sirve para comparar contraseñas, no para recuperar el texto original— y aquí
 * el nombre tiene que volver legible para pintarlo. Se usa un XOR reversible
 * sobre la llave de abajo, que además es síncrono: `crypto.subtle` es async y
 * obligaría a que `getUserName()` devolviera una promesa.
 *
 * Y que quede claro el alcance: la llave viaja en el bundle del navegador, así
 * que cualquiera con las devtools puede revertirlo. Esto evita que el nombre se
 * lea a simple vista en localStorage; no es una medida de seguridad.
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pccl_name';
const CIPHER_KEY  = 'pccl.session.name.v1';

/** Evento que ya usan Sidebar/Appbar para resincronizar los datos de sesión. */
const SYNC_EVENT = 'pccl_user_updated';

/* Variable global con el nombre YA descifrado. `null` = todavía no se hidrata
   desde localStorage; '' = se hidrató y no había nada guardado. */
let nombreUsuario: string | null = null;

/* ── Cifrado ─────────────────────────────────────────────── */

/* Se trabaja sobre bytes UTF-8 y no sobre `charCodeAt` directo: los nombres
   llevan acentos y ñ, y un XOR sobre code points de 16 bits puede producir
   surrogates sueltos que `btoa` rechaza. */
function xorBytes(bytes: Uint8Array): Uint8Array {
  const key = new TextEncoder().encode(CIPHER_KEY);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) {
    out[i] = bytes[i] ^ key[i % key.length];
  }
  return out;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Cifra un nombre a la cadena que se guarda en localStorage. */
export function encryptName(plain: string): string {
  return toBase64(xorBytes(new TextEncoder().encode(plain)));
}

/** Descifra lo que devuelve `encryptName`. Cadena vacía si el dato está corrupto. */
export function decryptName(token: string): string {
  try {
    return new TextDecoder().decode(xorBytes(fromBase64(token)));
  } catch {
    return '';
  }
}

/* ── API de sesión ───────────────────────────────────────── */

/**
 * Guarda el `fullName` del login cifrado en localStorage y refresca la variable
 * global. Avisa por `pccl_user_updated` para que la UI montada se entere.
 */
export function saveUserName(fullName: string | null | undefined): void {
  const name = (fullName ?? '').trim();
  nombreUsuario = name;
  if (typeof window === 'undefined') return;
  try {
    if (name) localStorage.setItem(STORAGE_KEY, encryptName(name));
    else localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch {
    // localStorage bloqueado (modo privado, cuota): queda solo en memoria
  }
}

/**
 * Devuelve el nombre en claro desde la variable global, hidratándola de
 * localStorage la primera vez. Es la función a llamar cada vez que se necesite
 * el nombre. Nunca durante el render en servidor: ahí devuelve ''.
 */
export function getUserName(): string {
  if (nombreUsuario !== null) return nombreUsuario;
  if (typeof window === 'undefined') return '';
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    nombreUsuario = token ? decryptName(token) : '';
  } catch {
    nombreUsuario = '';
  }
  return nombreUsuario;
}

/** Solo el primer nombre, que es lo que pide el saludo del panel. */
export function getUserFirstName(): string {
  return getUserName().split(' ')[0] ?? '';
}

/** Borra el nombre guardado y vacía la variable global (logout). */
export function clearUserName(): void {
  nombreUsuario = '';
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch {
    // nada que limpiar si el storage no está disponible
  }
}

/* ── Hook ────────────────────────────────────────────────── */

/**
 * Versión reactiva de `getUserName()`. Arranca en '' en ambos lados y lee el
 * storage solo dentro del efecto: leerlo en el valor inicial de `useState`
 * rompería la hidratación, porque en el servidor no existe localStorage.
 */
export function useUserName(): string {
  const [name, setName] = useState('');

  useEffect(() => {
    const sync = () => setName(getUserName());
    sync();

    /* `storage` cubre el caso de otra pestaña; `pccl_user_updated`, el de esta
       misma (el evento nativo no se dispara en la pestaña que escribe). */
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      nombreUsuario = null;
      sync();
    };

    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return name;
}
