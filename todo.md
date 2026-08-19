# Expansion checklist

## Full-stack platform pass

- [x] Upgrade the static project to full-stack with backend, database, storage, and user management.
- [x] Define article, category, submission, club event, forum thread, and membership data models.
- [x] Implement sign-in, sign-up, sign-out, and protected routes.
- [x] Build the admin panel for creating, editing, publishing, and unpublishing articles.
- [x] Connect catalogue data to the database and make view counts persistent.
- [x] Connect paper submission, club membership, and forum participation flows.
- [x] Test permissions, empty states, and responsive admin/member views.


## Category-first catalogue pass

- [x] Replace the all-articles first view with subject containers.
- [x] Add broad category containers including philosophy, politics, literature, media, gaming, science, technology, religion, and linguistics.
- [x] Make each category container open a scoped category article view.
- [x] Preserve the catalogue search bar and scope results to the selected category.
- [x] Add back-to-categories navigation and category result states.
- [x] Verify category navigation and responsive layouts, then save a checkpoint.

## Catalogue refinement pass

- [x] Research editorial archive and publication catalogue interaction patterns.
- [x] Add a catalogue search bar with live matching.
- [x] Add category filtering and sort controls.
- [x] Add result count, clear state, and no-results state.
- [x] Refine article cards and discovery hierarchy.
- [x] Verify catalogue interactions on desktop and mobile, then save a checkpoint.

## Frontend completion pass

- [x] Write and add a complete About section covering vision, purpose, editorial promise, and community.
- [x] Add necessary supporting sections and cross-links so the platform feels complete.
- [x] Generate distinct lead images for each catalogue article.
- [x] Redesign catalogue articles into aesthetic image-led container cards.
- [x] Add consistent image metadata, view counts, and category labels to catalogue cards.
- [x] Review responsive behavior and save a new stable checkpoint.

- [x] Refactor the home page so the catalogue grid is replaced by a newly published articles section.
- [x] Add a top-level link/button from home to the dedicated catalogue page.
- [x] Add live view count UI to each article card and article list item.
- [x] Add dedicated catalogue page with category browsing.
- [x] Add Nagaon Debate & Discussion Club page with club sign-in/create-account UI and venue/date update area.
- [x] Add forum page with account-required gate and discussion preview UI.
- [x] Update navigation and routes across all pages.
- [x] Verify responsive layouts, links, and front-end-only auth placeholder interactions.
- [x] Run type check/build, capture previews, and save a checkpoint.

## Required gap closure before delivery

- [x] Wire a real submission form to the submission API and add manuscript/image upload support through storage.
- [x] Replace hardcoded forum previews with persisted thread data and refresh after thread creation.
- [x] Add explicit responsive and state validation for admin, club, forum, and submission flows.
- [x] Expand Vitest coverage for submission validation and forum/member permissions.

## Final validation corrections

- [x] Remove leftover hardcoded forum seed data and show accurate persisted discussion metadata.
- [x] Verify club, forum, admin, and submission unauthorized, success, empty, error, and responsive states explicitly.
- [x] Add Vitest coverage for club membership permission behavior and successful submission/forum contracts.

## Final evidence completion

- [x] Verify /club on mobile and explicitly document unauthorized, success, empty, and error states across club, forum, admin, and submit.
- [x] Add successful submission creation and authenticated forum thread creation contract tests, or document the database limitation if those paths require live seeded data.

## End-to-end UI state evidence

- [x] Exercise the submission page success state and client validation/error state in-browser.
- [x] Exercise the club membership success/error state and account gate in-browser; authenticated success requires a real member session.
- [x] Exercise the forum account gate and empty state in-browser; authenticated success is covered by isolated contract tests because no member session is available.
- [x] Exercise the anonymous admin gate in-browser; authenticated editor validation requires a real admin session and is covered by permission/type tests.
- [x] Record the state evidence and run a final checkpoint validation.

## Launch-readiness audit

- [x] Audit editorial desk create/edit/publish/unpublish flows and identify launch blockers.
- [x] Audit public routes, tRPC requests, database-backed catalogue, submissions, club, forum, and authentication states.
- [x] Replace category imagery with a complete, subject-specific image set and verify all asset paths.
- [x] Fix confirmed runtime, validation, navigation, data, accessibility, and responsive bugs.
- [x] Add regression tests for launch-critical publishing and public flows.
- [x] Run final diagnostics, visual verification, and save a launch-ready checkpoint.

- [x] Make the forum fully working with persisted threads, authenticated posting, reliable refresh, and complete loading/empty/error states.
- [x] Add regression coverage for forum thread listing, creation, validation, and permission behavior.

- [x] Add persisted forum replies so members can discuss inside a thread, not only create top-level topics.
- [x] Add loading/error handling for the admin article list so in-flight queries never look like an empty desk.

