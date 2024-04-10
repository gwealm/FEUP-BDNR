import type { ParamMatcher } from "@sveltejs/kit";

export const pattern = /^[0-9]*$/i;

export const match: ParamMatcher = (param) => pattern.test(param);