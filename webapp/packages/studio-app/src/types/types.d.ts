export type formFieldPropTypes = {
    fieldName: string;
    fieldType: string;
    fieldValue?: string;
    labelName: string;
    handleInputChange: (actionType: string, actionType: string)=>void;
    required: boolean;
  };
  