export type ProjectFrameworks = 'reactjs' | 'vuejs' | 'angularjs' | 'none';

export interface Project {
    id: string;
    name: string;
    framework: ProjectFrameworks;
}
