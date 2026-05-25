# Testing Guide for OpenCode Changes

**Date**: 2025-05-25  
**Purpose**: Step-by-step instructions to test all changes before pushing to fork  
**Time Estimate**: 30-45 minutes

## 🎯 Pre-Push Testing Checklist

- [ ] Environment setup verified
- [ ] Dependencies installed
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Unit tests pass (if applicable)
- [ ] RTL feature tested manually
- [ ] Dev server runs without errors
- [ ] Git history is clean
- [ ] Commits are organized
- [ ] Ready to push

---

## Phase 1: Environment Setup (5 minutes)

### Step 1.1: Verify Node/Bun Version

```bash
bun --version
# Expected output: bun 1.3.14 or higher

node --version
# Expected output: v20+ (or compatible)
```

### Step 1.2: Install Dependencies

```bash
cd "C:\Users\d7oom\Desktop\GITHUB PROJECT_CON\opencode-my-edit"
bun install
# Wait for installation to complete
# Should see: "✓ Packages installed"
```

### Step 1.3: Verify Installation

```bash
ls packages/web/src/components/share/rtl-detect.ts
# Should show: packages/web/src/components/share/rtl-detect.ts exists

cat packages/web/src/components/share/rtl-detect.ts
# Should show: RTL detection utility code
```

---

## Phase 2: Code Quality Checks (10 minutes)

### Step 2.1: Type Checking

```bash
cd packages/app
bun run typecheck
# Expected: All types check successfully
# Watch for: No TypeScript errors
```

**If errors occur**:
```bash
# Check specific files
bun run typecheck -- packages/web/src/components/share/content-markdown.tsx
```

### Step 2.2: Linting

```bash
cd "C:\Users\d7oom\Desktop\GITHUB PROJECT_CON\opencode-my-edit"
bun run lint
# Expected: No lint errors
# Should see: "✓ All checks passed" or similar
```

**Common issues to fix**:
- Unused imports (remove them)
- Trailing whitespace (clean it up)
- Line length > 120 characters (break lines)

### Step 2.3: Verify Files Were Modified Correctly

```bash
# Check RTL detection utility exists
test -f packages/web/src/components/share/rtl-detect.ts && echo "✓ rtl-detect.ts exists" || echo "✗ Missing!"

# Verify imports in components
grep "detectRTLLanguage" packages/web/src/components/share/content-markdown.tsx && echo "✓ Import found" || echo "✗ Missing!"
grep "detectRTLLanguage" packages/web/src/components/share/content-text.tsx && echo "✓ Import found" || echo "✗ Missing!"
grep "detectRTLLanguage" packages/web/src/components/share/content-bash.tsx && echo "✓ Import found" || echo "✗ Missing!"

# Verify CSS changes
grep "data-rtl" packages/web/src/components/share/content-markdown.module.css && echo "✓ RTL CSS found" || echo "✗ Missing!"

# Verify fonts added
grep "IBM Plex Sans" packages/app/src/index.css && echo "✓ Fonts added" || echo "✗ Missing!"
```

---

## Phase 3: Manual Feature Testing (20 minutes)

### Step 3.1: Start Development Server

**Terminal 1 - Start the API Server**:
```bash
cd packages/opencode
bun run dev serve
# Expected output:
# Server listening on http://localhost:4096
# Keep this running in background
```

**Terminal 2 - Start the Web App**:
```bash
cd packages/web
bun dev
# Or from root:
cd "C:\Users\d7oom\Desktop\GITHUB PROJECT_CON\opencode-my-edit"
bun run dev:web

# Expected output:
# ➜  Local:   http://localhost:5173/
# Open browser to this URL
```

### Step 3.2: Test RTL Detection - Arabic Text

In the web app, create content with Arabic text. For example, create a markdown note with:

```markdown
# مرحبا بك في OpenCode

هذا نص عربي. OpenCode يجب أن يكتشفه تلقائياً ويعرضه من اليمين إلى اليسار.

العربية هي لغة من اليمين إلى اليسار (RTL).
```

