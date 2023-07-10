export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs';

export interface Project {
    id: string;
    name: string;
    framework: ProjectFrameworks;
}
