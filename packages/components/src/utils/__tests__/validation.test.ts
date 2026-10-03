import { describe, expect, it } from "vitest"

import {
  AUDIO_EMBED_URL_PATTERN,
  GTM_ID_STRING_REGEX,
  isValidAudioEmbedUrl,
  LINK_HREF_PATTERN,
  VIDEO_EMBED_URL_PATTERN,
} from "../validation"

describe("validation", () => {
  describe("LINK_HREF_PATTERN", () => {
    it("should allow external URLs beginning with https://", () => {
      const testCases = [
        "https://example.com",
        "https://www.example.net",
        "https://subdomain.example.gov",
        "https://very-nested.subsub.subdomain.example.gov",
        "https://example.gov",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow mailto links", () => {
      const testCases = [
        "test@example.com",
        "support@agency.example.gov",
        "contact@subdomain.agency-name.example.gov",
        "Capital_Letters@example.com",
      ]

      testCases
        .map((testCase) => `mailto:${testCase}`)
        .forEach((testCase) => {
          const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
          expect(result).toBe(true)
        })
    })

    it("should allow tel links", () => {
      const testCases = [
        "tel:12345678",
        "tel:+11234567890",
        "tel:+1-1234-5678",
        "tel:+1 1234 5678",
        "tel:1800 123 4567",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow sms links", () => {
      const testCases = [
        "sms:12345678",
        "sms:+11234567890",
        "sms:+11234567890?body=Hello",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow internal links", () => {
      const testCases = [
        "[resource:1:2]",
        "[resource:123:456]",
        "[resource:999:999]",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow files links", () => {
      const testCases = [
        "/1/dc2b609a-355e-406c-af6c-003683731e7e/RFP%20Template.docx",
        "/123/29591b8d-f1e4-489a-b10a-0ced3141a335/sample.pdf",
        "/999/ccc57360-c82e-4e6c-882e-593f230958f6/padlock.svg",
        "/22/b7da536d-693b-408a-b79b-17ce861afaeb/lock.png",
        "/430/e57f4738-7bf2-490a-a083-0a8c166e4bfb/favicon.ico",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow legacy internal links", () => {
      const testCases = [
        "/",
        "/about/senior-management",
        "/contact",
        "/files/annual-report.pdf",
        "/images/logo.png",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should not allow external links with protocols other than https, tel, sms and mailto", () => {
      const testCases = ["http://example.com", "ftp://example.net"]

      testCases.forEach((testCase) => {
        const result = new RegExp(LINK_HREF_PATTERN).test(testCase)
        expect(result).toBe(false)
      })
    })
  })

  describe("VIDEO_EMBED_URL_PATTERN", () => {
    it("should allow YouTube watch URLs", () => {
      const testCases = [
        "https://www.youtube.com/watch?v=abcdefg",
        "https://www.youtube.com/watch?v=123456",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(VIDEO_EMBED_URL_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow YouTube embed URLs", () => {
      const testCases = [
        "https://www.youtube.com/embed/abcdefg",
        "https://www.youtube.com/embed/123456",
        "https://www.youtube.com/embed/videoseries?si=ERNlpee6I1tOFxP1&amp;list=PL8H4HE5h1ju2mleR8sNaWzRAnRkFcYvg-",
        "https://www.youtube.com/embed/dQw4w9WgXcQ?si=7dAKYmJw2jTNNqkr",
        "https://www.youtube.com/embed/dQw4w9WgXcQ?si=7dAKYmJw2jTNNqkr&amp;start=60",
        "https://www.youtube.com/embed/dQw4w9WgXcQ?si=7dAKYmJw2jTNNqkr&amp;controls=0",
        "https://www.youtube.com/embed/dQw4w9WgXcQ?si=7dAKYmJw2jTNNqkr&amp;controls=0&amp;start=60",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(VIDEO_EMBED_URL_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow YouTube nocookie embed URLs", () => {
      const testCases = [
        "https://www.youtube-nocookie.com/embed/abcdefg",
        "https://www.youtube-nocookie.com/embed/123456",
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=7dAKYmJw2jTNNqkr&amp;controls=0",
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=7dAKYmJw2jTNNqkr&amp;controls=0&amp;start=60",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(VIDEO_EMBED_URL_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow Vimeo embed URLs", () => {
      const testCases = [
        "https://player.vimeo.com/video/984159615?h=945031e683",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(VIDEO_EMBED_URL_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should allow Facebook Watch embed URLs", () => {
      const testCases = [
        "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FCLCsg%2Fvideos%2F443087086248211%2F&show_text=0&width=560",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(VIDEO_EMBED_URL_PATTERN).test(testCase)
        expect(result).toBe(true)
      })
    })

    it("should not allow any other site's URLs", () => {
      const testCases = [
        "https://www.example.com/embed/abcdefg",
        "https://www.another-site.com/watch?v=abcdefg",
        "https://youtu.be/dQw4w9WgXcQ",
        "https://www.youtube.fakesite.com/watch?v=dQw4w9WgXcQ&feature=youtu.be",
        "https://www.facebook.com/plugins/video.ph?href=https%3A%2F%2Fwww.facebook.com%2FCLCsg%2Fvideos%2F443087086248211%2F",
        "https://www.facebook.com/plugins/videoXphp?href=https%3A%2F%2Fwww.facebook.com%2FCLCsg%2Fvideos%2F443087086248211%2F",
      ]

      testCases.forEach((testCase) => {
        const result = new RegExp(VIDEO_EMBED_URL_PATTERN).test(testCase)
        expect(result).toBe(false)
      })
    })
  })

  describe("GTM_ID_STRING_REGEX", () => {
    it("should allow valid Google tag IDs", () => {
      // Arrange
      const testCases = [
        "GTM-ABC123",
        "GTM-1234567",
        "GTM-ABCDEFGHIJ",
        "G-ABC123", // GA4 measurement IDs work with GTM snippet in practice
        "GT-ABC123", // GT- IDs observed working in manual testing
      ]

      testCases.forEach((testCase) => {
        // Act
        const result = new RegExp(GTM_ID_STRING_REGEX).test(testCase)

        // Assert
        expect(result).toBe(true)
      })
    })

    it("should reject invalid or malicious GTM IDs", () => {
      // Arrange
      const testCases = [
        "gtm-abc123",
        "GTM-",
        "');alert(document.cookie);//",
        "GTM-ABC<script>",
        "",
      ]

      testCases.forEach((testCase) => {
        // Act
        const result = new RegExp(GTM_ID_STRING_REGEX).test(testCase)

        // Assert
        expect(result).toBe(false)
      })
    })
  })

  describe("AUDIO_EMBED_URL_PATTERN and isValidAudioEmbedUrl", () => {
    it("should allow Spotify episode, show, and playlist embed URLs", () => {
      const testCases = [
        "https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5",
        "https://open.spotify.com/embed/episode/3T5WkragWdHZRwFl7qCHoz?utm_source=generator",
        "https://open.spotify.com/embed/show/66PYiIthr1KqQhJ82XH4DN?utm_source=generator",
        "https://open.spotify.com/embed/playlist/1apUfsI3NR7LqzFOlGieBT",
      ]

      testCases.forEach((testCase) => {
        expect(new RegExp(AUDIO_EMBED_URL_PATTERN).test(testCase)).toBe(true)
        expect(isValidAudioEmbedUrl(testCase)).toBe(true)
      })
    })

    it("should allow Apple Podcast embed URLs for show and episode", () => {
      const testCases = [
        "https://embed.podcasts.apple.com/us/podcast/biblioasia-podcast/id1688142751",
        "https://embed.podcasts.apple.com/us/podcast/the-days-before-air-conditioning/id1688142751?i=1000739749908",
        "https://embed.podcasts.apple.com/sg/podcast/another-podcast/id987654321",
      ]

      testCases.forEach((testCase) => {
        expect(new RegExp(AUDIO_EMBED_URL_PATTERN).test(testCase)).toBe(true)
        expect(isValidAudioEmbedUrl(testCase)).toBe(true)
      })
    })

    it("should not allow Spotify album, track, or artist (only episode, show, and playlist supported)", () => {
      const testCases = [
        "https://open.spotify.com/embed/album/6i6folBtxKV28WX3msQ4FE",
        "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT",
        "https://open.spotify.com/embed/artist/0OdUWJ0sBJDrq8yp90n0ID",
      ]

      testCases.forEach((testCase) => {
        expect(new RegExp(AUDIO_EMBED_URL_PATTERN).test(testCase)).toBe(false)
        expect(isValidAudioEmbedUrl(testCase)).toBe(false)
      })
    })

    it("should not allow non-audio or invalid embed URLs", () => {
      const testCases = [
        "https://www.example.com/embed/episode/xxx",
        "https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5",
        "https://spotify.com/embed/episode/xxx",
        "https://podcasts.apple.com/us/podcast/sample/id123",
        "https://embed.music.apple.com/us/album/test/123",
        "https://embed.podcasts.apple.com/",
      ]

      testCases.forEach((testCase) => {
        expect(new RegExp(AUDIO_EMBED_URL_PATTERN).test(testCase)).toBe(false)
        expect(isValidAudioEmbedUrl(testCase)).toBe(false)
      })
    })
  })
})