**What to verify**:
- [ ] Text displays right-to-left ✓
- [ ] Text is right-aligned ✓
- [ ] Lists (if any) are right-aligned ✓
- [ ] Buttons are on correct side ✓
- [ ] Font looks good (IBM Plex Sans Arabic) ✓
- [ ] Code blocks (if present) stay left-to-right ✓

**Screenshot Test** (optional):
```bash
# Take screenshot showing Arabic text
# Save as: CHANGES/screenshots/arabic-example.png
```

### Step 3.3: Test RTL Detection - Hebrew Text

Create content with Hebrew text:

```markdown
# שלום ל-OpenCode

זהו טקסט בעברית. OpenCode צריך לגלות אותו באופן אוטומטי
ולהציג אותו מימין לשמאל.

עברית היא שפה RTL.
```

**What to verify**:
- [ ] Text displays right-to-left ✓
- [ ] Text is right-aligned ✓
- [ ] Hebrew fonts render properly ✓
- [ ] Layout is correct ✓
- [ ] Copy button in correct position ✓

### Step 3.4: Test Mixed Content (English + RTL)

Create mixed content:

```markdown
# Hello مرحبا שלום

English text: This is a test.
Arabic: هذا اختبار
Hebrew: זה בדיקה

The app should detect that more than 15% is RTL and enable RTL mode.
```

**What to verify**:
- [ ] Mixed content detected as RTL ✓
- [ ] Overall layout is RTL ✓
- [ ] English words still readable ✓
- [ ] No overlapping text ✓

### Step 3.5: Test Below-Threshold Content

Create content that's less than 15% RTL:

```
Just a tiny bit of Arabic مرحبا in mostly English text. This should stay LTR mode.
```

**What to verify**:
- [ ] Stays in LTR mode (not RTL) ✓
- [ ] Normal left-aligned rendering ✓
- [ ] No unexpected RTL activation ✓

### Step 3.6: Test Different Component Types

Test RTL in different content components:

**Markdown**:
```markdown
# العنوان

محتوى النص العربي هنا.
```
Verify: RTL layout, fonts, code blocks stay LTR

**Code/Bash Output**:
```bash
# Arabic description: إخراج الأوامر
echo "Code output"
```
Verify: Description is RTL, code output is LTR

**Plain Text**:
```
نص عادي بالعربية
```
Verify: Text is RTL, properly aligned

### Step 3.7: Test Copy Button

**For Arabic content**:
- [ ] Click copy button (should be on left side) ✓
- [ ] Text copies correctly ✓
- [ ] Paste into text editor and verify ✓

**For Hebrew content**:
- [ ] Click copy button (should be on left side) ✓
- [ ] Text copies correctly ✓
- [ ] Paste and verify format ✓

---

## Phase 4: Browser Compatibility Testing (10 minutes)

### Step 4.1: Test in Chrome/Chromium

```bash
# Open in Chrome (usually default)
# URL: http://localhost:5173/

# Test RTL with Arabic text
# Verify:
# - [ ] RTL layout works ✓
# - [ ] Fonts load correctly ✓
# - [ ] No layout shift or flash ✓
# - [ ] Copy button works ✓
```

### Step 4.2: Test in Firefox (if available)

```bash
# Open in Firefox
# URL: http://localhost:5173/

# Repeat RTL tests
# Verify same functionality works
```

### Step 4.3: Test in Safari (if on macOS)

```bash
# Open in Safari
# URL: http://localhost:5173/

# Verify RTL support
# Check font rendering quality
```

---

## Phase 5: Git History Verification (5 minutes)

### Step 5.1: Check Git Log

```bash
cd "C:\Users\d7oom\Desktop\GITHUB PROJECT_CON\opencode-my-edit"
git log --oneline -5
```

