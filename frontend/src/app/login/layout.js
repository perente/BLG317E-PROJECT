// app/layout.js
import '../globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <header className="py-6">
            <h1 className="text-3xl font-bold text-center">Login For Olympics 2024 <br/> Managment Panel</h1>
          </header>
          <main className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
