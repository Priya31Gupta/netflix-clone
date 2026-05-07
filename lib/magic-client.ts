import { Magic } from "magic-sdk";
let magic: Magic | null = null;

if (typeof window !== "undefined") {
  magic = new Magic(
    process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY!
  );
}

export { magic };
