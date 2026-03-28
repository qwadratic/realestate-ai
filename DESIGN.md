# Design System — Property Intelligence Agent

Extracted from Stitch "Vienna Heritage" design system (assets/fc76b196765c4adeb4c00b7b2e62c873).
Source of truth: Stitch project "Property Intelligence Agent v2" (projects/14200655937375545784).

## Product Context
- **What this is:** AI-powered property search + signal intelligence platform
- **Who it's for:** Austrian Immobilienmakler (real estate agents), 1-15 people
- **Space:** Austrian PropTech. Competitors: Propelos, Estate Guide, willhaben
- **Positioning:** "Propelos is AI for browsing. We're AI for advising."

## Creative North Star: "The Digital Curator"
High-end editorial real estate archive. The UI is a quiet, sophisticated gallery for property intelligence. Move the user from "searching" to "collecting." Intentional asymmetry + tonal depth.

## Aesthetic Direction
- **Direction:** Editorial/Magazine meets Industrial/Utilitarian
- **Decoration:** Intentional. Tonal layering, no decorative blobs
- **Mood:** Luxury architectural digest meets data intelligence
- **No-Line Rule:** 1px borders prohibited for sectioning. Use background color shifts only.

## Typography (from Stitch)
- **Display/Headlines:** Newsreader (serif, editorial authority)
- **Body/Navigation:** Manrope (clean sans, modern legibility)
- **Data/Labels/Numbers:** Space Grotesk (monospace feel, tabular-nums, technical precision)
- **Scale:** display-lg 3.5rem, headline-lg, headline-md, body-md 0.875rem, label-md, label-sm

## Color (from Stitch)
- **Mode:** Light (warm organic). Dark variant for agent dashboard if needed.
- **Background:** #FAF9F6 (warm off-white canvas)
- **Surface containers:** #F4F3F1 (low) → #EFEEEB (mid) → #E9E8E5 (high) → #FFFFFF (lowest/cards)
- **Primary:** #894D0D / #B87333 (copper)
- **Primary container:** #A76526
- **On primary:** #FFFFFF
- **On surface:** #1A1C1A (never pure black)
- **On surface variant:** #524439 (muted)
- **Outline:** #857467
- **Outline variant:** #D8C3B4 (ghost borders at 15% opacity only)
- **Error:** #BA1A1A
- **Tertiary:** #006576 (teal, used sparingly)
- **Signal system:** Green #4CAF7D, Amber #D4A843, Red #D94F4F

## Spacing
- **Scale:** 3 (Stitch spacingScale)
- **Editorial breathing:** spacing-16 and spacing-24 between major sections
- **Data density:** spacing-3 between spec items

## Layout
- **Approach:** Editorial with intentional asymmetry
- **Cards:** White (#FFFFFF) on warm background (#FAF9F6), no borders
- **Border radius:** 4px max (ROUND_FOUR)
- **Grid:** Asymmetric where possible. 65/35 splits for image/data.

## Elevation & Depth
- **Method:** Tonal layering, not shadows
- **Ambient shadows (rare):** 24px blur, -4px spread, on-surface at 6% opacity
- **Ghost border (accessibility only):** outline-variant at 15% opacity
- **Glass (overlays):** surface at 80% opacity + backdrop-blur 12px

## Motion
- **Approach:** Minimal-functional
- **Duration:** 150ms state changes
- **Easing:** ease-out

## Key Components
- **Property Intelligence Cards:** White surface, Newsreader title, Manrope address, Space Grotesk data, copper AI-feature pills, signal badges, no divider lines
- **Signal badges:** Small colored chips (green/amber/red) with sharp corners
- **Quick question badges:** Pill buttons, surface background, copper on hover
- **Voice FAB:** Copper circle, microphone icon, bottom-right
- **Validation flags:** Strikethrough + red replacement text

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-28 | Vienna Heritage design system from Stitch | User selected over 5 alternatives. Editorial warmth + copper authority. |
| 2026-03-28 | No blue anywhere | Every competitor uses blue. Copper differentiates. |
| 2026-03-28 | No-Line Rule | Borders prohibited. Tonal depth defines structure. |
| 2026-03-28 | Light mode primary | Vienna Heritage is light. Dark variant available for agent focus mode. |
| 2026-03-28 | Newsreader + Manrope + Space Grotesk | Stitch-selected. Serif authority + sans legibility + mono precision. |
