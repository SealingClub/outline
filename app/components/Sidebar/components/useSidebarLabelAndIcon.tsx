import { DocumentIcon } from "outline-icons";
import * as React from "react";
import CollectionIcon from "~/components/Icons/CollectionIcon";
import EmojiIcon from "~/components/Icons/EmojiIcon";
import useStores from "~/hooks/useStores";

interface SidebarItem {
  documentId?: string;
  collectionId?: string;
}

export function useSidebarLabelAndIcon(
  { documentId, collectionId }: SidebarItem,
  defaultIcon?: React.ReactNode
) {
  const { collections, documents } = useStores();
  const icon = defaultIcon ?? <DocumentIcon />;

  if (documentId) {
    const document = documents.get(documentId);
    if (document) {
      return {
        label: document.titleWithDefault,
        icon: document.emoji ? <EmojiIcon emoji={document.emoji} /> : icon,
      };
    }
  }

  if (collectionId) {
    const collection = collections.get(collectionId);
    if (collection) {
      return {
        label: collection.name,
        icon: <CollectionIcon collection={collection} />,
      };
    }
  }

  return {
    label: "",
    icon,
  };
}
