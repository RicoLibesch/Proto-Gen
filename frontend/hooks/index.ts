import { useRouter } from "next/router";
import { useEffect } from "react";

export function useNotifyUnsavedChanges(saved: boolean) {
  const router = useRouter();
  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (!saved) e.preventDefault();
    };

    const cleanUp = () => {
      if (saved) return;
      const leave = confirm(
        "Ungespeicherter Inhalt festgestellt. Wollen Sie wirklich die Seite verlassen?"
      );
      if (!leave) {
        router.events.emit("routeChangeError");
        throw "Abort!";
      }
    };

    router.events.on("routeChangeStart", cleanUp);

    return () => {
      window.onbeforeunload = null;
      router.events.off("routeChangeStart", cleanUp);
    };
  }, [saved, router]);
}
