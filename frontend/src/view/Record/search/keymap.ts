import { Command } from "prosemirror-state";

export const shiftEnterKeyMap: { [key: string]: Command } = {
  "Shift-Enter": (state, dispatch) => {
    if (!dispatch) return false;
    const { $from } = state.selection;
    const parent = $from.parent;
    const { tr } = state;

    if (parent.type.isTextblock) {
      const { hardBreak } = state.schema.nodes;
      dispatch(tr!.replaceSelectionWith(hardBreak.create()));
    } else {
      const { br } = state.schema.nodes;
      dispatch(tr.replaceSelectionWith(br.create()));
    }

    return true;
  },
  Enter: (state, dispatch) => {
    if (!dispatch) return false;
    const { $from } = state.selection;
    const parent = $from.parent;
    const { tr } = state;

    if (parent.type.isTextblock) {
      const { hardBreak } = state.schema.nodes;
      dispatch(tr.replaceSelectionWith(hardBreak.create()));
    } else {
      const { br } = state.schema.nodes;
      dispatch(tr.replaceSelectionWith(br.create()));
    }

    return true;
  },
};
