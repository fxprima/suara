export default function SidebarLogo() {
return (
    <div className="flex items-center justify-center lg:justify-between w-full">
    <div className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Suara Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold text-primary hidden lg:block">Suara</h1>
    </div>
    </div>
);
}
