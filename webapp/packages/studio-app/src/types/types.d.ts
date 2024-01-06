
export type formFieldPropTypes = {
  fieldName: string;
  fieldType: string;
  fieldValue?: string;
  labelName: string;
  handleInputChange?: (actionType: string, actionType: string) => void;
  fieldDefaultChecked?: boolean;
  required: boolean;
  box?: "input" | "textarea";
  cols?: number;
  rows?: number;
};

export interface advanceSettingTypes {
  treeShaking: boolean;
  minify: boolean;
}