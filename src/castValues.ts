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
  return isFiniteNumeric(value) ? Number(value) : null;
}

function isFiniteNumeric(num: unknown) {
  switch (typeof num) {
    case 'number':
      return num - num === 0;
    case 'string':
      // eslint-disable-next-line no-implicit-coercion
      return num.trim() !== '' && Number.isFinite(+num);
    case 'bigint':
      return Number.isFinite(Number(num));
    default:
      return false;
  }
}
