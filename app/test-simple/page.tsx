export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple Test Page
        </h1>
        <p className="text-gray-600 mb-8">
          This is a simple test page to verify basic Next.js functionality.
        </p>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
          <p className="text-blue-800">
            If you can see this page, the basic Next.js build is working!
          </p>
        </div>
      </div>
    </div>
  )
}
