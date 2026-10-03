import type { IsomerPageSchemaType } from "~/types/schema"
import type { IsomerSitemap } from "~/types/sitemap"
import { describe, expect, it } from "vitest"
import { generateSiteConfig } from "~/stories/helpers"
import { ISOMER_PAGE_LAYOUTS } from "~/types/constants"

import { getMetadata, getPageJsonLd, getSiteJsonLd } from "../metadata"

const baseSite = {
  siteName: "Example Ministry",
  url: "https://www.example.gov",
  logoUrl: "/logo.svg",
} as IsomerPageSchemaType["site"]

const basePage = {
  permalink: "/",
  title: "Home",
} as IsomerPageSchemaType["page"]

describe("getMetadata", () => {
  describe("Homepage", () => {
    it("uses the hero subtitle as the meta description when present", () => {
      // Arrange
      const props = {
        layout: ISOMER_PAGE_LAYOUTS.Homepage,
        site: baseSite,
        page: basePage,
        content: [{ type: "hero", subtitle: "Welcome to our site" }],
      } as unknown as IsomerPageSchemaType

      // Act
      const actual = getMetadata(props).description

      // Assert
      expect(actual).toBe("Welcome to our site")
    })

    it("falls back to the site name when the hero subtitle is empty", () => {
      // Arrange
      const props = {
        layout: ISOMER_PAGE_LAYOUTS.Homepage,
        site: baseSite,
        page: basePage,
        content: [{ type: "hero", subtitle: "" }],
      } as unknown as IsomerPageSchemaType

      // Act
      const actual = getMetadata(props).description

      // Assert
      expect(actual).toBe(baseSite.siteName)
    })

    it("falls back to the site name when there is no hero block", () => {
      // Arrange
      const props = {
        layout: ISOMER_PAGE_LAYOUTS.Homepage,
        site: baseSite,
        page: basePage,
        content: [],
      } as unknown as IsomerPageSchemaType

      // Act
      const actual = getMetadata(props).description

      // Assert
      expect(actual).toBe(baseSite.siteName)
    })

    it("uses the overridden meta description when set", () => {
      // Arrange
      const props = {
        layout: ISOMER_PAGE_LAYOUTS.Homepage,
        site: baseSite,
        page: basePage,
        meta: { description: "Custom description" },
        content: [{ type: "hero", subtitle: "Welcome to our site" }],
      } as unknown as IsomerPageSchemaType

      // Act
      const actual = getMetadata(props).description

      // Assert
      expect(actual).toBe("Custom description")
    })
  })

  describe("Content", () => {
    it("uses the page summary as the meta description", () => {
      // Arrange
      const props = {
        layout: ISOMER_PAGE_LAYOUTS.Content,
        site: baseSite,
        page: { ...basePage, contentPageHeader: { summary: "Page summary" } },
        content: [],
      } as unknown as IsomerPageSchemaType

      // Act
      const actual = getMetadata(props).description

      // Assert
      expect(actual).toBe("Page summary")
    })

    it("uses the overridden meta description when set", () => {
      // Arrange
      const props = {
        layout: ISOMER_PAGE_LAYOUTS.Content,
        site: baseSite,
        page: { ...basePage, contentPageHeader: { summary: "Page summary" } },
        meta: { description: "Custom description" },
        content: [],
      } as unknown as IsomerPageSchemaType

      // Act
      const actual = getMetadata(props).description

      // Assert
      expect(actual).toBe("Custom description")
    })
  })
})

const getSerializedJsonLd = (
  input: Parameters<typeof getSiteJsonLd>[0],
): ReturnType<typeof getSiteJsonLd> =>
  JSON.parse(JSON.stringify(getSiteJsonLd(input))) as ReturnType<
    typeof getSiteJsonLd
  >

