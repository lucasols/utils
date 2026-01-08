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

interface Chunk {
  content: string;
  changes: Change[];
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
}

interface FileChange {
  oldLines: number;
  newLines: number;
}

export interface DiffFile {
  chunks: Chunk[];
  deletions: number;
  additions: number;
  from?: string;
  to?: string;
  new?: boolean;
  deleted?: boolean;
  oldMode?: string;
  newMode?: string;
  index?: string[];
}

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
      chunks: [],
      deletions: 0,
      additions: 0,
      from: fromFileName,
      to: toFileName,
    };

    files.push(currentFile);
  };

  const restart = (): void => {
    if (!currentFile || currentFile.chunks.length) start();
  };

  const newFile = (_: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      currentFile.new = true;
      currentFile.newMode = match[1];
      currentFile.from = '/dev/null';
    }
  };

  const deletedFile = (_: string, match: RegExpMatchArray): void => {
    restart();
    if (currentFile) {
      currentFile.deleted = true;
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

  const fromFile = (line: string): void => {
    restart();
    if (currentFile) {
      currentFile.from = parseOldOrNewFile(line);
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

  type HeaderHandler = (line: string, match: RegExpMatchArray) => void;
  type ContentHandler = (line: string, match: RegExpMatchArray) => void;

  const schemaHeaders: [RegExp, HeaderHandler][] = [
    [/^diff\s/, start],
    [/^new file mode (\d+)$/, newFile],
    [/^deleted file mode (\d+)$/, deletedFile],
    [/^old mode (\d+)$/, oldMode],
    [/^new mode (\d+)$/, newMode],
    [/^index\s[\da-zA-Z]+\.\.[\da-zA-Z]+(\s(\d+))?$/, index],
    [/^---\s/, fromFile],
    [/^\+\+\+\s/, toFile],
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
  };

  for (const line of lines) parseLine(line);

  return files;
}

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

const parseOldOrNewFile = (line: string): string => {
  let fileName = leftTrimChars(line, '-+').trim();
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
