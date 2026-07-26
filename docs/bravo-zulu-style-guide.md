# Bravo Zulu — Brand Foundations

**Version 1.0** · Prepared by Hundred10 · June 2026

> **Electric precision, cool restraint.**
> The Bravo Zulu system is built directly from the logo: one electric blue that carries every accent, supported by a family of cool greys that do the structural work. Blue is the signal. Grey is the surface.

---

## 01 · Color

Three colors come straight from the logo and are marked **Core**. The rest extend them — a deep blue for interaction states, a pale glaze for highlights, and neutrals tuned cool to match.

### Palette

| Name | Hex | Role | Origin |
|---|---|---|---|
| **Electric** | `#00A8EA` | The brand color. Accents, CTAs, links, key highlights — never large text blocks. | Core · Logo |
| **Current** | `#0077A3` | Deep blue for hover states, visited links, and anywhere Electric needs more weight. | Extended |
| **Glaze** | `#E3F5FC` | Pale blue wash for callouts, highlighted rows, and selected states. | Extended |
| **Jet** | `#1F2326` | Cool near-black for headlines and dark surfaces. Use instead of pure black. | Extended |
| **Slate** | `#5F6062` | Default body text and secondary content on light backgrounds. | Core · Logo |
| **Silver** | `#C0C0C0` | Borders, dividers, disabled states, and quiet UI chrome. | Core · Logo |
| **Mist** | `#F3F5F6` | Cool light background for alternating sections and cards. | Extended |
| **White** | `#FFFFFF` | Primary background. The brand breathes on white. | Extended |

### Proportion

| Band | Share |
|---|---|
| White / Mist | 60% |
| Greys | 30% |
| Electric | 10% |

Electric blue works because it's scarce. Hold it to roughly 10% of any layout — the moment everything is blue, nothing is.

---

## 02 · Typography

Three faces, three jobs. Manrope ExtraBold leads the system — geometric, slightly squared letterforms with real weight behind them; Roboto carries body copy with its workhorse neutrality; DM Mono handles labels, specs, and data.

### Type system

**Manrope** — Display & headings
`800 ExtraBold · 700 Bold · tracking −0.015 to −0.025em`

**Roboto** — Body & UI copy
`300 Light · 400 Regular · 500 Medium`
Body copy sets in Roboto Regular at 16px with a 1.6 line height, colored Slate on light backgrounds. It stays readable at small sizes, in long paragraphs, and in dense interfaces — which is exactly why it carries everything the headlines don't.

**DM Mono** — Labels, specs & data
`400 Regular · 500 Medium`
Example usage: `EXTERIOR — WASH · CLAY · POLISH · SEAL` / `TAIL Nº N428BZ · HANGAR 3 · 06:00`

### Scale

| Token | Specification |
|---|---|
| `display` | Manrope 800 · 44–58px · −0.025em |
| `h1` | Manrope 800 · 32px · −0.025em |
| `h2` | Manrope 700 · 24px · −0.02em |
| `h3` | Manrope 700 · 18px · −0.015em |
| `body` | Roboto 400 · 16px / 1.6 |
| `small` | Roboto 400 · 13.5px |
| `label` | DM Mono 500 · 12px · +0.14em |

---

## 03 · In use

A few quick proofs of how the palette behaves in real elements — light surfaces by default, Jet for the occasional dark moment.

**Buttons** — primary ("Request a quote") and secondary ("View services").

**Links & callouts** — Inline links set in Current with an Electric underline so they read clearly without shouting. Glaze plus a 3px Electric rule makes the standard callout pattern.

**On dark** — Electric stays electric on Jet. White headlines, Silver body, blue reserved for the single word or element that matters.

### Rules

**Blue is a signal, not a surface.**
Use Electric for the one thing you want the eye to find — a CTA, a key stat, a rule line. Never for body text or full backgrounds at scale.

**Greys are warm-free.**
Every neutral in the system is cool-toned. Don't introduce beige, cream, or warm greys — they fight the blue.

**Jet over black.**
Pure `#000` is too harsh against the palette. Jet keeps dark surfaces and headlines in the same cool family.

---

## 04 · Tokens

Paste this into any stylesheet to work in the system. Fonts load from Google Fonts.

```css
/* Bravo Zulu — brand tokens v1.0 */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Roboto:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

:root {
  /* core — from logo */
  --bz-electric: #00A8EA;
  --bz-slate:    #5F6062;
  --bz-silver:   #C0C0C0;

  /* extended */
  --bz-current:  #0077A3;
  --bz-glaze:    #E3F5FC;
  --bz-jet:      #1F2326;
  --bz-mist:     #F3F5F6;
  --bz-white:    #FFFFFF;

  /* type */
  --font-display: 'Manrope', Arial, sans-serif;
  --font-body:    'Roboto', Arial, sans-serif;
  --font-mono:    'DM Mono', 'Courier New', monospace;
}
```
