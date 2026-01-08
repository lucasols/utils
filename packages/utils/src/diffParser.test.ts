import { describe, expect, test } from 'vitest';
import { diffParser as parse } from './diffParser';
import { compactSnapshot } from './testUtils';

describe('diff parser', () => {
  test('should parse empty string', () => {
    expect(parse('').length).toBe(0);
  });

  test('should parse whitespace', () => {
    expect(parse(' ').length).toBe(0);
  });

  test('should parse simple git-like diff', () => {
    const diff = `\
diff --git a/file b/file
index 123..456 789
--- a/file
+++ b/file
@@ -1,2 +1,2 @@
- line1
+ line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1,2 +1,2 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
            oldStart: 1
            oldLines: 2
            newStart: 1
            newLines: 2
        deletions: 1
        additions: 1
        from: 'file'
        to: 'file'
        oldMode: '789'
        newMode: '789'
        index: ['123..456', '789']
        diff: |-
          @@ -1,2 +1,2 @@
          - line1
          + line2
      "
    `);
  });

  test('should parse file names when diff.mnemonicPrefix equals true', () => {
    const diff = `\
diff --git i/file w/file
index 123..456 789
--- i/file
+++ w/file
@@ -1,2 +1,2 @@
- line1
+ line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1,2 +1,2 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
            oldStart: 1
            oldLines: 2
            newStart: 1
            newLines: 2
        deletions: 1
        additions: 1
        from: 'file'
        to: 'file'
        oldMode: '789'
        newMode: '789'
        index: ['123..456', '789']
        diff: |-
          @@ -1,2 +1,2 @@
          - line1
          + line2
      "
    `);
  });

  test('should parse simple git-like diff with file enclosed by double-quote', () => {
    const diff = `\
diff --git "a/file1" "b/file2"
similarity index 100%
rename from "file1"
rename to "file2"\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'renamed'
        chunks: []
        deletions: 0
        additions: 0
        from: 'file1'
        to: 'file2'
        similarityIndex: 100
      "
    `);
  });

  test('should parse binary file diff with binary flag', () => {
    const diff = `\
diff --git a/screenshots/split-view.png b/screenshots/split-view.png
index 1c352c2..e1fb381 100644
Binary files a/screenshots/split-view.png and b/screenshots/split-view.png differ\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'binary'
        chunks: []
        deletions: 0
        additions: 0
        from: 'screenshots/split-view.png'
        to: 'screenshots/split-view.png'
        oldMode: '100644'
        newMode: '100644'
        index: ['1c352c2..e1fb381', '100644']
      "
    `);
  });

  test('should parse file names for changed binaries with spaces in their names', () => {
    const diff = `\
diff --git a/Artsy_Tests/ReferenceImages/ARTopMenuViewControllerSpec/selects 'home' by default as ipad@2x.png b/Artsy_Tests/ReferenceImages/ARTopMenuViewControllerSpec/selects 'home' by default as ipad@2x.png
index fc72ba34b..ec373e9a4 100644
Binary files a/Artsy_Tests/ReferenceImages/ARTopMenuViewControllerSpec/selects 'home' by default as ipad@2x.png and b/Artsy_Tests/ReferenceImages/ARTopMenuViewControllerSpec/selects 'home' by default as ipad@2x.png differ\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'binary'
        chunks: []
        deletions: 0
        additions: 0
        from: "Artsy_Tests/ReferenceImages/ARTopMenuViewControllerSpec/selects 'home' by default as ipad@2x.png"
        to: "Artsy_Tests/ReferenceImages/ARTopMenuViewControllerSpec/selects 'home' by default as ipad@2x.png"
        oldMode: '100644'
        newMode: '100644'
        index: ['fc72ba34b..ec373e9a4', '100644']
      "
    `);
  });

  test('should parse diff with new file mode line', () => {
    const diff = `\
diff --git a/test b/test
new file mode 100644
index 0000000..db81be4
--- /dev/null
+++ b/test
@@ -0,0 +1,2 @@
+line1
+line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'new'
        chunks:
          - content: '@@ -0,0 +1,2 @@'
            changes:
              - { type: 'add', add: '✅', ln: 1, content: '+line1' }
              - { type: 'add', add: '✅', ln: 2, content: '+line2' }
            oldStart: 0
            oldLines: 0
            newStart: 1
            newLines: 2
        deletions: 0
        additions: 2
        from: '/dev/null'
        to: 'test'
        newMode: '100644'
        index: ['0000000..db81be4']
        diff: |-
          @@ -0,0 +1,2 @@
          +line1
          +line2
      "
    `);
  });

  test('should parse diff with deleted file mode line', () => {
    const diff = `\
diff --git a/test b/test
deleted file mode 100644
index db81be4..0000000
--- b/test
+++ /dev/null
@@ -1,2 +0,0 @@
-line1
-line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'deleted'
        chunks:
          - content: '@@ -1,2 +0,0 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '-line1' }
              - { type: 'del', del: '✅', ln: 2, content: '-line2' }
            oldStart: 1
            oldLines: 2
            newStart: 0
            newLines: 0
        deletions: 2
        additions: 0
        from: 'test'
        to: '/dev/null'
        oldMode: '100644'
        index: ['db81be4..0000000']
        diff: |-
          @@ -1,2 +0,0 @@
          -line1
          -line2
      "
    `);
  });

  test('should parse diff with old and new mode lines', () => {
    const diff = `\
diff --git a/file b/file
old mode 100644
new mode 100755
index 123..456
--- a/file
+++ b/file
@@ -1,2 +1,2 @@
- line1
+ line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1,2 +1,2 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
            oldStart: 1
            oldLines: 2
            newStart: 1
            newLines: 2
        deletions: 1
        additions: 1
        from: 'file'
        to: 'file'
        oldMode: '100644'
        newMode: '100755'
        index: ['123..456']
        diff: |-
          @@ -1,2 +1,2 @@
          - line1
          + line2
      "
    `);
  });

  test('should parse diff with single line files', () => {
    const diff = `\
diff --git a/file1 b/file1
deleted file mode 100644
index db81be4..0000000
--- b/file1
+++ /dev/null
@@ -1 +0,0 @@
-line1
diff --git a/file2 b/file2
new file mode 100644
index 0000000..db81be4
--- /dev/null
+++ b/file2
@@ -0,0 +1 @@
+line1\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'deleted'
        chunks:
          - content: '@@ -1 +0,0 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '-line1' }
            oldStart: 1
            oldLines: 1
            newStart: 0
            newLines: 0
        deletions: 1
        additions: 0
        from: 'file1'
        to: '/dev/null'
        oldMode: '100644'
        index: ['db81be4..0000000']
        diff: |-
          @@ -1 +0,0 @@
          -line1
      - type: 'new'
        chunks:
          - content: '@@ -0,0 +1 @@'
            changes:
              - { type: 'add', add: '✅', ln: 1, content: '+line1' }
            oldStart: 0
            oldLines: 0
            newStart: 1
            newLines: 1
        deletions: 0
        additions: 1
        from: '/dev/null'
        to: 'file2'
        newMode: '100644'
        index: ['0000000..db81be4']
        diff: |-
          @@ -0,0 +1 @@
          +line1
      "
    `);
  });

  test('should parse multiple files in diff', () => {
    const diff = `\
diff --git a/file1 b/file1
index 123..456 789
--- a/file1
+++ b/file1
@@ -1,1 +1,1 @@
- line1
+ line2
diff --git a/file2 b/file2
index 123..456 789
--- a/file2
+++ b/file2
@@ -1,1 +1,1 @@
- line1
+ line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1,1 +1,1 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
            oldStart: 1
            oldLines: 1
            newStart: 1
            newLines: 1
        deletions: 1
        additions: 1
        from: 'file1'
        to: 'file1'
        oldMode: '789'
        newMode: '789'
        index: ['123..456', '789']
        diff: |-
          @@ -1,1 +1,1 @@
          - line1
          + line2
      - type: 'modified'
        chunks:
          - content: '@@ -1,1 +1,1 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
            oldStart: 1
            oldLines: 1
            newStart: 1
            newLines: 1
        deletions: 1
        additions: 1
        from: 'file2'
        to: 'file2'
        oldMode: '789'
        newMode: '789'
        index: ['123..456', '789']
        diff: |-
          @@ -1,1 +1,1 @@
          - line1
          + line2
      "
    `);
  });

  test('should parse diff with EOF flag', () => {
    const diff = `\
diff --git a/file1 b/file1
index 123..456 789
--- a/file1
+++ b/file1
@@ -1,1 +1,1 @@
- line1
\\ No newline at end of file
+ line2
\\ No newline at end of file
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1,1 +1,1 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - type: 'del'
                del: '✅'
                ln: 1
                content: '\\ No newline at end of file'
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
              - type: 'add'
                add: '✅'
                ln: 1
                content: '\\ No newline at end of file'
            oldStart: 1
            oldLines: 1
            newStart: 1
            newLines: 1
        deletions: 1
        additions: 1
        from: 'file1'
        to: 'file1'
        oldMode: '789'
        newMode: '789'
        index: ['123..456', '789']
        diff: |-
          @@ -1,1 +1,1 @@
          - line1
          \\ No newline at end of file
          + line2
          \\ No newline at end of file
      "
    `);
  });

  test('should parse gnu sample diff', () => {
    const diff = `\
--- lao	2002-02-21 23:30:39.942229878 -0800
+++ tzu	2002-02-21 23:30:50.442260588 -0800
@@ -1,7 +1,6 @@
-The Way that can be told of is not the eternal Way;
-The name that can be named is not the eternal name.
 The Nameless is the origin of Heaven and Earth;
-The Named is the mother of all things.
+The named is the mother of all things.
+
 Therefore let there always be non-being,
	so we may see their subtlety,
 And let there always be being,
@@ -9,3 +8,6 @@
 The two are the same,
 But after they are produced,
	they have different names.
+They both may be called deep and profound.
+Deeper and more profound,
+The door of all subtleties!\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1,7 +1,6 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '-The Way that can be told of is not the eternal Way;' }
              - { type: 'del', del: '✅', ln: 2, content: '-The name that can be named is not the eternal name.' }
              - type: 'normal'
                normal: '✅'
                ln1: 3
                ln2: 1
                content: ' The Nameless is the origin of Heaven and Earth;'
              - { type: 'del', del: '✅', ln: 4, content: '-The Named is the mother of all things.' }
              - { type: 'add', add: '✅', ln: 2, content: '+The named is the mother of all things.' }
              - { type: 'add', add: '✅', ln: 3, content: '+' }
              - type: 'normal'
                normal: '✅'
                ln1: 5
                ln2: 4
                content: ' Therefore let there always be non-being,'
              - { type: 'normal', normal: '✅', ln1: 6, ln2: 5, content: '	so we may see their subtlety,' }
              - { type: 'normal', normal: '✅', ln1: 7, ln2: 6, content: ' And let there always be being,' }
            oldStart: 1
            oldLines: 7
            newStart: 1
            newLines: 6
          - content: '@@ -9,3 +8,6 @@'
            changes:
              - { type: 'normal', normal: '✅', ln1: 9, ln2: 8, content: ' The two are the same,' }
              - { type: 'normal', normal: '✅', ln1: 10, ln2: 9, content: ' But after they are produced,' }
              - { type: 'normal', normal: '✅', ln1: 11, ln2: 10, content: '	they have different names.' }
              - { type: 'add', add: '✅', ln: 11, content: '+They both may be called deep and profound.' }
              - { type: 'add', add: '✅', ln: 12, content: '+Deeper and more profound,' }
              - { type: 'add', add: '✅', ln: 13, content: '+The door of all subtleties!' }
            oldStart: 9
            oldLines: 3
            newStart: 8
            newLines: 6
        deletions: 3
        additions: 5
        from: 'lao'
        to: 'tzu'
        diff: |-
          @@ -1,7 +1,6 @@
          -The Way that can be told of is not the eternal Way;
          -The name that can be named is not the eternal name.
           The Nameless is the origin of Heaven and Earth;
          -The Named is the mother of all things.
          +The named is the mother of all things.
          +
           Therefore let there always be non-being,
          	so we may see their subtlety,
           And let there always be being,
          @@ -9,3 +8,6 @@
           The two are the same,
           But after they are produced,
          	they have different names.
          +They both may be called deep and profound.
          +Deeper and more profound,
          +The door of all subtleties!
      "
    `);
  });

  test('should parse hg diff output', () => {
    const diff = `\
diff -r 514fc757521e lib/parsers.coffee
--- a/lib/parsers.coffee	Thu Jul 09 00:56:36 2015 +0200
+++ b/lib/parsers.coffee	Fri Jul 10 16:23:43 2015 +0200
@@ -43,6 +43,9 @@
             files[file] = { added: added, deleted: deleted }
         files

+    diff: (out) ->
+        files = {}
+
 module.exports = Parsers

 module.exports.version = (out) ->\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -43,6 +43,9 @@'
            changes:
              - type: 'normal'
                normal: '✅'
                ln1: 43
                ln2: 43
                content: '             files[file] = { added: added, deleted: deleted }'
              - { type: 'normal', normal: '✅', ln1: 44, ln2: 44, content: '         files' }
              - { type: 'add', add: '✅', ln: 45, content: '+    diff: (out) ->' }
              - { type: 'add', add: '✅', ln: 46, content: '+        files = {}' }
              - { type: 'add', add: '✅', ln: 47, content: '+' }
              - { type: 'normal', normal: '✅', ln1: 45, ln2: 48, content: ' module.exports = Parsers' }
              - { type: 'normal', normal: '✅', ln1: 46, ln2: 49, content: ' module.exports.version = (out) ->' }
            oldStart: 43
            oldLines: 6
            newStart: 43
            newLines: 9
        deletions: 0
        additions: 3
        from: 'lib/parsers.coffee'
        to: 'lib/parsers.coffee'
        diff: |-
          @@ -43,6 +43,9 @@
                       files[file] = { added: added, deleted: deleted }
                   files
          +    diff: (out) ->
          +        files = {}
          +
           module.exports = Parsers
           module.exports.version = (out) ->
      "
    `);
  });

  test('should parse svn diff output', () => {
    const diff = `\
Index: new.txt
===================================================================
--- new.txt	(revision 0)
+++ new.txt	(working copy)
@@ -0,0 +1 @@
+test
Index: text.txt
===================================================================
--- text.txt	(revision 6)
+++ text.txt	(working copy)
@@ -1,7 +1,5 @@
-This part of the
-document has stayed the
-same from version to
-version.  It shouldn't
+This is an important
+notice! It shouldn't
 be shown if it doesn't
 change.  Otherwise, that
 would not be helping to\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -0,0 +1 @@'
            changes:
              - { type: 'add', add: '✅', ln: 1, content: '+test' }
            oldStart: 0
            oldLines: 0
            newStart: 1
            newLines: 1
        deletions: 0
        additions: 1
        from: 'new.txt'
        to: 'new.txt'
        diff: |-
          @@ -0,0 +1 @@
          +test
      - type: 'modified'
        chunks:
          - content: '@@ -1,7 +1,5 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '-This part of the' }
              - { type: 'del', del: '✅', ln: 2, content: '-document has stayed the' }
              - { type: 'del', del: '✅', ln: 3, content: '-same from version to' }
              - type: 'del'
                del: '✅'
                ln: 4
                content: "-version.  It shouldn't"
              - { type: 'add', add: '✅', ln: 1, content: '+This is an important' }
              - type: 'add'
                add: '✅'
                ln: 2
                content: "+notice! It shouldn't"
              - type: 'normal'
                normal: '✅'
                ln1: 5
                ln2: 3
                content: " be shown if it doesn't"
              - { type: 'normal', normal: '✅', ln1: 6, ln2: 4, content: ' change.  Otherwise, that' }
              - { type: 'normal', normal: '✅', ln1: 7, ln2: 5, content: ' would not be helping to' }
            oldStart: 1
            oldLines: 7
            newStart: 1
            newLines: 5
        deletions: 4
        additions: 2
        from: 'text.txt'
        to: 'text.txt'
        diff: |-
          @@ -1,7 +1,5 @@
          -This part of the
          -document has stayed the
          -same from version to
          -version.  It shouldn't
          +This is an important
          +notice! It shouldn't
           be shown if it doesn't
           change.  Otherwise, that
           would not be helping to
      "
    `);
  });

  test('should parse GitHub API patch diff when listing files of a pull request', () => {
    const diff = `@@ -1 +1 @@
-hello world
+hello universe`;

    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1 +1 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '-hello world' }
              - { type: 'add', add: '✅', ln: 1, content: '+hello universe' }
            oldStart: 1
            oldLines: 1
            newStart: 1
            newLines: 1
        deletions: 1
        additions: 1
        diff: |-
          @@ -1 +1 @@
          -hello world
          +hello universe
      "
    `);
  });

  test('should parse file names for n new empty file', () => {
    const diff = `\
diff --git a/newFile.txt b/newFile.txt
new file mode 100644
index 0000000..e6a2e28\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'new'
        chunks: []
        deletions: 0
        additions: 0
        from: '/dev/null'
        to: 'newFile.txt'
        newMode: '100644'
        index: ['0000000..e6a2e28']
      "
    `);
  });

  test('should parse file names for a deleted file', () => {
    const diff = `\
diff --git a/deletedFile.txt b/deletedFile.txt
deleted file mode 100644
index e6a2e28..0000000\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'deleted'
        chunks: []
        deletions: 0
        additions: 0
        from: 'deletedFile.txt'
        to: '/dev/null'
        oldMode: '100644'
        index: ['e6a2e28..0000000']
      "
    `);
  });

  test('should parse rename diff with renamed and similarityIndex', () => {
    const diff = `\
diff --git a/test.txt b/text2.txt
similarity index 100%
rename from test.txt
rename to text2.txt\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'renamed'
        chunks: []
        deletions: 0
        additions: 0
        from: 'test.txt'
        to: 'text2.txt'
        similarityIndex: 100
      "
    `);
  });

  test('should parse rename diff with partial similarity', () => {
    const diff = `\
diff --git a/old.txt b/new.txt
similarity index 85%
rename from old.txt
rename to new.txt
index 123..456
--- a/old.txt
+++ b/new.txt
@@ -1,2 +1,2 @@
- line1
+ line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'renamed'
        chunks:
          - content: '@@ -1,2 +1,2 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
            oldStart: 1
            oldLines: 2
            newStart: 1
            newLines: 2
        deletions: 1
        additions: 1
        from: 'old.txt'
        to: 'new.txt'
        index: ['123..456']
        diff: |-
          @@ -1,2 +1,2 @@
          - line1
          + line2
        similarityIndex: 85
      "
    `);
  });

  test('should parse rename diff with space in path with no changes', () => {
    const diff = `\
diff --git a/My Folder/File b/My Folder/a/File
similarity index 100%
rename from a/My Folder/File
rename to My Folder/a/File\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'renamed'
        chunks: []
        deletions: 0
        additions: 0
        from: 'My Folder/File'
        to: 'My Folder/a/File'
        similarityIndex: 100
      "
    `);
  });

  test('should parse rename diff with space in path with changes', () => {
    const diff = `\
diff --git a/My Folder/File b/My Folder/a/File
similarity index 100%
rename from a/My Folder/File
rename to My Folder/a/File
@@ -1,2 +1,2 @@
- line1
+ line2\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'renamed'
        chunks:
          - content: '@@ -1,2 +1,2 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line1' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line2' }
            oldStart: 1
            oldLines: 2
            newStart: 1
            newLines: 2
        deletions: 1
        additions: 1
        from: 'My Folder/File'
        to: 'My Folder/a/File'
        diff: |-
          @@ -1,2 +1,2 @@
          - line1
          + line2
        similarityIndex: 100
      "
    `);
  });

  test('should parse diff with single line quote escaped file names', () => {
    const diff = `
diff --git "a/file \\"space\\"" "b/file \\"space\\""
index 9daeafb..88bd214 100644
--- "a/file \\"space\\""
+++ "b/file \\"space\\""
@@ -1 +1 @@
-test
+test\\n1234
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1 +1 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '-test' }
              - type: 'add'
                add: '✅'
                ln: 1
                content: '+test\\n1234'
            oldStart: 1
            oldLines: 1
            newStart: 1
            newLines: 1
        deletions: 1
        additions: 1
        from: 'file \\"space\\"'
        to: 'file \\"space\\"'
        oldMode: '100644'
        newMode: '100644'
        index: ['9daeafb..88bd214', '100644']
        diff: |-
          @@ -1 +1 @@
          -test
          +test\\n1234
      "
    `);
  });

  test("should parse files with additional '-' and '+'", () => {
    const diff = `\
