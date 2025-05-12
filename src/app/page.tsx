import ClientIntakeForm from "@/components/ClientIntakeForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Website Project Intake Form
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Help us understand your business and website needs
          </p>
        </div>
        <ClientIntakeForm />
      </div>
    </main>
  );
}