describe("getSiteJsonLd", () => {
  it("generates linked website and organisation entities from configured values", () => {
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Public Service Portal",
        agencyName: "Example Ministry",
        url: "https://example.com",
        logoUrl: "/images/logo.svg",
        assetsBaseUrl: "https://assets.example.com/",
        siteEntity: {
          type: "Organization",
          description: "  We serve the public.  ",
          address: {
            streetAddress: "1 Example Street",
            addressLocality: "Rivertown",
            postalCode: "123456",
            addressCountry: "US",
          },
          contactPoint: {
            contactType: "Customer service",
            telephone: "+1 555 123 4567",
            email: "hello@example.com",
          },
        },
      },
      footer: {
        contactUsLink: "/contact-us",
        socialMediaLinks: [
          {
            type: "linkedin",
            url: "https://www.linkedin.com/company/example-ministry",
          },
          {
            type: "instagram",
            url: "https://www.instagram.com/exampleministry",
          },
        ],
      },
    })

    expect(jsonLd).toEqual({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://example.com/#website",
          name: "Public Service Portal",
          url: "https://example.com/",
          publisher: {
            "@id": "https://example.com/#organization",
          },
        },
        {
          "@type": "Organization",
          "@id": "https://example.com/#organization",
          name: "Example Ministry",
          url: "https://example.com/",
          logo: "https://assets.example.com/images/logo.svg",
          description: "We serve the public.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "1 Example Street",
            addressLocality: "Rivertown",
            postalCode: "123456",
            addressCountry: "US",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer service",
            telephone: "+1 555 123 4567",
            email: "hello@example.com",
            url: "https://example.com/contact-us",
          },
          sameAs: [
            "https://www.linkedin.com/company/example-ministry",
            "https://www.instagram.com/exampleministry",
          ],
        },
      ],
    })
  })

  it("prepends the assets base URL to internal file links", () => {
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Community Site",
        url: "https://community.example.com",
        assetsBaseUrl: "https://assets.example.com/",
      },
      footer: {
        contactUsLink: "/1/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/contact-us.pdf",
        socialMediaLinks: [
          {
            type: "facebook",
            url: "/1/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/poster.png",
          },
        ],
      },
    })

    expect(jsonLd["@graph"][1]).toMatchObject({
      contactPoint: {
        "@type": "ContactPoint",
        url: "https://assets.example.com/1/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/contact-us.pdf",
      },
      sameAs: [
        "https://assets.example.com/1/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/poster.png",
      ],
    })
  })

  it("resolves a resource contact link using the sitemap", () => {
    const sitemap: IsomerSitemap = {
      id: "1",
      title: "Home",
      summary: "",
      lastModified: "",
      permalink: "/",
      layout: "homepage",
      children: [
        {
          id: "2",
          title: "Contact us",
          summary: "",
          lastModified: "",
          permalink: "/contact-us",
          layout: "content",
        },
      ],
    }
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Community Site",
        url: "https://community.example.com",
      },
      footer: {
        contactUsLink: "[resource:1:2]",
      },
      sitemap,
    })

    expect(jsonLd["@graph"][1]).toMatchObject({
      contactPoint: {
        "@type": "ContactPoint",
        url: "https://community.example.com/contact-us",
      },
    })
  })

  it("uses existing site settings as fallbacks and omits empty metadata", () => {
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Community Site",
        url: "https://community.example.com",
        logoUrl: "",
      },
      footer: {
        contactUsLink: "[resource:1:999]",
        socialMediaLinks: [],
      },
    })

    expect(jsonLd["@graph"][1]).toEqual({
      "@type": "Organization",
      "@id": "https://community.example.com/#organization",
      name: "Community Site",
      url: "https://community.example.com/",
    })
  })

  it("defaults to Organization when no entity type is set", () => {
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Community Site",
        url: "https://community.example.com",
      },
      footer: {},
    })

    expect(jsonLd["@graph"][1]?.["@type"]).toBe("Organization")
  })

  it("uses the selected organisation subtype", () => {
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Example School",
        url: "https://school.example.com",
        logoUrl: "/logo.png",
        siteEntity: {
          type: "EducationalOrganization",
        },
      },
      footer: {},
    })

    expect(jsonLd["@graph"][1]?.["@type"]).toBe("EducationalOrganization")
  })

  it("does not prepend the asset base URL to an absolute logo URL", () => {
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Example School",
        url: "https://school.example.com",
        logoUrl: "https://logos.example.com/school.png",
        assetsBaseUrl: "https://assets.example.com",
      },
      footer: {},
    })

    expect(jsonLd["@graph"][1]).toMatchObject({
      logo: "https://logos.example.com/school.png",
    })
  })

  it("omits a missing logo when an asset base URL is configured", () => {
    const jsonLd = getSerializedJsonLd({
      site: {
        siteName: "Example School",
        url: "https://school.example.com",
        assetsBaseUrl: "https://assets.example.com",
      },
      footer: {},
    })

    expect(jsonLd["@graph"][1]).not.toHaveProperty("logo")
  })
})

