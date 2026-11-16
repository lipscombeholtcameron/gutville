import { Shell } from '@/components/shell';

export const metadata = { title: 'How to play · Gutville' };

export default function RulesPage() {
  return <Shell active="rules">
    <main id="main" className="info-main">
      <div className="info-heading">
        <a href="/" className="back-link">← Back to town</a>
        <p className="eyebrow">A little adventure with Pip</p>
        <h1>Snakes &amp; Ladders<br />game rules</h1>
        <p>Roll the dice, follow the board and discover a few food clues along the way.</p>
      </div>

      <div className="prose-panel">
        <div className="prose-grid">
          <section><span className="step-number" aria-hidden="true">1</span><h2>Meet your opponent</h2><p>You race against Pip the pear, your friendly opponent. Pip also helps explain the food clues. Both counters start before square 1. You go first!</p></section>
          <section><span className="step-number" aria-hidden="true">2</span><h2>Take turns rolling</h2><p>Roll the dice and move that many spaces. Then it is Pip’s turn. You can start with any number. Rolling a six gives you six spaces and no extra turn.</p></section>
          <section><span className="step-number" aria-hidden="true">3</span><h2>Up the ladders</h2><p>Land at the bottom of a ladder? Climb to the top. Land on a snake’s head? Slide down to its tail. Passing one doesn’t move you.</p></section>
          <section><span className="step-number" aria-hidden="true">4</span><h2>Head for 49</h2><p>The first explorer to land on square 49 wins. You need the exact number. If your roll would take you past 49, stay where you are and try again next turn.</p></section>
          <section><span className="step-number" aria-hidden="true">5</span><h2>Be a food detective</h2><p>Sometimes the board has a question for you. Look at the clues and choose what you think. It is okay to be unsure. You can try again during the learning stops.</p></section>
          <section><span className="step-number" aria-hidden="true">6</span><h2>Take your time</h2><p>There is no timer to beat. You can pause whenever you need a break. You may find one food clue after a roll.</p></section>
        </div>
        <aside className="info-callout"><h2>Your answers never move your counter.</h2><p>Only your dice roll, the snakes and the ladders decide where you go. You can learn something new whether you win or Pip does.</p></aside>
      </div>

      <section className="prose-panel">
        <h2>A name for your adventures</h2>
        <p>When you start, Gutville gives you a playful username. Keep it somewhere safe so you and your grown-up can return to your game, even on another device.</p>
        <p>Sharing a computer? Choose <strong>New player</strong> when it is somebody else’s turn. Please use your own username.</p>
        <aside className="info-callout"><p><strong>A little heads-up:</strong> we save your game and the answers you choose so a grown-up can learn how well Gutville explains food. Your answers are not shown to other players.</p></aside>
        <p><a href="/play" className="primary-button">Let’s play <span aria-hidden="true">→</span></a> <a href="/grown-ups">More information for grown-ups</a></p>
      </section>
    </main>
  </Shell>;
}
