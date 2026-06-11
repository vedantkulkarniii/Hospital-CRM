export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Hospital CRM. All rights reserved.
          </p>
        </div>

        {/* Right Section - Links */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
