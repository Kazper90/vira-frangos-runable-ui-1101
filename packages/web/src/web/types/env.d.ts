interface ImportMetaEnv {
  /** "mock" (default) | "api" — selects the VF data provider. */
  readonly VITE_VF_DATA_SOURCE?: string;
  /** Base URL of the VF intelligence backend. Public, no secrets. */
  readonly VITE_VF_API_BASE_URL?: string;
}
