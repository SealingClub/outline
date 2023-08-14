import { Node as ProsemirrorNode } from "prosemirror-model";
import { EditorView, Decoration } from "prosemirror-view";
import * as React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import Extension from "@shared/editor/lib/Extension";
import { ComponentProps } from "@shared/editor/types";
import { Editor } from "~/editor";

type Component = (props: ComponentProps) => React.ReactElement;

export default class ComponentView {
  component: Component;
  editor: Editor;
  extension: Extension;
  node: ProsemirrorNode;
  view: EditorView;
  getPos: () => number;
  decorations: Decoration[];

  isSelected = false;
  dom: HTMLElement | null;
  portalId = uuidv4();

  // See https://prosemirror.net/docs/ref/#view.NodeView
  constructor(
    component: Component,
    {
      editor,
      extension,
      node,
      view,
      getPos,
      decorations,
    }: {
      editor: Editor;
      extension: Extension;
      node: ProsemirrorNode;
      view: EditorView;
      getPos: () => number;
      decorations: Decoration[];
    }
  ) {
    this.component = component;
    this.editor = editor;
    this.extension = extension;
    this.getPos = getPos;
    this.decorations = decorations;
    this.node = node;
    this.view = view;
    this.dom = node.type.spec.inline
      ? document.createElement("span")
      : document.createElement("div");

    this.dom.classList.add(`component-${node.type.name}`);

    this.renderElement();
    window.addEventListener("theme-changed", this.renderElement);
    window.addEventListener("location-changed", this.renderElement);
  }

  renderElement = () => {
    const { theme } = this.editor.props;
    const portal = () =>
      ReactDOM.createPortal(
        <ThemeProvider theme={theme}>
          <this.component
            theme={theme}
            node={this.node}
            view={this.view}
            isSelected={this.isSelected}
            isEditable={this.view.editable}
            getPos={this.getPos}
          />
        </ThemeProvider>,
        this.dom!,
        this.portalId
      );
    this.editor.portals.set(this.portalId, portal);
  };

  update(node: ProsemirrorNode) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    this.renderElement();
    return true;
  }

  selectNode() {
    if (this.view.editable) {
      this.isSelected = true;
      this.renderElement();
    }
  }

  deselectNode() {
    if (this.view.editable) {
      this.isSelected = false;
      this.renderElement();
    }
  }

  stopEvent(event: Event) {
    return event.type !== "mousedown" && !event.type.startsWith("drag");
  }

  destroy() {
    window.removeEventListener("theme-changed", this.renderElement);
    window.removeEventListener("location-changed", this.renderElement);

    if (this.dom) {
      this.editor.portals.delete(this.portalId);
      ReactDOM.unmountComponentAtNode(this.dom);
    }
    this.dom = null;
  }

  ignoreMutation() {
    return true;
  }
}
