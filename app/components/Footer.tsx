export default function Footer() {
  return (
    <footer className="w-full text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
      &copy; {new Date().getFullYear()} DataRoom. All rights reserved.
    </footer>
  );
}
