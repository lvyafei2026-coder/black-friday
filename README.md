# Black Friday Countdown

Live countdown to Black Friday — plus exact dates for every future year, deal timing and FAQ.

## Features

- Live second-by-second countdown to Black Friday (Friday after the 4th Thursday of November)
- Auto-rolls to the next year once the BF weekend (through Cyber Monday) is over — no manual date edits ever
- "LIVE" state during the BF weekend with green banner
- Future dates table 2026–2030 (Thanksgiving / Black Friday / Cyber Monday), current year highlighted by JS
- Featured-snippet answer box synced to the target year (for Google / AI citations)
- FAQ section with JSON-LD (FAQPage) + WebApplication structured data
- Long-tail sections: "How Many Days Until Black Friday?" (live) + "When Is Cyber Monday 2026?"
- Free embeddable countdown widget (`/embed.html`, iframe one-liner) — natural backlink source
- llms.txt for AI crawler discovery
- Dark theme (black + amber) — differentiated from the rest of the fleet

## Structure

```
index.html        # single-page site (en)
css/style.css     # site styles (dark) + shared toolara.dev fleet footer
js/countdown.js   # countdown / year roll / table highlight / FAQ / days-answer
embed.html        # embeddable widget + usage page (noindex; self-detects iframe mode)
privacy.html      # privacy policy (AdSense-ready)
llms.txt          # AI crawler guide
sitemap.xml
```

## Local development

```bash
python -m http.server 8123
```

Then open http://localhost:8123

## Deploy

Push to GitHub → Cloudflare Workers static build (repo name = worker name = folder name).
Fleet wiring in tool-proxy:

- `DOMAIN_MAP`: `'blackfriday.toolara.dev': { binding: 'SITE_BLACK_FRIDAY', service: 'black-friday' }`
- `wrangler.toml` `[[services]]`: `binding = "SITE_BLACK_FRIDAY"`, `service = "black-friday"`
- `SITE_PATHS`: `'blackfriday.toolara.dev': ["/"]`

## Ads

AdSense slots are prepared as commented-out `<ins>` blocks in index.html (header leaderboard + in-article + below content). Uncomment and fill `ca-pub-XXXX` / slot IDs when approved.

## License

MIT
