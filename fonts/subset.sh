#!/bin/sh
# 改文案后重新子集化字体：需要 fonttools+brotli，以及原始 TTF（LXGW WenKai Medium、ZCOOL KuaiLe）
# usage: sh fonts/subset.sh /path/LXGWWenKai-Medium.ttf /path/ZCOOLKuaiLe-Regular.ttf
cd "$(dirname "$0")/.." && cat index.html data.js app.js style.css themes.css art.css > /tmp/chars.txt && printf '%s' ' !"#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz，。！？：；、“”（）《》「」…—·' >> /tmp/chars.txt
pyftsubset "$1" --text-file=/tmp/chars.txt --flavor=woff2 --output-file=fonts/wenkai-sub.woff2
pyftsubset "$2" --text-file=/tmp/chars.txt --flavor=woff2 --output-file=fonts/kuaile-sub.woff2
