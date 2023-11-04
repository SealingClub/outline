import Token from "markdown-it/lib/token";
import { Node as ProsemirrorNode, NodeSpec, NodeType } from "prosemirror-model";
import { Command } from "prosemirror-state";
import { Primitive } from "utility-types";
import type { ComponentProps } from "@shared/editor/types";
import alwaysUsePrototype from "../../utils/alwaysUsePrototype";
import { MarkdownSerializerState } from "../lib/markdown/serializer";
import Node from "./Node";

export default class InpageThread extends Node {
  get name() {
    return "thread";
  }

  get schema(): NodeSpec {
    return {
      attrs: {
        id: {},
      },
      group: "block",
      atom: true,
      draggable: false,
      selectable: true,
      parseDOM: [
        {
          tag: "div.inpage-thread",
          getAttrs: (dom: HTMLDivElement) => ({
            id: dom.id.replace("inpage-thread-", ""),
          }),
        },
      ],
      toDOM: (node) => [
        "div",
        {
          id: `inpage-thread-${node.attrs.id}`,
          class: "inpage-thread",
        },
      ],
      toPlainText: (node) => `inpage-thread-id-${node.attrs.id}`,
    };
  }

  @alwaysUsePrototype
  // eslint-disable-next-line no-unused-vars
  component(props: ComponentProps) {
    throw new Error("The implement in @app/editor/nodes/Thread.tsx");
  }

  commands({ type }: { type: NodeType }) {
    return (attrs: Record<string, Primitive>): Command =>
      (state, dispatch) => {
        dispatch?.(state.tr.insert(state.selection.from, type.create(attrs)));
        return true;
      };
  }

  toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode): void {
    const id = node.attrs.id;
    state.ensureNewLine();
    state.write(`[${state.esc(id, false)}](${state.esc(id, false)})`);
    state.ensureNewLine();
  }

  parseMarkdown() {
    return {
      node: "thread",
      getAttrs: (token: Token) => ({
        href: token.attrGet("id"),
      }),
    };
  }
}
