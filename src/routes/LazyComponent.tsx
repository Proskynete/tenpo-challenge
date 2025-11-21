import { t } from "i18next";
import { type JSX, Suspense } from "react";

type LazyComponent = React.LazyExoticComponent<() => JSX.Element>;

export function LC(Component: LazyComponent, loadingText = "common.loading") {
  return () => {
    return (
      <Suspense fallback={<p>{t(loadingText)}</p>}>
        <Component />
      </Suspense>
    );
  };
}
