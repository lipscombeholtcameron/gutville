import { Shell } from "@/components/shell";
import { Pip } from "@/components/town-art";
import { Dashboard, ResearcherSetup } from "@/components/dashboard";
import { getResearcherStatus } from "@/lib/server";
import { chatGPTSignInPath } from "@/app/chatgpt-auth";
export const dynamic="force-dynamic";
export const metadata={title:"Researcher area · Gutville"};
export default async function ResearcherPage(){const status=await getResearcherStatus();return <Shell active="researcher"><main id="main" className="researcher-main">{status.authorized?<Dashboard researcherName={status.user?.displayName??"Researcher"}/>:<section className="researcher-login"><Pip size={105}/><span className="section-kicker">A space for the grown-ups</span><h1>Behind the discoveries</h1><p>The researcher area brings together learning encounters, before-and-after understanding, and each player’s journey.</p>{!status.authenticated?<><a className="button primary" href={chatGPTSignInPath("/researcher")} target="_top">Researcher sign-in</a><p className="tiny-note">Only the project’s configured researcher can view or export records.</p></>:status.claimable?<ResearcherSetup/>:<div className="info-callout"><p>{status.configured?"This account doesn’t have researcher access. Sign in with the project owner’s account.":"Researcher access is not configured yet. The project owner must complete private setup before records can be viewed."}</p><a href="/signout-with-chatgpt?return_to=/researcher" className="text-button" target="_top">Use another account</a></div>}</section>}</main></Shell>}
