import { prisma } from "@/lib/prisma/prisma";
import { getUser } from "@/lib/auth/get-user";
import Link from "next/link";

export default async function NotesPage() {
  const user = await getUser();

  const notes = await prisma.note.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Link className="bg-blue-200" href={"/notes/new"}>
        + 新規作成
      </Link>

      <p>ノートの一覧</p>
      <div className="flex gap-3 mt-5">
        <div className="w-1/8">ノート</div>
        <div>作成日時</div>
      </div>
      {notes.map((note) => (
        <div className="flex gap-3" key={note.id}>
          <div className="w-1/8">{note.content}</div>
          <div>
            {note.createdAt.toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </div>
          <Link href={`/notes/${note.id}`}>詳細</Link>
        </div>
      ))}
    </>
  );
}
