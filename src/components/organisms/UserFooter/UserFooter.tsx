import { Share, Megaphone } from "lucide-react";

export default function UserFooter() {
  return (
    <footer className="w-full flex justify-center bg-zinc-200">
      <div data-layer="Footer" className="Footer w-full max-w-[1280px] px-8 py-16 flex flex-col justify-start items-start gap-16">
        <div data-layer="Container" className="Container w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div data-layer="Container" className="Container pb-2.5 flex flex-col justify-start items-start gap-6">
            <div data-layer="Container" className="Container flex justify-start items-start">
              <span data-layer="Text" className="Text bg-gradient-to-r from-[#0058BE] to-[#6B38D4] bg-clip-text text-transparent text-3xl font-black font-['Inter'] leading-9">EventHub</span>
            </div>
            <div data-layer="Container" className="Container flex flex-col justify-start items-start">
              <p data-layer="The global platform..." className="justify-center text-gray-700 text-base font-normal font-['Inter'] leading-6">The global platform for meaningful connections and unforgettable moments. Start your journey today.</p>
            </div>
          </div>
          
          <div data-layer="Container" className="Container flex flex-col justify-start items-start gap-6">
            <div data-layer="Heading 4" className="Heading4 flex flex-col justify-start items-start">
              <span data-layer="Company" className="Company text-zinc-900 text-sm font-bold font-['Inter'] uppercase leading-5 tracking-wider">Company</span>
            </div>
            <ul data-layer="List" className="List flex flex-col justify-start items-start gap-4">
              <li data-layer="Item" className="Item flex flex-col justify-start items-start cursor-pointer hover:text-sky-700 transition-colors">
                <span data-layer="About Us" className="AboutUs text-gray-700 text-base font-normal font-['Inter'] leading-6 hover:text-sky-700 transition-colors">About Us</span>
              </li>
              <li data-layer="Item" className="Item flex flex-col justify-start items-start cursor-pointer hover:text-sky-700 transition-colors">
                <span data-layer="Careers" className="Careers text-gray-700 text-base font-normal font-['Inter'] leading-6 hover:text-sky-700 transition-colors">Careers</span>
              </li>
              <li data-layer="Item" className="Item flex flex-col justify-start items-start cursor-pointer hover:text-sky-700 transition-colors">
                <span data-layer="Press" className="Press text-gray-700 text-base font-normal font-['Inter'] leading-6 hover:text-sky-700 transition-colors">Press</span>
              </li>
            </ul>
          </div>
          
          <div data-layer="Container" className="Container flex flex-col justify-start items-start gap-6">
            <div data-layer="Heading 4" className="Heading4 flex flex-col justify-start items-start">
              <span data-layer="Support" className="Support text-zinc-900 text-sm font-bold font-['Inter'] uppercase leading-5 tracking-wider">Support</span>
            </div>
            <ul data-layer="List" className="List flex flex-col justify-start items-start gap-4">
              <li data-layer="Item" className="Item flex flex-col justify-start items-start cursor-pointer hover:text-sky-700 transition-colors">
                <span data-layer="Contact Support" className="ContactSupport text-gray-700 text-base font-normal font-['Inter'] leading-6 hover:text-sky-700 transition-colors">Contact Support</span>
              </li>
              <li data-layer="Item" className="Item flex flex-col justify-start items-start cursor-pointer hover:text-sky-700 transition-colors">
                <span data-layer="Terms of Service" className="TermsOfService text-gray-700 text-base font-normal font-['Inter'] leading-6 hover:text-sky-700 transition-colors">Terms of Service</span>
              </li>
              <li data-layer="Item" className="Item flex flex-col justify-start items-start cursor-pointer hover:text-sky-700 transition-colors">
                <span data-layer="Privacy Policy" className="PrivacyPolicy text-gray-700 text-base font-normal font-['Inter'] leading-6 hover:text-sky-700 transition-colors">Privacy Policy</span>
              </li>
            </ul>
          </div>
          
          <div data-layer="Container" className="Container pb-16 flex flex-col justify-start items-start gap-6">
            <div data-layer="Heading 4" className="Heading4 flex flex-col justify-start items-start">
              <span data-layer="Follow Us" className="FollowUs text-zinc-900 text-sm font-bold font-['Inter'] uppercase leading-5 tracking-wider">Follow Us</span>
            </div>
            <div data-layer="Container" className="Container inline-flex justify-start items-start gap-4">
              <div data-layer="Background" className="Background w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-300 transition-colors">
                <div data-layer="Container" className="Container inline-flex justify-start items-start">
                  <Share className="Icon w-4 h-5 text-zinc-900" />
                </div>
              </div>
              <div data-layer="Background" className="Background w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-300 transition-colors">
                <div data-layer="Container" className="Container inline-flex justify-start items-start">
                  <Megaphone className="Icon w-5 h-4 text-zinc-900" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div data-layer="HorizontalBorder" className="Horizontalborder w-full pt-8 border-t border-slate-300/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div data-layer="Container" className="Container flex flex-col justify-start items-start">
            <span data-layer="Text" className="Text text-gray-700 text-sm font-normal font-['Inter'] leading-5">© 2026 EventHub Inc. All rights reserved.</span>
          </div>
          <div data-layer="Container" className="Container flex justify-start items-center gap-8">
            <div data-layer="Container" className="Container flex flex-col justify-start items-start">
              <span data-layer="Text" className="Text text-gray-700 text-xs font-bold font-['Inter'] uppercase leading-4 tracking-wider">Designed for Kinetic Motion</span>
            </div>
            <div data-layer="Container" className="Container flex flex-col justify-start items-start">
              <span data-layer="Text" className="Text text-gray-700 text-xs font-bold font-['Inter'] uppercase leading-4 tracking-wider">Global Access</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
