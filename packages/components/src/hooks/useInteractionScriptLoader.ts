import { useRef, useState } from "react"
import { useEventListener, useScript, useTimeout } from "usehooks-ts"

interface UseInteractionScriptLoaderOptions {
  src: string
  id?: string
  timeout?: number
}

// TBT flags any script blocking the main thread for >50ms.
// Large third-party widgets can exceed this, and Lighthouse still counts
// them even with async, so we delay loading until after the first
// interaction (or a short timeout) instead.
export const useInteractionScriptLoader = ({
  src,
  id,
  timeout = 3000, // 3 seconds from manual testing
}: UseInteractionScriptLoaderOptions) => {
  const documentRef = useRef<Document | null>(
    typeof document !== "undefined" ? document : null,
  )
  const [shouldLoad, setShouldLoad] = useState(false)

  const triggerLoad = () => setShouldLoad(true)

  // Load script on user interactions (scroll, click, touchstart, mousemove, keydown)
  useEventListener("scroll", triggerLoad, documentRef, { passive: true })
  useEventListener("click", triggerLoad, documentRef) // as we might need to call preventDefault
  useEventListener("touchstart", triggerLoad, documentRef, { passive: true })
  useEventListener("mousemove", triggerLoad, documentRef, { passive: true })
  useEventListener("keydown", triggerLoad, documentRef, { passive: true })

  // Load script after timeout if user doesn't interact
  useTimeout(triggerLoad, timeout)

  useScript(shouldLoad ? src : null, { id })
}
