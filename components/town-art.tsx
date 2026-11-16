import { useId } from "react";

/** Original vector artwork for Gutville. Labels live in the surrounding HTML. */
export function LittleSprout() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
      <path d="M20 34V20" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
      <path d="M20 25C8 25 5 17 6 10c9-1 16 4 14 15Z" fill="currentColor" />
      <path d="M20 20C20 9 27 5 35 6c1 9-6 16-15 14Z" fill="currentColor" opacity=".76" />
      <path d="m11 16 9 9M29 11l-9 10" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity=".75" />
    </svg>
  );
}

export function TownLandscape() {
  return (
    <svg className="town-landscape" viewBox="0 0 1440 570" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <rect width="1440" height="570" fill="#DFF4FF" />
      <g fill="#FFFFFF" opacity=".83">
        <path d="M49 110c-19-1-25-19-12-29 0-23 29-31 40-13 15-24 50-15 50 9 27-4 34 32 7 33Z" />
        <path d="M1093 72c-20 0-26-21-10-30 1-28 36-34 48-14 19-21 53-8 50 16 24-2 31 29 7 29Z" />
        <path d="M1246 172c-26-1-33-27-12-37 5-30 40-34 56-14 20-17 45-8 48 12 28-4 37 37 10 39Z" />
        <path d="M472 128c-15 0-20-15-10-23 2-21 28-24 37-9 16-13 39-4 38 13 19-1 24 19 5 20Z" opacity=".66" />
      </g>
      <g fill="none" stroke="#9CC8D3" strokeWidth="2.5" strokeLinecap="round">
        <path d="M280 138q9-9 17 0 8-9 17 0M978 120q8-8 15 0 8-8 15 0" />
      </g>
      <path d="M-80 341Q111 160 346 310T791 311q217-175 482-19t245 29v249H-80Z" fill="#C2E8C5" />
      <path d="M-50 383Q139 259 351 350t400-12q271-110 482 12t277 24v196H-50Z" fill="#A1D7A6" />
      <path d="M0 430q203-81 384-17t359-7q219-76 401-9t296 9v164H0Z" fill="#83C88E" />
      {/* Side streets meet the front steps of all three destinations. */}
      <g fill="none" stroke="#F7DFAB" strokeLinecap="round" strokeLinejoin="round">
        <path d="M720 474 C718 446 718 410 720 368" strokeWidth="52" />
        <path d="M485 405 C390 388 330 366 265 345" strokeWidth="38" />
        <path d="M960 421 C1050 398 1120 369 1182 344" strokeWidth="38" />
      </g>
      <g fill="none" stroke="#FFEBC4" strokeLinecap="round" opacity=".75">
        <path d="M713 462 C708 436 710 402 711 378 M473 398 C390 381 329 361 272 345 M972 414 C1050 391 1124 364 1178 347" strokeWidth="5" />
      </g>
      <path d="M574 570c20-61 121-76 116-109-5-28-180-54-256-76l16-13c142 24 282 57 304 79 17 18 20 38-5 63l76 56Z" fill="#F7DFAB" />
      <path d="M712 463c56-29 223-53 361-68l14 12c-135 19-258 42-321 76Z" fill="#F7DFAB" />
      <path d="M596 569c24-52 133-74 116-111" fill="none" stroke="#FFEBC4" strokeWidth="10" strokeLinecap="round" opacity=".75" />
      <path d="M741 472q145-44 321-66" fill="none" stroke="#FFEBC4" strokeWidth="5" strokeLinecap="round" opacity=".7" />
      <g fill="#6BB77B">
        <ellipse cx="138" cy="478" rx="94" ry="17" />
        <ellipse cx="1238" cy="489" rx="123" ry="21" />
        <ellipse cx="354" cy="538" rx="86" ry="13" />
        <ellipse cx="1009" cy="547" rx="96" ry="13" />
      </g>
      <g fill="#62AB74" stroke="#62AB74" strokeWidth="3" strokeLinecap="round">
        <path d="m60 489-5-13m5 13 7-10m212 20-4-14m4 14 8-9m874 8 4-14m-4 14-7-7m233-28 4-14m-4 14-8-8M932 530l-4-13m4 13 7-8M390 480l-4-10m4 10 7-6" />
      </g>
      <g stroke="#4F9F67" strokeWidth="3" strokeLinecap="round">
        <path d="M79 529v-19m0 11 9-5M189 457v-18m0 10-7-4M1302 533v-23m0 14 9-6M1125 466v-18m0 8-7-3M346 568v-20m0 9-7-4" />
      </g>
      <g fill="#FFF4C5">
        <circle cx="79" cy="506" r="6" /><circle cx="73" cy="511" r="6" /><circle cx="85" cy="511" r="6" /><circle cx="79" cy="516" r="6" />
        <circle cx="1302" cy="505" r="7" /><circle cx="1296" cy="511" r="7" /><circle cx="1309" cy="511" r="7" /><circle cx="1302" cy="517" r="7" />
      </g>
      <g fill="#D9C4EF">
        <circle cx="189" cy="435" r="5" /><circle cx="184" cy="439" r="5" /><circle cx="195" cy="439" r="5" /><circle cx="189" cy="444" r="5" />
        <circle cx="1125" cy="444" r="5" /><circle cx="1120" cy="449" r="5" /><circle cx="1130" cy="449" r="5" /><circle cx="1125" cy="453" r="5" />
        <circle cx="346" cy="544" r="5" /><circle cx="341" cy="549" r="5" /><circle cx="351" cy="549" r="5" /><circle cx="346" cy="553" r="5" />
      </g>
      <g fill="#FFC85A"><circle cx="79" cy="511" r="3.5" /><circle cx="1302" cy="511" r="4" /><circle cx="189" cy="440" r="3" /><circle cx="1125" cy="449" r="3" /><circle cx="346" cy="549" r="3" /></g>
      <g fill="#5AAB71">
        <path d="M0 549c10-22 26-25 37-7 13-26 36-27 45-4 20-12 41-1 40 17H0Z" />
        <path d="M1300 570c-5-24 15-42 35-28 7-28 38-33 51-9 16-19 43-12 54 7v30Z" />
      </g>
      <g fill="#FFDC7A"><circle cx="29" cy="538" r="3" /><circle cx="60" cy="533" r="3" /><circle cx="1370" cy="540" r="3" /><circle cx="1408" cy="548" r="3" /></g>
    </svg>
  );
}

