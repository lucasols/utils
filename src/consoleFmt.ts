const colorToCodeASCII = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  black: '\x1b[30m',
  gray: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

function consoleColors(color: keyof typeof colorToCodeASCII, text: string) {
  return `${colorToCodeASCII[color]}${text}\x1b[0m`;
}

function bold(text: string) {
  return `\x1b[1m${text}\x1b[0m`;
}

function underline(text: string) {
  return `\x1b[4m${text}\x1b[0m`;
}

const bgColorToCodeASCII = {
  red: '\x1b[41m',
  green: '\x1b[42m',
  yellow: '\x1b[43m',
  blue: '\x1b[44m',
  magenta: '\x1b[45m',
  cyan: '\x1b[46m',
  white: '\x1b[47m',
  black: '\x1b[40m',
  gray: '\x1b[100m',
  brightRed: '\x1b[101m',
  brightGreen: '\x1b[102m',
  brightYellow: '\x1b[103m',
  brightBlue: '\x1b[104m',
  brightMagenta: '\x1b[105m',
  brightCyan: '\x1b[106m',
  brightWhite: '\x1b[107m',
};

function bgColor(color: keyof typeof bgColorToCodeASCII, text: string) {
  const resetBgColor = '\x1b[49m';
  return `${bgColorToCodeASCII[color]}${text}${resetBgColor}\x1b[0m`;
}

export const consoleFmt = {
  color: consoleColors,
  bold,
  underline,
  bgColor,
};
