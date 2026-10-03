import type { TableProps } from "~/interfaces"

const longDescription =
  "The team will progressively expand the programme across all towns over the next three years, working with local partners and residents."

export const denseThreeColumnTable: Pick<TableProps, "attrs" | "content"> = {
  attrs: {
    caption: "Year / Description / Agency",
  },
  content: [
    {
      type: "tableRow",
      content: [
        {
          type: "tableHeader",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Year" }],
            },
          ],
        },
        {
          type: "tableHeader",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Description" }],
            },
          ],
        },
        {
          type: "tableHeader",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Agency" }],
            },
          ],
        },
      ],
    },
    {
      type: "tableRow",
      content: [
        {
          type: "tableCell",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "2024" }],
            },
          ],
        },
        {
          type: "tableCell",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: longDescription }],
            },
          ],
        },
        {
          type: "tableCell",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Office of Sustainability",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
