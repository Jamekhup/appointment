const Pagination = ({ onPaginate, data }) => {
    return (
        <div className="flex mt-6 justify-center gap-2">
            <div className="flex flex-wrap gap-y-2">
                {data.links &&
                    data.per_page < data.total &&
                    data.links.map((link, index) =>
                        link.label === "..." ? (
                            <div key={index}>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`border border-slate-300 px-4 mr-2 py-1 rounded-sm  cursor-default`}
                                ></div>
                            </div>
                        ) : (
                            <div
                                key={index}
                                onClick={() => onPaginate(link.url)}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`border border-slate-300 px-4 mr-2 py-1 rounded-md hover:bg-blue-400 hover:text-white ${
                                        link.active
                                            ? "bg-blue-300 text-white"
                                            : ""
                                    } ${
                                        link.label === "..."
                                            ? "cursor-progress"
                                            : "cursor-pointer"
                                    }`}
                                ></div>
                            </div>
                        )
                    )}
            </div>
        </div>
    );
};

export default Pagination;