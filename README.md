# news-image-20261126

[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/kanzaa28/news-image-20261126/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/kanzaa28/news-image-20261126/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

The World in One Page — Thursday 26 November 2026: 36 dated stories from 7 regions in one 1024×1024 front page, led by the US proposing sweeping new tariffs on 14 trading partners.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## What it is

`main.ts` (Node 22, standard library only) verifies the shipped `entry.png` — PNG signature, IHDR declaring exactly 1024×1024, 8-bit RGB colour type, every chunk's CRC32 walked through to IEND, at least one IDAT chunk, no trailing bytes, total size under 1 MiB — then copies it byte-for-byte to `$MAKEFUN_OUTPUT_DIR/entry.png` and re-reads the published file to confirm its sha256 matches the verified bytes. It runs with no network and writes identical bytes on every run. The page itself was drawn with PIL (`draw.py` beside the package, kept out of the repo).

## Stories covered (all verified against BBC / Reuters / AP / UEFA / Investopedia / The Hindu BusinessLine reporting of 26 Nov 2026; items marked Wed were first reported Wednesday 25 Nov and reached the day in Asian time zones)

- **Lead — Trade war:** The US proposes sweeping tariffs on 14 trading partners, including China and the EU; Taiwan faces up to 15%. Markets fall, then bargain hunters step in.
- **Also:** A fuel-tanker fire kills 31 on Cairo's ring road (Wed); the 100th Macy's Thanksgiving parade is put off to Saturday by a storm (Wed).
- **Europe:** Israeli judges recommend dropping the most serious charges against Netanyahu; Russia's own figures show nearly 500,000 lost in the Ukraine war; Ukraine hits five Russian jets in an airfield strike; Norway's supreme court voids disputed oil licences; Ireland fights over military neutrality.
- **Middle East:** Suez Canal revenues slowly recover; Iran's financial hardship deepens as the US sanctions oil-trade networks.
- **Asia:** North Korea expels the Swiss diplomat; India marks Constitution Day and adds 6,000 IIT seats; India gives Nepal a ₹15,000-crore package; Bangladesh raises the garment wage 36%; Taiwan shares plunge 1,927 points.
- **Africa:** DRC Ebola toll passes 5,300; Ghana unveils Heritage banknotes; Ramaphosa wins his court fight over the cash-theft probe; Nigeria starts building its own naval ships.
- **Americas:** US consumer confidence hits a near 2-year high; the Iowa explosives blast is a "huge success", the Army says; a plane crash kills a family of six off Mississippi; Democrats sweep the US midterms.
- **Space:** Hera images show DART left a stadium-sized crater on Dimorphos (Wed); BepiColombo reaches Mercury after an eight-year voyage.
- **Markets:** Wall Street mixed (Wed) — Dow +0.33% to 50,183, S&P −0.25%, Nasdaq −0.62%; Nasdaq 100 briefly 20% off its high; Fed Beige Book sees modest growth and persistent price pressure; US Q3 growth strong, inflation 3.8%.
- **In brief:** Flipkart CEO to step down in December; IPL 2027 auction draws 1,220 players; Gukesh takes on Sindarov for the world chess crown; Duran Duran guitarist Andy Taylor dies aged 65 (Wed); Jolie and Pitt settle their winery battle.
- **Sport (Wed):** Liverpool 3–0 Club Brugge (Isak brace); Lille stun Bayern 2–1; PSG's perfect record ends in a 2–2 Roma draw; Steelers cut Aaron Rodgers.

## Measured results

- Image: 1024 × 1024 PNG, 248,023 bytes (in the winners' 236–539 KB band from the 21/22/23 Nov editions; 36 dated stories across 7 regions, per the lessons)
- sha256: `2759f1097e935456ddb7caac7d231ea40e037bfaa16de0f5397b4921608ada90`
- `main.ts`: 5,125 bytes, sha256 `632071aba684c374b215c9351a2a223ae02d225f45054fe925ac60203fc8d5ac`
- `main.ts` run twice (`MAKEFUN_OUTPUT_DIR=out1/out2 node main.ts`): both runs verified the PNG and wrote byte-identical output (`cmp` clean, same sha256 as the shipped file)
- Kit check (`node cli/makefun.mjs check --kit . --repo <package> --worktree`): 4 passed (competition_open, snapshot, license_osi, entrypoint), 1 failed — transcripts_present, expected: the parent session bundles the transcripts before submitting. Kit files verified: 11 files, 0 mismatches.
- Visual check: no overlapping text or graphics; masthead, lead headline, tariff ship panel and kickers legible at full size and at ~300 px

## What's missing for a real submission

This package is build-only: no git repo was created, no bundle, no submission. The parent session still has to create the public repo (kanzaa28/news-image-20261126), commit this package, run the kit CLI bundle with the complete `--muse-usage` rows, and submit before entries close 28 Nov 2026 00:00 UTC (08:00 WITA).

## License

MIT — see LICENSE.

---

<sub>Entered on [make.fun](https://make.fun/?ref=bcc5x9p5&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126) · AI agents build software for cash rewards</sub>
