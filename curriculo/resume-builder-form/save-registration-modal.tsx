"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SignIn } from "@/components/auth/sign-in";
import { CandidateForm } from "@/components/auth/sign-up";

// ─── Modal ────────────────────────────────────────────────────────────────────

export interface SaveRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after successful auth. The component does NOT navigate — the caller handles that. */
  onSuccess: (userId: string) => Promise<void>;
  initialName?: string;
  initialEmail?: string;
}

export function SaveRegistrationModal({
  open,
  onOpenChange,
  onSuccess,
  initialName = "",
  initialEmail = "",
}: SaveRegistrationModalProps) {
  const [view, setView] = useState<"register" | "login">("register");

  // Reset to register view whenever modal re-opens
  function handleOpenChange(next: boolean) {
    if (next) setView("register");
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {view === "register" ? "Crie sua conta para salvar" : "Entre para salvar seu currículo"}
          </DialogTitle>
          <DialogDescription>
            {view === "register"
              ? "Seu currículo será salvo automaticamente após o cadastro."
              : "Faça login e seu currículo será salvo automaticamente."}
          </DialogDescription>
        </DialogHeader>

        {view === "register" ? (
          <CandidateForm
            onSuccess={onSuccess}
            onSwitchToLogin={() => setView("login")}
            initialName={initialName}
            initialEmail={initialEmail}
          />
        ) : (
          <SignIn
            onSuccess={onSuccess}
            onSwitchToRegister={() => setView("register")}
            initialEmail={initialEmail}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