type BuildingKind = "club" | "lab" | "market";

export function Building({ kind }: { kind: BuildingKind }) {
  const unique = useId().replace(/:/g, "");
  const roof = `${unique}-roof`;
  const glass = `${unique}-glass`;
  const shade = `${unique}-shade`;
  return (
    <svg className={`building-art art-${kind}`} viewBox="0 0 330 330" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={roof} x1="0" y1="0" x2=".7" y2="1">
          <stop stopColor="#9C82D0" /><stop offset="1" stopColor="#6750A4" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#E9FFF8" /><stop offset="1" stopColor="#8FD5C2" />
        </linearGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFFFFF" stopOpacity=".48" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="166" cy="303" rx="140" ry="14" fill="#397C54" opacity=".17" />
      {kind === "club" && (
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* A school building with visible side walls, roof planes and deep steps. */}
          <path d="M38 150 55 132 268 130 298 148 298 274 270 293 48 293 38 279Z" fill="#9B83C1" stroke="#665080" strokeWidth="3" />
          <path d="M264 153 298 135 298 274 264 294Z" fill="#A48ACB" stroke="#735991" strokeWidth="3" />
          <path d="M39 156 65 140 65 277 39 286Z" fill="#C0A9DB" stroke="#8167A0" strokeWidth="3" />
          <path d="M63 151h202v137H63Z" fill="#E6D8F3" stroke="#8268A4" strokeWidth="3" />
          <path d="M66 154h195v16H66Z" fill="#C6AFE0" />
          <path d="M61 165h201v5H61Z" fill="#AC94CA" />
          {/* Roof, gable and the little school bell tower. */}
          <path d="M30 148 153 81 271 130 300 143 280 158 153 105 51 163Z" fill="#68518F" stroke="#5F497D" strokeWidth="3" />
          <path d="M30 148 150 78 270 130 256 143 150 98 47 158Z" fill="#9274BD" stroke="#725799" strokeWidth="3" />
          <path d="M43 146 150 88 261 137" fill="none" stroke="#C5A9E1" strokeWidth="5" />
          <path d="M112 120 151 97 195 116v38h-83Z" fill="#F7F0FC" stroke="#9D83BA" strokeWidth="2" />
          <path d="M127 93V56l24-19 24 19v38Z" fill="#D5C3E9" stroke="#765B99" strokeWidth="3" />
          <path d="m118 58 33-27 34 27-7 7-27-19-26 20Z" fill="#765B9C" stroke="#664C89" strokeWidth="3" />
          <path d="M151 33V16m0 1 22 5-22 6" fill="#F4C865" stroke="#947345" strokeWidth="2" />
          <path d="M139 61q0-13 12-13t12 13v15h-24Z" fill="#8F70AB" />
          <path d="M144 65q7-12 14 0l2 5h-18Z" fill="#F6C96A" stroke="#A37E44" strokeWidth="1.5" />
          <circle cx="151" cy="72" r="2" fill="#A37E44" />
          <circle cx="151" cy="127" r="17" fill="#FFF7E9" stroke="#9479B4" strokeWidth="4" />
          <path d="M151 118v10l7 4" fill="none" stroke="#785D99" strokeWidth="2.5" />
          {/* Four classroom windows, each framed and inset. */}
          <g fill="#A6DBE3" stroke="#8C71AC" strokeWidth="4">
            <rect x="76" y="184" width="35" height="44" rx="7" /><rect x="119" y="184" width="35" height="44" rx="7" />
            <rect x="190" y="184" width="35" height="44" rx="7" /><rect x="231" y="184" width="23" height="44" rx="6" />
          </g>
          <path d="M94 185v42m-17-21h33m26-21v42m-16-21h33m54-21v42m-16-21h33m18-21v42" fill="none" stroke="#8C71AC" strokeWidth="2.5" />
          <path d="m80 188 7-1-6 15m43-14 7-1-6 15m69-14 7-1-6 15m41-14 6-1-5 15" stroke="#F6FFFF" strokeWidth="3" opacity=".8" />
          <path d="M155 288v-50a19 19 0 0 1 38 0v50Z" fill="#75559B" stroke="#A88EC8" strokeWidth="5" />
          <path d="M160 239a14 14 0 0 1 28 0v12h-28Z" fill="#FFD989" /><path d="M174 226v25m-14-10h28" stroke="#8968AA" strokeWidth="2" />
          <circle cx="184" cy="268" r="3" fill="#FFD989" />
          <path d="M153 286h42l8 6h-58Z" fill="#A28BBE" stroke="#7F659C" strokeWidth="2" />
          <path d="M145 292h58l8 6h-74Z" fill="#C4ACD6" stroke="#9A7EBA" strokeWidth="2" />
          <path d="M137 298h74l9 6h-92Z" fill="#E0CAE5" stroke="#AD96C4" strokeWidth="2" />
          <path d="M266 176 291 163v34l-25 12Z" fill="#C2E4E7" stroke="#755F97" strokeWidth="2" /><path d="m278 171 0 31m-11-13 23-11" stroke="#8B73A9" strokeWidth="2" />
          {/* Ladders against both ends of the school. */}
          <g fill="none" stroke="#8E653C" strokeWidth="7"><path d="m67 166-11 113m24-111-10 111M259 161l-6 117m20-122-5 118" /></g>
          <g fill="none" stroke="#F1C983" strokeWidth="4"><path d="m67 166-11 113m24-111-10 111M259 161l-6 117m20-122-5 118" />
            <path d="m66 181 12 1m-14 17 13 1m-15 17 13 1m-15 17 13 1m-15 17 13 1m-15 17 13 1M258 178l14-2m-15 20 14-2m-15 20 14-2m-15 20 14-2m-15 20 14-2m-15 20 14-2" />
          </g>
          {/* Two curved cartoon snakes climb around the windows. */}
          <path d="M72 274c20-20 33 15 52-5s-5-32 12-43" fill="none" stroke="#51946B" strokeWidth="11" />
          <path d="M72 274c20-20 33 15 52-5s-5-32 12-43" fill="none" stroke="#A2D2A6" strokeWidth="2" strokeDasharray="3 9" />
          <path d="M134 224q9-9 16-2l4 5q-3 8-13 7-9 0-10-5Z" fill="#73B986" stroke="#51946B" strokeWidth="2" /><circle cx="146" cy="226" r="1.7" fill="#23344A" /><path d="m153 227 5 1 2-2m-2 2 2 2" fill="none" stroke="#C77278" strokeWidth="1.5" />
          <path d="M203 282c16-22 27 7 34-11 7-17-18-24-5-39" fill="none" stroke="#C68979" strokeWidth="9" /><path d="M203 282c16-22 27 7 34-11 7-17-18-24-5-39" fill="none" stroke="#F4D5B3" strokeWidth="2" strokeDasharray="3 8" />
          <path d="M229 231q7-8 14-2l4 4q-3 6-11 6-8 0-9-5Z" fill="#E5AA90" stroke="#B9776C" strokeWidth="2" /><circle cx="240" cy="232" r="1.4" fill="#23344A" />
          <path d="M42 294c-5-14 0-21 8-11 3-19 12-21 15-2 10-10 16-1 8 13Z M277 294c-3-14 4-20 10-10 5-19 16-14 14 1 10-5 15 4 8 9Z" fill="#75B782" stroke="#5A9A6A" strokeWidth="2" />
        </g>
      )}
      {kind === "lab" && (
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* A glass greenhouse dome holds the lab's oversized science flask. */}
          <path d="M53 142C52 13 274 13 278 142Z" fill={`url(#${glass})`} stroke="#5F9E98" strokeWidth="3" />
          <path d="M68 134C70 40 228 18 259 111" fill="none" stroke="#F4FFFC" strokeWidth="11" opacity=".6" />
          <path d="M110 141c-8-68 12-100 52-105m62 106c9-68-11-100-61-106M163 37v103M60 111h213" fill="none" stroke="#76B7AC" strokeWidth="2.7" opacity=".6" />
          <path d="m145 67 36-1v11h-6v26l23 32h-69l23-32V77h-7Z" fill="#F0FFFC" stroke="#578E8A" strokeWidth="3" />
          <path d="m146 113 35 1 14 19h-62Z" fill="#FFD16C" />
          <path d="m152 102 10-5 12 5" fill="none" stroke="#BFEADE" strokeWidth="2" />
          <circle cx="158" cy="119" r="3" fill="#F1AE56" /><circle cx="177" cy="126" r="3" fill="#F1AE56" /><circle cx="166" cy="108" r="2.5" fill="#B9E5D8" />
          <path d="m274 159 25-19v140l-25 17Z" fill="#80BBA5" stroke="#578E7A" strokeWidth="3" />
          <rect x="51" y="155" width="225" height="142" rx="9" fill="#D8F1D8" stroke="#6EAA87" strokeWidth="3" />
          <path d="M53 156h220v17H53Z" fill="#B7DCC0" />
          <rect x="35" y="139" width="262" height="20" rx="9" fill="#75ADA1" stroke="#558E83" strokeWidth="3" />
          <rect x="40" y="139" width="251" height="7" rx="3.5" fill="#B4DFCF" />
          <path d="M63 175h197" stroke="#F6FFF3" strokeWidth="3" opacity=".8" />
          <g>
            <circle cx="95" cy="210" r="28" fill="#A1CEB3" />
            <circle cx="95" cy="207" r="24" fill="#EFFDF8" stroke="#5D9B87" strokeWidth="5" />
            <circle cx="95" cy="207" r="18" fill="#A8E2DD" />
            <path d="M78 207h34m-17-17v34" stroke="#6EAC9B" strokeWidth="3" />
            <path d="m84 194 9-3-9 21-6-5Z" fill="#FFFFFF" opacity=".7" />
            <circle cx="231" cy="210" r="28" fill="#A1CEB3" />
            <circle cx="231" cy="207" r="24" fill="#EFFDF8" stroke="#5D9B87" strokeWidth="5" />
            <circle cx="231" cy="207" r="18" fill="#A8E2DD" />
            <path d="M214 207h34m-17-17v34" stroke="#6EAC9B" strokeWidth="3" />
            <path d="m220 194 9-3-9 21-6-5Z" fill="#FFFFFF" opacity=".7" />
          </g>
          <path d="M134 296v-70a29 29 0 0 1 58 0v70Z" fill="#5E9B86" stroke="#A8D2B5" strokeWidth="7" />
          <path d="M140 227a23 23 0 0 1 46 0v34h-46Z" fill="#D7F4E7" />
          <path d="M163 206v54m-23-26h46" stroke="#72AD98" strokeWidth="2.7" />
          <path d="M144 217q5-8 12-9l-12 31Z" fill="#FFFFFF" opacity=".7" />
          <circle cx="180" cy="272" r="4" fill="#FFD16C" />
          <path d="M129 296h69l8 6h-85Z" fill="#A2C7AF" stroke="#6D9C7E" strokeWidth="2" />
          <rect x="72" y="254" width="40" height="20" rx="6" fill="#F9E7AE" stroke="#B9AB7A" strokeWidth="2" transform="rotate(-5 92 264)" />
          <path d="m86 261 6 6 10-13" fill="none" stroke="#66986F" strokeWidth="3" />
          <path d="M248 292v-41q0-9 9-9h16" fill="none" stroke="#658D75" strokeWidth="3" />
          <path d="m258 247 26-1v39h-26Z" fill="#A981B9" stroke="#80608B" strokeWidth="2" />
          <path d="m263 256 7-6 9 7-1 18-8 6-8-7Z" fill="#DAD3EC" />
          <path d="m270 258-5 7 9 1-4 7" fill="none" stroke="#A182B6" strokeWidth="2" />
          <path d="M55 297c-7-19 1-26 11-12 3-24 15-23 17 0 10-14 19-4 10 12Z" fill="#6BAF81" />
          <path d="M284 299c-3-13 4-24 10-11 9-16 17-3 11 11Z" fill="#6BAF81" />
          <circle cx="64" cy="279" r="4" fill="#FFCB6D" />
        </g>
      )}
      {kind === "market" && (
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* Fruit and vegetable silhouettes make this a neighbourhood market. */}
          <path d="m72 119 8-27h172l18 29Z" fill="#D8AA78" stroke="#B38C65" strokeWidth="3" />
          <path d="M100 99c-24-25-4-51 15-38 16-9 32 4 22 24-7 15-16 19-20 19Z" fill="#F6C764" stroke="#C79A45" strokeWidth="2" />
          <path d="M114 64q0-16 13-19" fill="none" stroke="#649858" strokeWidth="5" />
          <path d="M123 49q17-9 22 3-16 8-22-3" fill="#78AF63" />
          <path d="M140 88c-3-32 32-46 49-23 30-9 43 25 22 43-20 16-59 9-71-20Z" fill="#E88878" stroke="#B86560" strokeWidth="2.5" />
          <path d="m169 62 2-17 8 12 14-12-2 17 13 2-21 8Z" fill="#65945C" />
          <path d="M152 80q4-9 12-10" fill="none" stroke="#F8B0A0" strokeWidth="5" />
          <path d="M221 95c-2-19 11-34 25-33 7 14 6 34-4 43Z" fill="#B6C67D" stroke="#819658" strokeWidth="2" />
          <path d="m236 68 4-16m-3 6-9-7m12 6 9-6" fill="none" stroke="#65945C" strokeWidth="3" />
          <path d="m272 164 25-21v143l-25 12Z" fill="#D4A189" stroke="#AD7F6B" strokeWidth="3" />
          <rect x="44" y="157" width="230" height="140" rx="8" fill="#FFE4CB" stroke="#C7987B" strokeWidth="3" />
          <path d="M46 161h226v23H46Z" fill="#E7B299" />
          <path d="M74 296v-99m42 99v-99m88 99v-99m43 99v-99" stroke="#EDC5A6" strokeWidth="2" />
          <path d="M134 298V192h59v106Z" fill="#9F7064" stroke="#C58E78" strokeWidth="4" />
          <rect x="141" y="198" width="44" height="59" rx="3" fill="#B7E0D6" />
          <path d="M163 199v58m-21-32h42" stroke="#D4A38C" strokeWidth="3" />
          <path d="m147 202 8-1-11 31Z" fill="#F4FFF6" opacity=".8" />
          <rect x="141" y="264" width="44" height="24" rx="3" fill="#C08F77" />
          <circle cx="183" cy="265" r="3.5" fill="#F9D87E" />
          <path d="M128 298h70l9 5h-88Z" fill="#D4AD8E" stroke="#B68C70" strokeWidth="2" />
          {/* Folded cream-and-peach canopy, with nine scalloped panels. */}
          <path d="M39 143h245l22 42q-2 17-18 15-12 0-16-12-4 12-18 12-13 0-18-12-5 12-18 12-14 0-18-12-4 12-18 12-14 0-18-12-5 12-18 12-14 0-18-12-4 12-18 12-14 0-18-12-4 12-18 12-13 0-18-12-4 12-17 12-16 1-19-15Z" fill="#FFF3DE" stroke="#C98A6F" strokeWidth="2.7" />
          <path d="m39 143-19 42q2 16 17 15 13 0 17-12l12-45Zm55 0-4 45q4 12 18 12 14 0 18-12l-5-45Zm54 0 1 45q4 12 18 12 13 0 18-12l-10-45Zm54 0 20 45q4 12 18 12 13 0 18-12l-29-45Zm55 0 15 45q4 12 16 12 16 2 18-15l-22-42Z" fill="#EDAB8D" />
          <path d="M32 136h259a7 7 0 0 1 7 7v5H25v-5a7 7 0 0 1 7-7Z" fill="#C4866E" stroke="#A97461" strokeWidth="2.5" />
          <path d="M32 137h259" stroke="#F8CCAE" strokeWidth="4" />
          {/* Front crates: deliberately imperfect silhouettes, warm wooden slats. */}
          <path d="M52 252h64v43H52Z" fill="#BB8A5F" stroke="#96704F" strokeWidth="2.5" />
          <path d="M55 261h58m-58 13h58m-58 13h58" stroke="#E0B58A" strokeWidth="5" />
          <path d="M58 253v40m53-40v40" stroke="#9F764E" strokeWidth="4" />
          <g fill="#E79A6D" stroke="#B87A52" strokeWidth="1.7">
            <circle cx="66" cy="247" r="11" /><circle cx="87" cy="246" r="12" /><circle cx="105" cy="247" r="11" /><circle cx="78" cy="229" r="11" /><circle cx="98" cy="230" r="10" />
          </g>
          <path d="m75 222 6-4m14 4 7-2m-39 18 5-4m17 2 4-5" stroke="#73975C" strokeWidth="3" />
          <path d="M207 249h67v46h-67Z" fill="#BB8A5F" stroke="#96704F" strokeWidth="2.5" />
          <path d="M210 261h60m-60 13h60m-60 13h60" stroke="#E0B58A" strokeWidth="5" />
          <path d="M214 251v41m53-41v41" stroke="#9F764E" strokeWidth="4" />
          <path d="m216 249 10-29 14 3-12 27Z" fill="#F4B364" stroke="#BA8B52" strokeWidth="1.8" />
          <path d="m226 222-4-12 9 6 7-12-1 17Z" fill="#7B9F5F" />
          <path d="M244 249c-12-9-4-28 8-24 2-12 14-16 18-7 8 16-5 32-26 31Z" fill="#A295BB" stroke="#7B6A91" strokeWidth="2" />
          <path d="m263 224-4-7 10-5 3 9Z" fill="#71945E" />
          <path d="M33 296c-7-14 0-25 8-13 0-24 12-28 15-7 11-11 17 0 10 20Z" fill="#74A978" />
          <path d="M282 299c-5-14 1-23 8-13 6-20 20-13 17 1 11-3 13 8 5 12Z" fill="#74A978" />
          <circle cx="45" cy="275" r="4" fill="#F9DC7D" />
        </g>
      )}
    </svg>
  );
}

