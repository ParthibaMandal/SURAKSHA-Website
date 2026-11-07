#!/usr/bin/env python3
import base64
import os

art_dir = r"C:\Users\PC\.gemini\antigravity\brain\431ffb9e-3b95-490d-9218-b0f0d206327c"
renders_dir = r"E:\Suraksha Website\designs\renders"

renders = {
    "dark": os.path.join(renders_dir, "Desktop — Landing (Dark Theme).png"),
    "mobile": os.path.join(renders_dir, "Mobile — Landing (Dark Theme).png"),
    "light": os.path.join(renders_dir, "Desktop — Landing (Light Theme).png"),
    "specs": os.path.join(renders_dir, "Design System & Component Specs.png")
}

b64_data = {}
for k, path in renders.items():
    if os.path.exists(path):
        with open(path, "rb") as f:
            b64_data[k] = base64.b64encode(f.read()).decode("utf-8")
        print(f"Loaded {k}: {len(b64_data[k])} base64 chars")
    else:
        print(f"Missing: {path}")

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Suraksha Design Previews</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .scroll-container {
      max-height: 540px;
      overflow-y: auto;
      scrollbar-width: thin;
    }
  </style>
</head>
<body class="bg-transparent text-[var(--foreground)] antialiased p-2">
  <div class="bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-2xl p-5 shadow-lg max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-lg text-emerald-400">
          🛡️
        </div>
        <div>
          <h2 class="text-base font-bold text-[var(--foreground)] leading-tight">Suraksha Platform Previews</h2>
          <p class="text-xs text-[var(--muted-foreground)]">FigCraft Native Renders · SDS v2.0</p>
        </div>
      </div>
      <!-- Tab Controls -->
      <div class="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl border border-[var(--border)]">
        <button onclick="setTab('dark')" id="tab-dark" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-black shadow-sm transition">Desktop (Dark)</button>
        <button onclick="setTab('mobile')" id="tab-mobile" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-white transition">Mobile (Dark)</button>
        <button onclick="setTab('light')" id="tab-light" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-white transition">Desktop (Light)</button>
        <button onclick="setTab('specs')" id="tab-specs" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-white transition">Component Specs</button>
      </div>
    </div>

    <!-- Active Viewport Banner -->
    <div class="mt-3 flex items-center justify-between px-3.5 py-2 bg-black/20 rounded-lg text-xs text-[var(--muted-foreground)]">
      <span id="view-meta" class="font-medium text-[var(--foreground)]">Desktop — Landing (Dark Theme) · 1440 × 4200 px</span>
      <span class="text-emerald-400 font-mono text-[11px]">Scroll down inside frame to inspect full page ↓</span>
    </div>

    <!-- Image Display Area -->
    <div class="mt-3 border border-[var(--border)] rounded-xl overflow-hidden bg-black/50 scroll-container flex justify-center p-4">
      <img id="preview-img" src="__IMG_DARK__" alt="Design Preview" class="rounded-lg shadow-2xl max-w-full h-auto transition-all duration-300" />
    </div>

    <!-- Direct File Locations -->
    <div class="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <span class="font-semibold text-[var(--foreground)]">Image Folder:</span> 
        <code class="bg-black/30 px-2 py-0.5 rounded text-emerald-400 font-mono">E:\\Suraksha Website\\designs\\renders\\</code>
      </div>
      <div>
        <span class="font-semibold text-[var(--foreground)]">FigCraft File:</span> 
        <code class="bg-black/30 px-2 py-0.5 rounded text-cyan-400 font-mono">E:\\Suraksha Website\\designs\\suraksha-website.figcraft</code>
      </div>
    </div>
  </div>

  <script>
    const b64 = {
      dark: '__IMG_DARK__',
      mobile: '__IMG_MOBILE__',
      light: '__IMG_LIGHT__',
      specs: '__IMG_SPECS__'
    };

    const meta = {
      dark: 'Desktop — Landing (Dark Theme) · 1440 × 4200 px',
      mobile: 'Mobile — Landing (Dark Theme) · 393 × 3800 px',
      light: 'Desktop — Landing (Light Theme) · 1440 × 4200 px',
      specs: 'Design System & Component Specs · 1600 × 2400 px'
    };

    function setTab(key) {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-white transition';
      });
      const activeBtn = document.getElementById('tab-' + key);
      activeBtn.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-black shadow-sm transition';

      const img = document.getElementById('preview-img');
      img.src = b64[key];

      if (key === 'mobile') {
        img.style.maxWidth = '393px';
      } else {
        img.style.maxWidth = '100%';
      }

      document.getElementById('view-meta').innerText = meta[key];
    }
  </script>
</body>
</html>"""

html_content = html_template.replace("__IMG_DARK__", f"data:image/png;base64,{b64_data.get('dark', '')}")
html_content = html_content.replace("__IMG_MOBILE__", f"data:image/png;base64,{b64_data.get('mobile', '')}")
html_content = html_content.replace("__IMG_LIGHT__", f"data:image/png;base64,{b64_data.get('light', '')}")
html_content = html_content.replace("__IMG_SPECS__", f"data:image/png;base64,{b64_data.get('specs', '')}")

out_path = os.path.join(art_dir, "suraksha_design_viewer.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html_content)

# Also save a copy in designs/preview.html so user can double-click and open it in their browser!
designs_html = r"E:\Suraksha Website\designs\preview.html"
with open(designs_html, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated viewer in artifact dir: {out_path} ({os.path.getsize(out_path)} bytes)")
print(f"Generated standalone browser file: {designs_html} ({os.path.getsize(designs_html)} bytes)")