diff --git a/file1 b/file1
index 123..456 789
--- a/file1
+++ b/file1
@@ -1,2 +1,1 @@
- line11
--- line12
+ line21
diff --git a/file2 b/file2
index 123..456 789
--- a/file2
+++ b/file2
@@ -1,2 +1,1 @@
- line11
+++ line21
+ line22\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'modified'
        chunks:
          - content: '@@ -1,2 +1,1 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line11' }
              - { type: 'del', del: '✅', ln: 2, content: '--- line12' }
              - { type: 'add', add: '✅', ln: 1, content: '+ line21' }
            oldStart: 1
            oldLines: 2
            newStart: 1
            newLines: 1
        deletions: 2
        additions: 1
        from: 'file1'
        to: 'file1'
        oldMode: '789'
        newMode: '789'
        index: ['123..456', '789']
        diff: |-
          @@ -1,2 +1,1 @@
          - line11
          --- line12
          + line21
      - type: 'modified'
        chunks:
          - content: '@@ -1,2 +1,1 @@'
            changes:
              - { type: 'del', del: '✅', ln: 1, content: '- line11' }
              - { type: 'add', add: '✅', ln: 1, content: '+++ line21' }
              - { type: 'add', add: '✅', ln: 2, content: '+ line22' }
            oldStart: 1
            oldLines: 2
            newStart: 1
            newLines: 1
        deletions: 1
        additions: 2
        from: 'file2'
        to: 'file2'
        oldMode: '789'
        newMode: '789'
        index: ['123..456', '789']
        diff: |-
          @@ -1,2 +1,1 @@
          - line11
          +++ line21
          + line22
      "
    `);
  });

  test('should parse combined git diff', () => {
    const diff = `\
