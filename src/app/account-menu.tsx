import {
  CircleUserRoundIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";
import { Session } from "next-auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { signOut } from "@/auth";
import Link from "next/link";

export const AccountMenu: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <Menu>
      <MenuButton
        type="button"
        className="flex max-w-60 min-w-40 space-x-2 bg-white hover:bg-neutral-100 items-center px-3 py-2 rounded-full border-2 border-neutral-700 shadow overflow-hidden"
      >
        <span className="text-sm font-bold line-clamp-1">
          {session.user.name}
        </span>
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="あなたのプロフィール画像"
            className="rounded-full size-8"
          />
        ) : (
          <CircleUserRoundIcon className="shrink-0 size-8" />
        )}
      </MenuButton>
      <MenuItems
        anchor={{
          to: "bottom end",
          gap: 8,
        }}
        className="rounded-2xl border-2 border-neutral-700 shadow-xl w-52 overflow-hidden bg-white divide-y-2 divide-neutral-700"
      >
        <MenuItem>
          <Link
            className="flex gap-1.5 items-center w-full font-bold h-12 hover:bg-neutral-100 text-start px-2"
            href="/dashboard"
          >
            <LayoutDashboardIcon className="size-6" />
            ダッシュボード
          </Link>
        </MenuItem>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="flex gap-1.5 items-center w-full font-bold h-12 hover:bg-neutral-100 text-start px-2">
            <LogOutIcon className="size-6" />
            Sign out
          </button>
        </form>
      </MenuItems>
    </Menu>
  );
};
