
import { Magic } from '@magic-sdk/admin';

let magicAdmin;

if (!magicAdmin) {
  magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);
}

export default magicAdmin;