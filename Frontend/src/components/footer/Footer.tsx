import { Instagram, Linkedin, Youtube } from "lucide-react";

const EXPLORE_LINKS = ["Concerts", "Conferences", "Workshops", "Festivals"];
const PLATFORM_LINKS = ["API Documentation", "Careers", "Contact Support"];
const LEGAL_LINKS = ["Terms of Service", "Privacy Policy"];

export default function Footer() {
  return (
    <footer className="border-t border-slate-300/20 bg-gray-200 px-4 pt-14 pb-10 sm:px-6 sm:pt-16 sm:pb-12 lg:px-6 lg:pt-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-2xl leading-8 font-bold text-sky-700">EventHub</h3>
            <p className="mt-6 max-w-96 text-base leading-6 text-gray-700">
              Connecting people to unforgettable experiences. From local meetups to global festivals, we empower you
              to live more.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-900">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-900">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-900">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base leading-6 font-bold text-zinc-900">Explore</h4>
            <ul className="mt-6 space-y-4">
              {EXPLORE_LINKS.map((item) => (
                <li key={item} className="text-base leading-6 text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base leading-6 font-bold text-zinc-900">Platform</h4>
            <ul className="mt-6 space-y-4">
              {PLATFORM_LINKS.map((item) => (
                <li key={item} className="text-base leading-6 text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base leading-6 font-bold text-zinc-900">Legal</h4>
            <ul className="mt-6 space-y-4">
              {LEGAL_LINKS.map((item) => (
                <li key={item} className="text-base leading-6 text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-300/30 pt-8 sm:mt-16 sm:flex-row sm:items-center sm:gap-4 sm:pt-12">
          <p className="text-sm leading-5 text-gray-700">© 2024 EventHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm leading-5 text-gray-700 sm:gap-8">
            <span>English (US)</span>
            <span>USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
