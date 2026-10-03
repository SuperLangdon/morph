import type { Meta, StoryObj } from "@storybook/nextjs"
import { within } from "storybook/test"
import { userEvent } from "storybook/test"
import { meHandlers } from "tests/msw/handlers/me"
import { pageHandlers } from "tests/msw/handlers/page"
import { resourceHandlers } from "tests/msw/handlers/resource"
import { sitesHandlers } from "tests/msw/handlers/sites"
import EditPage from "~/pages/sites/[siteId]/pages/[pageId]"

const COMMON_HANDLERS = [
  meHandlers.me(),
  pageHandlers.listWithoutRoot.default(),
  pageHandlers.getRootPage.default(),
  pageHandlers.updatePageBlob.default(),
  pageHandlers.countWithoutRoot.default(),
  sitesHandlers.getLocalisedSitemap.default(),
  sitesHandlers.getTheme.default(),
  sitesHandlers.getConfig.default(),
  sitesHandlers.getFooter.default(),
  sitesHandlers.getNavbar.default(),
  sitesHandlers.getLocalisedSitemap.default(),
  resourceHandlers.getChildrenOf.default(),
  resourceHandlers.getMetadataById.database(),
  pageHandlers.readPageAndBlob.database(),
  pageHandlers.readPage.database(),
  pageHandlers.getFullPermalink.database(),
  resourceHandlers.getRolesFor.admin(),
]

const meta: Meta<typeof EditPage> = {
  title: "Pages/Edit Page/Database Page",
  component: EditPage,
  parameters: {
    getLayout: EditPage.getLayout,
    msw: {
      handlers: COMMON_HANDLERS,
    },
    nextjs: {
      router: {
        query: {
          siteId: "1",
          pageId: "1",
        },
        pathname: "/sites/[siteId]/pages/[pageId]",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof EditPage>

export const Default: Story = {}

export const EditFixedBlockHeader: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByRole("button", {
      name: /Page header/i,
    })
    await userEvent.click(button)
  },
}

export const EditFixedBlockDatabase: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByRole("button", {
      name: /Database/i,
    })
    await userEvent.click(button)
  },
}
