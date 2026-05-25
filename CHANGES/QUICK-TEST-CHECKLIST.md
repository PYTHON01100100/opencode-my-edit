# ⚡ Quick Test Checklist (10 Minutes)

Use this for fast pre-push verification. For detailed steps, see [TESTING-GUIDE.md](./TESTING-GUIDE.md).

## 1️⃣ Setup (2 min)

```bash
cd "C:\Users\d7oom\Desktop\GITHUB PROJECT_CON\opencode-my-edit"
bun install
```

✅ **Check**: No install errors

---

## 2️⃣ Code Quality (3 min)

```bash
# Type check
cd packages/app
bun run typecheck
```

✅ **Check**: No TypeScript errors

```bash
# Lint
cd ..
bun run lint
```

✅ **Check**: No linting errors

---

## 3️⃣ Verify Files (2 min)

```bash
# RTL utility exists
test -f packages/web/src/components/share/rtl-detect.ts && echo "✓ OK" || echo "✗ FAIL"

# Imports added
grep "detectRTLLanguage" packages/web/src/components/share/content-markdown.tsx && echo "✓ OK" || echo "✗ FAIL"
grep "detectRTLLanguage" packages/web/src/components/share/content-text.tsx && echo "✓ OK" || echo "✗ FAIL"
grep "detectRTLLanguage" packages/web/src/components/share/content-bash.tsx && echo "✓ OK" || echo "✗ FAIL"

# CSS changes
grep "data-rtl" packages/web/src/components/share/content-markdown.module.css && echo "✓ OK" || echo "✗ FAIL"

# Fonts added
grep "IBM Plex Sans" packages/app/src/index.css && echo "✓ OK" || echo "✗ FAIL"

# Documentation
test -d CHANGES && echo "✓ CHANGES folder exists" || echo "✗ FAIL"
test -f CLAUDE.md && echo "✓ CLAUDE.md exists" || echo "✗ FAIL"
```

✅ **Check**: All commands return ✓

---

## 4️⃣ Dev Server Test (2 min)

**Terminal 1**:
```bash
cd packages/opencode
bun run dev serve
# Wait for: "Server listening on http://localhost:4096"
```

**Terminal 2**:
```bash
cd packages/app
bun dev
# Wait for: "Local: http://localhost:5173"
```

✅ **Check**: Both servers running without errors

---

## 5️⃣ Manual RTL Test (3 min)

**In browser** (http://localhost:5173):

### Arabic Test
Create markdown with Arabic text:
```
# مرحبا

هذا نص عربي
```

✅ **Check**:
- [ ] Text is right-aligned
- [ ] Text goes right-to-left
- [ ] Fonts look good
- [ ] Copy button works

### Hebrew Test  
Create markdown with Hebrew text:
```
# שלום

זה טקסט בעברית
```

✅ **Check**:
- [ ] Text is right-aligned
- [ ] Text goes right-to-left
- [ ] Fonts render properly
- [ ] Layout is correct

### English Test (Should stay LTR)
Create markdown with English only:
```
# Hello

This is English text
```

✅ **Check**:
- [ ] Text is left-aligned (LTR)
- [ ] Normal layout

---

## 6️⃣ Git Verification (1 min)

```bash
# Check commits
git log --oneline -3
```

✅ **Check**: Last 3 commits are:
```
3cf8cbe17 docs(changes): add comprehensive change tracking
ae3c5a9fb docs: add CLAUDE.md with development guidance
ca7120623 feat(web): add RTL support for Arabic and Hebrew
```

```bash
# Check status
git status
```

✅ **Check**: "nothing to commit, working tree clean"

---

## 7️⃣ Ready to Push? ✅

If all items above are ✓, you're ready:

```bash
# Create branch if needed
git checkout -b feature/rtl-support-arabic-hebrew

# Push to your fork
git push origin feature/rtl-support-arabic-hebrew
```

Then create a PR on GitHub!

---

## ❌ If Something Fails

**Type error?**
```bash
cd packages/app && bun run typecheck 2>&1 | head -5
```

**Lint error?**
```bash
bun run lint
```

**Dev server won't start?**
```bash
# Kill port
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**RTL not working?**
- Check browser console (F12)
- Verify Arabic/Hebrew text in content
- Check fonts loaded in Network tab

---

## 🎯 Summary

**If all checks pass**: ✅ **READY TO PUSH**

**If any fail**: ❌ **Fix, test again, then push**

**Total Time**: ~10 minutes

---

For detailed troubleshooting, see: [TESTING-GUIDE.md](./TESTING-GUIDE.md)
