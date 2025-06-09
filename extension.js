const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const addIncrementCommand = vscode.commands.registerCommand('array-indexer.addIncrement', function () {

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

		const selection = editor.selection;
        const text = editor.document.getText(selection);

		let result = removeComment(text);
		result = addComment(result);

		editor.edit(editBuilder => {
			editBuilder.replace(selection, result);
		});

		// Display a message box to the user
		vscode.window.showInformationMessage('Added index to array!');
	});

	const removeIncrementCommand = vscode.commands.registerCommand('array-indexer.removeIncrement', function () {

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

		const selection = editor.selection;
        const text = editor.document.getText(selection);

		let result = removeComment(text);

		editor.edit(editBuilder => {
			editBuilder.replace(selection, result);
		});

		// Display a message box to the user
		vscode.window.showInformationMessage('Removed index from array!');
	});

	function removeComment(text){
		const uncomment_regex = /\/\*i=\d+\s*\*\//g;

		return text.replace(uncomment_regex, '');
	}

	function addComment(text) {
	    const comment_regex = setCommentRegex();
	    let counter = 0;

	    let lines = text.split('\n');

	    // First pass: Add raw comments (unformatted)
	    for (let i = 0; i < lines.length; i++) {
	        // lines[i] = lines[i].replace(comment_regex, `/*i=${counter++}*/$&`);
			if(comment_regex.test(lines[i])){
				counter++;
			}
	    }

	    // Determine the max width for padding
	    const maxDigits = (counter - 1).toString().length;
		console.log(maxDigits);
		counter = 0;
	    // Second pass: Format the comments with padding
	    for (let i = 0; i < lines.length; i++) {

			let couterPadded =  String(counter).padEnd(maxDigits, ' ');
			lines[i] = lines[i].replace(comment_regex, `/*i=${couterPadded}*/$&`);
			counter++;
	        // const indexComment = lines[i].match(/\/\*i=\d+\*\//);

	        // if (indexComment) {
	        //     const index = indexComment[0].match(/\d+/);

	        //     const padded = String(index).padEnd(maxDigits, ' ');
			// 	console.log(padded);
	        //     lines[i] = lines[i].replace(/\/\*i=\d+\*\//, `/*i=${padded}*/`);
	        // }
	    }

	    return lines.join('\n');
	}

	function setCommentRegex(){
		const config = vscode.workspace.getConfiguration('array-indexer');
		const charToIndex = config.get('indexCharacter');

		if (charToIndex == '{') {
			return /\{/;
		} else if (charToIndex == '['){
			return /\[/;
		} else if (charToIndex == '['){
			return /\{/;
		} else {
			return /[\{\[\(]/;
		}
	}

	context.subscriptions.push(addIncrementCommand);
	context.subscriptions.push(removeIncrementCommand);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
