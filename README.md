# Wobb Scout

Rebuild of the influencer discovery starter app — bug fixes, redesigned UI, Zustand for state, and a working shortlist feature with persistence.

Live: https://BiplabaKrSamal.github.io/wobb-scout/

## Running it

```
npm install
npm run dev
```

http://localhost:5173

```
npm test       # 34 tests
npm run build  # production build
```

## What I changed

The starter had a handful of real bugs mixed in with the working code, so most of the first pass was just finding and fixing those:

- `react-beautiful-dnd` in package.json doesn't support React 19 at all, so `npm install` failed immediately. Wasn't used anywhere in the code either, so I just removed it.
- The engagement rate on the profile page was off by 100x — it multiplied by 10,000 instead of 100 when converting the fraction to a percentage.
- Right next to that, the "Engagements" stat box was actually showing the engagement rate again under a different label. The real engagement count was never displayed.
- Search was case-sensitive on username but not on full name, so typing "Cristiano" with a capital C returned nothing.
- Follower counts were formatted three different ways in three different files, so the same profile could show a different number depending on which screen you were on.
- A few YouTube profiles have `username: null` in the sample data and only have a handle/custom_name instead, which broke routing to their detail page (`/profile/null`). Added a fallback chain for this.
- Missing `alt` text on images, and the external profile link was missing `rel="noopener noreferrer"`.
- A leftover `SearchBar.tsx` file that was never imported anywhere.

After that it was rebuilding everything else properly: replaced Context with Zustand (`src/store/listStore.ts`), wired up `persist` so the shortlist survives a refresh, finished the add-to-list feature with duplicate prevention and a slide-out drawer to view/remove selections, and redesigned the UI from scratch — dark theme, orange accent, card-based layout instead of the original table view.

For performance, search filtering is memoized and debounced so it's not re-filtering on every keystroke, and list selectors are scoped per-card so adding one profile doesn't re-render the whole grid.

## Stack additions

Added zustand, framer-motion (for the card/drawer animations), clsx, and vitest for testing. Removed react-beautiful-dnd for the reason above — wasn't actually being used and breaks the install on React 19.

## Notes

- Routes are now `/profile/:key` instead of `/profile/:username`, since key can fall back to handle or user_id for the null-username accounts.
- Only 6 of the 30 search results have a matching detail JSON file — clicking the others correctly shows a "not found" state, that's just how the sample data is.
- Used HashRouter instead of BrowserRouter since this is deployed on GitHub Pages, which doesn't support server-side route fallback.