**Expected output**:
```
3cf8cbe17 docs(changes): add comprehensive change tracking and history documentation
ae3c5a9fb docs: add CLAUDE.md with development guidance
ca7120623 feat(web): add RTL support for Arabic and Hebrew
56743dcf0 fix(acp): share acp-next session state (#29253)
00ea47a50 chore: generate
```

### Step 5.2: Verify Commit Messages

```bash
# Check each commit message format
git log --format="%h %s" -3
# Should all follow: type(scope): message format
# Examples: feat(web):, docs(changes):, docs:
```

### Step 5.3: Check Files Changed

```bash
# See what files were modified
git diff --name-only HEAD~3..HEAD
```

**Expected files**:
```
CHANGES/ARCHITECTURE.md
CHANGES/CHANGELOG.md
CHANGES/CODE-CHANGES.md
CHANGES/README.md
CHANGES/RTL-SUPPORT.md
CLAUDE.md
packages/app/src/index.css
packages/web/src/components/share/content-bash.module.css
packages/web/src/components/share/content-bash.tsx
packages/web/src/components/share/content-markdown.module.css
packages/web/src/components/share/content-markdown.tsx
packages/web/src/components/share/content-text.module.css
packages/web/src/components/share/content-text.tsx
packages/web/src/components/share/rtl-detect.ts
```

### Step 5.4: Verify Commit Content

```bash
# Check RTL feature commit
git show ca7120623 --stat
# Should show: 8 files changed, 117 insertions

# Check CLAUDE.md commit
git show ae3c5a9fb --stat
# Should show: 1 file changed, 255 insertions

# Check CHANGES commit
git show 3cf8cbe17 --stat
# Should show: 5 files changed, 1686 insertions
```

---

## Phase 6: Code Review Checklist (5 minutes)

### Step 6.1: Review RTL Detection Utility

```bash
cat packages/web/src/components/share/rtl-detect.ts
```

**Verify**:
- [ ] Function is pure (no side effects) ✓
- [ ] Detects Arabic (U+0600–U+06FF) ✓
- [ ] Detects Hebrew (U+0590–U+05FF) ✓
- [ ] Has configurable threshold ✓
- [ ] TypeScript types are correct ✓
- [ ] No unnecessary comments ✓

### Step 6.2: Review Component Changes

```bash
# Check markdown component
grep -A 5 "const isRTL" packages/web/src/components/share/content-markdown.tsx
```

**Verify**:
- [ ] Import uses new utility ✓
- [ ] isRTL is computed signal ✓
- [ ] dir attribute is set correctly ✓
- [ ] data-rtl attribute added ✓

### Step 6.3: Review CSS Changes

```bash
# Check markdown CSS
grep -A 10 "data-rtl" packages/web/src/components/share/content-markdown.module.css
```

**Verify**:
- [ ] RTL styles use [data-rtl] selector ✓
- [ ] Code blocks have direction: ltr ✓
- [ ] Table alignment is correct ✓
- [ ] Copy button positioning adjusted ✓

### Step 6.4: Review Font Integration

```bash
# Check fonts added
grep -A 5 "@import url" packages/app/src/index.css
```

**Verify**:
- [ ] Google Fonts imported ✓
- [ ] IBM Plex Sans Arabic included ✓
- [ ] IBM Plex Sans Hebrew included ✓
- [ ] Font fallbacks present ✓

---

## Phase 7: Documentation Review (5 minutes)

### Step 7.1: Verify Documentation Files Exist

```bash
ls -la CHANGES/
# Should show:
# - README.md
# - CHANGELOG.md
# - RTL-SUPPORT.md
# - CODE-CHANGES.md
# - ARCHITECTURE.md
```

### Step 7.2: Check CLAUDE.md

```bash
# Verify CLAUDE.md exists
test -f CLAUDE.md && echo "✓ CLAUDE.md exists" || echo "✗ Missing!"

# Verify key sections
grep "Quick Start" CLAUDE.md && echo "✓ Quick Start found"
grep "Development Commands" CLAUDE.md && echo "✓ Dev Commands found"
grep "Monorepo Structure" CLAUDE.md && echo "✓ Structure found"
```