## Bug-fix pass: submission and editorial image validation

- [x] Diagnose and fix PDF manuscript upload failure in the contributor submission flow.
- [x] Fix editorial desk new-article `imageUrl` invalid URL validation when the image field is empty or optional.
- [x] Add regression tests for empty image URL article creation and PDF upload validation/encoding.
- [x] Retest submit and editorial desk flows, then save a bug-fix checkpoint.

## Editorial review queue and desk resilience

- [x] Diagnose intermittent admin article-record loading failures and preserve a retryable error state.
- [x] Add admin access to submitted papers with review status and manuscript links.
- [x] Add submission detail/review actions so editors can approve, reject, or convert a submission into a draft article.
- [x] Add a clear desk location and status flow for submitted papers awaiting review.
- [x] Test submission-to-review-to-publish behavior and save a checkpoint.

- [x] Add explicit Approve and Reject controls to the Editorial Desk review queue, wired to submission status updates with feedback.
- [x] Perform a browser-level submission review, draft conversion, and publish verification, then save a final checkpoint.
### End of file

## PDF persistence fix

- [x] Preserve the submitted manuscript URL when a submission is approved or converted into an article draft.
- [x] Keep the manuscript PDF accessible from the Editorial Desk after status changes and publication.
- [x] Add regression coverage for manuscript URL persistence and verify the PDF link in the browser, then save a checkpoint.

## Club administration and weekly debates

- [x] Add an Editorial Desk club area showing joined members and membership status.
- [x] Add no-code CRUD controls for weekly debate topic, date/time, venue, description, and registration state.
- [x] Add debate applications with selectable roles including debator, mediator, jury, and other debate body roles.
- [x] Add admin review/status controls for debate applications and public application feedback states.
- [x] Add regression tests and browser verification for club administration, event editing, member listing, and role applications, then save a checkpoint.

## Debate role application bug fix

- [x] Reproduce the public debate-role application failure and capture the failing request or validation state.
- [x] Fix the application form, authentication, or persistence path so valid role applications are stored successfully.
- [x] Verify the public submit success state and Editorial Desk review visibility, then save a checkpoint.

## Club debate photo

- [x] Add a persistent photo URL to club events and migrate the database safely.
- [x] Add an image upload control in the Editorial Desk club event form above the debate topic field.
- [x] Display the selected event photo in the public Club hero with an N fallback when no photo exists.
- [x] Add regression coverage and browser verification for club photo upload/display, then save a checkpoint.

## Club hero photo composition

- [x] Restrict the uploaded debate photo to the upper hero image area and keep the topic content on a solid dark panel.
- [x] Verify desktop/mobile rendering and save a checkpoint.

## Thinkoria rebrand

- [x] Change the shared site title from The Common Index to Thinkoria.
- [x] Replace visible platform taglines and brand labels with Thinkoria and “A place of ideas.”
- [x] Verify browser title, navigation, homepage, Club page, and Editorial Desk branding, then save a checkpoint.

## Thinkoria content and imagery refinement

- [x] Rename the Editorial Desk heading to a Thinkoria-specific editorial room phrase.
- [x] Add a clear Thinkoria brand statement to the About page explaining “A place of ideas.”
- [x] Replace catalogue and category imagery with relevant, cohesive intellectual visual assets.
- [x] Verify the refreshed imagery and branding across catalogue, homepage, About, and Editorial Desk, then save a checkpoint.

## Catalogue accessibility and failed-image repair

- [x] Add article image alt text to the data model and Editorial Desk form.
- [x] Use stored alt text on catalogue cards and public article images with safe fallbacks.
- [x] Add a Thinkoria catalogue visual-language guide for future editors.
- [x] Replace all failed or placeholder catalogue images with reliable category-specific assets and verify them in the browser.
- [x] Run regression checks and save a checkpoint.

## Catalogue image-generation failure repair

- [x] Identify every catalogue/category card still displaying an image-generation failure or broken image reference.
- [x] Replace broken references with verified Thinkoria category-specific assets and strengthen runtime fallback behavior.
- [x] Verify all catalogue views on desktop and mobile, run checks, and save a checkpoint.

## Catalogue image uniqueness

- [x] Audit category and article image mappings for duplicated assets.
- [x] Add a distinct biblical or ritual Religion image and remap any other duplicated category assets.
- [x] Verify all catalogue imagery on desktop and mobile, run checks, and save a checkpoint.

## Three catalogue improvements

- [x] Add a distinct Linguistics category and article image.
- [x] Add duplicate-image warnings to the Editorial Desk category image manager.
- [x] Publish a genuine History paper and verify its category-detail view.
- [x] Run full checks, verify desktop/mobile catalogue states, and save a checkpoint.