export function Pip({ size = 110, celebrate = false }: { size?: number; celebrate?: boolean }) {
  return (
    <svg className={`pip${celebrate ? " pip-celebrate" : ""}`} width={size} height={size} viewBox="0 0 130 140" aria-hidden="true" focusable="false">
      <ellipse cx="65" cy="131" rx="35" ry="6" fill="#4F805A" opacity=".13" />
      {celebrate && <g fill="#FFC85A"><path d="m12 27 4-9 4 9 10 4-10 4-4 9-4-9-10-4Z" /><path d="m108 15 3-7 3 7 8 3-8 3-3 7-3-7-8-3Z" /><circle cx="119" cy="55" r="3" /><circle cx="22" cy="9" r="3" /></g>}
      <g stroke="#487B5D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={celebrate ? "M34 85Q14 79 16 60M98 85q20-6 17-25" : "M34 85Q16 87 18 100M98 85q18-3 17 9"} fill="none" strokeWidth="7" />
        <path d="m48 119-3 10h14l2-9m12 1 2 8h14l-5-12" fill="#6DA278" />
        <path d="M64 29c-17 0-24 18-27 34-3 15-16 28-15 43 1 27 85 27 87 0 1-15-14-32-16-45-3-17-11-32-29-32Z" fill="#91C98A" />
        <path d="M63 36c-11 1-17 15-19 30-2 17-12 27-12 40 0 11 13 17 27 19-23-11-16-27-7-44 8-15 4-32 11-45Z" fill="#B0DB9E" stroke="none" />
        <path d="M64 29c-3-10-13-16-23-11 0 13 13 18 23 11Z" fill="#71A66E" />
        <path d="M64 30c0-16 10-23 22-20-1 15-10 23-22 20Z" fill="#84BB78" />
        <path d="m64 30 11-13" fill="none" strokeWidth="2.5" />
      </g>
      {/* Oversized violet goggles are Pip's tiny science uniform. */}
      <path d="M32 66h65" stroke="#6C5192" strokeWidth="6" strokeLinecap="round" />
      <rect x="35" y="55" width="27" height="27" rx="10" fill="#EAF8E1" stroke="#735698" strokeWidth="4" />
      <rect x="67" y="55" width="27" height="27" rx="10" fill="#EAF8E1" stroke="#735698" strokeWidth="4" />
      <path d="M62 65h5" stroke="#735698" strokeWidth="4" />
      <path d="m40 60 7-1-8 14m34-13 7-1-8 14" fill="#FFFFFF" opacity=".85" />
      {celebrate ? <g fill="none" stroke="#23344A" strokeWidth="2.7" strokeLinecap="round"><path d="M44 70q5-7 10 0m20 0q5-7 10 0" /></g> : <g fill="#23344A"><ellipse cx="50" cy="69" rx="3" ry="4" /><ellipse cx="79" cy="69" rx="3" ry="4" /></g>}
      <ellipse cx="39" cy="88" rx="7" ry="4" fill="#DF9E8C" opacity=".6" /><ellipse cx="89" cy="88" rx="7" ry="4" fill="#DF9E8C" opacity=".6" />
      <path d={celebrate ? "M53 89q12 21 23 0Z" : "M54 92q10 11 21-1"} fill={celebrate ? "#536D52" : "none"} stroke="#3B624B" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
      {celebrate && <path d="M59 99q6-5 11 0" stroke="#E8AE9D" strokeWidth="3.5" strokeLinecap="round" />}
      <g fill="#639C6B" opacity=".5"><circle cx="42" cy="109" r="3" /><circle cx="88" cy="108" r="4" /><circle cx="78" cy="117" r="2" /></g>
    </svg>
  );
}
