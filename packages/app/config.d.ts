export interface Config {
  app?: {
    /**
     * Deployment branding. Unset values fall back to the built-in logo.
     */
    branding?: {
      /**
       * Logo shown when the sidebar is open (any image URL).
       * @visibility frontend
       */
      logoFullUrl?: string;
      /**
       * Logo shown when the sidebar is collapsed (any image URL).
       * @visibility frontend
       */
      logoIconUrl?: string;
    };
  };
}
