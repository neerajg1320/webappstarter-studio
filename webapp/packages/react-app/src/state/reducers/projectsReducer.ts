import produce from 'immer';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { Project } from '../project';
import { randomIdGenerator } from '../id';

interface ProjectsState {
  currentProject: Project
}

const initialState: ProjectsState = {
  currentProject: {
    id: '0',
    name: 'default',
    framework: "none"
  }
}

const reducer = produce((state: ProjectsState = initialState, action: Action): ProjectsState => {
  switch(action.type) {

    case ActionType.SET_CURRENT_PROJECT:
      const {name, framework} = action.payload;
      const project: Project = {
        id: randomIdGenerator(),
        name,
        framework
      };

      state.currentProject = project;
      return state;    

    default:
      return state;  
  }
}, initialState);

export default reducer;