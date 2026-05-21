"""Convert zh-CN blog posts to zh-TW using opencc."""
import os
import re

POST_DIR = 'E:/blog/hugoblog/content/post'
PAGE_DIR = 'E:/blog/hugoblog/content'

pages = {
    'about.md': 'about.zh-tw.md',
    'friend.md': 'friend.zh-tw.md',
    'archives/_index.md': 'archives/_index.zh-tw.md',
}

from opencc import OpenCC
converter = OpenCC('s2t')  # without .json suffix

def process_file(src_path, dst_path):
    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split front matter and body
    match = re.match(r'^(---\s*\n.*?\n---\s*\n)(.*)$', content, re.DOTALL)
    if match:
        front_text = match.group(1)
        body = match.group(2)

        # Convert front matter selectively
        front_lines = front_text.split('\n')
        conv_lines = []
        for line in front_lines:
            if re.match(r'^(date|lastmod|math|mermaid|weight|draft):', line.strip()):
                conv_lines.append(line)
            else:
                conv_lines.append(converter.convert(line))
        converted_front = '\n'.join(conv_lines)

        # Convert body
        converted_body = converter.convert(body)

        content = converted_front + '\n' + converted_body
    else:
        content = converter.convert(content)

    with open(dst_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'  {os.path.basename(src_path)} -> {os.path.basename(dst_path)}')

def main():
    os.makedirs(os.path.join(PAGE_DIR, 'archives'), exist_ok=True)

    count = 0
    for fname in sorted(os.listdir(POST_DIR)):
        if fname.endswith('.md') and not any(fname.endswith(s) for s in ('.en.md', '.ja.md', '.zh-tw.md')):
            src = os.path.join(POST_DIR, fname)
            base = fname[:-3]
            dst = os.path.join(POST_DIR, f'{base}.zh-tw.md')
            if os.path.exists(dst):
                print(f'  SKIP {fname} -> exists')
            else:
                process_file(src, dst)
                count += 1

    for src_name, dst_name in pages.items():
        src = os.path.join(PAGE_DIR, src_name)
        dst = os.path.join(PAGE_DIR, dst_name)
        if not os.path.exists(src):
            print(f'  SKIP {src_name} -> no source')
            continue
        if os.path.exists(dst):
            print(f'  SKIP {src_name} -> exists')
        else:
            process_file(src, dst)
            count += 1

    print(f'\nDone. {count} files created.')

if __name__ == '__main__':
    main()
