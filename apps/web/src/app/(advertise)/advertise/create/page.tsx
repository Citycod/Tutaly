export default function AdCreationWizard() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Campaign</h1>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 w-1/5"></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Step 1 of 5: Choose Your Goal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 border-2 border-blue-600 rounded-xl bg-blue-50 dark:bg-blue-900/10 cursor-pointer relative">
          <div className="absolute top-4 right-4 text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">🏢 Promote My Business</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Drive traffic to your website or landing page</p>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Best for: External websites</span>
        </div>

        <div className="p-6 border border-gray-200 dark:border-neutral-700 hover:border-blue-300 rounded-xl cursor-pointer">
          <h3 className="text-xl font-bold mb-2">💼 Promote a Job</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get more qualified applicants for your open roles</p>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Best for: Employers</span>
        </div>

        <div className="p-6 border border-gray-200 dark:border-neutral-700 hover:border-blue-300 rounded-xl cursor-pointer">
          <h3 className="text-xl font-bold mb-2">🛍 Promote a Product</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Boost visibility of your marketplace listing</p>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Best for: Sellers</span>
        </div>

        <div className="p-6 border border-gray-200 dark:border-neutral-700 hover:border-blue-300 rounded-xl cursor-pointer">
          <h3 className="text-xl font-bold mb-2">📣 Promote Company Page</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Build brand awareness among professionals</p>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Best for: Employer Branding</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 dark:border-neutral-800 pt-6">
        <button className="px-6 py-2 text-gray-600 font-medium hover:text-gray-900">Cancel</button>
        <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Next: Choose Format &rarr;</button>
      </div>
    </div>
  );
}
