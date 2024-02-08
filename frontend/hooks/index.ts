import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * hook that notifys the user if he tries to leave the page and still has unsaved changes
 * @param saved whether or not there are any unsaved changes
 */
export function useNotifyUnsavedChanges(saved: boolean) {
  const router = useRouter();

  useEffect(() => {
    /**
     * default onbeforeunload callback that will be blocked
     */
    window.onbeforeunload = (e) => {
      if (!saved) e.preventDefault();
    };

    /**
     * function that gets called whenever the next router tries to push a new route -> we can prevent the route change if we throw an exception
     * - yes this is actually the best way to do this in nextjs
     */
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

    /**
     * unload the events when the component gets unmounted
     */
    return () => {
      window.onbeforeunload = null;
      router.events.off("routeChangeStart", cleanUp);
    };
  }, [saved, router]);
}
