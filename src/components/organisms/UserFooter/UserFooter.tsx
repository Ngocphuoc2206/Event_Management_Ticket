import { Share, Megaphone } from "lucide-react";

export default function UserFooter() {
  return (
    <footer className="w-full flex justify-center bg-white border-t border-slate-100">
      {/* Đồng bộ: Nền trắng, viền trên mảnh màu slate-100 */}

      <div
        data-layer="Footer"
        className="Footer w-full max-w-7xl px-8 py-16 flex flex-col justify-start items-start gap-16"
      >
        <div
          data-layer="Container"
          className="Container w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          <div
            data-layer="Container"
            className="Container pb-2.5 flex flex-col justify-start items-start gap-6"
          >
            <div
              data-layer="Container"
              className="Container flex justify-start items-start"
            >
              {/* Đồng bộ: Logo chữ cực đậm, viết hoa, màu slate-900 giống Admin */}
              <span
                data-layer="Text"
                className="Text text-2xl font-black text-slate-900 uppercase tracking-tighter leading-9"
              >
                EventHub
              </span>
            </div>
            <div
              data-layer="Container"
              className="Container flex flex-col justify-start items-start"
            >
              {/* Đồng bộ: Text phụ màu slate-500, font-medium */}
              <p
                data-layer="The global platform..."
                className="justify-center text-slate-500 text-sm font-medium leading-6"
              >
                The global platform for meaningful connections and unforgettable
                moments. Start your journey today.
              </p>
            </div>
          </div>

          <div
            data-layer="Container"
            className="Container flex flex-col justify-start items-start gap-6"
          >
            <div
              data-layer="Heading 4"
              className="Heading4 flex flex-col justify-start items-start"
            >
              {/* Đồng bộ: Tiêu đề nhỏ dạng nhãn (Label) text-[11px] font-black */}
              <span
                data-layer="Company"
                className="Company text-slate-900 text-[11px] font-black uppercase leading-5 tracking-widest"
              >
                Company
              </span>
            </div>
            <ul
              data-layer="List"
              className="List flex flex-col justify-start items-start gap-4"
            >
              <li
                data-layer="Item"
                className="Item flex flex-col justify-start items-start cursor-pointer group"
              >
                {/* Đồng bộ: Link hover sang blue-600 */}
                <span
                  data-layer="About Us"
                  className="AboutUs text-slate-500 text-sm font-semibold leading-6 group-hover:text-blue-600 transition-colors"
                >
                  About Us
                </span>
              </li>
              <li
                data-layer="Item"
                className="Item flex flex-col justify-start items-start cursor-pointer group"
              >
                <span
                  data-layer="Careers"
                  className="Careers text-slate-500 text-sm font-semibold leading-6 group-hover:text-blue-600 transition-colors"
                >
                  Careers
                </span>
              </li>
              <li
                data-layer="Item"
                className="Item flex flex-col justify-start items-start cursor-pointer group"
              >
                <span
                  data-layer="Press"
                  className="Press text-slate-500 text-sm font-semibold leading-6 group-hover:text-blue-600 transition-colors"
                >
                  Press
                </span>
              </li>
            </ul>
          </div>

          <div
            data-layer="Container"
            className="Container flex flex-col justify-start items-start gap-6"
          >
            <div
              data-layer="Heading 4"
              className="Heading4 flex flex-col justify-start items-start"
            >
              <span
                data-layer="Support"
                className="Support text-slate-900 text-[11px] font-black uppercase leading-5 tracking-widest"
              >
                Support
              </span>
            </div>
            <ul
              data-layer="List"
              className="List flex flex-col justify-start items-start gap-4"
            >
              <li
                data-layer="Item"
                className="Item flex flex-col justify-start items-start cursor-pointer group"
              >
                <span
                  data-layer="Contact Support"
                  className="ContactSupport text-slate-500 text-sm font-semibold leading-6 group-hover:text-blue-600 transition-colors"
                >
                  Contact Support
                </span>
              </li>
              <li
                data-layer="Item"
                className="Item flex flex-col justify-start items-start cursor-pointer group"
              >
                <span
                  data-layer="Terms of Service"
                  className="TermsOfService text-slate-500 text-sm font-semibold leading-6 group-hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </span>
              </li>
              <li
                data-layer="Item"
                className="Item flex flex-col justify-start items-start cursor-pointer group"
              >
                <span
                  data-layer="Privacy Policy"
                  className="PrivacyPolicy text-slate-500 text-sm font-semibold leading-6 group-hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          <div
            data-layer="Container"
            className="Container pb-16 flex flex-col justify-start items-start gap-6"
          >
            <div
              data-layer="Heading 4"
              className="Heading4 flex flex-col justify-start items-start"
            >
              <span
                data-layer="Follow Us"
                className="FollowUs text-slate-900 text-[11px] font-black uppercase leading-5 tracking-widest"
              >
                Follow Us
              </span>
            </div>
            <div
              data-layer="Container"
              className="Container inline-flex justify-start items-start gap-4"
            >
              {/* Đồng bộ: Nút social bo 2xl, bóng mờ shadow-sm, hover xanh */}
              <div
                data-layer="Background"
                className="Background w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-2xl flex justify-center items-center cursor-pointer hover:bg-slate-50 hover:border-blue-200 group transition-all"
              >
                <div
                  data-layer="Container"
                  className="Container inline-flex justify-start items-start"
                >
                  <Share className="Icon w-4 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
              <div
                data-layer="Background"
                className="Background w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-2xl flex justify-center items-center cursor-pointer hover:bg-slate-50 hover:border-blue-200 group transition-all"
              >
                <div
                  data-layer="Container"
                  className="Container inline-flex justify-start items-start"
                >
                  <Megaphone className="Icon w-5 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data-layer="HorizontalBorder"
          className="Horizontalborder w-full pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div
            data-layer="Container"
            className="Container flex flex-col justify-start items-start"
          >
            {/* Đồng bộ: Bản quyền text-[11px] chữ hoa */}
            <span
              data-layer="Text"
              className="Text text-slate-400 text-[11px] font-bold uppercase tracking-wider"
            >
              © 2026 EventHub Inc. All rights reserved.
            </span>
          </div>
          <div
            data-layer="Container"
            className="Container flex justify-start items-center gap-8"
          >
            <div
              data-layer="Container"
              className="Container flex flex-col justify-start items-start"
            >
              <span
                data-layer="Text"
                className="Text text-slate-400 text-[11px] font-bold uppercase tracking-widest"
              >
                Designed for Kinetic Motion
              </span>
            </div>
            <div
              data-layer="Container"
              className="Container flex flex-col justify-start items-start"
            >
              <span
                data-layer="Text"
                className="Text text-slate-400 text-[11px] font-bold uppercase tracking-widest"
              >
                Global Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
