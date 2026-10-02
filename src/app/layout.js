import collection from "../../collection.config.js";
import { LanguageProvider } from "../lib/i18n/LanguageProvider.js";
import { AuthProvider } from "../lib/auth/AuthProvider.js";
import { ThemeProvider } from "../lib/theme/ThemeProvider.js";
import AppShell from "../components/AppShell.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider>
              <AppShell>{children}</AppShell>
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
