interface Change {
  type: 'normal' | 'del' | 'add';
  normal?: boolean;
  del?: boolean;
  add?: boolean;
  ln1?: number;
  ln2?: number;
  ln?: number;
  content: string;
}

interface ParentRange {
  start: number;
  lines: number;
}

interface Chunk {
  content: string;
  changes: Change[];
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  combined?: boolean;
  parentCount?: number;
  oldRanges?: ParentRange[];
}

interface FileChange {
  oldLines: number;
  newLines: number;
  combined?: boolean;
  parentCount?: number;
  parentLines?: number[];
}

type DiffFileType =
  | 'modified'
  | 'new'
  | 'deleted'
  | 'renamed'
  | 'binary'
  | 'combined';

interface DiffFileBase {
  type: DiffFileType;
  chunks: Chunk[];
  deletions: number;
  additions: number;
  from: string | undefined;
  to: string | undefined;
  oldMode: string | undefined;
  newMode: string | undefined;
  index: string[] | undefined;
  diff: string | undefined;
  rawDiff: string;
}

interface DiffFileModified extends DiffFileBase {
  type: 'modified';
}

interface DiffFileNew extends DiffFileBase {
  type: 'new';
}

interface DiffFileDeleted extends DiffFileBase {
  type: 'deleted';
}

interface DiffFileRenamed extends DiffFileBase {
  type: 'renamed';
  similarityIndex: number | undefined;
}

interface DiffFileBinary extends DiffFileBase {
  type: 'binary';
}

interface DiffFileCombined extends DiffFileBase {
  type: 'combined';
  froms: string[] | undefined;
}

/**
 * Parsed diff file metadata and hunks.
 *
 * The `type` discriminator indicates the kind of change this diff represents.
 * Combined diffs (e.g. `diff --cc`) may include multiple parent paths via
 * `froms`.
 */
export type DiffFile =
  | DiffFileModified
  | DiffFileNew
  | DiffFileDeleted
  | DiffFileRenamed
  | DiffFileBinary
  | DiffFileCombined;

/**
 * Parse unified diff text (git, hg, svn) into structured file hunks.
 *
 * @example
 *   ```ts
 *   const files = diffParser('@@ -1 +1 @@\\n-old\\n+new');
 *   ```;
 */