### Step 7.3: Review CHANGES/README.md

```bash
# Check it's comprehensive
wc -l CHANGES/README.md
# Should be 200+ lines

# Verify key sections
grep "Quick Reference" CHANGES/README.md && echo "✓ Quick Ref found"
grep "How to Use" CHANGES/README.md && echo "✓ Usage guide found"
```

---

## Phase 8: Pre-Push Final Check (5 minutes)

### Step 8.1: Check Git Status

```bash
git status
# Expected: working tree clean (nothing to commit)
# If not clean:
git add .
git commit -m "fix: cleanup before push"
```

### Step 8.2: Verify Remote Configuration

```bash
# Check your fork is configured
git remote -v
# Should show:
# origin    https://github.com/YOUR-USERNAME/opencode.git (fetch)
# origin    https://github.com/YOUR-USERNAME/opencode.git (push)
# upstream  https://github.com/anomalyco/opencode.git (fetch)
# upstream  https://github.com/anomalyco/opencode.git (push)
```

**If not set up**:
```bash
# Add upstream (original repo)
git remote add upstream https://github.com/anomalyco/opencode.git

# Add your fork as origin (if not already)
git remote add origin https://github.com/YOUR-USERNAME/opencode.git
```

### Step 8.3: Sync with Upstream

```bash
# Fetch latest from upstream
git fetch upstream dev

# Check if you're behind
git log --oneline upstream/dev ^HEAD
# If nothing shown, you're up to date

# If behind, rebase (optional but recommended)
git rebase upstream/dev
```

### Step 8.4: Final Commit Check

```bash
# See what you're about to push
git log --oneline origin/dev..HEAD
# Should show your 3 commits:
# 3cf8cbe17 docs(changes): add comprehensive change tracking
# ae3c5a9fb docs: add CLAUDE.md with development guidance
# ca7120623 feat(web): add RTL support for Arabic and Hebrew
```

---

## Phase 9: Push to Fork (2 minutes)

### Step 9.1: Create Feature Branch (Recommended)

```bash
# Create a feature branch for your changes
git checkout -b feature/rtl-support-arabic-hebrew

# Or use current branch if already on a feature branch
git branch
# Shows: * dev (or your feature branch)
```

### Step 9.2: Push to Your Fork

```bash
# Push to your fork
git push origin feature/rtl-support-arabic-hebrew
# Or if on dev:
git push origin dev

# Expected output:
# Counting objects: ...
# Writing objects: ...
# remote: Create a pull request for 'feature/rtl-support-arabic-hebrew'
```

### Step 9.3: Create Pull Request (On GitHub)

1. Go to your fork: `https://github.com/YOUR-USERNAME/opencode`
2. Click "Compare & pull request"
3. Fill in PR details:

```markdown
Title: feat(web): add RTL support for Arabic and Hebrew

## Summary
- Add automatic RTL language detection for Arabic and Hebrew text
- Implement dir="rtl" attribute on content components
- Update CSS styling for RTL layout
- Preserve LTR rendering for code blocks
- Add IBM Plex Sans Arabic and Hebrew fonts
- Create shared RTL detection utility
- Add CLAUDE.md development guidance
- Add CHANGES folder with comprehensive documentation

## Files Changed
- packages/web/src/components/share/ (RTL components)
- packages/app/src/index.css (fonts)
- CLAUDE.md (new)
- CHANGES/ (new - 5 files)

## Testing
- [x] Manual testing with Arabic text
- [x] Manual testing with Hebrew text
- [x] Mixed content testing
- [x] Code block preservation
- [x] Browser compatibility
- [x] Copy button functionality
- [x] Type checking passes
- [x] Linting passes

## Related
- Closes #[issue-number] (if applicable)
```

---

## 🔧 Troubleshooting

### Issue: Type checking fails

**Solution**:
```bash
# Check which file has the error
cd packages/app && bun run typecheck 2>&1 | head -20

# Common fixes:
# - Remove unused imports
# - Add proper type annotations
# - Check import paths are correct
```

