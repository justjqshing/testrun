
import Header from "@/components/shared/Header";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex h-screen flex-col">
        <div className="">
        <Header />
        </div>
        <main className="flex-1">{children}</main>

        </div>
    )
}