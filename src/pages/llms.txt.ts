import type { APIRoute } from "astro";
import { pages, person, profiles } from "../data/profile";

// Markdown summary of the site for LLMs and agents, following https://llmstxt.org
export const GET: APIRoute = ({ site }) => {
    const url = (path: string) => new URL(path, site).href;

    const body = `# ${person.name}

> ${pages.home.description}

The best way to get in touch is a message on LinkedIn.

## Profiles

${Object.values(profiles)
    .map((p) => `- [${p.label}](${p.href}): ${p.description}`)
    .join("\n")}

## Pages

${Object.values(pages)
    .map((p) => `- [${p.title}](${url(p.path)}): ${p.description}`)
    .join("\n")}
`;

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
