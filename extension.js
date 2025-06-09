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
	
	function addComment(text){
		const comment_regex = setCommentRegex();
		let counter = 0;
        let lines = text.split('\n');

		for(i = 0; i < lines.length; i++){
			lines[i] = lines[i].replace(comment_regex, (a) => {
				if (counter > 9) {
					return `/*i=${counter++}*/${a}`;
				}				
				else {
					return `/*i=${counter++} */${a}`;
				}
			});	
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
