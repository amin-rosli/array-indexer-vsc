# Array Indexer

## Features

Personal tool for myself but what it could do:

- Automatically add incremental index comments like `/*i=0*/`, `/*i=1*/`, etc. to lines containing specific characters.
- Remove all index comments in a single command.
- Choose what characters should trigger the indexing via settings:
  - `{`, `[`, `(`, `"`, `'`, or Alphanumeric.


## How to Use

1. **Select the code** block you want to index.
2. Run `Add Increment` (default keybind: `ctrl + alt + 9`) to add index comments to your code.
3. Run `Remove Increment` (default keybind: `ctrl + alt + 0`) to add index comments to your code.

### Command Pallete :
   - `Array Indexer: Add Increment` → to insert index comments.
   - `Array Indexer: Remove Increment` → to remove all index comments.
   - `Array Indexer: Set Index Character` → to change which character triggers indexing.

### Keybinds.json

You can modify the keybinds for `Add Increment` and `Remove Increment` there.

## Example

![video](https://github.com/amin-rosli/array-indexer-vsc/blob/dev1/media/Example.gif)