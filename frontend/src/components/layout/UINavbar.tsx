import { Link } from "react-router-dom";

interface NavLink {
    label: string;
    href: string;
    active: boolean;
    available: boolean;
    shown: boolean;
}

interface YUINavbarProps {
    links: NavLink[];
    title?: string;
}

function YUINavbar(props: YUINavbarProps) {
    return (
        <nav className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="relative flex h-16 items-center">

                    {/* Left: Logo */}
                    <div className="text-xl font-bold">
                        {props.title || "Yannis' AI App"}
                    </div>

                    {/* Center: Links */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-6 items-center">
                        {props.links.map((link) => {
                            if (!link.available) {
                                return (
                                    <span
                                        key={link.href}
                                        className="text-gray-500 select-none"
                                        title="Not available"
                                    >
                                        {link.label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`transition-colors ${link.active
                                            ? "text-white font-semibold border-b-2 border-blue-500"
                                            : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default YUINavbar;