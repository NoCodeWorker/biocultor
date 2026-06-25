export type LandingPayload = {
  heroImage?: string;
  section1Image?: string;
  section2Image?: string;
  section3Image?: string;
  markdownContent?: string;
};

export function parseLandingPayload(value: string | null | undefined): LandingPayload {
  try {
    const parsed: unknown = JSON.parse(value || '{}');
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};

    const record = parsed as Record<string, unknown>;
    const payload: LandingPayload = {};

    for (const key of [
      'heroImage',
      'section1Image',
      'section2Image',
      'section3Image',
      'markdownContent',
    ] as const) {
      if (typeof record[key] === 'string') payload[key] = record[key];
    }

    return payload;
  } catch {
    return {};
  }
}
