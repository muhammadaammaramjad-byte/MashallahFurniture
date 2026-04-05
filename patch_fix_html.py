from pathlib import Path
import re, os
root = Path('.').resolve()
pattern = re.compile(r'(?P<prefix>(?:href|src)=["'])(?P<target>/✅?(?P<path>[^"']+))(?P<suffix>["'])')
updated = []
for html_path in root.rglob('*.html'):
    text = html_path.read_text(encoding='utf-8')
    def repl(m):
        target_path = m.group('path')
        if target_path.startswith(('http://', 'https://', '//')):
            return m.group(0)
        rel = Path(os.path.relpath(root / Path(target_path), html_path.parent)).as_posix()
        return f"{m.group('prefix')}{rel}{m.group('suffix')}"
    new_text = pattern.sub(repl, text)
    if new_text != text:
        html_path.write_text(new_text, encoding='utf-8')
        updated.append(str(html_path.relative_to(root)))
print('Updated HTML files:', len(updated))
print('\n'.join(updated))
