import { Shell } from "@/components/shell";

export default function Home() {
  return <Shell active="town" immersive>
    <main id="main" className="immersive-main">
      <h1 className="sr-only">Explore Gutville</h1>
      <section className="immersive-town" aria-label="Choose a game in Gutville">
        <div className="town-atmosphere" aria-hidden="true" />
        <div className="town-logo" aria-hidden="true">Gutville</div>
        <svg aria-hidden="true" width="0" height="0" style={{position:"absolute"}}><defs>
          <clipPath id="town-clubhouse-silhouette" clipPathUnits="objectBoundingBox">
            <path transform="scale(0.000598086 0.001062699)" d="M836 43 C824 43 815 52 815 64 C815 74 822 83 831 85 L767 144 C762 149 761 154 764 160 C766 165 771 168 776 167 L776 260 L649 260 C643 260 638 264 634 270 L571 382 C566 389 567 396 572 401 C575 404 579 406 584 407 L584 545 L576 552 L576 576 L729 576 L729 595 L943 595 L943 576 L1096 576 L1096 552 L1087 545 L1087 407 C1092 406 1096 404 1099 401 C1105 396 1106 389 1101 382 L1038 270 C1034 264 1029 260 1023 260 L896 260 L896 167 C901 168 906 165 908 160 C911 154 910 149 905 144 L841 85 C850 83 857 74 857 64 C857 52 848 43 836 43 Z" />
          </clipPath>
        </defs></svg>
        <div className="town-world">
          <div className="town-world-art" role="img" aria-label="A playful town with a gingerbread school, a greenhouse and a market, surrounded by colourful trees, giant dice and oversized food packages." /><div className="town-muted town-muted-lab" aria-hidden="true" /><div className="town-muted town-muted-market" aria-hidden="true" />
          <a href="/play" className="town-destination destination-school" aria-label="Play Snakes and Ladders Club">
            <span className="destination-card"><strong>Snakes &amp; Ladders Club</strong><span className="destination-action">Let’s play <span aria-hidden="true">▶</span></span></span>
          </a>
          <a href="/coming-soon/label-lab" className="town-destination destination-lab" aria-label="Label Lab, coming soon">
            <span className="destination-card coming"><strong>Label Lab</strong><span className="destination-status">Coming soon</span></span>
          </a>
          <a href="/coming-soon/mix-match-market" className="town-destination destination-market" aria-label="Mix and Match Market, coming soon">
            <span className="destination-card coming"><strong>Mix &amp; Match Market</strong><span className="destination-status">Coming soon</span></span>
          </a>
        </div>
      </section>
    </main>
  </Shell>;
}
