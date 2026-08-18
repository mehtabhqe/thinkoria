# Catalogue UX research notes

## British Online Archives
Source: https://britishonlinearchives.com/posts/category/news/918/our-tags-and-search-filters-make-research-easier

The archive emphasizes comprehensive tagging and targeted research. Its reusable filter vocabulary includes archive, country, date range, material type, reference, region, script, sub-theme, and time period. A key pattern worth adapting is a prominent keyword search paired with visible facets, rather than search as the only discovery mechanism. The filters are collection-aware, meaning the taxonomy can stay editorial rather than becoming a generic list of tags.

## Cooper Hewitt collections research
Source: https://mw2015.museumsandtheweb.com/paper/reconsidering-searching-and-browsing-on-the-cooper-hewitts-collections-website/index.html

The research distinguishes purposeful search from open-ended browsing and recommends exposing sorting and faceting controls. A single database can support multiple interfaces: search should prioritize accurate retrieval while browse should expose richer records and related content. For The Common Index, this suggests a catalogue toolbar with search, category facets, sort choices, result count, and clear states, while keeping the article cards visually rich enough for browsing.

## Decisions for The Common Index

The refined catalogue will combine a full-width keyword search bar with category chips, a sort select, result count, and a clear filters action. Search will match article title, author, field, and excerpt. Sort options will include newest, most viewed, and title. The UI will include a no-results message and preserve the existing image-led cards, metadata, view counts, and editorial rhythm.

## Rendered interaction test

The live catalogue route rendered the search bar, filter toggle, result count, image-led cards, and footer navigation. Searching for “interface” reduced the catalogue to one matching paper, updated the result count to 01, displayed the matching field summary, and exposed a clear-all action. This confirms the core search interaction is working in the rendered preview.

The rendered interaction test also confirmed that the Filters control opens a facet drawer with all subject categories and a sort select. Switching the sort select to “Most viewed” updates the visible control state without breaking the active search result.
