import { useState } from "react";

export default function Footer() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const rightCodes = ["konami", "letmein", "opensesame"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rightCodes.includes(value.toLowerCase())) {
      setError(false);

      // juiste code
      console.log("Konami code geactiveerd!");
    } else {
      // verkeerde code
      setError(true);
    }

    setValue(""); // input leegmaken
  };

  return (
    <footer className="bg-(--surface) border-t border-(--bordercolor) py-6">
      <div className="container mx-auto px-4 text-center space-y-2">

        <p className="text-(--muted) text-sm">
          © {new Date().getFullYear()} Marijn v. Veggel. Alle rechten voorbehouden.
        </p>

        <form onSubmit={handleSubmit} className="flex justify-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Speciale codes hier..."
            className="px-3 py-2 rounded border border-(--bordercolor) bg-transparent text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-(--accent) text-sm"
          >
            Ga
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-xs">
            Geen speciale code
          </p>
        )}
      </div>
    </footer>
  );
}
