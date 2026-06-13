import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
            AI-Powered Resume Tailoring
            <br />
            <span className="text-zinc-600 dark:text-zinc-400">Based on Your Real Experience</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
            Stop sending generic resumes. Let AI reshape your authentic experience to perfectly match any job description — without fabricating anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-semibold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/builder"
              className="px-8 py-4 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-lg font-semibold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              I Have a Profile
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-zinc-50 dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              100% Authentic
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Never fabricates skills or experience. Only uses your real background, rephrased and prioritized for each role.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-zinc-50 dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              AI-Powered Matching
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Claude analyzes job descriptions and intelligently highlights your most relevant achievements and skills.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-zinc-50 dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Fit Score Analysis
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Get an honest assessment of how well you match the role, plus clear gaps you need to address.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zinc-50 dark:text-zinc-900">1</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Build Your Master Profile
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Enter your complete work history, skills, education, and achievements once.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zinc-50 dark:text-zinc-900">2</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Paste Job Description
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Copy the full job posting for any role you want to apply to.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 dark:bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zinc-50 dark:text-zinc-900">3</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Get Tailored Resume
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                AI generates a perfectly matched resume highlighting your relevant experience.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Ready to Stand Out?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Create unlimited tailored resumes from your master profile.
          </p>
          <Link
            href="/onboarding"
            className="inline-block px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-semibold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Start Building Your Profile
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>Powered by Anthropic Claude AI • Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}
