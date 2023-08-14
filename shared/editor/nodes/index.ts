import DateTime from "../extensions/DateTime";
import History from "../extensions/History";
import MaxLength from "../extensions/MaxLength";
import Placeholder from "../extensions/Placeholder";
import TrailingNode from "../extensions/TrailingNode";
import Extension from "../lib/Extension";
import Bold from "../marks/Bold";
import Code from "../marks/Code";
import Comment from "../marks/Comment";
import Highlight from "../marks/Highlight";
import Italic from "../marks/Italic";
import Link from "../marks/Link";
import Mark from "../marks/Mark";
import TemplatePlaceholder from "../marks/Placeholder";
import Strikethrough from "../marks/Strikethrough";
import Underline from "../marks/Underline";
import Attachment from "./Attachment";
import Blockquote from "./Blockquote";
import BulletList from "./BulletList";
import CheckboxItem from "./CheckboxItem";
import CheckboxList from "./CheckboxList";
import CodeBlock from "./CodeBlock";
import CodeFence from "./CodeFence";
import Doc from "./Doc";
import Embed from "./Embed";
import Emoji from "./Emoji";
import HardBreak from "./HardBreak";
import Heading from "./Heading";
import HorizontalRule from "./HorizontalRule";
import Image from "./Image";
import InPageThread from "./InpageThread";
import ListItem from "./ListItem";
import Math from "./Math";
import MathBlock from "./MathBlock";
import Mention from "./Mention";
import Node from "./Node";
import Notice from "./Notice";
import OrderedList from "./OrderedList";
import Paragraph from "./Paragraph";
import SimpleImage from "./SimpleImage";
import Table from "./Table";
import TableCell from "./TableCell";
import TableHeadCell from "./TableHeadCell";
import TableRow from "./TableRow";
import Text from "./Text";
import Video from "./Video";

type Nodes = (typeof Node | typeof Mark | typeof Extension)[];

/**
 * The basic set of nodes that are used in the editor. This is used for simple
 * editors that need basic formatting.
 */
export const basicExtensions: Nodes = [
  Doc,
  Paragraph,
  Emoji,
  Text,
  SimpleImage,
  Bold,
  Code,
  Italic,
  Underline,
  Link,
  Strikethrough,
  History,
  TrailingNode,
  Placeholder,
  MaxLength,
  DateTime,
];

export const listExtensions: Nodes = [
  CheckboxList,
  CheckboxItem,
  BulletList,
  OrderedList,
  ListItem,
];

export const tableExtensions: Nodes = [
  Table,
  TableCell,
  TableHeadCell,
  TableRow,
];

/**
 * The full set of nodes that are used in the editor. This is used for rich
 * editors that need advanced formatting.
 */
export const richExtensions: Nodes = [
  ...basicExtensions.filter((n) => n !== SimpleImage),
  ...listExtensions,
  ...tableExtensions,
  Image,
  HardBreak,
  CodeBlock,
  CodeFence,
  Blockquote,
  Embed,
  Attachment,
  Video,
  Notice,
  Heading,
  HorizontalRule,
  Highlight,
  TemplatePlaceholder,
  Math,
  MathBlock,
  InPageThread,
];

/**
 * Add commenting and mentions to a set of nodes
 */
export const withComments = (nodes: Nodes) => [
  Mention,
  Comment,
  InPageThread,
  ...nodes,
];