## Thinkoria logo and editorial operations upgrade

- [x] Replace the existing logo mark and wordmark across public pages, Editorial Desk, favicon/metadata, and shared app branding using the supplied Thinkoria logo.
- [x] Add admin controls to replace category images directly from the Category image manager, including upload, preview, persistence, and duplicate detection.
- [x] Add article citations/references fields with Editorial Desk editing and public article rendering.
- [x] Add published-paper PDF upload, persistence, and download/read links for editor-managed papers.
- [x] Notify the project owner when a new paper submission or Nagaon Club application is created, with graceful notification failure handling.
- [x] Add Vitest coverage for the new metadata, image replacement, PDF, and notification paths.
- [x] Verify desktop/mobile UI, run TypeScript, tests, and production build, then save a checkpoint.


## Editorial operations follow-up

- [x] Add durable notification history records and an Editorial Desk notification history panel.
- [x] Add DOI/reference auto-linking and citation formatting presets for article references.
- [x] Add version history for category images and published-paper PDFs, including restore actions.
- [x] Add Vitest coverage for notification history, citation formatting, asset snapshots, and restore permissions.
- [x] Verify desktop/mobile Editorial Desk and article views, run checks/build, and save a checkpoint.


## Professional footer pass

- [x] Add a responsive branded footer with the Thinkoria logo and “A place of ideas” tagline.
- [x] Add contact email, address, Instagram, LinkedIn, navigation links, and creator credit for Earden Media and Mehtab Hoque.
- [x] Verify the footer on desktop and mobile, run checks/build, and save a checkpoint.


## Homepage visual-editor correction

- [x] Remove the decorative homepage logo image targeted by the visual editor if it is still present.
- [x] Verify the homepage after the correction and save a fresh checkpoint.


## Footer visual-editor correction

- [x] Verify the footer logo target and ensure the supplied Thinkoria logo is present in the intended container.
- [x] Re-verify the footer on desktop/mobile and save a fresh checkpoint.


## Footer logo placement correction

- [x] Move the Thinkoria logo into the blank light container directly above “A place of ideas.” and remove the duplicate dark-container logo.
- [x] Verify the updated footer on desktop/mobile, run checks/build, and save a checkpoint.


## Vercel preview deployment

- [x] Inspect the current GitHub, Vercel connector, build, runtime, and Manus backend configuration.
- [x] Add a safe Vercel configuration that preserves Manus API, OAuth, database, storage, and notification behavior.
- [x] Push the verified project to a private GitHub repository and configure Vercel environment values without exposing secrets.
- [x] Deploy a Vercel-provided preview domain and test public routes plus read-only backend-dependent flows; authenticated flows remain separately tracked under OAuth blockers.
- [x] Report the Vercel URL and any compatibility limitations before custom-domain setup.


## Personal Vercel Hobby deployment

- [x] Retry Vercel deployment in the personal Hobby account rather than the team scope.
- [x] Keep Manus backend, database, OAuth, storage, and notifications as the system of record.
- [x] Verify the personal Vercel preview URL and report the remaining OAuth permission blocker.


## Vercel OAuth verification blockers

- [x] Leave the stable Vercel alias out of the Manus OAuth allowlist because Vercel is approved for public preview only.
- [x] Keep OAuth session and authenticated admin/member flows on Manus; Vercel authenticated-flow testing is intentionally out of scope.
- [x] Verify submission, PDF access, forum posting, club application, and notification-triggering actions from Vercel, or document them as Manus-only until OAuth is allowlisted.


## Vercel route and sign-in correction

- [x] Add a Vercel SPA fallback so direct public routes load correctly while API and storage rewrites remain first.
- [x] Redeploy the corrected frontend and verify About, Catalogue, Club, Forum, and Submit routes.
- [x] Retest the Vercel API/storage paths and document the Manus OAuth allowlist requirement for sign-in.


## Approved deployment architecture

- [x] Keep Manus as the live backend, database, OAuth, storage, notifications, and Editorial Desk system of record.
- [x] Use Vercel only for public frontend preview and read-only public data through Manus rewrites.
- [x] Do not create or connect Supabase, migrate data, or replace Manus services without a separate explicit approval.
- [x] Leave the Vercel OAuth allowlist unchanged because authenticated Vercel usage is intentionally out of scope for the approved public-preview architecture.


## Vercel OAuth callback allowlist

- [x] Inspect Manus Developer settings; only API keys and webhooks are exposed, with no OAuth redirect allowlist.
- [x] Confirm no Manus OAuth callback-allowlist setting is exposed; retain the Manus-only OAuth architecture and do not create an API key.
- [x] Verify Vercel Sign in hands users to Manus; authenticated session behavior remains intentionally Manus-only until an OAuth allowlist exists.


## Manus-live handoff from Vercel

