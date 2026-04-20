import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { checkBackendHealth } from "@/features/httpClient/health.service";

export function useBackendHealth() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const verifyBackend = async () => {
      try {
        await checkBackendHealth();
        if (isMounted) {
          setIsBackendAvailable(true);
        }
      } catch (error) {
        if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          if (isMounted) {
            setIsBackendAvailable(true);
          }
          return;
        }

        if (isMounted) {
          setIsBackendAvailable(false);
        }
      }
    };

    void verifyBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  return isBackendAvailable;
}
