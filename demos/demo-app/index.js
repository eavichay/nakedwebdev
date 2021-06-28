import 'https://www.unpkg.com/slim-js@5.0.6/dist/index.js?module';
import 'https://www.unpkg.com/slim-js@5.0.6/dist/directives/all.js?module';

import './user-service.js';
import './task-service.js';
import './settings-service.js';

import './settings-component.js';
import './app-component.js';
import './board-component.js';
import './list-component.js';
import './task-component.js';

import { on } from './model.js';

on('theme', () => {
  alert('theme changed');
});
