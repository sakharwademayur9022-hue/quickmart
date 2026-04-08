import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useBackendActor } from "./useBackendActor";

export function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorLoading } = useBackendActor();

  const isAuthenticated = loginStatus === "success" && !!identity;
  const isLoading = loginStatus === "logging-in" || actorLoading;

  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return false;
      return actor.isAdmin();
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      return actor.getProfile();
    },
    enabled: isAuthenticated && !!actor && !actorLoading,
  });

  return {
    identity,
    isAuthenticated,
    isLoading,
    isAdmin,
    profile,
    login,
    logout: clear,
    principal: identity?.getPrincipal().toString(),
  };
}
