import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectRoot = join(import.meta.dirname, '..');
const claudeMdPath = join(projectRoot, 'CLAUDE.md');
const agentsMdPath = join(projectRoot, 'AGENTS.md');

try {
  const claudeMdContent = readFileSync(claudeMdPath, 'utf-8');

  writeFileSync(agentsMdPath, claudeMdContent, 'utf-8');

  console.info(' Successfully synced CLAUDE.md to AGENTS.md');
} catch (error) {
  console.error('L Error syncing files:', error);
  process.exit(1);
}
