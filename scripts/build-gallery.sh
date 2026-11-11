#!/usr/bin/env bash
# Rebuild the live X3 apps for public/gallery from their source repos.
#
# The built bundles come from private repos, so they are gitignored here and never
# committed to this public repo. Run this on a machine that can clone
# Cyptopimpinainteazy/xxxstar and Cyptopimpinainteazy/x3-world, then serve the result:
#
#   scripts/build-gallery.sh            # builds into public/gallery/apps
#   python3 -m http.server 8080 --directory public/gallery
#
# Without the apps, public/gallery/index.html still works and shows screenshots.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/gallery/apps"
WORK="${GALLERY_WORK:-$(mktemp -d)}"
XXXSTAR_REF="${XXXSTAR_REF:-2014362}"
GH="${GH_BASE:-https://github.com/Cyptopimpinainteazy}"

XXXSTAR_APPS=(x3-desktop x3-funding x3-transparency validators inferstructor-dashboard x3-studio super-ide x3-intelligence tauri-os)

sparse_clone() { # repo dir paths...
  local repo="$1" dir="$2"; shift 2
  git clone -q --filter=blob:none --no-checkout "$GH/$repo" "$dir"
  git -C "$dir" sparse-checkout set "$@"
}

build_vite_app() { # app_dir name
  local app="$1" name="$2"
  echo "== $name"
  if [ -f "$app/pnpm-lock.yaml" ]; then
    (cd "$app" && corepack pnpm install --frozen-lockfile --ignore-scripts)
  else
    (cd "$app" && npm ci --no-audit --no-fund --ignore-scripts)
  fi
  (cd "$app" && npx vite build --base ./ --outDir "$OUT/$name" --emptyOutDir)
}

add_back_link() { # index.html
  python3 - "$1" <<'EOF'
import sys
p = sys.argv[1]
s = open(p).read()
pill = ('<a href="../../index.html" style="position:fixed;z-index:2147483647;left:12px;bottom:12px;'
        'padding:8px 14px;border-radius:999px;background:rgba(4,6,13,.85);border:1px solid #33e1ff;'
        'color:#33e1ff;font:600 13px system-ui,sans-serif;text-decoration:none">&larr; Gallery</a>')
if pill not in s:
    if '</body>' not in s:
        sys.exit(f"{p}: no </body> to attach the gallery link to")
    s = s.replace('</body>', pill + '</body>', 1)
open(p, 'w').write(s)
EOF
}

mkdir -p "$OUT"
echo "Working in $WORK"

sparse_clone xxxstar "$WORK/xxxstar" apps
git -C "$WORK/xxxstar" fetch -q --depth 1 origin "$XXXSTAR_REF" 2>/dev/null || true
git -C "$WORK/xxxstar" checkout -q "$XXXSTAR_REF" 2>/dev/null || git -C "$WORK/xxxstar" checkout -q
for app in "${XXXSTAR_APPS[@]}"; do
  build_vite_app "$WORK/xxxstar/apps/$app" "$app"
done

sparse_clone x3-world "$WORK/x3-world" apps/quantum-kernel-voyager
git -C "$WORK/x3-world" checkout -q
build_vite_app "$WORK/x3-world/apps/quantum-kernel-voyager" quantum-kernel-voyager

# Hosting patches, applied to the built output only:
# 1. The Funding Portal hard-codes <base href="/funding/">, which breaks it in a subfolder.
sed -i 's#<base href="/funding/" />##' "$OUT/x3-funding/index.html"
# 2. X3 Intelligence uses BrowserRouter and expects to live at "/". Pin asset URLs to its
#    folder with <base>, then present "/" to the router.
python3 - "$OUT/x3-intelligence/index.html" <<'EOF'
import sys
p = sys.argv[1]
s = open(p).read()
shim = ('<script>(function(){var d=location.pathname.replace(/[^/]*$/,"");'
        'document.write(\'<base href="\'+d+\'">\');'
        'history.replaceState(null,"","/"+location.search+location.hash);})();</script>')
if shim not in s:
    s = s.replace('<head>', '<head>' + shim, 1)
open(p, 'w').write(s)
EOF

for app in "${XXXSTAR_APPS[@]}" quantum-kernel-voyager; do
  add_back_link "$OUT/$app/index.html"
done

# Refuse to leave obvious credentials in a build that may be hosted.
if grep -rlE '(sk-[A-Za-z0-9]{20,}|sk_live_[A-Za-z0-9]{10,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|ghp_[A-Za-z0-9]{30,}|gsk_[A-Za-z0-9]{20,}|xox[bp]-)' "$OUT"; then
  echo "Possible secret in the build output above. Fix the source before hosting." >&2
  exit 1
fi

echo "Built ${#XXXSTAR_APPS[@]} xxxstar apps + quantum-kernel-voyager into $OUT"
