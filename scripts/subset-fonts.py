#!/usr/bin/env python3
"""把 src/assets/fonts 下的 Century Gothic 子集化。

为什么要子集: GitHub Pages 对所有资源一律只给 Cache-Control: max-age=600(实测),
带指纹的字体也不例外, 于是这两个字体每 10 分钟就要重新下载一次。原始文件
regular 68408 / bold 61876 字节, 从国内到 Fastly 实测约 750ms 与 2.6s, 而 CSS 里是
font-display: swap —— 字体没到位时先渲染度量匹配的 Arial, 到位后再替换, 读者就会
看到字体闪一下。字体本身带了整套西里尔文(94 字形)、希腊文(73)与制表符(40)等,
对中文博客是纯粹负担, 砍掉后总体积约减三分之一。

保留范围(见 KEEP_RANGES)覆盖: 基本拉丁、拉丁-1 补充、拉丁扩展-B、间距修饰符、
希腊文、拉丁扩展附加、通用标点、上下标、货币、字母式、数字形式、箭头、数学运算符、
杂项技术、几何图形、杂项符号、拉丁连字。
不保留: 拉丁扩展-A(欧洲人名的 ł/č/ş, 当前内容零使用, 开了 +14KB)、西里尔文、制表符、私用区。

用法(需要 fontTools, 不进构建流程, 内容大改后手动重跑):
    python scripts/subset-fonts.py            # 就地覆盖
    python scripts/subset-fonts.py --check    # 只检查覆盖率, 不写文件

覆盖检查会扫描 content/ 与 src/ 的全部文本, 报告"站点用到、但该字体本来就有、"
"而子集里却没有"的字符 —— 若出现, 说明需要往 KEEP_RANGES 里补范围。
"""

import argparse
import glob
import io
import os
import sys
import unicodedata

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

FONT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'fonts'))
FONTS = ['centurygothic.woff2', 'centurygothic_bold.woff2']

# 保留的 Unicode 区块
KEEP_RANGES = [
    (0x0020, 0x007E),  # Basic Latin
    (0x00A0, 0x00FF),  # Latin-1 Supplement
    # (0x0100, 0x017F),  # Latin Extended-A: 欧洲人名的 ł/č/ş 等。当前内容零使用,
    #                    # 开了要 +14KB(约 15% 体积), 需要时再放开。
    (0x0180, 0x024F),  # Latin Extended-B
    (0x02B0, 0x02FF),  # Spacing Modifier Letters
    (0x0370, 0x03FF),  # Greek and Coptic: 正文里的 α/β/λ/σ 需要
    (0x1E00, 0x1EFF),  # Latin Extended Additional
    (0x2000, 0x206F),  # General Punctuation: • — ’ “ ” …
    (0x2070, 0x209F),  # Superscripts and Subscripts
    (0x20A0, 0x20CF),  # Currency Symbols
    (0x2100, 0x214F),  # Letterlike Symbols
    (0x2150, 0x218F),  # Number Forms
    (0x2190, 0x21FF),  # Arrows
    (0x2200, 0x22FF),  # Mathematical Operators
    (0x2300, 0x23FF),  # Miscellaneous Technical
    (0x25A0, 0x25FF),  # Geometric Shapes
    (0x2600, 0x26FF),  # Miscellaneous Symbols
    (0xFB00, 0xFB06),  # Latin Ligatures
]

SCAN_GLOBS = ['content/**/*.md', 'content/**/*.mdx', 'content/**/*.mdoc',
              'src/**/*.astro', 'src/**/*.ts', 'src/**/*.tsx', 'src/**/*.json',
              'src/**/*.css']


def keep_unicodes():
    out = set()
    for lo, hi in KEEP_RANGES:
        out.update(range(lo, hi + 1))
    return out


def scan_used_chars():
    """收集源文件里出现过的字符。"""
    chars = set()
    for pattern in SCAN_GLOBS:
        for path in glob.glob(pattern, recursive=True):
            if not os.path.isfile(path):
                continue
            with open(path, encoding='utf-8', errors='ignore') as f:
                chars.update(f.read())
    return chars


def subset(path, unicodes):
    font = TTFont(path)
    options = Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.desubroutinize = True
    options.drop_tables = ['DSIG']
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    buf = io.BytesIO()
    font.flavor = 'woff2'
    font.save(buf)
    return buf.getvalue(), set(TTFont(io.BytesIO(buf.getvalue())).getBestCmap())


def show(char):
    try:
        return '%s U+%04X %s' % (char, ord(char), unicodedata.name(char))
    except ValueError:
        return '%s U+%04X' % (char, ord(char))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='只检查覆盖率, 不写文件')
    args = parser.parse_args()

    unicodes = keep_unicodes()
    used = scan_used_chars()
    total_before = total_after = 0
    orig_cmap = set()   # 覆盖前记下, 用来区分"被我们砍掉的"与"本来就没有的"
    kept_after = set()

    for name in FONTS:
        path = os.path.join(FONT_DIR, name)
        orig_cmap |= set(TTFont(path).getBestCmap())
        before = os.path.getsize(path)
        data, cmap_after = subset(path, unicodes)
        after = len(data)
        total_before += before
        total_after += after
        kept_after |= cmap_after
        print('%-26s %6d -> %6d 字节 (-%.1f%%)' % (name, before, after, (1 - after / before) * 100))
        if not args.check:
            with open(path, 'wb') as f:
                f.write(data)

    print('%-26s %6d -> %6d 字节 (-%.1f%%)' % ('合计', total_before, total_after,
                                              (1 - total_after / total_before) * 100))
    if args.check:
        return 0

    # 覆盖率检查: 站点用到、原字体有、但子集丢了 -> 需要补 KEEP_RANGES
    missing = sorted((c for c in used
                      if ord(c) in unicodes and ord(c) in orig_cmap and ord(c) not in kept_after),
                     key=ord)
    if missing:
        print('\n警告: 下列字符在保留范围内但子集里没有, 需要补 KEEP_RANGES:')
        for c in missing:
            print('  ', show(c))
        return 1
    print('\n覆盖率检查通过: 站点文本无字符落在保留范围内却缺失。')
    return 0


if __name__ == '__main__':
    sys.exit(main())
