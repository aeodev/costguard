import clsx from 'clsx';

export const cn = (...values: Array<string | boolean | null | undefined>): string => clsx(values);
