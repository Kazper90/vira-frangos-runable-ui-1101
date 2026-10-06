import * as React from "react";

/**
 * Session UI context — placeholder until authentication is connected.
 * Only manages which account surfaces are open; no auth logic, no credentials.
 */
interface SessionUi {
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  profileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
}

const Ctx = React.createContext<SessionUi | null>(null);

export function SessionUiProvider({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuth] = React.useState(false);
  const [profileOpen, setProfile] = React.useState(false);
  const value = React.useMemo<SessionUi>(
    () => ({
      authOpen,
      openAuth: () => setAuth(true),
      closeAuth: () => setAuth(false),
      profileOpen,
      openProfile: () => setProfile(true),
      closeProfile: () => setProfile(false),
    }),
    [authOpen, profileOpen],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSessionUi(): SessionUi {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useSessionUi must be used inside SessionUiProvider");
  return v;
}
