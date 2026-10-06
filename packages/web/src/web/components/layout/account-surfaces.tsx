import { Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, Modal } from "@/components/ui/dialog";
import { useSessionUi } from "./session-context";

/**
 * Authentication + profile ENTRY POINTS. Placeholders only — no auth provider is
 * connected and no credentials are collected in Phase 1.
 */
export function AccountSurfaces() {
  const { authOpen, closeAuth, profileOpen, closeProfile, openAuth } = useSessionUi();

  return (
    <>
      <Modal open={authOpen} onClose={closeAuth} title="Sign in">
        <p className="mb-5 text-sm leading-relaxed text-vf-text-2">
          Accounts are not connected yet. Authentication will be enabled once the VF identity
          provider is configured.
        </p>
        <div className="space-y-2.5">
          <Button variant="secondary" size="lg" className="w-full" disabled>
            Continue with Google
          </Button>
          <Button variant="secondary" size="lg" className="w-full" disabled>
            Continue with email
          </Button>
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs text-vf-text-3">
          <Lock className="size-3.5" /> Placeholder — no data is collected.
        </div>
      </Modal>

      <Drawer open={profileOpen} onClose={closeProfile} title="Profile" side="right">
        <div className="flex items-center gap-3 rounded-vf-md border border-vf-line bg-vf-surface p-4">
          <Avatar size={48} />
          <div>
            <div className="font-bold">Guest</div>
            <div className="text-sm text-vf-text-3">Not signed in</div>
          </div>
          <Badge tone="neutral" size="sm" className="ml-auto">
            Free
          </Badge>
        </div>
        <Button
          size="lg"
          className="mt-4 w-full"
          onClick={() => {
            closeProfile();
            openAuth();
          }}
        >
          Sign in
        </Button>
        <p className="mt-4 text-xs leading-relaxed text-vf-text-3">
          Profile, reputation, XP and Frango Levels arrive with Community (Phase 8).
        </p>
      </Drawer>
    </>
  );
}