diff --cc file.txt
index bacb5fc,b8b0f61..97366e3
--- a/file.txt
+++ b/file.txt
@@@ -1,3 -1,3 +1,3 @@@
  one
- two-branch1
 -two-branch2
++two-merged
  three\
`;
    const files = parse(diff);
    expect(compactSnapshot(files)).toMatchInlineSnapshot(`
      "
      - type: 'combined'
        chunks:
          - content: '@@@ -1,3 -1,3 +1,3 @@@'
            changes:
              - { type: 'normal', normal: '✅', ln1: 1, ln2: 1, content: '  one' }
              - { type: 'del', del: '✅', ln: 2, content: '- two-branch1' }
              - { type: 'normal', normal: '✅', content: ' -two-branch2' }
              - { type: 'add', add: '✅', ln: 2, content: '++two-merged' }
              - { type: 'normal', normal: '✅', ln1: 3, ln2: 3, content: '  three' }
            oldStart: 1
            oldLines: 3
            newStart: 1
            newLines: 3
            combined: '✅'
            parentCount: 2
            oldRanges:
              - { start: 1, lines: 3 }
              - { start: 1, lines: 3 }
        deletions: 1
        additions: 1
        from: 'file.txt'
        to: 'file.txt'
        index: ['bacb5fc,b8b0f61..97366e3']
        diff: |-
          @@@ -1,3 -1,3 +1,3 @@@
            one
          - two-branch1
           -two-branch2
          ++two-merged
            three
      "
    `);
  });
});
