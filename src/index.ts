import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  NotebookActions, INotebookTracker, NotebookPanel
} from '@jupyterlab/notebook';

import {
  CodeCell
} from '@jupyterlab/cells';

import {
  ReadonlyJSONObject
} from '@phosphor/coreutils';

import {
  each
} from '@phosphor/algorithm'

import '../style/index.css';


function addCommands(app: JupyterLab, palette: ICommandPalette, tracker: INotebookTracker): void {
  console.log('JupyterLab extension jupyterlab-cell-formatter-black is activated!');
  const { commands, shell } = app;

  // Get the current widget and activate unless the args specify otherwise.
  function getCurrent(args: ReadonlyJSONObject): NotebookPanel | null {
    const widget = tracker.currentWidget;
    const activate = args['activate'] !== false;

    if (activate && widget) {
      shell.activateById(widget.id);
    }

    return widget;
  }

  /**
   * Whether there is an active notebook.
   */
  function isEnabled(): boolean {
    return tracker.currentWidget !== null &&
           tracker.currentWidget === app.shell.currentWidget;
  }

  commands.addCommand('black:format-cell', {
    label: 'Format cell with Black',
    execute: args => {
      const current = getCurrent(args);

      if (current) {
        const { context, content } = current;        
        // Add `%%black` cell magic to each selected cell
        each(content.widgets, (child, i) => {
          if (content.isSelectedOrActive(child) && (child instanceof CodeCell)) {
            child.model.value.insert(0,'%%black\n')
          }
        });
        // Run each selected cell
        return NotebookActions.run(content, context.session);
      }
    },
    isEnabled
  });
  
  palette.addItem({command: 'black:format-cell', category: 'Notebook Cell Operations'});
}


/**
 * Initialization data for the jupyterlab-cell-formatter-black extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-cell-formatter-black',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker],
  activate: addCommands
};

export default extension;
