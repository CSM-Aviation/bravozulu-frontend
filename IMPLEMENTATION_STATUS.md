# Homepage Polish — Implementation Status

_Last updated: 2026-07-30. **COMPLETE** — all work finished on branch `new_guide` (uncommitted). Higgsfield credits were topped up and the remaining 4 photos were generated + placed._

Full original plan: `~/.claude/plans/logo-in-banner-should-partitioned-aurora.md`

## Done (code + asset changes on branch `new_guide`, uncommitted)

1. **Banner logo enlarged** — `src/app/components/NavigationBar/index.tsx` line 164: logo container now `h-14 w-[104px] md:h-[72px] md:w-[133px]` (~28% larger, aspect ratio preserved).
2. **SERVICES header enlarged** — `src/app/components/ServicesSection/index.tsx` line 29: label now `text-4xl ... md:text-6xl tracking-[0.08em]`.
3. **CONTACT header enlarged** — `src/app/components/ContactUsSection/ContactUsSection.tsx` line 96: label now `text-4xl ... md:text-5xl tracking-[0.08em]`.
4. **Email typo fixed** (`service@` → `services@mybravozulu.com`, href + visible text in each):
   - `src/app/components/ContactUsSection/ContactUsSection.tsx` (~line 139)
   - `src/app/components/Footer.tsx` (~line 134)
   - `src/app/components/Contact.tsx` (~line 74, unrendered legacy component)
5. **Originals backed up** — the 5 overcast photos remain in `public/images/_originals/`.
6. **All 5 photos re-lit to bright sunny** and placed at their original paths, matching original format + dimensions (same vehicles/compositions, dry ground, blue sky):
   - `public/images/hero/hero-aircraft.jpg` (jet) — 896×1200 JPEG
   - `public/images/hero/hero-vessel.jpg` (boat marina) — 1024×1024 JPEG
   - `public/images/hero/hero-auto.jpg` (silver car) — 1200×896 JPEG
   - `public/images/services/Card3.webp` (superyacht) — 2676×3345 WebP
   - `public/images/services/Card4.jpg` (RV) — 928×1152 JPEG
   - `Card1.webp` / `Card2.webp` intentionally untouched (already looked good).
7. **Alt text updated** — `src/app/components/HeroSplit/index.tsx`: removed "wet tarmac"/"wet asphalt" wording (aircraft line 78 → "sunny ramp", auto line 98 → "bright sunlight").

## Generation details (for reference)

- Model: Higgsfield `nano_banana_pro` (resolves to `nano_banana_2` backend), resolution 2k, ~2 credits/image. 4 images cost 8 credits (balance 10 → 2).
- The old media_ids from the paused session had expired ("Media input not found"); source images were re-uploaded fresh from `public/images/_originals/`.
- Card3/Card4 were generated at 3:4 but the originals are 4:5, so they were center-cropped to 4:5 before resizing (no distortion). `sips` cannot encode WebP on this machine — Card3.webp was written with the project's bundled `sharp` (`node -e ... sharp().webp()`), quality 82.
- Prompt pattern: "Change the weather from overcast rainy dusk to bright sunny midday, keep the exact same vehicle/composition/background, dry ground, freshly-detailed glossy paint with crisp sun highlights, photorealistic, natural white balance."

## Verification done

- `npm run lint` — passes (only pre-existing warnings in unrelated files).
- `npm run dev` (port 3117) — homepage returns HTTP 200; all 5 swapped images serve HTTP 200 at correct byte sizes; `services@mybravozulu.com` and the hero image path present in rendered HTML.

## Remaining / optional

- None functionally required. Changes are still **uncommitted** on `new_guide` — commit when ready.
