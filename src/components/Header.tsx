import Link from "next/link";

export default function Header() {
  return (
    <header className="mb-5 bg-blue-400 py-3 px-10 font-bold flex justify-between items-center">
      <Link href={"/"}>
        <span className="hover:cursor-pointer">FitLog AI</span>
      </Link>
      <Link href={"/auth/signup"} className="hover:cursor-pointer">
        Sign Up
      </Link>
    </header>
  );
}
