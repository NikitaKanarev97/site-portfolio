#!/bin/sh
# Lighthouse 12.8.2 default mobile simulation, 3 runs each, Home EN/RU on the candidate build.
S=<scratchpad>
LH=C:/Users/kanar/AppData/Local/npm-cache/_npx/8003d8991b0d346b/node_modules/lighthouse/cli/index.js
CHROME=C:/Users/kanar/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe
OUT=$S/lh; mkdir -p $OUT
E=/d/Claude-projects/sp-release-v1/audit/portfolio-release-v1/logs/exit-codes.txt
for name in home:/ ru-home:/ru/; do
  n=${name%%:*}; p=${name#*:}
  for i in 1 2 3; do
    node $LH "http://127.0.0.1:4471$p" --chrome-path="$CHROME" --chrome-flags="--headless=new" --output=json --output-path=$OUT/$n-mobile-$i.json --quiet
    echo "lighthouse $n mobile run $i exit=$?" >> $E
  done
done
node $LH "http://127.0.0.1:4471/" --chrome-path="$CHROME" --chrome-flags="--headless=new" --preset=desktop --output=json --output-path=$OUT/home-desktop-1.json --quiet
echo "lighthouse home desktop exit=$?" >> $E
echo LH DONE
