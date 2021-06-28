import {
  Slim,
  Utils,
} from 'https://www.unpkg.com/slim-js@5.0.6/dist/index.js?module';
import { depInj } from '../../modules/depinj.js';
import TASK_SERVICE from './task-service.js';

const tpl = /*html*/ `
<header>{{this.list.title}}</header>
<main id="drop-target" @drop="this.handleDrop(event)" @dragover="this.handleDragOver(event)">
  <task-component @dragstart="this.handleDragStart(event, item)" draggable="true" class="task" *repeat="{{this.list?.items}}" .task="item" data-title="{{item.title}}">
  </task-component>
</main>
<style>
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  header {
    background-color: greenyellow;
    padding: 0.25em;
    font-family: sans-serif;
  }
  main {
    height: 100%;
    padding: 0.5em;
  }
  .task-content {
    display: flex;
    flex-direction: column;
  }
</style>
`;

Slim.element(
  'list-component',
  tpl,
  class extends depInj(Slim) {
    static inject = [TASK_SERVICE];
    constructor() {
      super();
      this.dependencies[TASK_SERVICE].on('TASK MOVED', (data) => {
        Utils.forceUpdate(this);
      });
      this.dependencies[TASK_SERVICE].on('NEW TASK', (data) => {
        Utils.forceUpdate(this);
      });
    }

    handleDragStart(event, item) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          item,
          list: this.list.title,
        })
      );
    }

    handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.effectAllowed = 'move';
    }

    handleDrop(event) {
      const { item, list } = JSON.parse(
        event.dataTransfer.getData('text/plain')
      );
      const service = this.dependencies[TASK_SERVICE];
      const fromList = service.findList(list);
      service.moveTask(item.id, fromList, this.list);
    }
  }
);
