import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

// Author: Alireza Esfahani
// Modified: Brian Tompsett
// Source: https://stackoverflow.com/questions/63064778/next-js-warn-user-for-unsaved-form-before-route-change
const useExamineUploadCondition = (saved) => {
  const router = useRouter();

  useEffect(() => {
      const confirmationMessage = 'All answers will be abolished.';
  
      const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      };
  
      const beforeRouteHandler = (url: string) => {
        if (router.pathname !== url && !confirm(confirmationMessage)) {
          router.events.emit('routeChangeError');
          throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
        }
      };
  
      if (saved) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        router.events.off('routeChangeStart', beforeRouteHandler);
      } else {
        window.addEventListener('beforeunload', beforeUnloadHandler);
        router.events.on('routeChangeStart', beforeRouteHandler);
      }

      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        router.events.off('routeChangeStart', beforeRouteHandler);
      };
    }, [saved]);
};

export default useExamineUploadCondition;