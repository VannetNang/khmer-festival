const en = {
  common: {
    back: "Back",
  },
  home: {
    brand: "Khmer Festivals",
    heroTitle: "Cambodia's Living Festivals",
    heroSubtitle:
      "Browse and search the Khmer festivals preserved in this living archive.",
    searchPlaceholder: "Search festivals, categories, or tags…",
    count: (n) => `${n} festival${n === 1 ? "" : "s"} shown`,
    emptyTitle: "No festivals found",
    emptyText: "Try a different keyword, or reset the search below.",
    reset: "Reset Search",
    loading: "Loading festivals…",
    loadingText: "The archive is fetching entries from the database.",
    loadFailedTitle: "Could not load the archive",
    loadFailedText: "Check your connection, then reload the page.",
    kicker: "Khmer Living Archive",
    loginTitle: "Login",
    signUpTitle: "Sign Up",
    logoutTitle: "Logout",
  },
  login: {
    title: "Sign in",
    subtitle: "Welcome back to the archive.",
    emailLabel: "Email",
    passwordLabel: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    noAccount: "Don't have an account?",
    signupLink: "Sign up",
  },
  signup: {
    title: "Create an account",
    subtitle: "Join the archive as a contributor.",
    emailLabel: "Email",
    passwordLabel: "Password",
    submit: "Create account",
    submitting: "Creating account…",
    haveAccount: "Already have an account?",
    loginLink: "Sign in",
  },
};

export default en;
