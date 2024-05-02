export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-4 py-2 bg-[#3e3d3d] border border-transparent rounded-md
                font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#504f4f] focus:bg-[#3e3d3d]
                focus:outline-none focus:ring-0 focus:ring-blue-400 focus:ring-offset-2 transition ease-in-out
                duration-150 ${disabled && "opacity-65"} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
