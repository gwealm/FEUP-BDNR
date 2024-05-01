import type { ParamMatcher } from "@sveltejs/kit";

export const pattern = /^[a-zA-Z0-9]*$/i;

export const match: ParamMatcher = (param) => pattern.test(param);