### Issue: Linting fails

**Solution**:
```bash
# Run linter with more detail
bun run lint -- --format=verbose

# Common fixes:
# - Remove trailing whitespace
# - Break long lines
# - Remove unused variables
```

### Issue: Dev server won't start

**Solution**:
```bash
# Kill existing process
lsof -i :5173  # Find process using port 5173
kill -9 <PID>

# Or use different port
PORT=5174 bun run dev:web
```

### Issue: Fonts not loading

**Solution**:
```bash
# Check Google Fonts URL is accessible
curl -I https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic

# Check browser network tab for font loading
# Open DevTools (F12) > Network tab
# Look for Google Fonts CSS file (should be 200 status)
```

### Issue: RTL not activating for Arabic text

**Solution**:
```bash
# Check detection logic
# Open browser console (F12)
# Paste: detectRTLLanguage("مرحبا")
# Should return: true

# If false, check:
# - Text is actually Arabic (U+0600–U+06FF)
# - Text is >15% of content
# - Component is using new code
```

---

## ✅ Final Pre-Push Checklist

Before you push, verify all of these:

### Code Quality
- [ ] `bun run lint` passes without errors
- [ ] Type checking passes in all packages
- [ ] No console.log or debug code left
- [ ] No unused imports or variables
- [ ] Code follows AGENTS.md style guide

### Features
- [ ] RTL detection works for Arabic
- [ ] RTL detection works for Hebrew
- [ ] Mixed content handled correctly
- [ ] Code blocks stay LTR
- [ ] Copy buttons work correctly
- [ ] Fonts load without errors

### Documentation
- [ ] CLAUDE.md created and complete
- [ ] CHANGES folder created with 5 files
- [ ] CHANGELOG.md documents all changes
- [ ] RTL-SUPPORT.md has implementation details
- [ ] CODE-CHANGES.md is thorough
- [ ] ARCHITECTURE.md explains decisions

### Git
- [ ] 3 commits organized logically
- [ ] Commit messages follow conventional format
- [ ] No merge conflicts
- [ ] Up to date with upstream/dev
- [ ] Clean git status (nothing uncommitted)

### Testing
- [ ] Tested in at least one browser
- [ ] Tested Arabic content
- [ ] Tested Hebrew content
- [ ] Tested mixed content
- [ ] Tested threshold boundary (~15%)
- [ ] Verified copy functionality

### Ready to Push?
- [ ] All above items checked
- [ ] No last-minute concerns
- [ ] Ready to create pull request

---

## 📞 If Tests Fail

Don't push if:
- ❌ Linting fails
- ❌ Type checking shows errors
- ❌ RTL content doesn't display correctly
- ❌ Code blocks are affected
- ❌ Fonts don't load
- ❌ Git history is messy

**Instead**:
1. Identify the issue
2. Fix the problem
3. Run tests again
4. Commit the fix
5. Then push

---

## 🎯 Expected Test Results

When everything works correctly, you should see:

**Lint**:
```
✓ All checks passed
```

**Type Check**:
```
✓ No type errors
```

**Dev Server**:
```
➜  Local:   http://localhost:5173/
```

**RTL Feature**:
- Arabic text displays RTL ✓
- Hebrew text displays RTL ✓
- Code stays LTR ✓
- Fonts look good ✓

**Git**:
```
3cf8cbe17 docs(changes): add comprehensive change tracking
ae3c5a9fb docs: add CLAUDE.md with development guidance
ca7120623 feat(web): add RTL support for Arabic and Hebrew
```

---

## Summary

**Total Testing Time**: ~45 minutes

**Key Steps**:
1. ✅ Setup environment
2. ✅ Run code quality checks
3. ✅ Test RTL feature manually
4. ✅ Test in browser
5. ✅ Review git history
6. ✅ Final checks
7. ✅ Push to fork
8. ✅ Create PR

**Status**: ✅ Ready to push

Good luck! 🚀
