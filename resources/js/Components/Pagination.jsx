import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <div className="flex mt-8 space-x-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url}
                    className={
                        link.active
                            ? "bg-gray-900 text-white px-4 py-2 border rounded-md border-gray-500"
                            : "text-primary hover:bg-gray-700 hover:text-white px-4 py-2 border rounded-md border-gray-500"
                    }
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
