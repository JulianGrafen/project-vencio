/**
 * No-op PostHog stub for dental compliance deployments.
 * Replaces `posthog-js` via Next.js resolveAlias — no US analytics in patient contexts.
 */
const noop = () => undefined;

const posthogNoop = {
  capture: noop,
  identify: noop,
  reset: noop,
  register: noop,
  unregister: noop,
  opt_out_capturing: noop,
  opt_in_capturing: noop,
  has_opted_out_capturing: () => true,
  isFeatureEnabled: () => false,
  onFeatureFlags: noop,
  getFeatureFlag: () => undefined,
  getFeatureFlagPayload: () => undefined,
  reloadFeatureFlags: noop,
  group: noop,
  people: {
    set: noop,
    set_once: noop,
  },
};

export default posthogNoop;
