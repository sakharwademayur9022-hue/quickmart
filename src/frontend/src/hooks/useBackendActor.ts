import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

/**
 * Typed wrapper around useActor that injects the backend createActor.
 * Returns the typed Backend actor and loading state.
 */
export function useBackendActor() {
  return useActor(createActor);
}
