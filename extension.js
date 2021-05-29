const vscode = require('vscode')

function openFile (fileName) {
  return vscode.workspace.openTextDocument(fileName)
    .then(textDocument => vscode.window.showTextDocument(textDocument))
}

class ViewComponentDefinitionProvider {
  async provideDefinition (document, position, token) {
    const componentName = this.getComponentName(document, position)
    console.log(componentName)
    await openFile(`${vscode.workspace.rootPath}/app/components/${componentName}`)
    return undefined
  }

  getComponentName (document, position) {
    return this.getComponentNameFromLine(
      document.lineAt(position.line).text
    )
  }

  getComponentNameFromLine (text) {
    if (!(/Component/.test(text))) { return '' }
    const componentName = text.split(' ').filter(function (el) { return el.indexOf('Component') !== -1 })[0].split('.new')[0]

    return this.filePath(componentName)
  }

  filePath (componentName) {
    const toSnakeCase = str =>
      str &&
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('_')

    return componentName.split('::').map(el => toSnakeCase(el)).join('/') + '.rb'
  }
}

const SELECTOR = ['erb', 'haml', 'slim']

function activate (context) {
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      SELECTOR, new (ViewComponentDefinitionProvider)()
    )
  )
}

function deactivate () {}
module.exports = {
  activate,
  deactivate
}