const getSerializedPageJsonLd = (
  input: Parameters<typeof getPageJsonLd>[0],
): ReturnType<typeof getPageJsonLd> =>
  JSON.parse(JSON.stringify(getPageJsonLd(input))) as ReturnType<
    typeof getPageJsonLd
  >

describe("getPageJsonLd", () => {
  const contentPage = {
    layout: "content",
    meta: {},
    page: {
      title: "About us",
      permalink: "/about-us",
      lastModified: "2026-08-18T10:00:00.000Z",
      contentPageHeader: {
        summary: "Learn about our work.",
        showThumbnail: false,
      },
    },
    content: [],
    site: generateSiteConfig({
      url: "https://example.com",
    }),
  } satisfies IsomerPageSchemaType

  it("generates a page entity linked to the site-wide graph", () => {
    expect(getSerializedPageJsonLd(contentPage)).toEqual({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://example.com/about-us#webpage",
      url: "https://example.com/about-us",
      name: "About us",
      description: "Learn about our work.",
      dateModified: "2026-08-18T10:00:00.000Z",
      inLanguage: "en",
      isPartOf: {
        "@id": "https://example.com/#website",
      },
      publisher: {
        "@id": "https://example.com/#organization",
      },
    })
  })

  it("uses the explicitly configured meta description", () => {
    expect(
      getSerializedPageJsonLd({
        ...contentPage,
        meta: {
          description: "The canonical description.",
        },
      }).description,
    ).toBe("The canonical description.")
  })

  it("uses the default site URL when the configured URL is empty", () => {
    const jsonLd = getSerializedPageJsonLd({
      ...contentPage,
      site: {
        siteName: "Example Agency",
        url: "",
      },
    })

    expect(jsonLd.url).toBe("https://example.com/about-us")
    expect(jsonLd["@id"]).toBe("https://example.com/about-us#webpage")
    expect(jsonLd.isPartOf["@id"]).toBe("https://example.com/#website")
  })
})

const makeProps = ({
  layout = "collection",
  permalink = "/newsroom",
  title = "Newsroom",
  url = "https://www.example.com",
}: {
  layout?: IsomerPageSchemaType["layout"]
  permalink?: string
  title?: string
  url?: string
}): IsomerPageSchemaType =>
  ({
    layout,
    site: {
      ...baseSite,
      siteName: "Test Agency",
      url,
    },
    page: {
      ...basePage,
      title,
      permalink,
      subtitle: "Latest updates",
      articlePageHeader: { summary: "An article summary" },
    },
    content: [],
  }) as unknown as IsomerPageSchemaType

describe("getMetadata — RSS feed discovery", () => {
  it("advertises the collection's rss.xml as an application/rss+xml alternate", () => {
    // Arrange
    const props = makeProps({ layout: "collection", permalink: "/newsroom" })

    // Act
    const { alternates } = getMetadata(props)

    // Assert
    expect(alternates.types).toEqual({
      "application/rss+xml": [
        {
          url: "https://www.example.com/newsroom/rss.xml",
          title: "Test Agency — Newsroom",
        },
      ],
    })
  })

  it("does not double the slash when the collection permalink already ends in one", () => {
    // Arrange
    const props = makeProps({ layout: "collection", permalink: "/newsroom/" })

    // Act
    const { alternates } = getMetadata(props)

    // Assert
    expect(alternates.types?.["application/rss+xml"]).toEqual([
      {
        url: "https://www.example.com/newsroom/rss.xml",
        title: "Test Agency — Newsroom",
      },
    ])
  })

  it("falls back to a relative feed path when the site has no url", () => {
    // Arrange
    const props = makeProps({ layout: "collection", url: "" })

    // Act
    const { alternates } = getMetadata(props)

    // Assert
    expect(alternates.types?.["application/rss+xml"]).toEqual([
      { url: "/newsroom/rss.xml", title: "Test Agency — Newsroom" },
    ])
  })

  it("emits no feed alternate for non-collection layouts", () => {
    // Arrange
    const props = makeProps({ layout: "article" })

    // Act
    const { alternates } = getMetadata(props)

    // Assert
    expect(alternates.types).toBeUndefined()
  })
})
