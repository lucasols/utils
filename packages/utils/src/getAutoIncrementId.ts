let id = 1;

/** a simple util to get a unique number each time it is called, for hash ids use nanoid() */
export function getAutoIncrementId() {
  return id++;
}

export function getLocalAutoIncrementIdGenerator({
  prefix,
  suffix,
}: {
  prefix?: string;
  suffix?: string;
}) {
  let localId = 1;

  return () => {
    return `${prefix || ''}${localId++}${suffix || ''}`;
  };
}