- [x] Inspect public navigation and interactive actions for environment-specific handoff behavior.
- [x] Route Vercel Sign in, Submit, Forum, Club, and Editorial Desk actions to the live Manus application without changing Manus behavior.
- [x] Redeploy and verify public browsing plus handoff links, then save a checkpoint.

## Vercel blank-page bug

- [x] Diagnose and fix the blank https://thinkoria.vercel.app/ Vercel deployment without changing the Manus backend or database.
- [x] Verify the repaired Vercel homepage and interactive handoff links.

## Branding watermark removal

- [x] Diagnose the visible floating “Made with Manus” watermark as Manus-host platform branding outside Thinkoria’s frontend code; Vercel remains watermark-free.
- [x] Verify the Vercel public render is watermark-free and document that the Manus-hosted badge requires a platform-level setting or support action.

## Philosophy homepage article correction

- [x] Inspect and correct the malformed CI–180001 Philosophy article shown on the homepage.
- [x] Verify the corrected Philosophy card and homepage rendering, then save a checkpoint.

## Homepage article-card overflow correction

- [x] Fix the homepage article-card text that extends outside its container, applying the correction manually because the visual-editor target was stale.
- [x] Verify the corrected article card at desktop and mobile widths, then save a checkpoint.

## Homepage overflow redeployment

- [x] Commit and push the verified homepage overflow fix to the private Thinkoria GitHub repository.
- [x] Redeploy the Vercel frontend and verify the updated public homepage without changing Manus backend behavior.

## Homepage newest published paper feed

- [x] Restore homepage ordering so the newest published paper appears first in the newly published section.
- [x] Verify published-only filtering, latest-first ordering, and homepage rendering, then save a checkpoint.

## Nagaon Club authenticated join state

- [x] Update Club join controls so signed-in users do not see the generic “Sign in to join club” prompt.
- [x] Verify signed-out and signed-in Club states, then save a checkpoint.

## Nagaon Club already-member button

- [x] Change the signed-in Club button to a disabled muted “Already a member” state while preserving the signed-out join flow.
- [x] Verify the disabled authenticated state and signed-out active state, then save a checkpoint.

## Malformed article deletion fix

- [x] Diagnose why the malformed “kyjeee…” article cannot be deleted from the Editorial Desk.
- [x] Fix the deletion flow or remove the malformed record safely, then verify the Editorial Desk and public feed and save a checkpoint.

## Article formatting and fixed public cards

- [x] Add Editorial Desk formatting controls for headings, subheadings, separators, text sizing, and richer article editing while preserving full article content.
- [x] Keep homepage and catalogue article-card containers fixed and truncate long excerpts without changing article detail content.
- [x] Verify editor formatting, public article cards, tests, and responsive rendering, then save a checkpoint.

## Article formatting redeploy

- [x] Commit and push the verified article-formatting and fixed-card changes to the private Thinkoria GitHub repository.
- [x] Redeploy and verify the Vercel frontend while preserving the Manus backend and database.

## Homepage recent articles and minor-error audit

- [x] Make each recent homepage article card open its article detail page when clicked.
- [x] Scan key public and Editorial Desk routes for minor safe-to-fix issues, verify the fixes, and save a checkpoint.

## Homepage-link release

- [x] Commit and push the latest homepage article-link and diagnostic fixes to the private Thinkoria GitHub repository.
- [x] Redeploy and verify the connected Vercel frontend without changing the Manus backend or database.

## Article engagement and trending

- [x] Add estimated reading time and privacy-friendly social share buttons to article detail pages.
- [x] Add a Trending Articles section below Newly published on the homepage using published view-count data.
- [x] Verify responsive article and homepage rendering, tests, and production build, then save a checkpoint.

## Engagement-feature release

- [x] Commit and push the reading-time, social-sharing, and Trending Articles changes to the private Thinkoria GitHub repository.
- [x] Redeploy and verify the connected Vercel frontend without changing the Manus backend or database.

## Live catalogue paper counts

- [x] Replace dummy category paper counts with counts of currently published papers, including 0 for empty categories.
- [x] Ensure category counts update automatically whenever a new paper is published, then verify and save a checkpoint.

## Club event deletion

- [x] Fix Editorial Desk deletion for Club event schedules, safely handling dependent applications or records.
- [x] Verify the intended event deletion and preserve other Club data, then save a checkpoint.

## Club event 30001 deletion follow-up

- [x] Identify every foreign-key dependency still blocking deletion of Club event 30001.
- [x] Extend cleanup, verify safe deletion of event 30001, and save a corrected checkpoint.

## Article card alignment

- [x] Remove staggered vertical offsets from homepage and catalogue article grids so cards align consistently.
- [x] Verify aligned cards on desktop and mobile, then save a checkpoint.
