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
                `inline-flex items-center justify-center px-4 py-2 bg-blue-400 border border-transparent rounded-md 
                font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-300 focus:bg-blue-400 
                focus:outline-none focus:ring-0 focus:ring-blue-400 focus:ring-offset-2 transition ease-in-out 
                duration-150 ${disabled && "opacity-65"} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
