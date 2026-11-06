import collection from "../../collection.config.js";
import { LanguageProvider } from "../lib/i18n/LanguageProvider.js";
import { AuthProvider } from "../lib/auth/AuthProvider.js";
import { ThemeProvider } from "../lib/theme/ThemeProvider.js";
import AppShell from "../components/AppShell.js";
// Fonts + base reset are global so they load on every route, even after a
// client-side navigation. (See globals.css for why they can't live in home.css.)
import "./globals.css";

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
