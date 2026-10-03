import type { Static } from "@sinclair/typebox"
import type { SimplifyDeep } from "type-fest"
import type { IsomerPageLayoutType, IsomerSiteProps } from "~/types"
import { Type } from "@sinclair/typebox"
import { LINK_HREF_PATTERN } from "~/utils/validation"

import { NativeDataSourceSchema } from "../../integration"
import { CONTACT_INFORMATION_SUPPORT_METHODS } from "./constants"

const BaseContactInformationSchema = Type.Object({
  type: Type.Literal("contactinformation", {
    default: "contactinformation",
  }),
  label: Type.Optional(
    Type.String({
      title: "Link text",
      maxLength: 50,
      description:
        "Add a link under your block. Avoid generic text such as “Click here” or “Learn more”",
    }),
  ),
  url: Type.Optional(
    Type.String({
      title: "Link destination",
      description: "When this is clicked, open:",
      format: "link",
      pattern: LINK_HREF_PATTERN,
    }),
  ),
  // Allows selectively displaying only a subset of the configured
  // contact methods
  whitelistedMethods: Type.Optional(
    Type.Array(
      Type.Union(
        CONTACT_INFORMATION_SUPPORT_METHODS.map((method) =>
          Type.Literal(method, { default: method }),
        ),
        {
          title: "Whitelisted Methods",
          description: "Only whitelisted methods will be displayed.",
          format: "hidden",
        },
      ),
    ),
  ),
})

// arbitrary limit for now to prevent abuse
const CHARACTER_LIMIT = 30

const InjectableContactInformationSchema = Type.Object(
  {
    title: Type.Optional(
      Type.String({
        title: "Title",
      }),
    ),
    description: Type.Optional(
      Type.String({
        title: "Description",
      }),
    ),
    methods: Type.Array(
      Type.Object({
        method: Type.Optional(
          Type.Union(
            CONTACT_INFORMATION_SUPPORT_METHODS.map((method) =>
              Type.Literal(method, {
                title:
                  method.charAt(0).toUpperCase() +
                  method.slice(1).replace(/_/g, " "),
              }),
            ),
            {
              title: "Type",
              description: "Select the type of contact information",
            },
          ),
        ),
        label: Type.Optional(
          Type.String({
            title: "Label",
            maxLength: CHARACTER_LIMIT,
          }),
        ),
        values: Type.Array(
          Type.String({
            maxLength: CHARACTER_LIMIT,
          }),
          { minItems: 1 },
        ),
        caption: Type.Optional(
          Type.String({
            title: "Caption",
            maxLength: CHARACTER_LIMIT,
          }),
        ),
      }),
      {
        title: "Contact Methods",
        description: "Displayed in the order you add them here.",
        minItems: 1,
      },
    ),
    otherInformation: Type.Optional(
      Type.Object({
        label: Type.Optional(
          Type.String({
            title: "Other Information",
          }),
        ),
        value: Type.String(), // note: there can be HTML tags in this field
      }),
    ),
  },
  {
    title: "Native Contact Information component",
  },
)

const NativeContactInformationSchema = Type.Intersect([
  NativeDataSourceSchema,
  InjectableContactInformationSchema,
])

export const ContactInformationSchema = Type.Intersect([
  BaseContactInformationSchema,
  NativeContactInformationSchema,
])

interface AdditionalContactInformationTypeProps {
  layout: IsomerPageLayoutType
  headingLevel: number
}

type BaseContactInformationType = SimplifyDeep<
  Static<typeof BaseContactInformationSchema> &
    AdditionalContactInformationTypeProps
>

export type ContactInformationUIProps = Omit<
  BaseContactInformationType,
  "url"
> &
  Static<typeof InjectableContactInformationSchema> & {
    referenceLinkHref?: string
    isLoading?: boolean
    acceptHtmlTags?: boolean
  }

export type NativeContactInformationProps = SimplifyDeep<
  BaseContactInformationType & Static<typeof NativeContactInformationSchema>
>

export type ContactInformationProps = Static<typeof ContactInformationSchema> &
  AdditionalContactInformationTypeProps & {
    site: IsomerSiteProps
  }
