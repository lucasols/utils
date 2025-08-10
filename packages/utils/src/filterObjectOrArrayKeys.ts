/**
 * Filters the keys of an object based on the provided patterns.
 *
 * Filtering patterns in `rejectKeys` and `filterKeys`:
 * - `'prop'` - Only root-level properties named 'prop'
 * - `'*prop'` - Any property named exactly 'prop' at any level (root or nested)
 * - `'*.prop'` - Any nested property named 'prop' (excludes root-level matches)
 * - `'prop.nested'` - Exact nested property paths like `obj.prop.nested`
 * - `'prop.*nested'` - All nested properties inside `prop` with name `nested`
 * - `'prop[0]'` - The first item of the `prop` array
 * - `'prop[*]'` - All items of the `prop` array
 * - `'prop[0].nested'` - `nested` prop of the first item of the `prop` array
 * - `'prop[*].nested'` - `nested` prop of all items of the `prop` array
 * - `'prop[*]*nested'` - all `nested` props of all items of the `prop` array
 * - `'prop[0-2]'` - The first three items of the `prop` array
 * - `'prop[4-*]'` - All items of the `prop` array from the fourth index to the end
 * - `'prop[0-2].nested.*prop'` - Combining multiple nested patterns is supported
 * - `'[0]'` - The first item of the array
 * - `'[*]'` - All items of the array
 * - `'[0].nested'` - `nested` prop of the first item of the array
 * - `'[*].nested'` - `nested` prop of all items of the array
 * - `'[*]*nested'` - all `nested` props of all items of the array
 * - `'[0-2]'` - The first three items of the array
 * - `'[4-*]'` - All items of the array from the fourth index to the end
 *
 * @param objOrArray - The object or array to filter.
 * @param options - The options for the filter.
 * @param options.filterKeys - The keys to filter.
 * @param options.rejectKeys - The keys to reject.
 * @param options.rejectEmptyObjectsInArray - Whether to reject empty objects in arrays (default: true).
 * @returns The filtered object or array.
 */
