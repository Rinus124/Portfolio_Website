export default function Footer() {
  return (
    <footer className="bg-(--surface) border-t border-(--bordercolor) py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-(--muted) text-sm">
          © {new Date().getFullYear()} Jouw Naam. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}