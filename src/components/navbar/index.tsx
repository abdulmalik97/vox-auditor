import { Disclosure } from "@headlessui/react";
import logo from "../../app/assets/logo.png";
import Image from "next/image";

const navigation = [
  { name: "Activity Log", href: "activity-log", current: true },
  { name: "Patients", href: "patients", current: false },
];

const generateTabs = () => {
  return navigation.map((item) => (
    <a
      key={item.name}
      href={item.href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        item.current
          ? "bg-yellow-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
      aria-current={item.current ? "page" : undefined}
    >
      {item.name}
    </a>
  ));
};

const Navbar = () => {
  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <Image className="h-36 w-auto" src={logo} alt="Logo" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-4">{generateTabs()}</div>
          </div>

          <div className="flex-1" />
        </div>
      </div>
    </Disclosure>
  );
};

export default Navbar;
