import type { TSchema } from "@sinclair/typebox"
import type { IsomerPageLayoutType, IsomerComponentTypes } from "~/types"
import { Type } from "@sinclair/typebox"
import {
  AccordionSchema,
  AudioSchema,
  BlockquoteSchema,
  ButtonSchema,
  CalloutSchema,
  ChildrenPagesSchema,
  CollectionBlockSchema,
  ContactInformationSchema,
  ContentpicSchema,
  DividerSchema,
  DynamicDataBannerSchema,
  HeadingSchema,
  HeroSchema,
  IframeSchema,
  ImageGallerySchema,
  ImageSchema,
  InfobarDefaultSchema,
  InfobarHomepageSchema,
  InfoCardsSchema,
  InfoColsSchema,
  InfopicSchema,
  KeyStatisticsSchema,
  LogoCloudSchema,
  OrderedListSchema,
  ParagraphSchema,
  ProseSchema,
  StepsSchema,
  TableSchema,
  UnorderedListSchema,
  VideoSchema,
} from "~/interfaces"

export const IsomerComplexComponentsMap = {
  accordion: AccordionSchema,
  blockquote: BlockquoteSchema,
  button: ButtonSchema,
  callout: CalloutSchema,
  hero: HeroSchema,
  iframe: IframeSchema,
  image: ImageSchema,
  infobar: InfobarHomepageSchema,
  infocards: InfoCardsSchema,
  infocols: InfoColsSchema,
  infopic: InfopicSchema,
  contentpic: ContentpicSchema,
  keystatistics: KeyStatisticsSchema,
  steps: StepsSchema,
  audio: AudioSchema,
  video: VideoSchema,
  childrenpages: ChildrenPagesSchema,
  dynamicdatabanner: DynamicDataBannerSchema,
  logocloud: LogoCloudSchema,
  collectionblock: CollectionBlockSchema,
  imagegallery: ImageGallerySchema,
  contactinformation: ContactInformationSchema,
}

export const IsomerNativeComponentsMap = {
  prose: ProseSchema,
  divider: DividerSchema,
  heading: HeadingSchema,
  orderedList: OrderedListSchema,
  paragraph: ParagraphSchema,
  table: TableSchema,
  unorderedList: UnorderedListSchema,
}

export const componentSchemaDefinitions = {
  components: {
    complex: IsomerComplexComponentsMap,
    native: IsomerNativeComponentsMap,
  },
}

interface ComponentSchema {
  component: IsomerComponentTypes
  layout?: IsomerPageLayoutType
}

const generateComponentSchema = ({ component, layout }: ComponentSchema) => {
  if (component === "prose") {
    return Type.Ref(IsomerNativeComponentsMap.prose)
  }

  if (component === "infobar") {
    return layout === "homepage" ? InfobarHomepageSchema : InfobarDefaultSchema
  }

  return IsomerComplexComponentsMap[component]
}

export const getComponentSchema = ({
  component,
  layout,
}: ComponentSchema): TSchema => {
  return {
    ...generateComponentSchema({ component, layout }),
    ...componentSchemaDefinitions,
  }
}
