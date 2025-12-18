export default function App() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-(--text) mb-6">
          Welkom op mijn portfolio
        </h1>
        
        <p className="text-lg text-(--muted) leading-relaxed mb-8">
          Dit portfolio is gebouwd met React, Vite en Tailwind CSS v4.
        </p>

        <div className="bg-(--surface) border border-(--bordercolor) rounded-lg p-6">
          <p className="text-sm text-(--muted) space-y-1">
            <div>✔ Tailwind actief</div>
            <div>✔ Thema geladen</div>
            <div>✔ Eerste UI werkt</div>
          </p>
        </div>
      </div>
    </main>
  );
}