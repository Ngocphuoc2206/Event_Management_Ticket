export function OrganizerMetaFooter() {
  return (
    <footer className="inline-flex w-full items-center justify-between border-t border-gray-100 py-6">
      <div className="inline-flex flex-col items-start">
        <p className="text-sm font-normal leading-5 text-gray-700">© 2024 EventHub Management System. All rights reserved.</p>
      </div>

      <div className="flex items-center gap-6">
        <a href="#privacy" className="text-sm font-medium leading-5 text-gray-700 transition hover:text-zinc-900">
          Privacy Policy
        </a>
        <a href="#support" className="text-sm font-medium leading-5 text-gray-700 transition hover:text-zinc-900">
          Support Center
        </a>
        <a href="#api-docs" className="text-sm font-medium leading-5 text-gray-700 transition hover:text-zinc-900">
          API Documentation
        </a>
      </div>
    </footer>
  );
}
