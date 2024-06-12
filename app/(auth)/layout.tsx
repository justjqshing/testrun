const layout = ({ children }: {children: React.ReactNode}) => {
    return (
        <div className="flex justify-center items-center min-h-screen w-full bg-white bg-dotted-pattern bg-cover bg-fixed bg-center">
            {children}
        </div>
    )
}
export default layout