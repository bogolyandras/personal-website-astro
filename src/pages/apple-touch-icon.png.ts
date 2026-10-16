import type { APIRoute } from "astro";
import { renderPng } from "../lib/favicon";

// iOS home-screen icon. iOS fills transparent areas with black, so flatten onto the icon's green.
export const GET: APIRoute = async () =>
    new Response(new Uint8Array(await renderPng(180, "#8dd35f")), {
        headers: { "Content-Type": "image/png" },
    });
