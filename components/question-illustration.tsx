/** Small, decorative illustrations of the food or evidence mentioned in a clue. */
export function QuestionIllustration({title, prompt, evidence}: {title:string; prompt:string; evidence?:string}) {
  const text = `${title} ${prompt}`.toLowerCase();
  // Avoid depicting just one answer in questions that compare several foods.
  const compare = /which example|two foods|two food|two recipes|two similar|two yoghurt|two ultra/.test(text);
  let kind: 'bread'|'soup'|'drink'|'cereal'|'milk'|'cold'|'egg'|'apple'|'carrot'|'fish'|'tin'|'dessert'|'label' = 'label';
  if (!compare) {
    if (/bread|bakery|baker|wholemeal|loaf/.test(text)) kind='bread';
    else if (/soup|sauce/.test(text)) kind='soup';
    else if (/drink|bottle/.test(text)) kind='drink';
    else if (/cereal|oats|oat sorter/.test(text)) kind='cereal';
    else if (/milk|dairy/.test(text)) kind='milk';
    else if (/frozen|freezer|freezing/.test(text)) kind='cold';
    else if (/egg/.test(text)) kind='egg';
    else if (/apple/.test(text)) kind='apple';
    else if (/carrot/.test(text)) kind='carrot';
    else if (/fish/.test(text)) kind='fish';
    else if (/tin of|canned|canning|cupboard beans/.test(text)) kind='tin';
    else if (/pudding|dessert|yoghurt/.test(text)) kind='dessert';
  }
  return <svg viewBox="0 0 100 78" aria-hidden="true" focusable="false" style={{width:'min(22vw, 94px)',height:'auto',flexShrink:0}}>
    <rect x="2" y="3" width="96" height="72" rx="20" fill="#f4edf9"/>
    {kind==='bread' && <g stroke="#704c42" strokeWidth="2.2" strokeLinejoin="round"><path d="M20 39c-4-3-2-13 3-15 1-11 14-14 20-8 6-6 19-3 20 8 7 1 10 10 6 15v20c0 4-3 7-7 7H28c-5 0-8-3-8-7Z" fill="#d89b60"/><path d="M27 38c-3-9 0-15 7-16 4-5 12-5 16 0 7-2 12 5 11 16v20H27Z" fill="#ffe6b5"/><path d="M36 31c2-3 5-4 8-3m7 1c2-2 4-2 6-1" fill="none" strokeLinecap="round"/></g>}
    {kind==='soup' && <g stroke="#614f62" strokeWidth="2.2" strokeLinejoin="round"><path d="M18 39h62c-1 17-11 26-31 26S20 56 18 39Z" fill="#b3d6ba"/><ellipse cx="49" cy="39" rx="31" ry="8" fill="#fff9ed"/><ellipse cx="49" cy="39" rx="25" ry="5" fill="#eab772"/><path d="M40 28c-6-5 4-7 0-13m16 13c-5-5 4-7 0-13" fill="none" strokeLinecap="round"/></g>}
    {kind==='drink' && <g stroke="#66496e" strokeWidth="2.2" strokeLinejoin="round"><path d="M35 21h30l-3 42H38Z" fill="#a6d9e5"/><path d="M38 42h24l-1 20H39Z" fill="#efb8c4"/><path d="M33 21h34M54 21l7-12h7" fill="none" strokeLinecap="round"/><circle cx="45" cy="49" r="2" fill="#fff" stroke="none"/><circle cx="55" cy="55" r="2" fill="#fff" stroke="none"/></g>}
    {kind==='cereal' && <g stroke="#63516b" strokeWidth="2.2" strokeLinejoin="round"><path d="M20 43h60c-2 15-13 22-30 22S22 58 20 43Z" fill="#c5dcbc"/><ellipse cx="50" cy="43" rx="30" ry="7" fill="#fff9ed"/><g fill="#e8bb75" strokeWidth="1.5"><circle cx="34" cy="41" r="4"/><circle cx="45" cy="38" r="4"/><circle cx="55" cy="42" r="4"/><circle cx="65" cy="39" r="4"/></g><path d="M73 17l-8 16" fill="none" strokeLinecap="round"/></g>}
    {kind==='milk' && <g stroke="#61536c" strokeWidth="2.2" strokeLinejoin="round"><path d="M33 25 42 13h21l7 12v40H33Z" fill="#fffaf0"/><path d="M33 25h37l-7-12H42Z" fill="#bdafd8"/><path d="M40 34h23v20H40Z" fill="#c8e5ef"/><path d="M43 19h16" fill="none"/></g>}
    {kind==='cold' && <g fill="none" stroke="#5b84a3" strokeWidth="3" strokeLinecap="round"><path d="M50 14v50M29 26l42 26M29 52l42-26"/><path d="m44 20 6 5 6-5M44 58l6-5 6 5M30 33l7-2 2-7M61 54l2-7 7-2M30 45l7 2 2 7M61 24l2 7 7 2"/></g>}
    {kind==='egg' && <g stroke="#695968" strokeWidth="2.2"><path d="M50 14c-8 0-19 19-19 31a19 19 0 0 0 38 0c0-12-11-31-19-31Z" fill="#fff9e9"/><path d="M41 47c0-5 4-8 9-8" fill="none" stroke="#e2b89b" strokeLinecap="round"/></g>}
    {kind==='apple' && <g stroke="#704c5b" strokeWidth="2.2" strokeLinejoin="round"><path d="M50 28c-10-9-24-4-24 10 0 14 9 24 17 24 3 0 5-2 7-2s4 2 7 2c8 0 17-10 17-24 0-14-14-19-24-10Z" fill="#ed9ea4"/><path d="M50 28c0-7 3-11 7-14M53 20c5-7 12-6 14-5-1 6-6 10-13 9" fill="#a5cfa4" strokeLinecap="round"/></g>}
    {kind==='carrot' && <g stroke="#76524d" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"><path d="M43 27c-3-6-2-11 2-14 4 2 6 6 7 10 2-6 6-9 11-9 1 7-3 12-8 15" fill="#a7d4ad"/><path d="M35 29c5-4 18-4 24 0 2 9-6 26-17 36-3-13-9-27-7-36Z" fill="#f1ae78"/><path d="m40 39 6 2m-4 6 5 2" fill="none"/></g>}
    {kind==='fish' && <g stroke="#5a6982" strokeWidth="2.2" strokeLinejoin="round"><path d="M21 39c13-16 35-18 48-6l12-7v26l-12-7C56 57 34 55 21 39Z" fill="#b7dbe7"/><circle cx="35" cy="37" r="2.2" fill="#405369" stroke="none"/><path d="M48 29c5 6 5 14 0 20" fill="none"/></g>}
    {kind==='tin' && <g stroke="#655774" strokeWidth="2.2"><rect x="31" y="18" width="38" height="47" rx="5" fill="#d3e8df"/><ellipse cx="50" cy="18" rx="19" ry="5" fill="#fffdf7"/><path d="M32 30h36M32 54h36" fill="none"/><circle cx="50" cy="42" r="6" fill="#a3ca9e"/></g>}
    {kind==='dessert' && <g stroke="#70546a" strokeWidth="2.2" strokeLinejoin="round"><path d="M27 39h46l-6 25H33Z" fill="#d5c4e7"/><ellipse cx="50" cy="39" rx="23" ry="6" fill="#fffaf3"/><path d="M34 36c3-12 11-17 16-17s13 5 16 17" fill="#f5c5c6"/><path d="M38 31c5-2 9-2 13 0" fill="none" strokeLinecap="round"/></g>}
    {kind==='label' && <g stroke="#655774" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="26" y="12" width="42" height="53" rx="5" fill="#fffdf7"/><path d="M34 23h25M34 30h22M34 37h24M34 44h15M34 51h14" fill="none"/><circle cx="65" cy="52" r="11" fill="#c9e6d5"/><path d="m73 60 7 7" fill="none" strokeWidth="4"/></g>}
    {evidence?.trim().startsWith('Ingredients:') && kind!=='label' && <g transform="translate(68 44)"><rect width="22" height="26" rx="3" fill="#fffdf7" stroke="#655774" strokeWidth="1.5"/><path d="M4 6h14M4 10h12M4 14h14M4 18h10" fill="none" stroke="#655774" strokeWidth="1.2" strokeLinecap="round"/></g>}
  </svg>;
}
