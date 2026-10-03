import type { Meta, StoryObj } from "@storybook/react-vite"
import { generateSiteConfig } from "~/stories/helpers"

import { withChromaticModes } from "@isomer/storybook-config"

import { SearchLayout } from "./Search"

const meta: Meta<typeof SearchLayout> = {
  title: "Next/Layouts/Search",
  component: SearchLayout,
  argTypes: {},
  tags: ["!autodocs"],
  parameters: {
    chromatic: withChromaticModes(["mobile", "tablet", "desktop"]),
    themes: {
      themeOverride: "Isomer Next",
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchLayout>

export const Search: Story = {
  args: {
    layout: "search",
    site: generateSiteConfig({
      search: {
        type: "localSearch",
        searchUrl: "/search",
      },
    }),
    meta: {
      description: "Search results",
    },
    page: {
      title: "Search",
      permalink: "/search",
      lastModified: "2024-05-02T14:12:57.160Z",
    },
  },
}
