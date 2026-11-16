import { Shell } from '@/components/shell';
import { OBJECTIVES, SOURCES } from '@/lib/curriculum';

export const metadata = { title: 'Parents & teachers · Gutville' };

export default function GrownUpsPage() {
  return <Shell active="grown-ups">
    <main id="main" className="info-main">
      <div className="info-heading">
        <a href="/" className="back-link">← Back to town</a>
        <p className="eyebrow">About Gutville</p>
        <h1>For parents<br />&amp; teachers</h1>
        <p>Gutville is a university prototype exploring how play can help children in Years 4–6 understand food processing and ultra-processed foods (UPFs).</p>
      </div>

      <section className="prose-panel">
        <h2>Curiosity, without food shame</h2>
        <p>Children investigate how foods are made, what ingredients do and which clues help us understand a packet. Cooking, freezing and other processing can be useful. An unfamiliar ingredient name is not a reason to fear a food.</p>
        <p>Processing category is one part of the picture. Fibre, nutrients, variety and the foods available to a family also matter. The game does not ask children to judge their lunchbox or label themselves as “good” or “bad” eaters.</p>
        <div className="prose-grid">{OBJECTIVES.map(objective => <section key={objective.id}><h3>{objective.title}</h3><p>{objective.description}</p></section>)}</div>
        <aside className="info-callout"><p><strong>Science includes uncertainty.</strong> Research links diets high in UPFs with some poorer health outcomes, but processing categories alone do not explain every food’s nutritional value or establish the cause of those associations. Gutville uses clear examples and allows “we need more information” where appropriate.</p></aside>
      </section>

      <section className="prose-panel" id="learning-method">
        <h2>How learning is explored</h2>
        <p>Each round covers three topics: processing, ingredients and applying evidence. One question appears after each child’s roll. Opening predictions come before teaching feedback, followed by practical encounters with explanations and supportive retries, then new application questions. A game may finish before every question is reached; incomplete pairs are excluded from paired results.</p>
        <p>The researcher area compares the first answer before teaching with the first answer to the matched final example. Practice retries are recorded separately, so finding an answer after a hint does not replace the original response. A child’s earliest recorded baseline for each topic stays available when they play again.</p>
        <p>Summaries use complete before-and-after pairs from the same topic and scenario version after a teaching encounter. They show sample counts and changes in percentage points. Participant comparisons can use topics shared by the children being compared. Repeat rounds are shown as further practice or repeat checks; they are not fresh measures of pre-existing knowledge.</p>
        <p>These are project-specific questions, not a validated assessment. Different examples may vary in difficulty, and a short before-and-after comparison cannot prove that the game caused a change. Incomplete pairs and fictional demonstration records are excluded from the real paired summaries.</p>
      </section>

      <section className="prose-panel" id="saved-information">
        <h2>What the prototype saves</h2>
        <p>Gutville saves a generated username, game progress, the questions shown, answers and retries, answer timing, teaching encounters and whether a round finished. School year and an end-of-game enjoyment reaction are optional. Children are not asked for real names, dates of birth, contact details or food-intake diaries.</p>
        <aside className="info-callout"><h3>What we tell children</h3><p>“We save your game and the answers you choose so a grown-up can learn how well Gutville explains food. Your answers are not shown to other players.”</p></aside>
        <p>Answers and analysis are available only in the protected researcher area. The researcher can export records and delete a player’s saved records. In this prototype, test records remain until the researcher deletes them; exported copies must also be managed by the person who downloads them.</p>
        <h3>A username is a memory helper</h3>
        <p>Each generated username is unique and lets a player return on another device. It is not a private password: anyone who knows it can play under that username. It does not provide access to saved answer histories or the researcher dashboard. On shared devices, use <strong>New player</strong> when a different child begins.</p>
      </section>

      <section className="prose-panel">
        <h2>A prototype, with a clear next step</h2>
        <p>This first version is intended for adult-led prototype testing with clearly labelled test records. Before formal pupil research, the project needs its university-approved participant information, appropriate adult involvement, research arrangements and a defined retention policy. Gutville does not supply those arrangements or claim institutional approval.</p>
        <p>Parents and teachers can read clues together with a child. There is no time limit, and questions never change the dice or decide who wins.</p>
        <p><a href="/rules">Read the game rules →</a></p>
      </section>

      <section className="prose-panel" id="sources">
        <h2>The evidence behind the clues</h2>
        <p>The learning bank draws on the guidance below. Some food classifications need information about how a product was made, so an ingredient list will not always settle the question.</p>
        <ul className="source-list">{SOURCES.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a></li>)}</ul>
        <p><a href="/researcher">Researcher sign-in →</a></p>
      </section>
    </main>
  </Shell>;
}
