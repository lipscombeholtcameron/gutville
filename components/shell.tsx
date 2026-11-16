import { LittleSprout } from "./town-art";
export function Shell({ children, active, game = false, immersive = false }: { children: React.ReactNode; active?: "town" | "grown-ups" | "researcher" | "rules"; game?: boolean; immersive?: boolean }) {
 return <div className={immersive ? "site-shell immersive-shell" : game ? "site-shell game-shell" : "site-shell"}>
   <a href="#main" className="skip-link">Skip to content</a>
   <header className="site-header"><a href="/" className="brand" aria-label="Gutville home"><span className="brand-icon"><LittleSprout /></span><span>Gutville</span></a><nav aria-label="Main navigation"><a className={active === "town" ? "nav-active" : ""} href="/" aria-current={active === "town" ? "page" : undefined}>{game ? "Back to town" : "The town"}</a><a className={active === "grown-ups" ? "nav-active" : ""} href="/grown-ups" aria-current={active === "grown-ups" ? "page" : undefined}><span className="parent-nav-label">Parents &amp; teachers</span><span className="parent-nav-detail">About the game &amp; privacy</span></a><a className={`help-button ${active === "rules" ? "nav-active" : ""}`} aria-current={active === "rules" ? "page" : undefined} href="/rules">Game rules</a></nav></header>
   {children}
   {!immersive && <footer className="site-footer"><a href="/" className="footer-wordmark">Gutville <LittleSprout /></a><p>A little more curious about what we eat.</p><div><a className="imperial-brand" href="/researcher" aria-label="Researcher area — Imperial College London"><img src="/images/imperial-logo.png" alt="Imperial College London" /></a><span className="prototype-tag">University prototype</span><a href="/researcher">Researcher area <span aria-hidden="true">↗</span></a></div></footer>}
 </div>;
}
