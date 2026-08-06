# GitHub CI Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Cloudflare-internal GitLab pipeline with reproducible GitHub Actions CI, add security/release-contract gates, and restore a green test baseline without publishing anything.

**Architecture:** GitHub Actions will run a blocking quality job on pull requests and `main`, using the repository-pinned Node/pnpm toolchain and frozen installation. A separate release-contract job will build the immutable release artifact but will not upload to R2; production publication remains a later, explicitly configured CD workflow. The AI test regression will preserve an injected test fetch while defaulting production calls to the Worker-safe fetch wrapper.

**Tech Stack:** GitHub Actions, Node.js 22, pnpm 11, Vitest, TypeScript, oxlint, Wrangler, CodeQL, dependency review.

## Global Constraints

- Keep the GitLab-to-GitHub migration scoped to CI configuration and the proven `fetch` regression.
- Do not add R2 credentials, deploy secrets, production publication, or promotion in this change.
- Use `pnpm`, never npm, for workspace commands.
- Keep the minimum Node version at `22.19.0` because `@earendil-works/pi-ai@0.83.0` declares that engine floor.
- Preserve the existing recursive `pnpm lint`, `pnpm build`, and `pnpm test` commands as the authoritative checks.

---

### Task 1: Restore the test baseline and pin the local toolchain

**Files:**
- Modify: `packages/workshop-backend/src/ai-models.ts:316-336`
- Modify: `package.json:1-25`
- Test: `packages/workshop-backend/__tests__/ai-models.test.ts:49-65`

**Interfaces:**
- Consumes: `ModelStreamOptions.fetch` supplied by callers and `workerFetch` used as the production default.
- Produces: A model stream that uses an explicitly supplied fetch implementation, otherwise the Worker-safe global fetch wrapper; a root package that declares its pnpm and Node requirements.

- [ ] **Step 1: Run the existing regression test and verify the expected failure**

Run:

```bash
PATH=/Users/felipewilliams/.nvm/versions/node/v22.22.0/bin:$PATH pnpm --filter @gadgets/workshop-backend exec vitest run __tests__/ai-models.test.ts
```

Expected: the request-capture tests fail because `capturedRequests` remains empty while `ai-models.ts` forces `workerFetch`.

- [ ] **Step 2: Implement the minimal fix**

Change the merged stream options so the per-call fetch wins and the Worker wrapper remains the fallback:

```ts
fetch: options.fetch ?? workerFetch,
```

- [ ] **Step 3: Pin the workspace runtime contract**

Add the exact root metadata:

```json
"packageManager": "pnpm@11.20.0",
"engines": {
  "node": ">=22.19.0"
},
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run the same focused Vitest command and expect all `ai-models` tests to pass.

---

### Task 2: Replace the inherited GitLab pipeline with blocking GitHub CI

**Files:**
- Delete: `.gitlab-ci.yml`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: root `packageManager`, `engines`, and workspace scripts.
- Produces: Required GitHub checks for pull requests and pushes to `main`.

- [ ] **Step 1: Create the workflow**

The workflow must:

- run on `pull_request` and pushes to `main`;
- grant only `contents: read`;
- use `actions/checkout@v4` with persisted credentials disabled;
- use `actions/setup-node@v4` with Node `22.22.0` and pnpm cache;
- enable Corepack and install with `pnpm install --frozen-lockfile`;
- run `pnpm lint` in one job;
- run `pnpm build` followed by `pnpm test` in another job;
- cancel obsolete pull-request runs but never cancel a `main` run.

- [ ] **Step 2: Remove the obsolete GitLab configuration**

Delete `.gitlab-ci.yml` after the GitHub workflow contains equivalent blocking checks. Do not carry over the private runner tag, `gitlab.cfdata.org` credential rewrite, or internal OpenCode component.

- [ ] **Step 3: Validate workflow syntax and references locally**

Use a YAML parser available in the workspace or inspect the parsed workflow structure. Confirm that every referenced script exists and that no GitLab variable remains in `.github/`.

---

### Task 3: Add security and release-contract validation

**Files:**
- Create: `.github/workflows/security.yml`
- Create: `.github/workflows/release-contract.yml`

**Interfaces:**
- Consumes: lockfile supply-chain policy, CodeQL JavaScript/TypeScript analysis, and `scripts/release/build-release.mjs`.
- Produces: Non-publishing security checks and PR validation that the deployable release can be built.

- [ ] **Step 1: Add the security workflow**

Run CodeQL on JavaScript/TypeScript for pull requests, pushes to `main`, and a weekly schedule with least-privilege read/security-event permissions. Run dependency review only for pull requests. Do not expose deploy or R2 secrets to pull-request jobs.

- [ ] **Step 2: Add the release-contract workflow**

On pull requests and pushes to `main`, install dependencies, run `pnpm build`, then run:

```bash
node scripts/release/build-release.mjs --out release-out
```

The workflow must not call `upload-release.mjs` or `promote-release.mjs`.

- [ ] **Step 3: Add concurrency and artifact hygiene**

Use a stable concurrency group for release-contract runs, remove the generated output at job end when practical, and ensure no secret is needed to validate the local release bundle.

---

### Task 4: Verify the complete change

**Files:**
- Verify: `package.json`, `.github/workflows/ci.yml`, `.github/workflows/security.yml`, `.github/workflows/release-contract.yml`, `.gitlab-ci.yml`, `packages/workshop-backend/src/ai-models.ts`

- [ ] **Step 1: Run `pnpm install --frozen-lockfile` with the pinned runtime**
- [ ] **Step 2: Run `pnpm lint`**
- [ ] **Step 3: Run `pnpm build`**
- [ ] **Step 4: Run `pnpm test` with Node 22**
- [ ] **Step 5: Run the release-contract build and inspect its manifest**
- [ ] **Step 6: Run `git diff --check`, inspect `git status`, and review the complete diff**

The final report must distinguish passing checks, existing warnings, and any environment-only limitations. No merge, push, R2 upload, or production promotion is part of this plan.
