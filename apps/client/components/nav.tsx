import Link from 'next/link';

export function Nav() {
  return (
    <nav className=" basis-1/4 flex flex-col pl-14 pt-3">
      <ul>
        <li className=" text-xl">
          <Link href="/home">Home</Link>
        </li>
      </ul>
    </nav>
  );
}
