"use client";

import type { UseAddAppMutationOptions } from "@calcom/app-store/_utils/useAddAppMutation";
import type { App } from "@calcom/types/App";

import { InstallAppButtonWithoutPlanCheck } from "./InstallAppButtonWithoutPlanCheck";
import type { InstallAppButtonProps } from "./types";

export const InstallAppButton = (
  props: {
    type: App["type"];
    wrapperClassName?: string;
    disableInstall?: boolean;
    options?: UseAddAppMutationOptions;
  } & InstallAppButtonProps
) => {
  return (
    <div className={props.wrapperClassName}>
      <InstallAppButtonWithoutPlanCheck {...props} />
    </div>
  );
};
