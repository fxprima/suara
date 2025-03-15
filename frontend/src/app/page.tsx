export default function Home() {
  return (
    <div className="flex h-screen w-full bg-base-200 text-base-content">
      <div className="max-w-5xl mx-auto flex w-full h-full items-center justify-between p-10 space-x-10">
        {/* Left */}
        <div className="min-w-2/5 flex justify-center items-center">
          <img src="logo.svg" alt="Logo" className="" />
        </div>

        {/* Right */}
        <div className="minw-3/5 flex flex-col justify-center items-center bg-base-100 p-10 rounded-4xl shadow-xl border border-neutral">
          <h1 className="text-3xl font-bold mb-4">Welcome to Suara</h1>
          <h2 className="text-xl font-semibold mb-6">Join us today.</h2>

          <button className="w-full btn btn-outline btn-primary flex items-center justify-center mb-4 hover:scale-105 transition-transform">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 border-t border-white"></div>
            <span className="px-3 text-white">or</span>
            <div className="flex-1 border-t border-white"></div>
          </div>

          {/* Register Modal */}
          <input type="checkbox" id="signup-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box shadow-md bg-base-300 p-6 rounded-2xl m-auto flex flex-col">
              <h1 className="font-bold text-2xl mb-6">Create your account</h1>

              <form className="w-full flex flex-col gap-4">
                {/* Email */}
                <label className="input flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  <input className="w-full bg-transparent focus:outline-none" type="email" placeholder="Email" required autoComplete="off" name="email" />
                </label>

                {/* Password */}
                <label className="input flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input className="w-full bg-transparent focus:outline-none" type="password" required placeholder="Password" autoComplete="new-password" name="password" />
                </label>

                {/* Phone */}
                <label className="input validator flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input className="w-full bg-transparent focus:outline-none" type="password" required placeholder="Confirm Password" autoComplete="new-password" name="confirmPassword" />
                </label>

                <label className="input validator flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <g fill="none">
                      <path d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z" fill="currentColor"></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                  <input type="tel" className="tabular-nums" required placeholder="Phone" name="phone" />
                </label>
                
                {/* DOB */}
                <label className="text-sm text-neutral-content">
                  <h3 className="font-semibold text-lg">Date of Birth</h3>
                  <p className="text-gray-400 my-3">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                  <input type="date" className="input w-full focus:outline-none" required name="dob" />
                </label>
              </form>

              <div className="modal-action flex justify-end mt-4">
                <button type="button" className="btn btn-primary">
                  Sign up
                </button>
                <label htmlFor="signup-modal" className="btn bg-transparent ml-2">
                  Close
                </label>
              </div>
            </div>
          </div>

          <label htmlFor="signup-modal" className="w-full btn btn-primary hover:scale-105 transition-transform">
            Create account
          </label>

          <p className="text-xs text-neutral-content mt-4 text-center">
            By signing up, you agree to the{" "}
            <a href="#" className="text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary">
              Privacy Policy
            </a>
            , including{" "}
            <a href="#" className="text-primary">
              Cookie Use
            </a>
            .
          </p>

          <div className="mt-6 text-center">
            <p className="text-neutral-content">Already have an account?</p>
            <a className="text-primary hover:underline cursor-pointer">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
