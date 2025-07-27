const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const addIncrementCommand = vscode.commands.registerCommand('array-indexer.addIncrement', function () {

		indexer(true);

	});

	const removeIncrementCommand = vscode.commands.registerCommand('array-indexer.removeIncrement', function () {

		indexer(false);

	});

	function indexer(addStatus){

		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

        const selection_text = editor.document.getText(editor.selection);

		let result = removeComment(selection_text);

		if(addStatus == true) {
			result = addComment(result);
		}

		editor.edit(editBuilder => {
			editBuilder.replace(editor.selection, result);
		});
	}

	function removeComment(text){
		const uncomment_regex = /\/\*i=\d+\s*\*\//g;

		return text.replace(uncomment_regex, '');
	}

	function addComment(text) {
	    const comment_char = setCommentChar();
		const match_regex = new RegExp(`^\\s*[${comment_char}]`);
		const comment_regex = new RegExp(`[${comment_char}]`);

	    let counter = 0;
	    let lines = text.split('\n');

	    // First pass: Count max counter
	    for (let i = 0; i < lines.length; i++) {

			if(match_regex.test(lines[i])){
				counter++;
			}
	    }

	    // Determine number of digits of counter
	    const max_digits = (counter - 1).toString().length;
		counter = 0;

	    // Second pass: Add comments with padding
	    for (let i = 0; i < lines.length; i++) {

			if(match_regex.test(lines[i])){
				let couterPadded =  String(counter).padEnd(max_digits, ' ');
				lines[i] = lines[i].replace(comment_regex, `/*i=${couterPadded}*/$&`);
				counter++;
			}
	    }

		vscode.window.showInformationMessage(`Indexed "${counter} elements."`);
	    return lines.join('\n');
	}

	function setCommentChar(){
		const config = vscode.workspace.getConfiguration('array-indexer');
		const char_index = config.get('indexCharacter');

		const regex_map = {
			'{': '{',
			'[': '[',
			'(': '(',
			'"': '"',
			"'": "'",
			'Alphanumeric': 'a-zA-Z0-9'
		};

		return regex_map[char_index];
	}

	const setIndexCharacterCommand = vscode.commands.registerCommand('array-indexer.setIndexCharacter', async function () {
    	const options = ['{', '[', '(', '"', "'", 'Alphanumeric'];

    	const selected = await vscode.window.showQuickPick(options, {
    	    placeHolder: 'Select the character to index'
    	});

    	if (selected) {
    	    const config = vscode.workspace.getConfiguration('array-indexer');
    	    await config.update('indexCharacter', selected, vscode.ConfigurationTarget.Global);
    	    vscode.window.showInformationMessage(`Index character set to "${selected}"`);
    	}
	});

	context.subscriptions.push(addIncrementCommand);
	context.subscriptions.push(removeIncrementCommand);
	context.subscriptions.push(setIndexCharacterCommand);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