export function diffParser(input: string): DiffFile[] {
  if (!input) return [];
  if (typeof input !== 'string' || input.match(/^\s+$/)) return [];

  const lines = input.split('\n');
  if (lines.length === 0) return [];

  const files: DiffFile[] = [];
  let currentFile: DiffFile | null = null;
  let currentChunk: Chunk | null = null;
  let deletedLineCounter = 0;
  let addedLineCounter = 0;
  let currentFileChanges: FileChange | null = null;
  let fromLineCount = 0;
  let pendingFroms: string[] | undefined;

  const normal = (line: string): void => {
    currentChunk?.changes.push({
      type: 'normal',
      normal: true,
      ln1: deletedLineCounter++,
      ln2: addedLineCounter++,
      content: line,
    });
    if (currentFileChanges) {
      currentFileChanges.oldLines--;
      currentFileChanges.newLines--;
    }
  };

  const start = (line?: string): void => {
    const [fromFileName, toFileName] = parseFiles(line) ?? [];

    currentFile = {
      type: 'modified',
      chunks: [],
      deletions: 0,
      additions: 0,
      from: fromFileName,
      to: toFileName,
      oldMode: undefined,
      newMode: undefined,
      index: undefined,
      diff: undefined,
      rawDiff: '',
    };
    fromLineCount = 0;
    pendingFroms = undefined;

    files.push(currentFile);
  };

  const restart = (): void => {
    if (!currentFile || currentFile.chunks.length) start();
  };

  const newFile = (_: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      currentFile.type = 'new';
      currentFile.newMode = match[1];
      currentFile.from = '/dev/null';
    }
  };

  const deletedFile = (_: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      currentFile.type = 'deleted';
      currentFile.oldMode = match[1];
      currentFile.to = '/dev/null';
    }
  };

  const oldMode = (_: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      currentFile.oldMode = match[1];
    }
  };

  const newMode = (_: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      currentFile.newMode = match[1];
    }
  };

  const index = (line: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      currentFile.index = line.split(' ').slice(1);
      if (match[1]) {
        currentFile.oldMode = currentFile.newMode = match[1].trim();
      }
    }
  };

  const similarityIndex = (_: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      const renamedFile = ensureRenamedFile(currentFile);
      renamedFile.similarityIndex = Number(match[1]);
    }
  };

  const indexFile = (line: string): void => {
    start(line);
  };

  const renameFrom = (line: string): void => {
    restart();
    if (currentFile) {
      const renamedFile = ensureRenamedFile(currentFile);
      renamedFile.from = parseOldOrNewFile(line, 'rename from ');
    }
  };

  const renameTo = (line: string): void => {
    restart();
    if (currentFile) {
      const renamedFile = ensureRenamedFile(currentFile);
      renamedFile.to = parseOldOrNewFile(line, 'rename to ');
    }
  };

  const binaryFiles = (): void => {
    restart();
    if (currentFile) {
      currentFile.type = 'binary';
    }
  };

  const fromFile = (line: string): void => {
    restart();
    if (currentFile) {
      const fileName = parseOldOrNewFile(line);
      if (fromLineCount === 0) {
        currentFile.from = fileName;
        fromLineCount = 1;
        return;
      }

      const froms =
        pendingFroms ?? (currentFile.from ? [currentFile.from] : []);
      if (!froms.includes(fileName)) {
        froms.push(fileName);
      }
      pendingFroms = froms;
      fromLineCount++;
    }
  };

  const toFile = (line: string): void => {
    restart();
    if (currentFile) {
      currentFile.to = parseOldOrNewFile(line);
    }
  };

  const toNumOfLines = (number: string | undefined): number =>
    Number(number || 1);

  const parseRange = (range: string, prefix: '-' | '+'): ParentRange | null => {
    if (!range.startsWith(prefix)) return null;
    const [rangeStart, rangeLines] = range.slice(1).split(',');
    const startNumber = Number(rangeStart);
    if (!Number.isFinite(startNumber)) return null;
    return { start: startNumber, lines: toNumOfLines(rangeLines) };
  };

  const parseCombinedChunkHeader = (
    line: string,
  ):
    | {
        parentRanges: ParentRange[];
        newRange: ParentRange;
        parentCount: number;
      }
    | undefined => {
    const prefixMatch = line.match(/^(@{3,})\s/);
    const atCount = prefixMatch?.[1]?.length;
    if (!atCount) return;
    const suffixMatch = line.match(new RegExp(`\\s@{${atCount}}$`));
    if (!suffixMatch) return;

    const ranges = line.slice(atCount, line.length - atCount).trim();
    const parts = ranges.split(/\s+/);
    if (parts.length < 2) return;

    const newPart = parts.at(-1);
    if (!newPart?.startsWith('+')) return;

    const parentParts = parts.slice(0, -1);
    const parentRanges: ParentRange[] = [];

    for (const part of parentParts) {
      const range = parseRange(part, '-');
      if (!range) return;
      parentRanges.push(range);
    }

    const newRange = parseRange(newPart, '+');
    if (!newRange) return;

    return {
      parentRanges,
      newRange,
      parentCount: parentRanges.length,
    };
  };

  const combinedChunk = (line: string): void => {
    if (!currentFile) {
      start(line);
    }

    const parsedHeader = parseCombinedChunkHeader(line);
    if (!parsedHeader) return;

    const [firstParent] = parsedHeader.parentRanges;
    const oldStartNum = firstParent?.start ?? 0;
    const oldLinesNum = firstParent?.lines ?? 0;

    deletedLineCounter = oldStartNum;
    addedLineCounter = parsedHeader.newRange.start;
    currentChunk = {
      content: line,
      changes: [],
      oldStart: oldStartNum,
      oldLines: oldLinesNum,
      newStart: parsedHeader.newRange.start,
      newLines: parsedHeader.newRange.lines,
      combined: true,
      parentCount: parsedHeader.parentCount,
      oldRanges: parsedHeader.parentRanges,
    };
    currentFileChanges = {
      oldLines: oldLinesNum,
      newLines: parsedHeader.newRange.lines,
      combined: true,
      parentCount: parsedHeader.parentCount,
      parentLines: parsedHeader.parentRanges.map((range) => range.lines),
    };
    if (currentFile) {
      const combinedFile = ensureCombinedFile(currentFile);
      combinedFile.froms = pendingFroms;
    }
    currentFile?.chunks.push(currentChunk);
  };

  const chunk = (line: string, match: RegExpMatchArray): void => {
    if (!currentFile) {
      start(line);
    }

    const [oldStart, oldNumLines, newStart, newNumLines] = match.slice(1);

    const oldStartNum = Number(oldStart ?? 0);
    const newStartNum = Number(newStart ?? 0);

    deletedLineCounter = oldStartNum;
    addedLineCounter = newStartNum;
    currentChunk = {
      content: line,
      changes: [],
      oldStart: oldStartNum,
      oldLines: toNumOfLines(oldNumLines),
      newStart: newStartNum,
      newLines: toNumOfLines(newNumLines),
    };
    currentFileChanges = {
      oldLines: toNumOfLines(oldNumLines),
      newLines: toNumOfLines(newNumLines),
    };
    currentFile?.chunks.push(currentChunk);
  };

  const del = (line: string): void => {
    if (!currentChunk || !currentFile || !currentFileChanges) return;

    currentChunk.changes.push({
      type: 'del',
      del: true,
      ln: deletedLineCounter++,
      content: line,
    });
    currentFile.deletions++;
    currentFileChanges.oldLines--;
  };

  const add = (line: string): void => {
    if (!currentChunk || !currentFile || !currentFileChanges) return;

    currentChunk.changes.push({
      type: 'add',
      add: true,
      ln: addedLineCounter++,
      content: line,
    });
    currentFile.additions++;
    currentFileChanges.newLines--;
  };

  const eof = (line: string): void => {
    if (!currentChunk) return;

    const [mostRecentChange] = currentChunk.changes.slice(-1);
    if (!mostRecentChange) return;

    currentChunk.changes.push({
      type: mostRecentChange.type,
      [mostRecentChange.type]: true,
      ln1: mostRecentChange.ln1,
      ln2: mostRecentChange.ln2,
      ln: mostRecentChange.ln,
      content: line,
    });
  };

  const parseCombinedContentLine = (line: string): void => {
    if (!currentChunk || !currentFile || !currentFileChanges) return;

    if (line.match(/^\\ No newline at end of file$/)) {
      eof(line);
      return;
    }

    const parentCount =
      currentChunk.parentCount ??
      currentFileChanges.parentCount ??
      currentFileChanges.parentLines?.length ??
      0;

    const parentLines = currentFileChanges.parentLines;

    if (!parentLines || parentCount <= 0) return;

    const prefix = line.slice(0, parentCount);
    const lineInResult = !prefix.includes('-');
    const isLineInParent = (marker: string): boolean => {
      if (marker === '-') return true;
      if (marker === '+') return false;
      return lineInResult;
    };
    const lineInFirstParent = isLineInParent(prefix[0] ?? ' ');

    if (lineInResult && !lineInFirstParent) {
      currentChunk.changes.push({
        type: 'add',
        add: true,
        ln: addedLineCounter++,
        content: line,
      });
      currentFile.additions++;
      currentFileChanges.newLines--;
    } else if (!lineInResult && lineInFirstParent) {
      currentChunk.changes.push({
        type: 'del',
        del: true,
        ln: deletedLineCounter++,
        content: line,
      });
      currentFile.deletions++;
      currentFileChanges.oldLines--;
    } else if (lineInResult && lineInFirstParent) {
      currentChunk.changes.push({
        type: 'normal',
        normal: true,
        ln1: deletedLineCounter++,
        ln2: addedLineCounter++,
        content: line,
      });
      currentFileChanges.oldLines--;
      currentFileChanges.newLines--;
    } else {
      currentChunk.changes.push({
        type: 'normal',
        normal: true,
        content: line,
      });
    }

    for (let i = 0; i < parentLines.length; i++) {
      if (!isLineInParent(prefix[i] ?? ' ')) continue;
      const parentLine = parentLines[i];
      if (parentLine !== undefined) {
        parentLines[i] = parentLine - 1;
      }
    }
  };

  type HeaderHandler = (line: string, match: RegExpMatchArray) => void;
  type ContentHandler = (line: string, match: RegExpMatchArray) => void;

  const schemaHeaders: [RegExp, HeaderHandler][] = [
    [/^Index:\s/, indexFile],
    [/^diff\s/, start],
    [/^new file mode (\d+)$/, newFile],
    [/^deleted file mode (\d+)$/, deletedFile],
    [/^old mode (\d+)$/, oldMode],
    [/^new mode (\d+)$/, newMode],
    [/^similarity index (\d+)%/, similarityIndex],
    [/^rename from /, renameFrom],
    [/^rename to /, renameTo],
    [/^Binary files .* and .* differ$/, binaryFiles],
    [/^index\s[\da-zA-Z]+(?:,[\da-zA-Z]+)*\.\.[\da-zA-Z]+(?:\s(\d+))?$/, index],
    [/^---\s/, fromFile],
    [/^\+\+\+\s/, toFile],
    [/^@{3,}\s/, combinedChunk],
    [/^@@\s+-(\d+),?(\d+)?\s+\+(\d+),?(\d+)?\s@@/, chunk],
    [/^\\ No newline at end of file$/, eof],
  ];

  const schemaContent: [RegExp, ContentHandler][] = [
    [/^\\ No newline at end of file$/, eof],
    [/^-/, del],
    [/^\+/, add],
    [/^\s+/, normal],
  ];

  const parseContentLine = (line: string): void => {
    if (currentFileChanges?.combined) {
      parseCombinedContentLine(line);
      const parentLines = currentFileChanges.parentLines;
      if (
        parentLines &&
        parentLines.every((count) => count === 0) &&
        currentFileChanges.newLines === 0
      ) {
        currentFileChanges = null;
      }
      return;
    }

    for (const [pattern, handler] of schemaContent) {
      const match = line.match(pattern);
      if (match) {
        handler(line, match);
        break;
      }
    }
    if (
      currentFileChanges &&
      currentFileChanges.oldLines === 0 &&
      currentFileChanges.newLines === 0
    ) {
      currentFileChanges = null;
    }
  };

  const parseHeaderLine = (line: string): void => {
    for (const [pattern, handler] of schemaHeaders) {
      const match = line.match(pattern);
      if (match) {
        handler(line, match);
        break;
      }
    }
  };

  const parseLine = (line: string): void => {
    if (currentFileChanges) {
      parseContentLine(line);
    } else {
      parseHeaderLine(line);
    }
    if (currentFile) {
      currentFile.rawDiff =
        currentFile.rawDiff.length === 0 ?
          line
        : `${currentFile.rawDiff}\n${line}`;
    }
  };

  for (const line of lines) parseLine(line);

  for (const file of files) {
    if (file.chunks.length === 0) continue;

    const diffLines: string[] = [];

    for (const fileChunk of file.chunks) {
      diffLines.push(fileChunk.content);
      for (const change of fileChunk.changes) {
        diffLines.push(change.content);
      }
    }

    file.diff = diffLines.join('\n');
  }

  return files;
}

