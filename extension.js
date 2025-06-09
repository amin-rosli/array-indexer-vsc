// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "array-indexer" is now active!');

	const addIncrementCommand = vscode.commands.registerCommand('array-indexer.addIncrement', function () {

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

		const selection = editor.selection;
        const text = editor.document.getText(selection); 
		console.log(text);

		let result = removeComment(text);
		result = addComment(result);

		console.log(result);

		editor.edit(editBuilder => {
			editBuilder.replace(selection, result);
		});

		// Display a message box to the user
		vscode.window.showInformationMessage('Added index to array!');
	});

	const removeIncrementCommand = vscode.commands.registerCommand('array-indexer.removeIncrement', function () {
		// The code you place here will be executed every time your command is executed
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

	function removeComment(selected_text){
		const uncomment_regex = /\/\*i=\d+\s*\*\//g;
		
		return selected_text.replace(uncomment_regex, '');
	}
	
	function addComment(selected_text){
		const comment_regex = /\n\s*\{/g;
		let counter = 0;

		let result = selected_text.replace(/\{/ , `/*i=${counter++} */$&`)

		result = result.replace(comment_regex, (a) => {
			
			const newlineAndSpaces = a.match(/\n\s*/);

			console.log(newlineAndSpaces);

			if (counter > 9) {
				return `${newlineAndSpaces}/*i=${counter++}*/{`
			}				
			else {
				return `${newlineAndSpaces}/*i=${counter++} */{`
			}
		});

		return result;
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
