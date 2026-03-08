/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  config.js — YOUR PERSONAL REPO MANAGER CONFIGURATION       ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  This is the only file you need to edit.                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const CONFIG = {

  /* ── GitHub username ──────────────────────────────────────────
     Your GitHub handle. This is the only required field.
  ─────────────────────────────────────────────────────────────── */
  github: "bishal216",

  /* ── Cache duration ───────────────────────────────────────────
     How long (in minutes) to cache the GitHub API response.
     GitHub allows 60 unauthenticated requests/hour per IP,
     so anything ≥ 60 is safe for a public portfolio.
  ─────────────────────────────────────────────────────────────── */
  cacheDuration: 60, // minutes

  /* ── Pinned repos ─────────────────────────────────────────────
     List repo names you want pinned (floated to top, highlighted).
     These override whatever GitHub says. Case-sensitive.
  ─────────────────────────────────────────────────────────────── */
  pinned: [
    // "repo-name"

  ],

  /* ── Excluded repos ───────────────────────────────────────────
     Repo names to hide entirely (forks, archived junk, etc.)
     Leave empty to show all public repos.
  ─────────────────────────────────────────────────────────────── */
  exclude: [
    // "old-project",
    // "some-fork"
    "Renderer",
    "Swift",
    "TheGreatBishwash"
  ],

  /* ── Cloudflare Worker URL ────────────────────────────────────
     Your deployed Worker acts as a proxy between the contact form
     and Discord — the real webhook URL never leaves the Worker.

     Steps:
       1. Deploy worker.js to Cloudflare Workers
       2. Add DISCORD_WEBHOOK as an encrypted env secret there
       3. Paste the Worker's public URL below

     Leave empty string "" to run in simulation mode.
     See worker.js for full deployment instructions.
  ─────────────────────────────────────────────────────────────── */
  discord_webhook: "https://portfolio2discord.bis3hal.workers.dev",  // e.g. "https://contact-proxy.yourname.workers.dev"

  /* ── GitHub API token ─────────────────────────────────────────
     Raises the rate limit from 60 → 5000 requests/hour.
     Only needed if you have 100+ repos or very high traffic.
     Leave empty string "" to use unauthenticated requests.
     
     ⚠️  If you add a token, keep this repo PRIVATE or use
         a fine-grained token with read-only public repo scope.
  ─────────────────────────────────────────────────────────────── */
  token: "",

  /* ── Display options ──────────────────────────────────────────
     Fine-tune what appears in the UI.
  ─────────────────────────────────────────────────────────────── */
  display: {
    showForks:    false,  // show repos that are forks of other repos
    showArchived: false,  // show archived repos
    maxRepos:     50,     // max repos to fetch (GitHub API max per page: 100)
    sortBy:       "name" // "updated" | "stars" | "name"
  }

};