const ensureRenamedFile = (file: DiffFile): DiffFileRenamed => {
  const renamedFile = file as DiffFileRenamed;
  renamedFile.type = 'renamed';
  renamedFile.similarityIndex ??= undefined;
  return renamedFile;
};

const ensureCombinedFile = (file: DiffFile): DiffFileCombined => {
  const combinedFile = file as DiffFileCombined;
  combinedFile.type = 'combined';
  combinedFile.froms ??= undefined;
  return combinedFile;
};

const fileNameDiffRegex =
  /(a|i|w|c|o|1|2)\/.*(?=["']? ["']?(b|i|w|c|o|1|2)\/)|(b|i|w|c|o|1|2)\/.*$/g;
const gitFileHeaderRegex = /^(a|b|i|w|c|o|1|2)\//;

const parseFiles = (line?: string): string[] | undefined => {
  const fileNames = line?.match(fileNameDiffRegex);
  return fileNames?.map((fileName) =>
    fileName.replace(gitFileHeaderRegex, '').replace(/("|')$/, ''),
  );
};

const quotedFileNameRegex = /^\\?['"]|\\?['"]$/g;

const parseOldOrNewFile = (line: string, prefix?: string): string => {
  let fileName: string;
  if (prefix) {
    fileName = line.slice(prefix.length);
  } else {
    fileName = leftTrimChars(line, '-+').trim();
  }
  fileName = removeTimeStamp(fileName);
  return fileName
    .replace(quotedFileNameRegex, '')
    .replace(gitFileHeaderRegex, '');
};

const leftTrimChars = (input: string, trimmingChars?: string): string => {
  if (!trimmingChars) return input.trimStart();

  const trimmingString = formTrimmingString(trimmingChars);

  return input.replace(new RegExp(`^${trimmingString}+`), '');
};

const timeStampRegex =
  /\t.*|\d{4}-\d\d-\d\d\s\d\d:\d\d:\d\d(.\d+)?\s(\+|-)\d\d\d\d/;

const removeTimeStamp = (input: string): string => {
  const timeStamp = timeStampRegex.exec(input);
  if (timeStamp) {
    return input.substring(0, timeStamp.index).trim();
  }
  return input;
};

const formTrimmingString = (
  trimmingChars: string | RegExp | null | undefined,
): string => {
  if (trimmingChars === null || trimmingChars === undefined) return '\\s';
  else if (trimmingChars instanceof RegExp) return trimmingChars.source;
  return `[${trimmingChars.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')}]`;
};
