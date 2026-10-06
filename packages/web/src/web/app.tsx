import { Route, Switch } from "wouter";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { Provider } from "./components/provider";
import { AppShell } from "./components/layout/app-shell";
import { ScrollToTop } from "./components/layout/scroll-to-top";
import HomePage from "./pages/index";
import MatchesPage from "./pages/matches";
import MatchIntelligencePage from "./pages/match-intelligence";
import {
  CommunityPage,
  JarvisPage,
  LivePage,
  MyBetsPage,
  NotFoundPage,
  PricingPage,
} from "./pages/placeholder";
import { paths } from "./routes";

function App() {
  return (
    <Provider>
      <ScrollToTop />
      <AppShell>
        <Switch>
          <Route path={paths.home} component={HomePage} />
          <Route path={paths.matches} component={MatchesPage} />
          <Route path={paths.matchPattern} component={MatchIntelligencePage} />
          <Route path={paths.myBets} component={MyBetsPage} />
          <Route path={paths.jarvis} component={JarvisPage} />
          <Route path={paths.live} component={LivePage} />
          <Route path={paths.community} component={CommunityPage} />
          <Route path={paths.pricing} component={PricingPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </AppShell>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
