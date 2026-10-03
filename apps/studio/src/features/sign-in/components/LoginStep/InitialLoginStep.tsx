import { Box, Stack, Text, VStack } from "@chakra-ui/react"
import { Infobox } from "@opengovsg/design-system-react"
import { useMemo } from "react"
import { MorphLogo } from "~/components/Svg"
import { useEnv } from "~/hooks/useEnv"

import { EmailLoginForm } from "../EmailLogin"
import { useSignInContext } from "../SignInContext"

export const InitialLoginStep = (): JSX.Element => {
  const {
    env: { NEXT_PUBLIC_APP_NAME: title },
  } = useEnv()
  const { errorState } = useSignInContext()

  const errorTitle = useMemo(() => {
    switch (errorState) {
      case "unauthorized":
        return "You don’t have access to this workspace"
      default:
        const _: undefined = errorState
        return undefined
    }
  }, [errorState])

  const errorDescription = useMemo(() => {
    switch (errorState) {
      case "unauthorized":
        return "If you think you should have access, ask a site admin to whitelist your email address."
      default:
        const _: undefined = errorState
        return undefined
    }
  }, [errorState])

  return (
    <Stack gap="1.5rem" direction="column" width="100%">
      <Box>
        <MorphLogo />
      </Box>

      {!!errorState && (
        <Infobox variant="error" size="sm">
          <Box>
            <Text textStyle="subhead-2" color="base.content.strong">
              {errorTitle}
            </Text>

            <Text textStyle="body-2" color="base.content.strong">
              {errorDescription}
            </Text>
          </Box>
        </Infobox>
      )}

      <VStack spacing="0.25rem" alignItems="start">
        <Text color="base.content.strong" textStyle="subhead-1">
          Welcome back to {title}
        </Text>

        <Text color="base.content.default" textStyle="body-2">
          Use your email to log in.
        </Text>
      </VStack>

      <EmailLoginForm />
    </Stack>
  )
}
