import type { PropsWithChildren, ReactElement } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

// Create a test i18n instance
const createTestI18n = () => {
  const testI18n = i18n.createInstance();
  testI18n.init({
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          "auth.welcomeBack": "Welcome Back",
          "auth.signInToContinue": "Sign in to continue",
          "auth.email": "Email",
          "auth.enterEmail": "Enter your email",
          "auth.password": "Password",
          "auth.enterPassword": "Enter your password",
          "auth.signIn": "Sign In",
          "auth.signingIn": "Signing in...",
          "auth.logout": "Logout",
          "auth.errorLogin": "Login failed. Please try again.",
          "auth.useEmailToLogin":
            "Use the email {{email}} with any password to login",
          "movies.title": "Popular Movies",
          "movies.browsePopular": "Browse the most popular movies",
          "movies.loading": "Loading movies...",
          "movies.loadingMore": "Loading more movies...",
          "movies.errorLoading": "Error loading movies",
          "common.noImage": "No Image",
          "common.noVotes": "No Votes",
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
  return testI18n;
};

// Create a new QueryClient for each test
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  queryClient?: QueryClient;
}

export const AllTheProviders = ({
  children,
  queryClient = createTestQueryClient(),
}: PropsWithChildren<AllTheProvidersProps>) => {
  const testI18n = createTestI18n();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { customRender as render };
