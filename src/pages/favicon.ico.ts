import type { APIRoute } from "astro";
import { renderIco } from "../lib/favicon";

// Fallback for browsers and tools that request /favicon.ico or cannot display SVG icons.
export const GET: APIRoute = async () =>
    new Response(new Uint8Array(await renderIco([16, 32, 48])), {
        headers: { "Content-Type": "image/x-icon" },
    });
