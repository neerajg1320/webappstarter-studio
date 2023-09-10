import {diff_match_patch as DiffMatchPatch} from "diff-match-patch";

const debugFile = false;
const dmp = new DiffMatchPatch();

export const createDiff = (text1:string, text2:string) => {
  if (debugFile) {
    console.log(text1, text2);
  }

  // return 'To be supported ...';

  const patch_list = dmp.patch_make(text1, text2);
  const diff_text = dmp.patch_toText(patch_list);

  return diff_text;
};