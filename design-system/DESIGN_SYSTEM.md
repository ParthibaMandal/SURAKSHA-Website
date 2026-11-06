# SURAKSHA Flood Interface Design System

## Product and audience

SURAKSHA is a flood intelligence and decision-support project for the public, citizens, researchers, and authorised response operators. The interface should communicate uncertainty plainly and keep synthetic demonstrations visually distinct from verified observations and approved public alerts.

## Visual direction

- **Tone:** calm, scientific, public-service oriented, legible under pressure.
- **Canvas:** warm graphite (`#101213`) with raised charcoal panels.
- **Primary accent:** muted river teal (`#A9C9C2` / `#729D95`).
- **Warning:** restrained amber (`#D8B575`).
- **Critical:** muted red (`#D78379`).
- **Typography:** system sans-serif for interface text; monospace only for IDs, timestamps, and technical metadata.
- **Density:** moderate on public pages; higher in operations tables with clear groupings and adequate spacing.
- **Motion:** short state transitions only; honor `prefers-reduced-motion`.

## Semantic color use

| Meaning | Color | Rule |
|---|---|---|
| Page canvas | `#101213` | Main background |
| Surface | `#191E1F` | Cards and panels |
| Raised surface | `#232A2B` | Hover, selected, and nested surfaces |
| Main text | `#F1F2EE` | Headings and high-priority values |
| Supporting text | `#A3ADAB` | Body copy |
| Muted metadata | `#74807D` | Never use alone for essential instructions |
| River accent | `#A9C9C2` | Links, focus, primary action, river data |
| Caution | `#D8B575` | Stale, synthetic, pending, uncertain |
| Critical | `#D78379` | Critical condition and destructive/rejected state |
| Confirmed | `#9BBDA2` | Confirmed workflow state only; never forecast accuracy |

## Layout and interaction

- Use a fluid content width with 24–32px desktop gutters and 16–20px mobile gutters.
- Maintain visible keyboard focus, semantic landmarks, descriptive labels, and keyboard-operable controls.
- Target at least 44px touch areas for primary mobile controls.
- Pair risk colors with text labels and icons; color alone must not carry meaning.
- Use local demo labels on every synthetic data surface, not only in a distant footer.
- Show observation time, source, units, and freshness when actual observation data is available.
- Keep approval, alert publication, and emergency intake explicit and separate actions.

## Status labels

Use exact, plain-language distinctions such as **Synthetic scenario**, **Catalog metadata**, **Feed not verified**, **Backend unavailable**, **Draft — not published**, and **Human review required**. Never use “live”, “official”, “verified”, “safe”, or performance claims without evidence from the connected system and review by the project team.

## Existing prototype

`index.html` contains the current responsive flood-site visual implementation and page concepts. The earlier cyber-defense design specification and the rendered images in `designs/renders/` describe a different cybersecurity concept; do not use those screens as flood-product visual references. They are retained in the checkout for provenance until the repository owner decides whether to move or remove them. The flood prototype and this guide are the current product references.
