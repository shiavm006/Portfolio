"use client";

// Wingo UI · MIT License · https://wingo-ui.com/legal/license#mit

import { createContext, useContext, useMemo, type ReactNode } from "react";

// app-wide defaults for every UI Lab component, keyed by the component's data-slot name ("button", "input"...).
// explicit props always win; provider defaults win over the component's built-in defaults.
export type ComponentDefaults = Record<string, Record<string, unknown>>;

export type UIConfig = {
  defaults?: ComponentDefaults;
  // Intl locale for dates, numbers and currencies (components read it through useUIConfig().locale)
  locale?: string;
  // "user" follows prefers-reduced-motion, "always" / "never" force it
  reducedMotion?: "user" | "always" | "never";
};

const UIConfigContext = createContext<UIConfig>({});

export type UIProviderProps = UIConfig & {
  children: ReactNode;
  // merge with an outer provider instead of replacing it (default true)
  inherit?: boolean;
};

export function UIProvider({
  children,
  defaults,
  locale,
  reducedMotion,
  inherit = true,
}: UIProviderProps) {
  const parent = useContext(UIConfigContext);
  const value = useMemo<UIConfig>(() => {
    if (!inherit) return { defaults, locale, reducedMotion };
    const merged: ComponentDefaults = { ...parent.defaults };
    for (const [name, props] of Object.entries(defaults ?? {}))
      merged[name] = { ...merged[name], ...props };
    return {
      defaults: merged,
      locale: locale ?? parent.locale,
      reducedMotion: reducedMotion ?? parent.reducedMotion,
    };
  }, [parent, defaults, locale, reducedMotion, inherit]);
  return (
    <UIConfigContext.Provider value={value}>{children}</UIConfigContext.Provider>
  );
}

export function useUIConfig() {
  return useContext(UIConfigContext);
}

// merges provider defaults under the props a component received; undefined props do not override a default
export function useDefaults<P extends object>(name: string, props: P): P {
  const defaults = useContext(UIConfigContext).defaults?.[name];
  return useMemo(() => {
    if (!defaults) return props;
    const out: Record<string, unknown> = { ...defaults };
    for (const [key, value] of Object.entries(props))
      if (value !== undefined) out[key] = value;
    return out as P;
  }, [defaults, props]);
}
