import type { IsomerSchema } from "~/types"

export const doesComponentHaveImage = ({
  component,
}: {
  component: IsomerSchema["content"][number]
}): boolean => {
  // While "iframe", "video" do not have images, they take up page real estate
  // so we treat them as having images and return true
  // TODO: Do separate optimization for them to improve lighthouse SEO score
  switch (component.type) {
    case "accordion":
    case "button":
    case "keystatistics":
    case "callout":
    case "infobar":
    case "infocols":
    case "steps":
    case "prose":
    case "dynamicdatabanner":
    case "contactinformation":
      return false
    case "image":
    case "infopic":
    case "hero":
    case "logocloud":
    case "contentpic":
    case "iframe":
    case "audio":
    case "video":
    case "imagegallery":
    case "childrenpages":
      return true
    case "infocards":
      return component.cards.some((card) => "imageUrl" in card)
    case "collectionblock":
      return component.displayThumbnail
    case "blockquote":
      return component.imageSrc !== undefined
    default:
      const _: never = component
      return false
  }
}
