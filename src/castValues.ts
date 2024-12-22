export function castToString(value: unknown): string | null {
  const valueType = typeof value;

  return (
      valueType === 'string' ||
        valueType === 'number' ||
        valueType === 'boolean' ||
        valueType === 'bigint'
    ) ?
      String(value)
    : null;
}

export function castToNumber(value: unknown): number | null {
  return isNumeric(value) ? Number(value) : null;
}

function isNumeric(num: unknown) {
  const str = String(num);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}
