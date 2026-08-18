# Thinkoria Catalogue Image Language

## Purpose

Thinkoria images should make each field feel like a distinct doorway into a shared room of ideas. The image is not decoration alone; it should create an atmosphere for reading, signal the subject without illustrating it too literally, and remain quiet enough for titles and metadata to stay legible.

## Visual direction

Use tactile editorial still lifes, archival materials, instruments, diagrams without readable text, landscapes, objects of practice, and traces of human attention. Prefer warm ivory, paper beige, charcoal, muted vermilion, deep blue, mineral green, and restrained metallic accents. Images should feel observed rather than glossy: soft window light, visible grain, natural shadows, and modest contrast are preferred.

Avoid generic stock-photo gestures, smiling corporate portraits, neon technology clichés, loud gradients, oversaturated colors, visible watermarks, AI artifacts, illegible pseudo-text, and images that depict a category too literally. A Philosophy image may show a worn notebook or stone; it does not need to show a person thinking. A Technology image may show an old interface, circuit detail, or a tool in use; it does not need to show a person pointing at a laptop.

## Subject cues by field

| Field | Useful visual cues | Avoid |
|---|---|---|
| Philosophy | notebooks, stones, marginalia, empty chairs, measured still lifes | generic statues or clichéd “deep thought” portraits |
| Politics | public noticeboards, civic architecture, documents, streets, microphones | partisan symbols or campaign-like imagery |
| Literature | annotated pages, typewriters, books, ink, domestic reading spaces | book-cover mockups or readable invented text |
| Media | screens as objects, newspapers, cameras, broadcast equipment, layered frames | social-media logos and generic influencer scenes |
| Gaming | game boards, tokens, controllers, rule sheets, spatial arrangements | childish arcade imagery or copyrighted characters |
| Science | specimens, laboratory glass, field instruments, moss, stars, diagrams | fake equations, unsafe lab scenes, or medical claims |
| Technology | keyboards, circuits, interfaces, tools, cables, machine details | generic blue “AI brain” graphics |
| Religion | ritual objects, light, architecture, textiles, hands in quiet practice | claims about a specific faith unless editorially relevant |
| Linguistics | handwriting, alphabets as objects, sound equipment, maps, conversation spaces | fabricated readable language or stereotypes |
| Society | shared tables, streets, housing, public spaces, local objects | poverty voyeurism or anonymous crowds without purpose |
| History | documents, material culture, architecture, maps, preserved objects | invented historical scenes presented as documentary |
| Art & Design | material studies, tools, grids, studios, pigments, forms | generic gallery walls or trend-board collages |

## Composition and cropping

Prepare landscape images at approximately 3:2 or 4:3 so they work across category containers and article cards. Keep the primary subject away from the extreme edges because cards crop responsively. Leave calm areas where category labels or article metadata may sit. Do not place important faces, instruments, or objects under likely overlay gradients. Use `object-cover` for the catalogue and test both a desktop three-column card and a narrow mobile card before publishing.

## Accessibility

Every uploaded article image should receive a concise alt description in the Editorial Desk. Describe the meaningful subject, setting, and visual action in one sentence. Do not begin with “image of,” do not repeat the article title, and do not invent details that cannot be seen. If an image is purely decorative, leave the description empty so assistive technology can skip it.

## Operational fallback

A missing or failed image must never leave a broken card. Each article should inherit its category image when no lead image exists, and the catalogue should provide a stable category fallback when a stored asset fails. Editors should replace failed assets with a verified storage-backed image before publication and confirm the result in both the catalogue and article page.

## Editorial checklist

Before publishing, confirm that the image is relevant to the paper’s field, fits the Thinkoria palette, contains no accidental text or watermark, crops safely at desktop and mobile widths, has a useful alt description, and loads from a project storage URL. If the image feels louder than the writing, choose a quieter image.

## File naming

Use descriptive names such as `philosophy-marginalia-01.jpg` or `science-field-specimen-02.webp`. Avoid names such as `final-final.png`, generated IDs in visible copy, and category names that do not match the actual subject.
