import { Link, Text } from "@chakra-ui/react"
import NextLink from "next/link"

export const RestrictedMiniFooter = (): JSX.Element => {
  return (
    <Text
      display="flex"
      alignItems="center"
      whiteSpace="pre"
      lineHeight="1rem"
      fontWeight={500}
      letterSpacing="0.08em"
      textTransform="uppercase"
      fontSize="0.625rem"
    >
      Powered by{" "}
      <Link
        as={NextLink}
        title="Morph on GitHub"
        href="https://github.com/morph-cms/morph"
      >
        Morph
      </Link>
    </Text>
  )
}
