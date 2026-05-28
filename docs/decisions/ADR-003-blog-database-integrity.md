# ADR-003: Blog Database Integrity and Upload Preservation Policy

## Status
Approved

## Context
During the migration of static articles to the unified database (`prisma.post`), we identified critical risks:
1.  **Overwriting User Modifications:** Batch updates and migration scripts overrode custom cover images (`/uploads/...`) uploaded manually by the user via the Admin Dashboard, reverting them to default placeholder images.
2.  **Duplicate Slugs:** Lack of cross-checking between static arrays and database records allowed duplicate entries of the same post under slightly different slugs, threatening SEO authority in Google.
3.  **Broad Keyword Merging:** A low semantic similarity threshold (65%) caused distinct articles to merge into each other.

To prevent these issues from recurring, we need a strict, permanent set of architectural and operational guardrails.

## Decision

### 1. Unified Database Single Source of Truth
*   All blog articles, guides, and informational content must live **exclusively** in the PostgreSQL database (`prisma.post`).
*   The legacy static arrays (`seoArticles` and `seoArticlesOrtiga` in `lib/seo-content.ts`) are **strictly deprecated** for any new additions or edits. Any new post must be created directly through the Admin Dashboard or a controlled SQL migration.

### 2. "Upload Preservation" Seeding Rule (No-Overwrite)
*   All future seeding, batch import, or migration scripts **must respect manual user edits**.
*   Before updating any fields (such as `coverImage` or `content`), scripts must inspect the existing record. If the record in the database contains a custom value (e.g., a `coverImage` path starting with `/uploads/`), the script **must preserve it** and skip overwriting that field.
*   *Implementation Pattern:*
    ```typescript
    const existing = await prisma.post.findUnique({ where: { slug } });
    const coverImage = existing?.coverImage?.startsWith('/uploads/') 
      ? existing.coverImage 
      : incoming.image;
    ```

### 3. Strict Semantic Threshold for Imports (85%)
*   Any future batch import that uses keyword-matching to detect duplicate slugs must enforce a **strict minimum threshold of 85%**.
*   This prevents distinct crop-specific articles (such as `/te-de-humus-de-lombriz-para-olivos` and `/te-de-humus-de-lombriz-para-citricos`) from being incorrectly merged, while safely consolidating true duplicates (like `/lixiviado-te-humus-aireado` and `/lixiviado-vs-te-humus-liquido-aireado`).

### 4. Mandatory Pre-Flight Database Diagnostics & Backup
*   Before executing any batch database scripts or schema migrations in the production VPS environment, developers and AI agents **must**:
    1.  Perform a diagnostic query to verify the count and integrity of existing posts (using scanning scripts like `inspect-posts`).
    2.  Ensure a database backup/dump is created on the host or inside a temporary folder.

### 5. Standardized typecheck Verification
*   Any change to files under `lib/`, `app/`, or `scripts/` must be followed by a successful local `npm run typecheck` (`tsc --noEmit`) to verify 100% type safety before pushing to the `main` branch.

## Consequences
*   **Safety:** Zero accidental loss of manual edits or uploaded images during deployments.
*   **SEO Protection:** Complete prevention of duplicate URL generation and Google indexation conflicts.
*   **Clarity:** A single, clean path for future blog expansions (entirely database-driven) without manual code maintenance.
