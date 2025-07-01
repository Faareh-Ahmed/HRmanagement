export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-blue-500 p-6 rounded-xl">
        <h1 className="text-4xl font-bold text-center sm:text-left text-white">
          Welcome to HR Management System
        </h1>
        <p className="text-lg text-center sm:text-left text-yellow-200">
          A comprehensive solution for managing human resources effectively.
        </p>
      </main>
    </div>
  );
}