export function filterObjectOrArrayKeys(
  objOrArray: Record<string, any> | Record<string, any>[],
  {
    filterKeys,
    rejectKeys,
    rejectEmptyObjectsInArray = true,
  }: {
    filterKeys?: string[] | string;
    rejectKeys?: string[] | string;
    rejectEmptyObjectsInArray?: boolean;
  },
): Record<string, any> | Record<string, any>[] {
  // Handle circular references detection
  const visited = new WeakSet();

  // Normalize keys to arrays
  const normalizedFilterKeys = filterKeys
    ? Array.isArray(filterKeys)
      ? filterKeys
      : [filterKeys]
    : [];
  const normalizedRejectKeys = rejectKeys
    ? Array.isArray(rejectKeys)
      ? rejectKeys
      : [rejectKeys]
    : [];

  // Parse a key pattern into segments
  function parseKeyPattern(pattern: string): string[] {
    const segments: string[] = [];
    let current = '';
    let i = 0;

    while (i < pattern.length) {
      const char = pattern[i];
      
      if (char === '.') {
        if (current) {
          segments.push(current);
          current = '';
        }
      } else if (char === '[') {
        // Handle array notation
        if (current) {
          segments.push(current);
          current = '';
        }
        const closingBracket = pattern.indexOf(']', i);
        if (closingBracket === -1) {
          throw new Error(`Invalid pattern: missing closing bracket in "${pattern}"`);
        }
        segments.push(pattern.slice(i, closingBracket + 1));
        i = closingBracket;
      } else {
        current += char;
      }
      i++;
    }
    
    if (current) {
      segments.push(current);
    }
    
    return segments;
  }

  // Check if a key matches a pattern segment
  function matchesSegment(key: string, segment: string, isArrayIndex = false): boolean {
    if (isArrayIndex && segment.startsWith('[') && segment.endsWith(']')) {
      const indexPattern = segment.slice(1, -1);
      
      if (indexPattern === '*') {
        return true;
      }
      
      if (indexPattern.includes('-')) {
        const parts = indexPattern.split('-');
        const start = parts[0];
        const end = parts[1];
        if (!start || !end) return false;
        
        const keyNum = parseInt(key, 10);
        const startNum = parseInt(start, 10);
        
        if (isNaN(keyNum) || isNaN(startNum)) return false;
        
        if (end === '*') {
          return keyNum >= startNum;
        }
        
        const endNum = parseInt(end, 10);
        if (isNaN(endNum)) return false;
        
        return keyNum >= startNum && keyNum <= endNum;
      }
      
      return key === indexPattern;
    }
    
    if (segment === '*') {
      return true;
    }
    
    if (segment.includes('*')) {
      if (segment.startsWith('*')) {
        return key.endsWith(segment.slice(1));
      }
      if (segment.endsWith('*')) {
        return key.startsWith(segment.slice(0, -1));
      }
      // Handle middle wildcards
      const parts = segment.split('*');
      if (parts.length === 2 && parts[0] !== undefined && parts[1] !== undefined) {
        return key.startsWith(parts[0]) && key.endsWith(parts[1]);
      }
    }
    
    return key === segment;
  }


  // Check if any descendant paths from the given object match the patterns
  function hasMatchingDescendants(obj: any, currentPath: string[], patterns: string[]): boolean {
    if (!isPlainObject(obj) && !Array.isArray(obj)) {
      return false;
    }
    
    // Prevent infinite recursion on circular references
    if (typeof obj === 'object' && obj !== null && visited.has(obj)) {
      return false;
    }
    
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const itemPath = [...currentPath, i.toString()];
        
        // Check if this path itself matches
        if (patterns.some(pattern => {
          const segments = parseKeyPattern(pattern);
          return matchesPath(itemPath, segments, 0, 0);
        })) {
          return true;
        }
        
        // Check descendants recursively
        if (hasMatchingDescendants(obj[i], itemPath, patterns)) {
          return true;
        }
      }
    } else {
      for (const [key, val] of Object.entries(obj)) {
        const keyPath = [...currentPath, key];
        
        // Check if this path itself matches
        if (patterns.some(pattern => {
          const segments = parseKeyPattern(pattern);
          return matchesPath(keyPath, segments, 0, 0);
        })) {
          return true;
        }
        
        // Check descendants recursively
        if (hasMatchingDescendants(val, keyPath, patterns)) {
          return true;
        }
      }
    }
    
    return false;
  }

  // Recursively match path segments against pattern segments
  function matchesPath(path: string[], pattern: string[], pathIndex: number, patternIndex: number): boolean {
    if (patternIndex >= pattern.length) {
      return pathIndex >= path.length;
    }
    
    if (pathIndex >= path.length) {
      return false;
    }
    
    const segment = pattern[patternIndex];
    const key = path[pathIndex];
    if (!segment || !key) return false;
    
    const isArrayIndex = /^\d+$/.test(key);
    
    // Handle special wildcard patterns like *name that can match at any remaining level
    if (segment.startsWith('*') && !segment.endsWith(']') && segment !== '*') {
      const targetName = segment.slice(1);
      
      // Try to find the target name in the remaining path
      for (let i = pathIndex; i < path.length; i++) {
        if (path[i] === targetName) {
          // If this is the last pattern segment, we found a match
          if (patternIndex === pattern.length - 1) {
            return true;
          }
          // Try to match the remaining pattern from the next position
          if (matchesPath(path, pattern, i + 1, patternIndex + 1)) {
            return true;
          }
        }
      }
      
      return false;
    }
    
    if (matchesSegment(key, segment, isArrayIndex)) {
      return matchesPath(path, pattern, pathIndex + 1, patternIndex + 1);
    }
    
    // For regular wildcards (like *), try skipping to next path segment
    if (segment === '*') {
      return matchesPath(path, pattern, pathIndex + 1, patternIndex + 1);
    }
    
    return false;
  }

  // Check if a value is a plain object (not a class instance, Date, etc.)
  function isPlainObject(value: any): boolean {
    if (value === null || typeof value !== 'object') return false;
    if (Array.isArray(value)) return false;
    
    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
  }

  // Check if an object is empty
  function isEmpty(obj: any): boolean {
    if (Array.isArray(obj)) return obj.length === 0;
    if (isPlainObject(obj)) return Object.keys(obj).length === 0;
    return false;
  }

  // Recursively filter object/array
  function filterRecursive(
    value: any,
    currentPath: string[] = [],
    filterPatterns: string[],
    rejectPatterns: string[]
  ): any {
    if (value === null || value === undefined) {
      return value;
    }

    // Handle circular references
    if (typeof value === 'object' && visited.has(value)) {
      throw new TypeError('Circular references are not supported');
    }

    // Don't filter non-plain objects
    if (!isPlainObject(value) && !Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'object') {
      visited.add(value);
    }

    try {
      if (Array.isArray(value)) {
        const result: any[] = [];
        
        for (let i = 0; i < value.length; i++) {
          const itemPath = [...currentPath, i.toString()];
          
          // Check if this array index should be included
          const shouldInclude = filterPatterns.length === 0 || 
            filterPatterns.some(pattern => {
              const segments = parseKeyPattern(pattern);
              const itemMatches = matchesPath(itemPath, segments, 0, 0);
              // Also check if this is a prefix of the pattern (for nested objects)
              const hasNestedMatch = segments.length > itemPath.length && 
                matchesPath(itemPath, segments.slice(0, itemPath.length), 0, 0);
              // Check if there are any actual matching descendant paths
              const couldMatchDeeper = hasMatchingDescendants(value[i], itemPath, filterPatterns);
              return itemMatches || hasNestedMatch || couldMatchDeeper;
            });

          const shouldReject = rejectPatterns.some(pattern => {
            const segments = parseKeyPattern(pattern);
            return matchesPath(itemPath, segments, 0, 0);
          });

          if (!shouldReject && shouldInclude) {
            // Check if any pattern exactly matches this path (should include entire item)
            const exactMatch = filterPatterns.some(pattern => {
              const segments = parseKeyPattern(pattern);
              return segments.length === itemPath.length && matchesPath(itemPath, segments, 0, 0);
            });
            
            const filteredItem = exactMatch 
              ? value[i] 
              : filterRecursive(value[i], itemPath, filterPatterns, rejectPatterns);
            
            // Only add non-empty objects if rejectEmptyObjectsInArray is true
            if (!rejectEmptyObjectsInArray || !isEmpty(filteredItem)) {
              result.push(filteredItem);
            }
          }
        }
        
        return result;
      } else if (isPlainObject(value)) {
        const result: Record<string, any> = {};
        
        for (const [key, val] of Object.entries(value)) {
          const keyPath = [...currentPath, key];
          
          // Check if this key should be included
          const shouldInclude = filterPatterns.length === 0 || 
            filterPatterns.some(pattern => {
              const segments = parseKeyPattern(pattern);
              const keyMatches = matchesPath(keyPath, segments, 0, 0);
              
              // Check if there are any actual matching descendant paths
              const couldMatchDeeper = hasMatchingDescendants(val, keyPath, filterPatterns);
              
              // Also check if this is a prefix of the pattern (for nested objects)
              const hasNestedMatch = segments.length > keyPath.length && 
                matchesPath(keyPath, segments.slice(0, keyPath.length), 0, 0);
                
              return keyMatches || hasNestedMatch || couldMatchDeeper;
            });

          const shouldReject = rejectPatterns.some(pattern => {
            const segments = parseKeyPattern(pattern);
            return matchesPath(keyPath, segments, 0, 0);
          });

          if (!shouldReject && shouldInclude) {
            // Check if any pattern exactly matches this path (should include entire value)
            const exactMatch = filterPatterns.some(pattern => {
              const segments = parseKeyPattern(pattern);
              return segments.length === keyPath.length && matchesPath(keyPath, segments, 0, 0);
            });
            
            // For exact matches, include the entire value but check for circular references
            const filteredValue = exactMatch
              ? (typeof val === 'object' && val !== null && visited.has(val) 
                  ? (() => { throw new TypeError('Circular references are not supported'); })()
                  : val)
              : filterRecursive(val, keyPath, filterPatterns, rejectPatterns);
            result[key] = filteredValue;
          }
        }
        
        return result;
      }
      
      return value;
    } finally {
      if (typeof value === 'object') {
        visited.delete(value);
      }
    }
  }

  return filterRecursive(objOrArray, [], normalizedFilterKeys, normalizedRejectKeys);
}
