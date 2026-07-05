vi.mock("@calcom/lib/next-seo.config", () => ({
  default: {
    headSeo: {
      siteName: "teeth.al",
    },
    defaultNextSeo: {
      title: "teeth.al",
      description: "Scheduling infrastructure for everyone.",
    },
  },
  seoConfig: {
    headSeo: {
      siteName: "teeth.al",
    },
  },
  buildSeoMeta: vi.fn().mockReturnValue({}),
}));
